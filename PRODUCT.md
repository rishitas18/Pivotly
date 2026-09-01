# PRODUCT.md

## The problem

Most organizations approach AI backwards: "here is a model, what can we do
with it?" That produces pilots that never scale, because they were never
anchored to a measurable business problem in the first place. The people
who actually get AI adopted — solution consultants, AI product managers,
business analysts, presales engineers — start from the opposite direction:
a business problem, a process, a bottleneck, a number. Pivotly is built
to demonstrate and support that direction of work.

## Target users

- AI Product Managers and Product Managers evaluating where to invest
- Business Analysts scoping a transformation initiative
- Solution Consultants / Solution Advisors / Presales Engineers preparing a client conversation
- Enterprise Architects assessing technical feasibility and integration
- Digital Transformation and AI Strategy teams building a roadmap
- Business leaders who need to understand AI ROI without a technical translator

The tool is deliberately dual-audience: a business stakeholder can read the
Executive Summary and Business Case without ever seeing a scoring formula;
a technical stakeholder can drill into the exact factor weights, the
architecture layers, and the data requirements.

## Value proposition

Pivotly replaces a multi-week consulting exercise — process discovery,
opportunity brainstorming, prioritization workshops, architecture
whiteboarding, and a business case in a slide deck — with a single guided
workflow that produces the same artifacts, grounded in the same kind of
structured thinking, in minutes. It doesn't replace the judgment of a
solution advisor; it replaces the blank page.

## The user journey

1. **Business Assessment** — a 3-step guided form capturing business
   context, the actual problem (with real operational numbers), and data/
   technology readiness. A free-text "describe your problem" box is
   optionally parsed to suggest the right process.
2. **Process Analysis** — the selected business process is rendered as a
   stage-by-stage map, with each stage rated for bottleneck potential,
   automation potential, AI suitability, and business impact — adjusted for
   the specific inputs just entered, not generic textbook values.
3. **AI Opportunities** — every opportunity is anchored to a real process
   stage from the knowledge base. Nothing is invented on the fly.
4. **Recommendation** — opportunities are ranked by a transparent 0–100
   priority score, and the top pick comes with a rationale that names the
   actual numbers behind it.
5. **Solution Architecture** — a 6-layer architecture built dynamically
   from the chosen opportunity's AI capability and data requirements, with
   an optional, clearly-labeled illustrative mapping onto a real enterprise
   ecosystem (SAP, Microsoft, Salesforce, Oracle, or custom).
6. **Business Case / ROI** — a real, editable calculator: productivity
   savings, error-reduction savings, investment, ROI, and payback period,
   computed with disclosed formulas.
7. **Implementation Roadmap** — a 3-phase plan whose duration and
   activities scale with the opportunity's actual complexity.
8. **Risk & Governance** — a 10-item AI risk register with severity
   adjusted for the industry and customer sensitivity involved, plus a
   stakeholder map.
9. **Executive Summary** — a ten-section, CXO-ready synthesis of everything
   above.
10. **Presentation Mode** — the same data, reflowed into a 12-slide,
    keyboard-navigable deck.

## Product principles

- **AI is one component, not the product.** The product is the
  transformation workflow. An LLM is used only where reasoning or
  generation genuinely adds value (recommendation rationale, executive
  narrative, free-text parsing) — never for scoring, ranking, or financial
  math.
- **Every number is grounded.** Opportunities are anchored to real process
  stages; scores are computed from the user's actual inputs; ROI formulas
  are disclosed, not hidden behind a black box.
- **Vendor-neutral by default.** The core recommendation never assumes a
  specific ERP or CRM. Vendor ecosystem mappings are opt-in and explicitly
  labeled illustrative.
- **Works with zero configuration.** No API key, no setup beyond
  `pip install` and `npm install`, is required to experience the complete
  product.
- **No dead ends.** Every button does something. Every screen has a
  purpose tied back to the business problem entered on day one.

## KPIs the product itself would be judged on

- Time from "business problem" to "executive-ready recommendation"
- % of recommendations a domain expert would consider defensible
- Whether the ROI model's assumptions are transparent enough to challenge
- Whether a non-technical stakeholder can follow the architecture without help

## Future roadmap (beyond this portfolio scope)

- Multi-opportunity portfolio view (compare and sequence several
  transformation initiatives at once, not just one at a time)
- Org-specific knowledge base ingestion (replace generic process templates
  with a customer's actual documented processes)
- Confidence intervals on the ROI model instead of point estimates
- Exportable PDF/PPTX of the executive summary and presentation deck
- Multi-user assessments with role-based views (business vs. technical)
