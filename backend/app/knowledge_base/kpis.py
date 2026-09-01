"""KPI catalog. Each KPI is classified as a leading indicator (predicts future
performance / tracks adoption and quality of the new way of working) or a
lagging indicator (measures the business outcome after the fact). Both are
needed: leading indicators let a team course-correct during rollout; lagging
indicators prove the business case to executives.
"""

KPI_LIBRARY = {
    "process_cycle_time": {
        "name": "Process Cycle Time",
        "type": "lagging",
        "unit": "minutes per transaction",
        "description": "Total elapsed time from process start to completion.",
        "why_it_matters": "Directly reflects speed of service and operating efficiency; the primary metric the business case targets.",
    },
    "automation_rate": {
        "name": "Automation Rate",
        "type": "leading",
        "unit": "% of volume",
        "description": "Share of transactions completed without manual intervention.",
        "why_it_matters": "Rising automation rate during rollout is the earliest signal the solution is working before cost savings fully materialize.",
    },
    "cost_per_transaction": {
        "name": "Cost per Transaction",
        "type": "lagging",
        "unit": "$",
        "description": "Fully loaded cost (labor + platform) to process one transaction.",
        "why_it_matters": "The unit economics executives use to judge whether the transformation delivered real savings.",
    },
    "error_rate": {
        "name": "Error Rate",
        "type": "lagging",
        "unit": "% of transactions",
        "description": "Share of transactions requiring rework due to mistakes.",
        "why_it_matters": "Errors carry hidden cost (rework, disputes, compliance exposure) beyond processing time alone.",
    },
    "employee_hours_saved": {
        "name": "Employee Hours Saved",
        "type": "lagging",
        "unit": "hours / year",
        "description": "Manual effort hours eliminated or redeployed to higher-value work.",
        "why_it_matters": "Translates automation into a workforce-capacity story stakeholders and HR/finance can plan around.",
    },
    "first_time_accuracy": {
        "name": "First-Time Accuracy",
        "type": "leading",
        "unit": "%",
        "description": "Share of AI-assisted outputs accepted without human correction on first pass.",
        "why_it_matters": "A direct read on model quality in production; degradation here predicts downstream error-rate and trust issues.",
    },
    "sla_compliance": {
        "name": "SLA Compliance",
        "type": "lagging",
        "unit": "% within SLA",
        "description": "Share of transactions completed within the agreed service-level window.",
        "why_it_matters": "Connects process performance to contractual and customer commitments.",
    },
    "customer_resolution_time": {
        "name": "Customer Resolution Time",
        "type": "lagging",
        "unit": "hours",
        "description": "Time from a customer raising an issue to it being resolved.",
        "why_it_matters": "The metric customers experience directly; strongly correlated with satisfaction and churn.",
    },
    "adoption_rate": {
        "name": "Adoption Rate",
        "type": "leading",
        "unit": "% of eligible users/volume",
        "description": "Share of eligible users or transactions actually using the new AI-enabled workflow.",
        "why_it_matters": "A solution with strong model accuracy but low adoption will never deliver its projected ROI — this catches that early.",
    },
    "exception_rate": {
        "name": "Exception Rate",
        "type": "leading",
        "unit": "% of volume",
        "description": "Share of transactions that fall outside automated handling and require human review.",
        "why_it_matters": "A falling exception rate as the model learns is a leading signal that steady-state savings will hold.",
    },
    "model_accuracy": {
        "name": "Model Accuracy / Precision",
        "type": "leading",
        "unit": "%",
        "description": "Accuracy of the AI model's predictions or extractions against a validated ground truth sample.",
        "why_it_matters": "The technical health metric that governance and MLOps monitor to catch drift before it affects the business.",
    },
    "straight_through_processing_rate": {
        "name": "Straight-Through Processing Rate",
        "type": "leading",
        "unit": "% of volume",
        "description": "Share of transactions that complete end-to-end with zero human touch.",
        "why_it_matters": "The clearest single indicator of how far a transaction-heavy process has moved toward full automation.",
    },
    "forecast_accuracy": {
        "name": "Forecast Accuracy (MAPE)",
        "type": "lagging",
        "unit": "% (lower is better)",
        "description": "Mean absolute percentage error between forecast and actual demand.",
        "why_it_matters": "The core outcome metric for any planning/forecasting use case; ties directly to inventory and service-level cost.",
    },
}

PROCESS_KPI_MAP = {
    "procure_to_pay": [
        "straight_through_processing_rate", "cost_per_transaction", "error_rate",
        "process_cycle_time", "automation_rate", "exception_rate",
    ],
    "order_to_cash": [
        "process_cycle_time", "cost_per_transaction", "error_rate", "automation_rate",
        "sla_compliance", "employee_hours_saved",
    ],
    "record_to_report": [
        "process_cycle_time", "error_rate", "automation_rate", "first_time_accuracy",
        "employee_hours_saved",
    ],
    "customer_service": [
        "customer_resolution_time", "sla_compliance", "automation_rate", "first_time_accuracy",
        "adoption_rate", "employee_hours_saved",
    ],
    "inventory_management": [
        "forecast_accuracy", "process_cycle_time", "cost_per_transaction", "automation_rate",
        "exception_rate",
    ],
    "demand_planning": [
        "forecast_accuracy", "adoption_rate", "process_cycle_time", "employee_hours_saved",
    ],
    "sales_operations": [
        "process_cycle_time", "automation_rate", "adoption_rate", "employee_hours_saved",
        "first_time_accuracy",
    ],
    "recruitment": [
        "process_cycle_time", "automation_rate", "employee_hours_saved", "adoption_rate",
    ],
    "invoice_processing": [
        "straight_through_processing_rate", "cost_per_transaction", "error_rate",
        "process_cycle_time", "exception_rate", "first_time_accuracy",
    ],
    "claims_processing": [
        "process_cycle_time", "customer_resolution_time", "error_rate", "sla_compliance",
        "automation_rate", "exception_rate",
    ],
    "asset_maintenance": [
        "process_cycle_time", "error_rate", "automation_rate", "employee_hours_saved",
        "model_accuracy",
    ],
    "loan_operations": [
        "process_cycle_time", "error_rate", "sla_compliance", "automation_rate",
        "exception_rate", "first_time_accuracy",
    ],
    "content_operations": [
        "process_cycle_time", "automation_rate", "adoption_rate", "employee_hours_saved",
        "first_time_accuracy",
    ],
}


def get_kpis_for_process(process_id: str) -> list[dict]:
    kpi_ids = PROCESS_KPI_MAP.get(process_id, [])
    return [{"id": kid, **KPI_LIBRARY[kid]} for kid in kpi_ids]
