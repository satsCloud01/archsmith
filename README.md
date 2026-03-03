# ArchSmith — Architecture Intelligence Platform

**Version:** 1.0.0
**Production:** https://archsmith.satszone.link
**Stack:** FastAPI · React 18 · Tailwind CSS · Claude AI · SQLite · Nginx · AWS EC2

ArchSmith is a full-stack architecture intelligence platform that enables enterprise architects and engineering leaders to generate standards-aligned, traceable, production-ready architectural artifacts grounded in AI-powered analysis.

---

## Quick Start

```bash
git clone https://github.com/satsCloud01/archsmith.git
cd archsmith
./start.sh        # starts backend :8002 + frontend :5175
```

**Frontend:** http://localhost:5175
**Backend:** http://localhost:8002
**API Docs:** http://localhost:8002/docs

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [C1 Context Diagram](docs/c4-context.md) | System boundary: users, external systems |
| [C2 Container Diagram](docs/c4-container.md) | SPA + FastAPI + SQLite containers |
| [C3 Component Diagram](docs/c4-component.md) | Routers, React pages, ORM models |
| [API Reference](docs/api/openapi.md) | All REST endpoints |
| [Domain Model](docs/domain/domain-model.md) | Bounded contexts, entities, state machines |
| [Deployment Runbook](docs/deployment/runbook.md) | Local, EC2, Nginx, SSL, systemd |

---

## Platform Summary

ArchSmith implements all six functional requirements from the ArchForge PRD (FR1–FR6), delivering a complete architecture intelligence lifecycle from requirement input through AI-assisted generation, impact analysis, and governance approval.

### Core Capabilities (FR1–FR6)

| # | FR | Capability | Description |
|---|-----|-----------|-------------|
| 1 | FR1 | **Architecture Creation** | Structured 6-step wizard: define domains, services, APIs, events, data entities |
| 2 | FR2 | **Traceability** | Every artifact links back to requirements and ADRs — no documentation drift |
| 3 | FR3 | **Impact Analysis** | Breaking change detection, mitigation plans, migration steps |
| 4 | FR4 | **Multi-Cloud Blueprints** | Terraform modules generated for AWS, Azure, and GCP |
| 5 | FR5 | **Automated ADR Generation** | ADR candidates generated on every artifact generation run |
| 6 | FR6 | **Governance Workflow** | RBAC-gated approvals, immutable audit logs, versioned packages |

### AI Features

- **AI Generate Architecture** — describe your system in plain English, Claude Haiku generates domains, services, APIs, events, data entities, and requirements instantly
- **4 Example Templates** — Retail Banking Core, E-Commerce Platform, Healthcare Data Platform, Real-Time Analytics
- API key entered via UI (stored in localStorage) — never persisted on the server

### 8 Artifact Types

| Artifact | Description |
|----------|-------------|
| `domain_model` | Domain narrative with bounded contexts and service inventory |
| `c4` | C4 Container Diagram in Mermaid format |
| `openapi` | OpenAPI 3.1.0 specification for all API endpoints |
| `asyncapi` | AsyncAPI 2.6.0 specification for all domain events |
| `terraform` | Infrastructure blueprint (null_resource modules per component) |
| `adr` | Architecture Decision Records (proposed + accepted) |
| `impact_baseline` | Service inventory, API surface, event catalog |
| `arc42` | Full arc42 architecture documentation pack |

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · TypeScript · Vite 5 · Tailwind CSS · Recharts · React Router v6 |
| Backend | FastAPI 0.115 · Python 3.12 · SQLAlchemy 2.0 · Pydantic v2 |
| Database | SQLite (auto-created on first run) |
| AI | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) |
| Deploy | AWS EC2 t2.micro · Nginx · systemd · Let's Encrypt SSL |

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing overview, lifecycle, capabilities, success metrics |
| Dashboard | `/dashboard` | KPI stats, NFR coverage chart, recent packages |
| Studio | `/studio` | 6-step wizard with AI Suggest + Load Example |
| Packages | `/packages` | Filterable package list with status badges |
| Package Detail | `/packages/:id` | Generate + view all 8 artifacts in tabbed viewer |
| Impact Analysis | `/impact` | FR3: dynamic changeset analysis |
| Governance | `/governance` | FR6: RBAC-gated approval with audit trail |
| Settings | `/settings` | Tenant, role, actor, API key management |

