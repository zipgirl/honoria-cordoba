"""Lectura histórica y conversiones JUS/ARS con Decimal."""
from __future__ import annotations

import csv
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path

from app.services.jus_source import JusRecord, JusSourceError

DATA_PATH = Path(__file__).resolve().parents[3] / "data" / "jus_history.csv"
FIELDS = ["effective_date", "value_ars", "source_url", "fetched_at"]


def read_records(path: Path = DATA_PATH) -> list[JusRecord]:
    if not path.exists():
        return []
    records: list[JusRecord] = []
    with path.open("r", encoding="utf-8", newline="") as stream:
        for row in csv.DictReader(stream):
            try:
                records.append(JusRecord(
                    value_ars=Decimal(row["value_ars"]),
                    effective_date=date.fromisoformat(row["effective_date"]),
                    source_url=row["source_url"],
                    fetched_at=datetime.fromisoformat(row["fetched_at"]),
                ))
            except (KeyError, ValueError, ArithmeticError) as exc:
                raise JusSourceError("El archivo histórico JUS contiene una fila inválida.") from exc
    return sorted(records, key=lambda item: item.effective_date)


def value_on(day: date, records: list[JusRecord]) -> JusRecord:
    eligible = [record for record in records if record.effective_date <= day]
    if not eligible:
        raise JusSourceError(f"No hay un valor JUS registrado para {day.isoformat()}.")
    return eligible[-1]


def jus_to_ars(jus: Decimal, record: JusRecord) -> Decimal:
    if jus < 0:
        raise ValueError("La cantidad de JUS no puede ser negativa.")
    return (jus * record.value_ars).quantize(Decimal("0.01"))


def ars_to_jus(ars: Decimal, record: JusRecord) -> Decimal:
    if ars < 0:
        raise ValueError("El importe en pesos no puede ser negativo.")
    return (ars / record.value_ars).quantize(Decimal("0.0001"))
