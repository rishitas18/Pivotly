"""AI governance risk catalog. Baseline severity/likelihood (Low/Medium/High)
are adjusted per assessment in app/engines/risk_engine-equivalent logic inside
the routers layer: customer-facing use cases raise Bias/Hallucination
severity; regulated industries (Banking, Healthcare, Public Sector) raise
Regulatory severity; low data-quality inputs raise Data Quality and Model
Drift likelihood.
"""

RISK_CATALOG = {
    "data_privacy": {
        "name": "Data Privacy",
        "category": "Data",
        "baseline_severity": "Medium",
        "baseline_likelihood": "Medium",
        "description": "Personal or commercially sensitive data is exposed to the AI system or to third-party model providers.",
        "mitigation": "Apply data minimization, masking/anonymization of PII before it reaches the model, and contractual data-handling terms with any AI vendor.",
    },
    "security": {
        "name": "Security",
        "category": "Technical",
        "baseline_severity": "High",
        "baseline_likelihood": "Low",
        "description": "The AI system or its integrations become an attack surface (prompt injection, data exfiltration, insecure API access).",
        "mitigation": "Apply standard application security controls, input validation, least-privilege API access, and adversarial testing of prompts/inputs before launch.",
    },
    "hallucination": {
        "name": "Hallucination Risk",
        "category": "Model",
        "baseline_severity": "Medium",
        "baseline_likelihood": "Medium",
        "description": "The model generates plausible-sounding but incorrect or unsupported output.",
        "mitigation": "Ground outputs in approved enterprise knowledge via retrieval, apply validation rules on structured fields, and require human approval before any high-impact decision is executed.",
    },
    "model_accuracy": {
        "name": "Model Accuracy",
        "category": "Model",
        "baseline_severity": "Medium",
        "baseline_likelihood": "Medium",
        "description": "The model's predictions or extractions fall below the accuracy needed for reliable automation.",
        "mitigation": "Establish an accuracy threshold against a validated ground-truth sample before go-live, and route low-confidence outputs to human review.",
    },
    "bias": {
        "name": "Bias",
        "category": "Model",
        "baseline_severity": "Medium",
        "baseline_likelihood": "Low",
        "description": "The model produces systematically unfair outcomes for particular customer, employee, or applicant segments.",
        "mitigation": "Test model outputs for disparate impact across protected segments before launch and monitor continuously in production.",
    },
    "regulatory": {
        "name": "Regulatory Requirements",
        "category": "Compliance",
        "baseline_severity": "Medium",
        "baseline_likelihood": "Medium",
        "description": "The use case falls under industry-specific regulation (e.g., fair lending, data residency, claims handling rules) that AI-assisted decisions must satisfy.",
        "mitigation": "Engage compliance/legal early to define explainability and audit-trail requirements, and keep a human of record for regulated decisions.",
    },
    "data_quality": {
        "name": "Data Quality",
        "category": "Data",
        "baseline_severity": "Medium",
        "baseline_likelihood": "Medium",
        "description": "Incomplete, inconsistent, or poorly structured source data degrades model performance.",
        "mitigation": "Run a data-readiness assessment and remediation pass before build, and monitor data quality metrics continuously post-launch.",
    },
    "integration_risk": {
        "name": "Integration Risk",
        "category": "Technical",
        "baseline_severity": "Medium",
        "baseline_likelihood": "Medium",
        "description": "The solution must integrate with existing ERP/CRM/legacy systems that have limited APIs or fragile interfaces.",
        "mitigation": "Validate integration feasibility with a technical spike before committing to the full build timeline, and design for graceful degradation if an upstream system is unavailable.",
    },
    "human_oversight": {
        "name": "Human Oversight",
        "category": "Governance",
        "baseline_severity": "Medium",
        "baseline_likelihood": "Low",
        "description": "Automation is extended into decisions that still require human judgment or accountability.",
        "mitigation": "Explicitly define which decisions remain human-approved by policy, and design the workflow so escalation is the default for low-confidence or high-impact cases.",
    },
    "model_drift": {
        "name": "Model Drift",
        "category": "Model",
        "baseline_severity": "Low",
        "baseline_likelihood": "Medium",
        "description": "Model performance degrades over time as real-world data patterns shift away from training conditions.",
        "mitigation": "Monitor production accuracy against a sampled ground truth on a fixed cadence and retrain/recalibrate when performance drops below threshold.",
    },
}


def get_all_risks() -> list[dict]:
    return [{"id": rid, **r} for rid, r in RISK_CATALOG.items()]
