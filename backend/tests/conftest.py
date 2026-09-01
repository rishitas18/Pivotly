import pytest

from app.knowledge_base.scenarios import get_scenario


@pytest.fixture
def manufacturing_assessment() -> dict:
    return dict(get_scenario("manufacturing_p2p")["assessment"])


@pytest.fixture
def retail_assessment() -> dict:
    return dict(get_scenario("retail_customer_service")["assessment"])
