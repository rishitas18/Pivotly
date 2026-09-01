from app.engines.roi import calculate_roi


def test_roi_hand_calculation(manufacturing_assessment):
    result = calculate_roi(manufacturing_assessment)

    current_annual_operating_cost = (
        manufacturing_assessment["manual_effort_fte"] * manufacturing_assessment["avg_employee_cost"]
    )
    efficiency_gain = (manufacturing_assessment["expected_automation_pct"] / 100) * (
        manufacturing_assessment["expected_time_reduction_pct"] / 100
    )
    productivity_savings = current_annual_operating_cost * efficiency_gain

    automated_volume = manufacturing_assessment["annual_transaction_volume"] * (
        manufacturing_assessment["expected_automation_pct"] / 100
    )
    error_reduction_savings = automated_volume * (
        manufacturing_assessment["error_rate_pct"] / 100
    ) * manufacturing_assessment["cost_per_error"]
    annual_benefit = productivity_savings + error_reduction_savings

    assert result["current_state"]["current_annual_operating_cost"] == round(current_annual_operating_cost, 2)
    assert result["savings"]["productivity_savings"] == round(productivity_savings, 2)
    assert result["savings"]["error_reduction_savings"] == round(error_reduction_savings, 2)
    assert result["savings"]["annual_benefit"] == round(annual_benefit, 2)


def test_current_operating_cost_matches_fte_headcount(manufacturing_assessment):
    result = calculate_roi(manufacturing_assessment)
    expected = manufacturing_assessment["manual_effort_fte"] * manufacturing_assessment["avg_employee_cost"]
    assert result["current_state"]["current_annual_operating_cost"] == round(expected, 2)


def test_roi_pct_and_payback_consistent(manufacturing_assessment):
    result = calculate_roi(manufacturing_assessment)
    total_investment = result["investment"]["total_year1_investment"]
    net_benefit = result["returns"]["net_annual_benefit"]

    expected_roi = round(net_benefit / total_investment * 100, 1)
    assert result["returns"]["roi_pct"] == expected_roi

    expected_payback = round(
        manufacturing_assessment["implementation_cost"] / (net_benefit / 12), 1
    )
    assert result["returns"]["payback_months"] == expected_payback


def test_zero_implementation_cost_gives_zero_payback(manufacturing_assessment):
    manufacturing_assessment["implementation_cost"] = 0
    result = calculate_roi(manufacturing_assessment)
    assert result["returns"]["payback_months"] == 0


def test_benefit_below_platform_cost_returns_no_payback(manufacturing_assessment):
    manufacturing_assessment["annual_platform_cost"] = 10_000_000
    manufacturing_assessment["implementation_cost"] = 500_000
    result = calculate_roi(manufacturing_assessment)
    assert result["returns"]["payback_months"] is None


def test_higher_automation_increases_benefit(manufacturing_assessment):
    low = calculate_roi({**manufacturing_assessment, "expected_automation_pct": 10})
    high = calculate_roi({**manufacturing_assessment, "expected_automation_pct": 90})
    assert high["savings"]["annual_benefit"] > low["savings"]["annual_benefit"]


def test_disclaimer_present(manufacturing_assessment):
    result = calculate_roi(manufacturing_assessment)
    assert "directional estimate" in result["disclaimer"].lower()
