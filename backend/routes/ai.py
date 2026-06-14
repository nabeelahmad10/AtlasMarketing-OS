"""
AI routes — Natural language segmentation and message generation.
Uses Mistral AI API for NL → SQL translation and personalized message crafting.
"""

from fastapi import APIRouter, Depends
import aiosqlite
import json
import os
import httpx
from database import get_db
from models import AISegmentRequest, AIMessageRequest

router = APIRouter(prefix="/api/ai", tags=["AI"])

# Mistral AI configuration
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "")
MISTRAL_MODEL = os.getenv("MISTRAL_MODEL", "mistral-small-latest")

# Database schema for the LLM to understand
DB_SCHEMA = """
Tables:
1. customers (id, name, email, phone, age, gender, city, joined_at, total_spent, total_orders, last_order_date, tags)
   - tags is a JSON array of strings like ["high-value", "vip", "frequent-buyer", "new-customer", "at-risk", "dormant", "deal-seeker", "brand-loyal", "seasonal-buyer"]
   - city values include: Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur, Lucknow, Chandigarh, Kochi, Goa, Indore, Noida

2. orders (id, customer_id, product_name, category, amount, quantity, ordered_at)
   - category values: 'Winter Collection', 'Summer Collection', 'Accessories', 'Footwear', 'Basics'
   - Products include items like Cashmere Sweater, Wool Overcoat, Linen Shirt, Leather Tote Bag, Chelsea Boots, Organic Cotton Tee, etc.

The brand is "LUXE" — a fashion/lifestyle D2C brand based in India. Currency is INR.
Today's date is important for relative queries (e.g. "last month", "past 30 days").
"""


async def call_llm(messages: list, temperature: float = 0.3) -> str:
    """Call Mistral AI API with error handling."""
    if not MISTRAL_API_KEY:
        raise ValueError("MISTRAL_API_KEY not set. Please set the environment variable.")

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.mistral.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {MISTRAL_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": MISTRAL_MODEL,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": 1000,
            }
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


@router.post("/segment")
async def ai_segment(request: AISegmentRequest, db: aiosqlite.Connection = Depends(get_db)):
    """
    Chat-first segmentation: marketer types a natural language query
    and the AI returns a filtered audience segment.

    Example prompts:
    - "Find me shoppers who bought winter gear last month"
    - "High-value customers from Mumbai who haven't purchased in 60 days"
    - "Women aged 25-35 who spent over ₹10,000 on accessories"
    """
    from datetime import datetime
    today = datetime.now().strftime("%Y-%m-%d")

    # Step 1: Ask the LLM to generate a SQL query
    sql_prompt = [
        {
            "role": "system",
            "content": f"""You are an expert SQL query generator for a CRM database. 
Given the user's natural language request, generate a SQLite-compatible SQL query that returns matching customer IDs and names.

{DB_SCHEMA}

Today's date: {today}

IMPORTANT RULES:
- ONLY output the raw SQL query, nothing else. No markdown, no explanation.
- The query MUST SELECT at least id and name FROM customers.
- Use JOINs with orders table when the query involves purchase behavior.
- For "last month", use date('now', '-1 month'). For "past 30 days", use date('now', '-30 days').
- For tags, use: tags LIKE '%"tag_name"%'
- Always return DISTINCT customer results.
- Keep queries simple and correct."""
        },
        {
            "role": "user",
            "content": request.prompt,
        }
    ]

    try:
        sql_query = await call_llm(sql_prompt)
        # Clean up the query (remove markdown fences if any)
        sql_query = sql_query.strip().strip("```").strip("sql").strip()

        # Safety: only allow SELECT statements
        if not sql_query.upper().startswith("SELECT"):
            return {"error": "AI generated a non-SELECT query. Please rephrase your request."}

        # Execute the query
        cursor = await db.execute(sql_query)
        rows = await cursor.fetchall()

        customer_ids = []
        customer_names = []
        for row in rows:
            row_dict = dict(row) if hasattr(row, 'keys') else {"id": row[0], "name": row[1]}
            customer_ids.append(row_dict.get("id", row[0]))
            customer_names.append(row_dict.get("name", row[1]))

        # Step 2: Generate a segment name & description
        naming_prompt = [
            {
                "role": "system",
                "content": "Generate a short, catchy segment name (max 5 words) and a one-sentence description for this customer segment. Return as JSON: {\"name\": \"...\", \"description\": \"...\"}"
            },
            {
                "role": "user",
                "content": f"The marketer's request was: \"{request.prompt}\". Found {len(customer_ids)} customers."
            }
        ]

        naming_response = await call_llm(naming_prompt, temperature=0.7)
        try:
            naming_data = json.loads(naming_response.strip().strip("```").strip("json").strip())
        except json.JSONDecodeError:
            naming_data = {"name": request.prompt[:50], "description": f"AI segment: {request.prompt}"}

        # Step 3: Save the segment
        seg_cursor = await db.execute(
            """INSERT INTO segments (name, description, rules_json, customer_count, created_by)
               VALUES (?, ?, ?, ?, 'ai')""",
            (
                naming_data["name"],
                naming_data["description"],
                json.dumps({"prompt": request.prompt, "sql": sql_query}),
                len(customer_ids),
            )
        )
        segment_id = seg_cursor.lastrowid

        for cid in customer_ids:
            await db.execute(
                "INSERT OR IGNORE INTO segment_customers (segment_id, customer_id) VALUES (?, ?)",
                (segment_id, cid)
            )
        await db.commit()

        return {
            "segment_id": segment_id,
            "segment_name": naming_data["name"],
            "description": naming_data["description"],
            "sql_query": sql_query,
            "customer_count": len(customer_ids),
            "customer_ids": customer_ids,
            "customer_preview": [
                {"id": cid, "name": name}
                for cid, name in zip(customer_ids[:10], customer_names[:10])
            ],
        }

    except httpx.HTTPStatusError as e:
        return {"error": f"AI API error: {e.response.status_code}", "detail": str(e)}
    except Exception as e:
        return {"error": f"Segmentation failed: {str(e)}"}


