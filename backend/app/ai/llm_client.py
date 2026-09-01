"""Thin Anthropic client wrapper.

Pivotly uses an LLM for exactly three things (see reasoning.py):
recommendation rationale, executive summary narrative, and optional
free-text problem parsing. Never for scoring, ROI, or ranking — those are
deterministic (see app/engines).

If ANTHROPIC_API_KEY is not set, or if a live call fails for any reason
(network, auth, rate limit), the app falls back to deterministic,
knowledge-base-grounded templates in reasoning.py so the product is always
fully functional in a demo/interview setting with zero configuration.
"""

import json
import os

MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-5")


def is_mock_mode() -> bool:
    return not bool(os.getenv("ANTHROPIC_API_KEY"))


def call_llm_structured(system_prompt: str, user_prompt: str, tool_name: str, input_schema: dict) -> dict | None:
    """Calls Claude with a forced tool call so the response is valid JSON
    matching input_schema. Returns None (never raises) if the call fails or
    mock mode is active, so callers can transparently fall back."""
    if is_mock_mode():
        return None
    try:
        import anthropic

        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        response = client.messages.create(
            model=MODEL,
            max_tokens=2000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
            tools=[{
                "name": tool_name,
                "description": f"Return the {tool_name} result as structured data.",
                "input_schema": input_schema,
            }],
            tool_choice={"type": "tool", "name": tool_name},
        )
        for block in response.content:
            if block.type == "tool_use" and block.name == tool_name:
                return json.loads(json.dumps(block.input))
        return None
    except Exception:
        return None
