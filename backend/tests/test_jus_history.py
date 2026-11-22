from datetime import date, datetime, timezone
from decimal import Decimal

import pytest

from app.services.jus_history import ars_to_jus, jus_to_ars, value_on
from app.services.jus_source import JusRecord, JusSourceError


def record(value: str, effective: date) -> JusRecord:
    return JusRecord(
        value_ars=Decimal(value),
        effective_date=effective,
        source_url="https://www.abogado.org.ar/valores-y-tasas/",
        fetched_at=datetime(2026, 11, 22, tzinfo=timezone.utc),
    )


def test_uses_latest_value_effective_on_requested_date():
    records = [record("50000.00", date(2026, 10, 1)), record("52321.47", date(2026, 11, 1))]
    assert value_on(date(2026, 11, 22), records).value_ars == Decimal("52321.47")
    assert value_on(date(2026, 10, 15), records).value_ars == Decimal("50000.00")


def test_no_historical_value_before_first_record():
    with pytest.raises(JusSourceError):
        value_on(date(2026, 1, 1), [record("50000.00", date(2026, 10, 1))])


def test_conversions_use_decimal():
    current = record("52321.47", date(2026, 11, 1))
    assert jus_to_ars(Decimal("2"), current) == Decimal("104642.94")
    assert ars_to_jus(Decimal("104642.94"), current) == Decimal("2.0000")
