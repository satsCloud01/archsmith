# ArchSmith — Architecture Documentation

**Platform:** ArchSmith v1.0.0
**Description:** Architecture Intelligence Platform — PRD FR1–FR6 · arc42 Aligned
**Production URL:** https://archsmith.satszone.link

---

## Quick Start

```bash
git clone https://github.com/satsCloud01/archsmith.git
cd archsmith
./start.sh        # starts backend :8002 + frontend :5175
```

**Backend:** http://localhost:8002 · API docs: http://localhost:8002/docs
**Frontend:** http://localhost:5175

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [C1 Context Diagram](c4-context.md) | System boundary: users, external systems |
| [C2 Container Diagram](c4-container.md) | SPA + FastAPI + SQLite + AI |
| [C3 Component Diagram](c4-component.md) | Routers, pages, services |
| [API Reference](api/openapi.md) | All REST endpoints |
| [Domain Model](domain/domain-model.md) | Bounded contexts, entities, state machines |
| [Deployment Runbook](deployment/runbook.md) | Local, EC2, Nginx, SSL, systemd |

---

## Platform Summary

ArchSmith is a full-stack architecture intelligence platform for enterprise architects and engineering leaders. It generates standards-aligned, traceable, production-ready architectural artifacts — domain models, C4 diagrams, OpenAPI specs, AsyncAPI specs, Terraform blueprints, ADRs, and arc42 documentation packs — from structured inputs, optionally augmented by Claude AI.

### Core Capabilities

| # | Capability | PRD Ref | Description |
|---|-----------|---------|-------------|
| 1 | **Architecture Creation** | FR1 | 6-step wizard: name → requirements → domains/services → APIs/events → data/infra → review |
| 2 | **Traceability** | FR2 | Every artifact contains `requirements`, `adrs`, and `citations` fields |
| 3 | **Impact Analysis** | FR3 | Breaking change detection across services, APIs, and data entities |
| 4 | **Multi-Cloud Blueprints** | FR4 | Terraform modules for AWS, Azure, GCP |
| 5 | **ADR Generation** | FR5 | 3 ADR candidates generated automatically per package |
| 6 | **Governance Workflow** | FR6 | RBAC-gated approval, version bump, immutable audit log, ADR on approval |

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · TypeScript · Vite 5 · Tailwind CSS · Recharts · React Router v6 · lucide-react |
| Backend | FastAPI 0.115 · Python 3.12 · SQLAlchemy 2.0 · Pydantic v2 |
| Database | SQLite (auto-created, no migrations required) |
| AI | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) |
| Deploy | AWS EC2 t2.micro · Nginx · systemd · Let's Encrypt SSL |

### Pre-built Example Templates

| Template | Domains | Services | APIs | Events |
|----------|---------|---------|------|--------|
| Retail Banking Core | 3 | 5 | 6 | 4 |
| E-Commerce Platform | 4 | 7 | 6 | 5 |
| Healthcare Data Platform | 3 | 5 | 6 | 5 |
| Real-Time Analytics | 4 | 7 | 5 | 4 |

---

## Repository Structure

```
archsmith/
├── backend/
│   ├── src/archsmith/
│   │   ├── main.py                 FastAPI app entrypoint
│   │   ├── database.py             SQLAlchemy engine + session
│   │   ├── models.py               ORM: Package, Domain, Service, API, Event, ...
│   │   ├── schemas.py              Pydantic: all request/response models
│   │   ├── security.py             RBAC + tenant header extraction
│   │   ├── routers/
│   │   │   ├── architecture.py     FR1–FR6 endpoints
│   │   │   ├── ai.py               POST /api/ai/suggest
│   │   │   └── examples.py         GET /api/examples
│   │   └── services/
│   │       ├── artifact_generator.py  8 artifact types
│   │       ├── impact.py              Impact analysis engine
│   │       └── ai_suggest.py          Claude Haiku prompt + parser
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── lib/api.ts
│   │   ├── lib/apiKeyContext.tsx
│   │   ├── lib/settingsContext.tsx
│   │   ├── components/
│   │   │   ├── layout/Sidebar.tsx
│   │   │   ├── ApiKeyBanner.tsx
│   │   │   ├── ArtifactViewer.tsx
│   │   │   └── ExamplesDrawer.tsx
│   │   └── pages/ (8 pages)
│   └── vite.config.ts
├── docs/
│   ├── README.md                  (this file)
│   ├── c4-context.md
│   ├── c4-container.md
│   ├── c4-component.md
│   ├── api/openapi.md
│   ├── domain/domain-model.md
│   └── deployment/runbook.md
├── start.sh
└── .env.example
```
