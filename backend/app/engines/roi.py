"""ROI / business case engine — pure, deterministic. No LLM involvement.

Current annual operating cost is anchored to the FTE headcount and cost the
user actually reported (manual_effort_fte x avg_employee_cost) rather than
re-derived from volume x processing time — those two would rarely agree
(an organization's actual staffing plan reflects more than raw transaction
math), and a cost figure that silently drifts from the headcount the user
just entered would undermine trust in the model. Volume x processing time
is used only to compute the automated-hours ratio.

    hourly_rate               = avg_employee_cost / WORKING_HOURS_PER_YEAR
    current_annual_operating_cost = manual_effort_fte * avg_employee_cost
    efficiency_gain            = expected_automation_pct * expected_time_reduction_pct
    productivity_savings       = current_annual_operating_cost * efficiency_gain
    automated_volume           = annual_transaction_volume * expected_automation_pct
    error_reduction_savings    = automated_volume * error_rate_pct * cost_per_error
    annual_benefit             = productivity_savings + error_reduction_savings
    total_year1_investment     = implementation_cost + annual_platform_cost
    net_annual_benefit         = annual_benefit - annual_platform_cost
    roi_pct                    = net_annual_benefit / total_year1_investment * 100
    monthly_net_benefit        = net_annual_benefit / 12
    payback_months             = implementation_cost / monthly_net_benefit

All percentages in the input schema are 0-100 and converted to fractions
here. Every result is labeled a directional estimate based on user-provided
assumptions — see BUSINESS_LOGIC.md.
"""

WORKING_HOURS_PER_YEAR = 2080


def calculate_roi(assessment: dict) -> dict:
    hourly_rate = assessment["avg_employee_cost"] / WORKING_HOURS_PER_YEAR
    manual_hours_per_txn = assessment["current_processing_time_minutes"] / 60
    automation_fraction = assessment["expected_automation_pct"] / 100
    time_reduction_fraction = assessment["expected_time_reduction_pct"] / 100
    error_rate_fraction = assessment["error_rate_pct"] / 100

    current_annual_operating_cost = assessment["manual_effort_fte"] * assessment["avg_employee_cost"]

    efficiency_gain = automation_fraction * time_reduction_fraction
    productivity_savings = current_annual_operating_cost * efficiency_gain
    hours_saved = assessment["manual_effort_fte"] * WORKING_HOURS_PER_YEAR * efficiency_gain

    automated_volume = assessment["annual_transaction_volume"] * automation_fraction
    error_reduction_savings = automated_volume * error_rate_fraction * assessment["cost_per_error"]

    annual_benefit = productivity_savings + error_reduction_savings

    total_year1_investment = assessment["implementation_cost"] + assessment["annual_platform_cost"]
    net_annual_benefit = annual_benefit - assessment["annual_platform_cost"]

    roi_pct = (net_annual_benefit / total_year1_investment * 100) if total_year1_investment > 0 else 0

    monthly_net_benefit = net_annual_benefit / 12
    if monthly_net_benefit > 0 and assessment["implementation_cost"] > 0:
        payback_months = assessment["implementation_cost"] / monthly_net_benefit
    elif assessment["implementation_cost"] == 0:
        payback_months = 0
    else:
        payback_months = None  # benefit never exceeds ongoing cost

    return {
        "assumptions": {
            "hourly_rate": round(hourly_rate, 2),
            "manual_hours_per_transaction": round(manual_hours_per_txn, 3),
            "automated_volume": round(automated_volume),
            "hours_saved_annually": round(hours_saved),
        },
        "current_state": {
            "current_annual_operating_cost": round(current_annual_operating_cost, 2),
        },
        "savings": {
            "productivity_savings": round(productivity_savings, 2),
            "error_reduction_savings": round(error_reduction_savings, 2),
            "annual_benefit": round(annual_benefit, 2),
        },
        "investment": {
            "implementation_cost": assessment["implementation_cost"],
            "annual_platform_cost": assessment["annual_platform_cost"],
            "total_year1_investment": round(total_year1_investment, 2),
        },
        "returns": {
            "net_annual_benefit": round(net_annual_benefit, 2),
            "roi_pct": round(roi_pct, 1),
            "payback_months": round(payback_months, 1) if payback_months is not None else None,
        },
        "disclaimer": "Directional estimate based on user-provided assumptions.",
    }
