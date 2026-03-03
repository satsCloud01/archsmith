from __future__ import annotations

import json

import anthropic


SYSTEM_PROMPT = """You are a senior enterprise software architect. Given a system description, generate a complete and realistic architecture breakdown.

Return ONLY valid JSON (no markdown fences, no explanation) matching this exact structure:
{
  "requirements": [
    {"key": "FR-1", "category": "FR", "text": "...", "priority": "high"},
    {"key": "NFR-1", "category": "NFR", "text": "...", "priority": "high"}
  ],
  "domains": [{"name": "...", "description": "..."}],
  "bounded_contexts": [{"domain_name": "...", "name": "..."}],
  "services": [{"bounded_context_name": "...", "name": "...", "service_type": "application"}],
  "apis": [{"service_name": "...", "name": "...", "method": "POST", "path": "/..."}],
  "events": [{"name": "...", "producer_service": "..."}],
  "data_entities": [{"name": "...", "owning_service": "..."}],
  "infra_components": [{"name": "...", "cloud": "aws"}]
}

Rules:
- Include 3–5 FRs and 2–4 NFRs in requirements (covering performance, security, reliability)
- Include 2–4 meaningful business domains
- Each domain → 1–2 bounded contexts
- Each bounded context → 1–3 services (service_type: application | gateway | worker | cache)
- Include 4–8 REST API endpoints spread across services
- Include 3–6 domain events (PascalCase: e.g. OrderPlaced, PaymentProcessed)
- Include 4–6 data entities (PascalCase nouns: e.g. Order, Customer)
- Include 3–5 infra components (cloud: aws | azure | gcp)
- All names must be specific to the system described — no generic names like "Service1"
- service_type must be one of: application, gateway, worker, cache, stream
"""


def get_ai_suggestions(description: str, api_key: str) -> dict:
    client = anthropic.Anthropic(api_key=api_key)

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": f"System Description:\n\n{description}"}
        ],
    )

    raw = message.content[0].text.strip()

    # Strip markdown fences if present
    if raw.startswith("```"):
        lines = raw.splitlines()
        raw = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])

    return json.loads(raw)
