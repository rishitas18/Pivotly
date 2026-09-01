# ARCHITECTURE.md

## System overview

```
┌─────────────────────────────────────────────────────────────────┐
│  React + TypeScript frontend (Vite, Tailwind, React Flow, Recharts) │
│  Single AssessmentContext holds the assessment + a derived-data   │
│  cache; each page fetches (and caches) exactly the data it needs. │
└───────────────────────────────┬───────────────────────────────────┘
                                 │ JSON over fetch
┌───────────────────────────────▼───────────────────────────────────┐
│  FastAPI backend                                                   │
│                                                                     │
│  routers/*  → thin HTTP layer, Pydantic validation only            │
│       │                                                            │
│       ▼                                                            │
│  engines/*  → pure functions: (assessment dict) -> (result dict)   │
│       │         no I/O, no LLM, fully unit-testable                │
│       ▼                                                            │
│  knowledge_base/* → static grounding data (processes, opportunity  │
│       │              templates, KPIs, risks, platform mapping,     │
│       │              demo scenarios)                               │
│       ▼                                                            │
│  ai/*  → the ONLY place an LLM is called (3 call sites), with a    │
│           deterministic fallback so mock mode is fully functional  │
│                                                                     │
│  SQLite (via SQLAlchemy) → stores saved assessments only           │
└─────────────────────────────────────────────────────────────────┘
```

## Why engines are pure functions

Every file in `backend/app/engines/` takes a plain assessment dict (and
sometimes an opportunity dict) and returns a plain result dict. No engine
touches the database, the network, or an LLM. This is the single design
decision that makes the rest of the system trustworthy:

- **Testable**: `tests/test_scoring.py` and `tests/test_roi.py` hand-verify
  the exact formulas against the engine output — no mocking required.
- **Debuggable**: if a number on screen looks wrong, it can be reproduced
  by calling the engine function directly with the same input.
- **Composable**: `engines/pipeline.py` wires `opportunity_engine` →
  `scoring` → `select_opportunity` into the sequence every downstream
  screen depends on, without any engine needing to know about the others.

## Request flow for a typical screen

Take Solution Architecture as an example (`POST /api/architecture`):

1. The router (`routers/architecture.py`) validates the request body
   against `AssessmentWithOpportunity`.
2. `engines/pipeline.get_ranked_opportunities` re-derives the full ranked
   opportunity list from the assessment (via `opportunity_engine` +
   `scoring`) — nothing is looked up from a prior request; every response
   is fully reproducible from the assessment alone.
3. `engines/pipeline.select_opportunity` picks the requested opportunity
   (or falls back to the top-ranked one).
4. `engines/architecture.build_architecture` builds the 6-layer
   architecture from that opportunity's AI capability, required data, and
   risk factor.
5. The router returns the result as-is — no LLM involved.

The Executive Summary endpoint is the one place several engines are
composed together (ROI, roadmap, risk register) before handing the result
to the AI reasoning layer for narrative generation.

## The AI layer

`app/ai/llm_client.py` wraps the Anthropic Messages API with a forced
tool-call so responses are always valid JSON matching a declared schema.
`app/ai/reasoning.py` has exactly three call sites:

| Call site | Used on | Fallback when no API key / call fails |
|---|---|---|
| `generate_recommendation_rationale` | Recommendation screen | Template built from the actual top-opportunity factors and assessment numbers |
| `generate_executive_summary` | Executive Summary + Presentation Mode | Ten-section template built from ROI, roadmap, and risk data already computed |
| `parse_natural_language_problem` | Business Assessment (optional) | Keyword-matching against the 13 process definitions |

`call_llm_structured` never raises — a failed or missing API key returns
`None`, and every caller in `reasoning.py` treats `None` as "use the
fallback." This is why the product is fully functional with zero
configuration: `GET /api/health` reports `mock_mode: true` when no key is
set, and every screen still renders complete, assessment-specific content.

## The knowledge base

`app/knowledge_base/` is the grounding layer that keeps opportunity
generation and the executive narrative honest:

- `processes.py` — 13 business processes, each broken into 5–7 stages with
  baseline manual-effort, bottleneck, automation, and AI-suitability
  ratings.
- `opportunity_templates.py` — an AI opportunity template for every stage
  where AI genuinely fits (stages with low AI suitability, like physical
  repair work or rubber-stamp approvals, intentionally have none).
- `kpis.py`, `risks.py`, `platforms.py` — the KPI catalog, AI risk catalog,
  and vendor-neutral-to-illustrative platform mapping.
- `scenarios.py` — six complete, internally consistent demo assessments.

`opportunity_engine.py` is the bridge between this static data and a
user's specific input: it takes each stage's template and adjusts its
baseline scores using the assessment's actual volume, error rate, data
readiness, and industry — see BUSINESS_LOGIC.md for the exact adjustment
rules.

## Frontend state model

`frontend/src/state/AssessmentContext.tsx` is the single source of truth:
one `AssessmentInput` object plus a derived-data cache (process map,
opportunities, recommendation, architecture, ROI, roadmap, risks,
stakeholders, executive summary). Any change to the assessment clears the
entire derived cache — every downstream artifact is cheap to recompute
against the local FastAPI backend, so there's no need for fine-grained
cache invalidation. Each page's `useEffect` calls its own `fetchX()`, which
no-ops if that slice of the cache is already populated.

`selectedOpportunityId` lets a user override the top recommendation from
the Recommendation screen; every downstream fetch (architecture, roadmap,
risks, executive summary) passes it through so the rest of the story stays
consistent with whichever opportunity is actually selected.

## Diagrams

Both the process map (`ProcessFlowDiagram.tsx`) and the solution
architecture (`ArchitectureDiagram.tsx`) are built with React Flow rather
than static images, so they can be laid out dynamically from whatever data
the backend returns — a different process or opportunity produces a
different diagram with no code changes.

## Data model

SQLite has exactly one table in active use, `assessments` (id, name,
scenario_id, JSON payload, timestamps). It exists so an assessment can be
saved and reloaded later — no computation in the system depends on reading
from it. This was a deliberate choice: coupling business logic to database
state would make the engines harder to test and the numbers harder to
trust.
