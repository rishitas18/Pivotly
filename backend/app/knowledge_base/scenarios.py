"""Six realistic demo scenarios. Each is a complete assessment payload that
matches app.schemas.AssessmentInput exactly, so `POST /scenarios/{id}/load`
can drop it straight into the same pipeline a real user's input would go
through. Nothing about scenario handling is special-cased downstream.
"""

SCENARIOS = [
    {
        "id": "manufacturing_p2p",
        "title": "Manufacturing — Procure-to-Pay",
        "tagline": "145K invoices/year across 6 plants, 22 FTEs, frequent late payments",
        "assessment": {
            "industry": "Manufacturing",
            "company_size": "Large Enterprise (5,000-50,000 employees)",
            "business_function": "Procurement",
            "process_id": "procure_to_pay",
            "problem_description": (
                "Our accounts payable team manually processes supplier invoices arriving "
                "via email, EDI, and paper across 6 plants. Invoice matching against "
                "purchase orders and goods receipts is slow and error-prone, causing late "
                "payments and strained supplier relationships."
            ),
            "current_processing_time_minutes": 38,
            "annual_transaction_volume": 145000,
            "manual_effort_fte": 22,
            "error_rate_pct": 7.5,
            "avg_employee_cost": 58000,
            "customer_impact": "Medium",
            "employee_impact": "High",
            "sla_impact": "Frequent breaches",
            "structured_data_available": True,
            "unstructured_documents_available": True,
            "email_data_available": True,
            "historical_records_available": True,
            "apis_available": True,
            "existing_automation": "Partial RPA for data entry on 2 of 6 plants",
            "existing_erp_crm": True,
            "data_quality": "Medium",
            "enterprise_systems": ["SAP"],
            "cost_per_error": 85,
            "implementation_cost": 420000,
            "annual_platform_cost": 96000,
            "expected_automation_pct": 65,
            "expected_time_reduction_pct": 55,
        },
    },
    {
        "id": "retail_customer_service",
        "title": "Retail — Customer Service",
        "tagline": "2.1M contacts/year, 340 FTEs, long resolution times in peak season",
        "assessment": {
            "industry": "Retail",
            "company_size": "Global Enterprise (50,000+ employees)",
            "business_function": "Customer Service",
            "process_id": "customer_service",
            "problem_description": (
                "Our contact center handles order-status, returns, and product queries "
                "across chat, email, and phone. Agents spend significant time searching "
                "multiple systems for answers, driving long resolution times and "
                "inconsistent responses during peak seasons."
            ),
            "current_processing_time_minutes": 14,
            "annual_transaction_volume": 2100000,
            "manual_effort_fte": 340,
            "error_rate_pct": 5,
            "avg_employee_cost": 42000,
            "customer_impact": "High",
            "employee_impact": "Medium",
            "sla_impact": "Occasional breaches during peak season",
            "structured_data_available": True,
            "unstructured_documents_available": True,
            "email_data_available": True,
            "historical_records_available": True,
            "apis_available": True,
            "existing_automation": "Basic chatbot for FAQ deflection only",
            "existing_erp_crm": True,
            "data_quality": "Medium",
            "enterprise_systems": ["Salesforce"],
            "cost_per_error": 18,
            "implementation_cost": 650000,
            "annual_platform_cost": 180000,
            "expected_automation_pct": 40,
            "expected_time_reduction_pct": 35,
        },
    },
    {
        "id": "telecom_service_operations",
        "title": "Telecommunications — Service Operations",
        "tagline": "3.8M tickets/year, 520 FTEs, frequent misrouting and SLA breaches",
        "assessment": {
            "industry": "Telecommunications",
            "company_size": "Global Enterprise (50,000+ employees)",
            "business_function": "Customer Service",
            "process_id": "customer_service",
            "problem_description": (
                "Field and call-center teams handle a high volume of service tickets "
                "covering network faults, SIM/activation issues, and billing disputes. "
                "Ticket triage is inconsistent, causing misrouting to the wrong specialist "
                "team and repeat contacts."
            ),
            "current_processing_time_minutes": 22,
            "annual_transaction_volume": 3800000,
            "manual_effort_fte": 520,
            "error_rate_pct": 11,
            "avg_employee_cost": 39000,
            "customer_impact": "High",
            "employee_impact": "High",
            "sla_impact": "Frequent breaches",
            "structured_data_available": True,
            "unstructured_documents_available": True,
            "email_data_available": False,
            "historical_records_available": True,
            "apis_available": True,
            "existing_automation": "IVR call routing only",
            "existing_erp_crm": True,
            "data_quality": "Low",
            "enterprise_systems": ["Microsoft", "Custom"],
            "cost_per_error": 22,
            "implementation_cost": 980000,
            "annual_platform_cost": 240000,
            "expected_automation_pct": 45,
            "expected_time_reduction_pct": 40,
        },
    },
    {
        "id": "banking_loan_operations",
        "title": "Banking — Loan Operations",
        "tagline": "68K applications/year, 95 FTEs, long approval cycles",
        "assessment": {
            "industry": "Banking",
            "company_size": "Large Enterprise (5,000-50,000 employees)",
            "business_function": "Operations",
            "process_id": "loan_operations",
            "problem_description": (
                "Retail lending operations processes personal and small-business loan "
                "applications. Document verification and credit risk assessment are "
                "heavily manual, creating long approval cycles and inconsistent "
                "underwriting decisions across regions."
            ),
            "current_processing_time_minutes": 260,
            "annual_transaction_volume": 68000,
            "manual_effort_fte": 95,
            "error_rate_pct": 6,
            "avg_employee_cost": 71000,
            "customer_impact": "High",
            "employee_impact": "Medium",
            "sla_impact": "Frequent breaches",
            "structured_data_available": True,
            "unstructured_documents_available": True,
            "email_data_available": True,
            "historical_records_available": True,
            "apis_available": True,
            "existing_automation": "Rules-based credit bureau pull only",
            "existing_erp_crm": True,
            "data_quality": "Medium",
            "enterprise_systems": ["Oracle"],
            "cost_per_error": 140,
            "implementation_cost": 1150000,
            "annual_platform_cost": 310000,
            "expected_automation_pct": 50,
            "expected_time_reduction_pct": 45,
        },
    },
    {
        "id": "energy_asset_maintenance",
        "title": "Energy — Asset Maintenance",
        "tagline": "14.5K work orders/year, 60 FTEs, reactive maintenance and downtime",
        "assessment": {
            "industry": "Energy",
            "company_size": "Large Enterprise (5,000-50,000 employees)",
            "business_function": "Operations",
            "process_id": "asset_maintenance",
            "problem_description": (
                "Field operations maintains turbines and substations across a wide "
                "geographic footprint. Maintenance is largely reactive and schedule-based "
                "rather than condition-based, leading to unplanned downtime and "
                "inefficient technician dispatch."
            ),
            "current_processing_time_minutes": 480,
            "annual_transaction_volume": 14500,
            "manual_effort_fte": 60,
            "error_rate_pct": 9,
            "avg_employee_cost": 76000,
            "customer_impact": "Medium",
            "employee_impact": "Medium",
            "sla_impact": "Occasional breaches",
            "structured_data_available": True,
            "unstructured_documents_available": True,
            "email_data_available": False,
            "historical_records_available": True,
            "apis_available": True,
            "existing_automation": "SCADA monitoring, no predictive analytics",
            "existing_erp_crm": True,
            "data_quality": "Medium",
            "enterprise_systems": ["SAP", "Custom"],
            "cost_per_error": 310,
            "implementation_cost": 890000,
            "annual_platform_cost": 210000,
            "expected_automation_pct": 35,
            "expected_time_reduction_pct": 30,
        },
    },
    {
        "id": "media_content_operations",
        "title": "Media — Content Operations",
        "tagline": "42K assets/year across 18 markets, manual localization bottlenecks",
        "assessment": {
            "industry": "Media",
            "company_size": "Mid-Market (500-5,000 employees)",
            "business_function": "Marketing",
            "process_id": "content_operations",
            "problem_description": (
                "Our content team localizes and publishes editorial and marketing "
                "content across 18 regional markets. Metadata tagging, rights checks, "
                "and localization are manual bottlenecks that delay time-to-market for "
                "new releases."
            ),
            "current_processing_time_minutes": 95,
            "annual_transaction_volume": 42000,
            "manual_effort_fte": 48,
            "error_rate_pct": 8,
            "avg_employee_cost": 54000,
            "customer_impact": "Medium",
            "employee_impact": "Medium",
            "sla_impact": "Occasional breaches",
            "structured_data_available": True,
            "unstructured_documents_available": True,
            "email_data_available": False,
            "historical_records_available": True,
            "apis_available": True,
            "existing_automation": "Basic DAM system, manual tagging",
            "existing_erp_crm": False,
            "data_quality": "Medium",
            "enterprise_systems": ["Custom"],
            "cost_per_error": 65,
            "implementation_cost": 380000,
            "annual_platform_cost": 110000,
            "expected_automation_pct": 55,
            "expected_time_reduction_pct": 50,
        },
    },
]

SCENARIOS_BY_ID = {s["id"]: s for s in SCENARIOS}


def list_scenarios() -> list[dict]:
    return [{"id": s["id"], "title": s["title"], "tagline": s["tagline"]} for s in SCENARIOS]


def get_scenario(scenario_id: str) -> dict:
    if scenario_id not in SCENARIOS_BY_ID:
        raise KeyError(f"Unknown scenario_id: {scenario_id}")
    return SCENARIOS_BY_ID[scenario_id]
