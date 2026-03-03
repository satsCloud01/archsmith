from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import architecture, ai, examples

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ArchSmith API",
    description="Architecture Intelligence Platform — PRD-aligned, AI-powered artifact generation.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(architecture.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(examples.router, prefix="/api")


@app.get("/health", tags=["system"])
def health() -> dict:
    return {"status": "ok", "service": "archsmith", "version": "1.0.0"}
