"""Solution architecture engine — builds a 6-layer architecture dynamically
from the selected opportunity's actual AI capability and required data,
rather than returning one static diagram for every use case.

Layers: Business Users -> Application/Experience -> Workflow/Orchestration
-> AI/Intelligence -> Data/Knowledge -> Enterprise Systems.
"""

_AI_COMPONENT_RULES = [
    (("document ai", "ocr", "extraction"), ["Document Intelligence (extraction + classification)"]),
    (("computer vision",), ["Computer Vision Model"]),
    (("retrieval-augmented", "rag", "knowledge retrieval"), ["RAG Pipeline", "Embeddings Model"]),
    (("generative", "llm", "drafting", "narrative"), ["LLM (generation/reasoning)"]),
    (("predictive", "forecast", "scoring model", "risk model", "risk scoring"), ["Predictive / ML Scoring Model"]),
    (("anomaly detection",), ["Anomaly Detection Model"]),
    (("classification",), ["Classification Model"]),
    (("optimization",), ["Optimization Engine"]),
    (("matching", "pattern matching"), ["Pattern Matching Engine"]),
    (("translation",), ["Neural Machine Translation Model"]),
]


def _ai_components(ai_capability: str) -> list[str]:
    text = ai_capability.lower()
    components: list[str] = []
    for keywords, comps in _AI_COMPONENT_RULES:
        if any(k in text for k in keywords):
            for c in comps:
                if c not in components:
                    components.append(c)
    if not components:
        components.append("AI Reasoning Service")
    return components


def _data_components(required_data: list[str], ai_capability: str) -> list[str]:
    components = ["Document Store" if any("document" in d.lower() or "invoice" in d.lower() or "resume" in d.lower() for d in required_data) else None]
    if "retrieval" in ai_capability.lower() or "rag" in ai_capability.lower() or "knowledge" in ai_capability.lower():
        components.append("Vector Database")
    components.append("Transactional Data Store")
    components.append("Data Warehouse / Analytics Store")
    return [c for c in dict.fromkeys(components) if c]


def build_architecture(opportunity: dict, assessment: dict) -> dict:
    ai_capability = opportunity["ai_capability"]
    required_data = opportunity["required_data"]
    business_function = assessment["business_function"]

    needs_human_approval = opportunity["factors"]["risk"] >= 40 or "approval" in opportunity["use_case_name"].lower()

    orchestration_components = ["Workflow / Orchestration Engine", "Exception & Escalation Routing"]
    if needs_human_approval:
        orchestration_components.append("Human-in-the-Loop Approval Queue")

    enterprise_systems = assessment.get("enterprise_systems") or []
    enterprise_layer = (
        [f"{s} (existing system of record)" for s in enterprise_systems]
        if enterprise_systems
        else ["ERP / CRM (existing system of record — illustrative)"]
    )
    enterprise_layer.append("REST / Event APIs")

    layers = [
        {
            "id": "business_users",
            "name": "Business Users",
            "components": [f"{business_function} team", "Process owners & approvers"],
        },
        {
            "id": "experience",
            "name": "Application / Experience Layer",
            "components": ["Case / Assessment Workspace", "Agent or Analyst Console"],
        },
        {
            "id": "orchestration",
            "name": "Workflow / Orchestration",
            "components": orchestration_components,
        },
        {
            "id": "ai_intelligence",
            "name": "AI / Intelligence Layer",
            "components": _ai_components(ai_capability),
        },
        {
            "id": "data_knowledge",
            "name": "Data / Knowledge Layer",
            "components": _data_components(required_data, ai_capability),
        },
        {
            "id": "enterprise_systems",
            "name": "Enterprise Systems",
            "components": enterprise_layer,
        },
    ]

    return {
        "use_case_name": opportunity["use_case_name"],
        "layers": layers,
        "human_in_the_loop": needs_human_approval,
        "monitoring": [
            "Model accuracy / drift monitoring",
            "Business KPI dashboard",
            "Audit trail logging",
        ],
        "security_considerations": [
            "Least-privilege access to source systems and data",
            "PII masking before data reaches any AI model",
            "Full audit trail of AI-influenced decisions",
        ],
    }
