"""Vendor-neutral enterprise platform mapping.

Pivotly's core product is deliberately vendor-neutral: every
recommendation, architecture, and business case is generated without
assuming any specific ERP/CRM vendor. This module exists only to answer the
natural follow-up question a solution consultant gets in the room — "okay,
where would this actually plug into OUR systems?" — by showing, for a chosen
ecosystem, which category of product would typically host each
architectural capability.

IMPORTANT: Pivotly has no real, live integration with any of these
platforms. Every value returned by get_ecosystem_mapping is labeled
"Illustrative architecture mapping" in the API response and must be
presented to the user with that label, never as a built integration.
"""

DISCLAIMER = "Illustrative architecture mapping — not a live integration."

CATEGORIES = ["ERP", "CRM", "Workflow Platform", "Data Platform", "Cloud / AI Platform"]

# Which generic system categories are typically relevant for each process category.
PROCESS_CATEGORY_RELEVANCE = {
    "Procurement & Finance": ["ERP", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
    "Sales & Finance": ["ERP", "CRM", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
    "Finance": ["ERP", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
    "Customer Operations": ["CRM", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
    "Supply Chain": ["ERP", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
    "Sales & Marketing": ["CRM", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
    "Human Resources": ["ERP", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
    "Finance & Procurement": ["ERP", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
    "Insurance & Risk Operations": ["CRM", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
    "Operations & Engineering": ["ERP", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
    "Banking & Financial Services": ["ERP", "CRM", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
    "Media & Publishing": ["CRM", "Workflow Platform", "Data Platform", "Cloud / AI Platform"],
}

ECOSYSTEMS = {
    "sap": {
        "label": "SAP Ecosystem",
        "ERP": "SAP S/4HANA",
        "CRM": "SAP Customer Experience (CX)",
        "Workflow Platform": "SAP Build Process Automation",
        "Data Platform": "SAP Datasphere / SAP BTP",
        "Cloud / AI Platform": "SAP AI Core, Joule",
    },
    "microsoft": {
        "label": "Microsoft Ecosystem",
        "ERP": "Microsoft Dynamics 365 Finance & Operations",
        "CRM": "Microsoft Dynamics 365 Sales / Customer Service",
        "Workflow Platform": "Power Automate",
        "Data Platform": "Microsoft Fabric / Azure Synapse",
        "Cloud / AI Platform": "Azure AI Foundry, Copilot Studio",
    },
    "salesforce": {
        "label": "Salesforce Ecosystem",
        "ERP": "Typically paired with a separate ERP (e.g., SAP, Oracle, NetSuite)",
        "CRM": "Salesforce Sales Cloud / Service Cloud",
        "Workflow Platform": "Salesforce Flow",
        "Data Platform": "Salesforce Data Cloud",
        "Cloud / AI Platform": "Salesforce Agentforce, Einstein",
    },
    "oracle": {
        "label": "Oracle Ecosystem",
        "ERP": "Oracle Fusion Cloud ERP",
        "CRM": "Oracle Fusion Customer Experience (CX)",
        "Workflow Platform": "Oracle Process Automation",
        "Data Platform": "Oracle Fusion Data Intelligence",
        "Cloud / AI Platform": "Oracle OCI AI Services",
    },
    "custom": {
        "label": "Custom / In-House Ecosystem",
        "ERP": "Custom or legacy in-house system",
        "CRM": "Custom CRM or tracking tooling",
        "Workflow Platform": "Custom workflow engine or RPA tooling",
        "Data Platform": "Custom data warehouse / lake",
        "Cloud / AI Platform": "Custom-built AI services on any cloud provider (AWS, Azure, GCP)",
    },
}


def get_relevant_categories(process_category: str) -> list[str]:
    return PROCESS_CATEGORY_RELEVANCE.get(process_category, CATEGORIES)


def get_ecosystem_mapping(process_category: str, ecosystem_key: str) -> dict:
    ecosystem = ECOSYSTEMS.get(ecosystem_key)
    if not ecosystem:
        raise KeyError(f"Unknown ecosystem: {ecosystem_key}")
    relevant = get_relevant_categories(process_category)
    return {
        "ecosystem": ecosystem_key,
        "label": ecosystem["label"],
        "disclaimer": DISCLAIMER,
        "mapping": {category: ecosystem[category] for category in relevant},
    }


def list_ecosystems() -> list[dict]:
    return [{"key": key, "label": v["label"]} for key, v in ECOSYSTEMS.items()]
