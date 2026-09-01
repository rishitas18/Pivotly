# BUSINESS_LOGIC.md

Every formula below lives in `backend/app/engines/` as a pure function and
is covered by a hand-calculated unit test in `backend/tests/`. None of this
math ever touches an LLM.

## 1. Process stage adjustment (`engines/process_analysis.py`)

Each process stage has baseline ratings (0–100) from the knowledge base.
Four adjustments are applied using the assessment's actual inputs:

| Adjustment | Rule | Applied to |
|---|---|---|
| Volume bonus | ≤10K txn/yr: +0 · ≤100K: +5 · ≤500K: +10 · ≤1M: +14 · >1M: +18 | `business_impact`, `bottleneck_potential` (via error bonus) |
| Error bonus | `min(15, error_rate_pct / 2)` | `business_impact`, `bottleneck_potential` |
| Existing automation offset | "significant"/"extensive" in text: −18 · "partial"/"basic": −8 · else 0 | `bottleneck_potential` |
| Data quality offset | Low: −15 · Medium: 0 · High: +8 | `ai_suitability`, `automation_potential` |

All results are clamped to [0, 100].

## 2. AI opportunity factor scoring (`engines/opportunity_engine.py`)

Each opportunity is anchored to one (process, stage) template. Its seven
scoring factors are derived as follows:

- **Business Impact** = average of the stage's adjusted `business_impact`
  (above) and the template's `business_value_baseline`, itself adjusted by
  the same volume and error bonuses.
- **AI Suitability** = the stage's adjusted `ai_suitability` directly.
- **Technical Feasibility** = template baseline + 5 (if APIs available) + 5
  (if existing ERP/CRM) − 10 (if data quality is Low).
- **Data Readiness** — see §3 below; the same score is used for every
  opportunity within one process, since it reflects organization-wide data
  posture, not a single stage.
- **Time to Value** = template baseline + 5 (if data readiness ≥ 70) or −10
  (if < 40) − 5 (if more than one enterprise system is selected).
- **Implementation Complexity** = template baseline + `min(15, 3 ×
  number_of_enterprise_systems)` − 8 (if APIs available) − 5 (if existing
  ERP/CRM).
- **Risk** = template baseline + 10 (if industry is Banking, Healthcare, or
  Public Sector) + 8 (if customer impact is High or Critical).

## 3. Data readiness score (`opportunity_engine.data_readiness_score`)

```
score = 30×structured_data + 15×unstructured_docs + 10×email_data
      + 20×historical_records + 15×apis_available + 10×existing_erp_crm
      + (Low: −25 | Medium: −10 | High: 0)   [data_quality]
```
Clamped to [0, 100]. A fully data-ready organization scores 100; an
organization with no confirmed data sources and low data quality scores 0.

## 4. Priority scoring formula (`engines/scoring.py`)

```
raw = business_impact           × 0.25
    + ai_suitability             × 0.20
    + technical_feasibility      × 0.15
    + data_readiness             × 0.15
    + time_to_value              × 0.10
    − implementation_complexity  × 0.10
    − risk                       × 0.05

PriorityScore = clamp(raw + 15, 0, 100)
```

The weights on the five positive factors sum to 0.85; the two penalty
factors sum to 0.15. With every factor at its best possible value (100 for
benefits, 0 for complexity/risk), `raw` = 85. With every factor at its
worst, `raw` = −15. The **+15 recenter offset** maps that realistic range
onto a clean 0–100 scale — without it, even a perfect opportunity would cap
out at 85, which reads as "pretty good" rather than "ideal." The offset is
disclosed and shown in the UI (Recommendation screen), not hidden.

