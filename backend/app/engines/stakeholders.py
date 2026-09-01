"""Stakeholder map engine. Produces the standard enterprise transformation
stakeholder set, with each entry's concern/value tailored to the selected
business function and use case.
"""


def build_stakeholder_map(opportunity: dict, assessment: dict) -> list[dict]:
    function = assessment["business_function"]
    use_case = opportunity["use_case_name"]

    return [
        {
            "role": "Business Owner",
            "who": f"{function} leadership",
            "concern": f"Whether {use_case} measurably improves the metrics they're accountable for.",
            "expected_value": "Faster, cheaper, more consistent process performance without added headcount.",
            "decision_responsibility": "Approves the business case and owns the outcome.",
        },
        {
            "role": "Product Owner",
            "who": "Digital / AI transformation team",
            "concern": "Whether the solution is being built to solve the right problem, not just showcase AI.",
            "expected_value": "A working capability that is actually adopted, not a shelved pilot.",
            "decision_responsibility": "Owns scope, prioritization, and success criteria.",
        },
        {
            "role": "IT Owner",
            "who": "Enterprise IT / architecture team",
            "concern": "Integration complexity, system stability, and total cost of ownership.",
            "expected_value": "A solution that fits the existing architecture and doesn't create technical debt.",
            "decision_responsibility": "Approves technical architecture and integration approach.",
        },
        {
            "role": "Data / AI Team",
            "who": "Data science / ML engineering",
            "concern": "Whether the required data is actually available and clean enough to hit accuracy targets.",
            "expected_value": "A well-scoped, technically feasible build with a realistic monitoring plan.",
            "decision_responsibility": "Owns model design, evaluation, and ongoing performance monitoring.",
        },
        {
            "role": "Security",
            "who": "InfoSec / data governance",
            "concern": "Data privacy, access control, and whether AI outputs could leak sensitive information.",
            "expected_value": "A solution that passes security review without slowing down the timeline.",
            "decision_responsibility": "Approves security posture and data-handling design before go-live.",
        },
        {
            "role": "Finance",
            "who": "Finance business partner",
            "concern": "Whether the projected ROI is realistic and the investment is sequenced sensibly.",
            "expected_value": "A funded initiative with a credible payback period and tracked savings.",
            "decision_responsibility": "Approves budget and validates savings realization post-launch.",
        },
        {
            "role": "Operations",
            "who": f"{function} operations management",
            "concern": "Whether day-to-day staff can actually work with the new process without disruption.",
            "expected_value": "Reduced manual workload redirected to higher-value work, not just headcount pressure.",
            "decision_responsibility": "Owns change management and day-to-day process execution.",
        },
        {
            "role": "End Users",
            "who": f"{function} staff and/or customers interacting with the process",
            "concern": "Whether the tool actually makes their job or experience easier, and whether they're replaced or supported.",
            "expected_value": "Less repetitive manual work and faster outcomes.",
            "decision_responsibility": "Adoption behavior determines whether projected value is ever realized.",
        },
    ]
