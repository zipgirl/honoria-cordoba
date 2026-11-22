from datetime import date, datetime, timezone
from decimal import Decimal

import pytest
from fastapi import HTTPException

from app import main
from app.services.jus_source import JusRecord, JusSourceError


def cached_record() -> JusRecord:
    return JusRecord(
        value_ars=Decimal("52321.47"),
        effective_date=date(2026, 11, 1),
        source_url="https://www.abogado.org.ar/valores-y-tasas/",
        fetched_at=datetime(2026, 11, 22, tzinfo=timezone.utc),
    )


def test_current_jus_falls_back_to_last_verified_record(monkeypatch):
    def unavailable():
        raise JusSourceError("official source unavailable")

    monkeypatch.setattr(main, "fetch_official_jus", unavailable)
    monkeypatch.setattr(main, "read_records", lambda: [cached_record()])

    result = main.current_jus()

    assert result["value_ars"] == "52321.47"
    assert result["effective_date"] == "2026-11-01"
    assert result["source_status"] == "cached"


def test_current_jus_returns_503_when_source_and_cache_are_unavailable(monkeypatch):
    def unavailable():
        raise JusSourceError("official source unavailable")

    monkeypatch.setattr(main, "fetch_official_jus", unavailable)
    monkeypatch.setattr(main, "read_records", lambda: [])

    with pytest.raises(HTTPException) as exc:
        main.current_jus()

    assert exc.value.status_code == 503