@router.post("/message")
async def ai_generate_message(request: AIMessageRequest, db: aiosqlite.Connection = Depends(get_db)):
    """
    Auto-generate personalized campaign message copy based on the
    segment audience characteristics and campaign goal.
    """
    # Get segment info
    cursor = await db.execute(
        "SELECT name, description, customer_count FROM segments WHERE id = ?",
        (request.segment_id,)
    )
    segment = await cursor.fetchone()
    if not segment:
        return {"error": "Segment not found"}

    seg_dict = dict(segment)

    # Get audience demographics
    demo_cursor = await db.execute("""
        SELECT
            ROUND(AVG(c.age)) as avg_age,
            ROUND(AVG(c.total_spent)) as avg_spent,
            GROUP_CONCAT(DISTINCT c.city) as cities
        FROM customers c
        JOIN segment_customers sc ON c.id = sc.customer_id
        WHERE sc.segment_id = ?
    """, (request.segment_id,))
    demographics = dict(await demo_cursor.fetchone())

    # Get top categories for this segment
    cat_cursor = await db.execute("""
        SELECT o.category, COUNT(*) as count
        FROM orders o
        JOIN segment_customers sc ON o.customer_id = sc.customer_id
        WHERE sc.segment_id = ?
        GROUP BY o.category ORDER BY count DESC LIMIT 3
    """, (request.segment_id,))
    top_categories = [dict(r) for r in await cat_cursor.fetchall()]

    prompt = [
        {
            "role": "system",
            "content": """You are a world-class marketing copywriter for LUXE, a premium fashion/lifestyle brand in India.
Generate a personalized campaign message. Return as JSON:
{
    "subject_line": "Email subject line (if email channel)",
    "message": "The full message body. Use {{name}} as placeholder for customer name. Keep it under 160 chars for SMS/WhatsApp, or 300 chars for email.",
    "channel_recommendation": "Recommended channel (email/sms/whatsapp) based on the message type"
}"""
        },
        {
            "role": "user",
            "content": f"""
Segment: {seg_dict['name']} ({seg_dict['customer_count']} customers)
Description: {seg_dict['description']}
Campaign Goal: {request.campaign_goal}
Tone: {request.tone}
Audience: Avg age {demographics.get('avg_age', 'N/A')}, Avg spend ₹{demographics.get('avg_spent', 'N/A')}, Cities: {demographics.get('cities', 'N/A')}
Top Categories: {', '.join(c['category'] for c in top_categories)}
"""
        }
    ]

    try:
        response = await call_llm(prompt, temperature=0.8)
        data = json.loads(response.strip().strip("```").strip("json").strip())
        return data
    except Exception as e:
        # Fallback message
        return {
            "message": f"Hi {{{{name}}}}! We have something special for you at LUXE. {request.campaign_goal}",
            "subject_line": f"LUXE — {request.campaign_goal}",
            "channel_recommendation": "email",
            "note": f"AI generation failed ({str(e)}), using fallback template."
        }
