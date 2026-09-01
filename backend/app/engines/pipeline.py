"""Composition helpers shared across routers. Not business logic itself —
just wires the pure engines together in the order the product's core
journey requires (see PRODUCT.md): process -> opportunities -> scored &
ranked -> select one for downstream architecture/roadmap/risk/exec-summary.
"""

from app.engines.opportunity_engine import build_opportunities
from app.engines.scoring import score_and_rank


def get_ranked_opportunities(assessment: dict) -> list[dict]:
    opportunities = build_opportunities(assessment)
    return score_and_rank(opportunities)


def select_opportunity(ranked: list[dict], opportunity_id: str | None) -> dict:
    if not ranked:
        raise ValueError("No AI opportunities were identified for this process and assessment.")
    if opportunity_id:
        for opp in ranked:
            if opp["id"] == opportunity_id:
                return opp
    return ranked[0]
