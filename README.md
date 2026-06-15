# LUXE CRM — AI-Native Mini CRM for Marketing & Engagement

> Built for the Xeno Engineering Internship Assignment 2026

## What is LUXE CRM?

A marketing and engagement platform for D2C brands. Describe your audience in plain English, and AI builds the segment, crafts the message, and launches the campaign — all from a single prompt.

**This is NOT a sales CRM.** It's a marketing tool for reaching shoppers through personalized, data-driven campaigns.

## Architecture

```
┌──────────────────────┐          ┌─────────────────────────┐
│    Next.js Frontend  │─────────>│    CRM API (FastAPI)    │
│    Port 3000         │<─────────│    Port 8000            │
│                      │          │                         │
│  • Audience Explorer │          │  • /api/customers       │
│  • AI Campaign Build │          │  • /api/segments        │
│  • Live Analytics    │          │  • /api/campaigns       │
│  • Landing Page      │          │  • /api/receipts        │
└──────────────────────┘          │  • /api/analytics       │
                                  │  • /api/ai/segment      │
                                  │  • /api/ai/message      │
                                  └────────┬────────────────┘
                                           │
                                           │ HTTP POST /send
                                           v
                                  ┌───────────────────────────┐
                                  │  Channel Service (FastAPI)│
                                  │  Port 8001                │
                                  │                           │
                                  │  • Simulates delivery     │
                                  │  • Async status callbacks │
                                  │  • Retry with backoff     │
                                  └───────────────────────────┘
```

### The Async Callback Loop

1. CRM triggers a campaign → sends communications to the Channel Service
2. Channel Service simulates delivery with realistic delays
3. For each message, it determines outcomes:
   - 90% delivered → 65% of those opened → 35% of those clicked
   - 10% failed (with random failure reasons)
4. Channel Service POSTs receipts back to CRM's `/api/receipts` webhook
5. CRM updates communication status and campaign aggregates
6. Frontend auto-refreshes analytics every 5 seconds to show live progress

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python FastAPI (async) |
| Database | SQLite (via aiosqlite) |
| AI | Mistral AI API (mistral-small-latest) |
| Frontend | Next.js 16, TypeScript, Tailwind CSS, Framer Motion |
| Icons | Lucide React |
| HTTP | httpx (async) |

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Mistral AI API key (for AI features)

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
# Create .env with your MISTRAL_API_KEY
cp .env.example .env
# Start CRM API
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Channel Service Setup

```bash
cd channel-service
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Frontend Setup

```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL
npm run dev
```

### 4. Open the App

Visit `http://localhost:3000`

## Features

### AI-Powered Segmentation
Type a natural language query like "Find me VIP customers from Mumbai who bought winter gear" and AI translates it into a precise SQL query, creates a segment, and returns matching customers.

### Smart Campaign Builder
4-step chat-first flow:
1. **Describe** your target audience
2. **AI creates** the segment
3. **AI generates** personalized message copy
4. **Launch** the campaign with one click

### Live Analytics
Auto-refreshing dashboard showing:
- Delivery funnel (Sent → Delivered → Opened → Clicked)
- Campaign performance table with rates
- Real-time activity feed
- Channel breakdown

### Audience Explorer
Full customer table with search, city/tag filters, sorting, expandable detail views with spend stats and tags.

## Scale Assumptions & Tradeoffs

| Decision | Rationale |
|----------|-----------|
| SQLite over PostgreSQL | Sufficient for 50 customers, zero-config deployment, easily swappable |
| Stubbed channel service | Assignment requirement — simulates real delivery lifecycle |
| Single LLM call for segmentation | Could add caching/retry, but keeps latency low for demo |
| Auto-refresh polling | WebSockets would be better at scale, polling is simpler for MVP |
| No auth | Not in scope — would add JWT auth for production |

## Data Model

- **50 customers** with realistic Indian names, emails, phone numbers
- **~300 orders** across 5 product categories (Winter Collection, Summer Collection, Accessories, Footwear, Basics)
- **Behavioral tags**: high-value, vip, frequent-buyer, new-customer, at-risk, dormant, deal-seeker, brand-loyal, seasonal-buyer
- **4 customer archetypes**: whale (10-20 orders), regular (5-10), occasional (2-5), one-timer (1-2)

## License

Built with care for the Xeno Internship Assignment.
