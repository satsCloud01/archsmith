from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..schemas import AISuggestRequest, AISuggestResponse
from ..services.ai_suggest import get_ai_suggestions

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/suggest", response_model=AISuggestResponse)
def suggest_architecture(payload: AISuggestRequest) -> AISuggestResponse:
    if not payload.api_key or not payload.api_key.startswith("sk-"):
        raise HTTPException(status_code=400, detail="A valid Anthropic API key (sk-...) is required.")
    if not payload.description or len(payload.description.strip()) < 20:
        raise HTTPException(status_code=400, detail="Please provide a description of at least 20 characters.")
    try:
        result = get_ai_suggestions(payload.description.strip(), payload.api_key)
        return AISuggestResponse(**result)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"AI response could not be parsed: {exc}") from exc
    except Exception as exc:
        msg = str(exc)
        if "authentication" in msg.lower() or "api_key" in msg.lower() or "401" in msg:
            raise HTTPException(status_code=401, detail="Invalid Anthropic API key.")
        raise HTTPException(status_code=500, detail=f"AI suggestion failed: {msg}") from exc