**Worked example** (Manufacturing demo scenario, "Intelligent Document
Processing for Invoices"): Business Impact 97, AI Suitability 92, Technical
Feasibility 100, Data Readiness 90, Time to Value 90, Complexity 30, Risk
20.

```
raw = 97×0.25 + 92×0.20 + 100×0.15 + 90×0.15 + 90×0.10 − 30×0.10 − 20×0.05
    = 24.25 + 18.4 + 15 + 13.5 + 9 − 3 − 1
    = 76.15
PriorityScore = clamp(76.15 + 15, 0, 100) = 91
```

## 5. ROI / business case (`engines/roi.py`)

`current_annual_operating_cost` is anchored to the FTE headcount and cost
the user actually reported — **not** re-derived from volume × processing
time. Those two would rarely agree in the real world (staffing reflects
more than raw transaction math), and a cost figure that silently drifted
from the headcount number the user just entered would undermine trust in
the whole model. Volume × processing time is used only to size the
error-reduction line item, which is a genuinely separate cost driver.

```
hourly_rate                  = avg_employee_cost / 2080
current_annual_operating_cost = manual_effort_fte × avg_employee_cost

efficiency_gain               = (expected_automation_pct / 100)
                                 × (expected_time_reduction_pct / 100)
productivity_savings          = current_annual_operating_cost × efficiency_gain
hours_saved_annually          = manual_effort_fte × 2080 × efficiency_gain

automated_volume              = annual_transaction_volume × (expected_automation_pct / 100)
error_reduction_savings       = automated_volume × (error_rate_pct / 100) × cost_per_error

annual_benefit                = productivity_savings + error_reduction_savings

total_year1_investment        = implementation_cost + annual_platform_cost
net_annual_benefit            = annual_benefit − annual_platform_cost
roi_pct                       = net_annual_benefit / total_year1_investment × 100
payback_months                = implementation_cost / (net_annual_benefit / 12)
```

Edge cases: if `implementation_cost` is 0, payback is reported as 0 months.
If `net_annual_benefit` is ≤ 0 (the ongoing platform cost exceeds the
benefit), payback is reported as `null` — there is no payback, and the UI
shows "N/A" rather than a nonsensical negative or infinite number.

**Worked example** (Manufacturing demo scenario): 22 FTE, $58,000/FTE,
145,000 transactions/year, 38 min processing time, 7.5% error rate, $85
cost/error, 65% expected automation, 55% expected time reduction, $420,000
implementation cost, $96,000/year platform cost.

```
current_annual_operating_cost = 22 × 58,000 = $1,276,000
efficiency_gain = 0.65 × 0.55 = 0.3575
productivity_savings = 1,276,000 × 0.3575 = $456,170

automated_volume = 145,000 × 0.65 = 94,250
error_reduction_savings = 94,250 × 0.075 × 85 = $600,844

annual_benefit = 456,170 + 600,844 = $1,057,014

total_year1_investment = 420,000 + 96,000 = $516,000
net_annual_benefit = 1,057,014 − 96,000 = $961,014
roi_pct = 961,014 / 516,000 × 100 = 186.2%
payback_months = 420,000 / (961,014 / 12) = 5.2 months
```

Every ROI screen and Presentation Mode slide carries the label
**"Directional estimate based on user-provided assumptions"** — this is a
model for reasoning about a business case with disclosed, editable inputs,
not an audited financial forecast.

## 6. Risk register severity adjustment (`engines/risk_register.py`)

The 10-item risk catalog has baseline severity/likelihood (Low/Medium/
High). Four rules bump specific risks by one level:

| Risk | Bumped when | Field bumped |
|---|---|---|
| Regulatory, Data Privacy | Industry is Banking, Healthcare, or Public Sector | Severity |
| Hallucination, Bias | Customer impact is High or Critical | Severity |
| Data Quality | Data quality is Low | Severity + Likelihood |
| Model Drift | Data quality is Low | Likelihood |
| Human Oversight | Selected opportunity's risk factor ≥ 50 | Severity |

## 7. Implementation roadmap duration (`engines/roadmap.py`)

Phase durations scale with the selected opportunity's implementation
complexity factor (0–100):

```
pilot_weeks   = 6  + round(complexity / 10)
scale_weeks   = 8  + round(complexity / 8)
rollout_weeks = 10 + round(complexity / 6)
```

A low-complexity opportunity (e.g., complexity 25) gets a ~9-week pilot; a
high-complexity one (e.g., complexity 60) gets a ~12-week pilot and a
~20-week enterprise rollout.

## 8. What the LLM is never allowed to do

To keep every number in this document reproducible without an API key, the
LLM (see ARCHITECTURE.md §"The AI layer") is restricted to three narrative
tasks — recommendation rationale, executive summary prose, and free-text
process matching — and is always given the already-computed numbers to
narrate, never asked to produce them. Scoring, ROI, ranking, KPI selection,
and risk severity are 100% deterministic Python.
