"""
LUXE CRM API — Main FastAPI Application
AI-Native Mini CRM for Marketing & Engagement

Endpoints:
- /api/customers — Customer management
- /api/segments — Audience segmentation
- /api/campaigns — Campaign triggering
- /api/receipts — Delivery receipt webhooks
- /api/analytics — Performance insights
- /api/ai — AI-powered segmentation & messaging
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from seed_data import seed
from dotenv import load_dotenv

load_dotenv()

from routes.customers import router as customers_router
from routes.segments import router as segments_router
from routes.campaigns import router as campaigns_router
from routes.receipts import router as receipts_router
from routes.analytics import router as analytics_router
from routes.ai import router as ai_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and seed data on startup."""
    print("[START] Starting LUXE CRM API...")
    await init_db()
    await seed()
    print("[READY] CRM API ready!")
    yield
    print("[STOP] Shutting down CRM API...")


app = FastAPI(
    title="LUXE CRM API",
    description="AI-Native Mini CRM for Marketing & Engagement — Built for Xeno",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
        "*",  # For development; restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(customers_router)
app.include_router(segments_router)
app.include_router(campaigns_router)
app.include_router(receipts_router)
app.include_router(analytics_router)
app.include_router(ai_router)


@app.get("/")
async def root():
    """Health check & API info."""
    return {
        "name": "LUXE CRM API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
        "description": "AI-Native Mini CRM for Marketing & Engagement",
        "endpoints": {
            "customers": "/api/customers",
            "segments": "/api/segments",
            "campaigns": "/api/campaigns",
            "receipts": "/api/receipts",
            "analytics": "/api/analytics",
            "ai_segment": "/api/ai/segment",
            "ai_message": "/api/ai/message",
        },
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
