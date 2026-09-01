import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import (
    architecture,
    assessment,
    business_case,
    executive_summary,
    knowledge,
    nl_parse,
    opportunities,
    process,
    recommendation,
    risks,
    roadmap,
    scenarios,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Pivotly API",
    description=(
        "Deterministic business logic for turning a business problem into a scored, ranked, "
        "architected, and quantified AI transformation recommendation. See BUSINESS_LOGIC.md."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    from app.ai.llm_client import is_mock_mode

    return {"status": "ok", "mock_mode": is_mock_mode()}


for router in (
    knowledge.router,
    scenarios.router,
    assessment.router,
    process.router,
    opportunities.router,
    recommendation.router,
    architecture.router,
    business_case.router,
    roadmap.router,
    risks.router,
    executive_summary.router,
    nl_parse.router,
):
    app.include_router(router)