---

## API Endpoints

```
GET  /health                              Health check
POST /api/architecture/create             Create package (FR1)
POST /api/architecture/{id}/generate      Generate all 8 artifacts (FR2/FR4/FR5)
GET  /api/architecture/{id}/artifacts     Retrieve artifacts
POST /api/architecture/{id}/impact        Impact analysis (FR3)
POST /api/architecture/{id}/approve       Governance approval (FR6)
GET  /api/architecture                    List packages
GET  /api/architecture/dashboard/summary  Dashboard KPIs
POST /api/ai/suggest                      AI architecture suggestion
GET  /api/examples                        List example templates
GET  /api/examples/{id}                   Get full example payload
```

---

## Repository Structure

```
archsmith/
├── backend/
│   ├── src/archsmith/
│   │   ├── main.py                 FastAPI app + CORS + router mounts
│   │   ├── database.py             SQLAlchemy engine + get_db()
│   │   ├── models.py               13 SQLAlchemy ORM model classes
│   │   ├── schemas.py              Pydantic request/response schemas
│   │   ├── security.py             RBAC + tenant isolation via headers
│   │   ├── routers/
│   │   │   ├── architecture.py     All FR1–FR6 endpoints
│   │   │   ├── ai.py               POST /ai/suggest (Claude Haiku)
│   │   │   └── examples.py         4 built-in industry templates
│   │   └── services/
│   │       ├── artifact_generator.py  8 artifact generators
│   │       ├── impact.py              Breaking change analysis engine
│   │       └── ai_suggest.py          Claude prompt + JSON parsing
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 Router + providers + AppLayout
│   │   ├── lib/
│   │   │   ├── api.ts              Typed API client
│   │   │   ├── apiKeyContext.tsx   Anthropic key localStorage context
│   │   │   └── settingsContext.tsx Tenant/role/actor localStorage context
│   │   ├── components/
│   │   │   ├── layout/Sidebar.tsx  Navigation sidebar
│   │   │   ├── ApiKeyBanner.tsx    Persistent AI key prompt
│   │   │   ├── ArtifactViewer.tsx  Tabbed artifact code viewer
│   │   │   └── ExamplesDrawer.tsx  Slide-in template drawer
│   │   └── pages/
│   │       ├── Landing.tsx         Marketing page
│   │       ├── Dashboard.tsx       KPI dashboard
│   │       ├── Studio.tsx          6-step wizard (main feature)
│   │       ├── Packages.tsx        Package list + filter
│   │       ├── PackageDetail.tsx   Artifact viewer + generate
│   │       ├── Impact.tsx          Impact analysis (FR3)
│   │       ├── Governance.tsx      Approval workflow (FR6)
│   │       └── SettingsPage.tsx    Configuration
│   └── vite.config.ts             Proxy /api → :8002
├── docs/                          Architecture documentation
├── start.sh                       One-command local startup
└── .env.example                   Environment variable template
```

---

## Security Model

- **Tenant isolation** — all packages scoped to `X-Tenant-Id` header
- **RBAC** — `ARCHITECT` (create/generate/impact), `REVIEWER`/`ADMIN` (approve)
- **Audit logging** — every action written to `audit_logs` table
- **API key** — never stored server-side; passed per-request from browser localStorage

---

## Success Metrics (PRD Targets)

| Metric | Target |
|--------|--------|
| Reduction in architecture documentation time | 40% |
| Faster ADR creation | 60% |
| Fewer late-stage reworks | 50% |
| NFR coverage target | 80% |
