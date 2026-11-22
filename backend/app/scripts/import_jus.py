"""Importa el valor JUS oficial. Por defecto muestra el dato; --write lo persiste."""
from __future__ import annotations

import argparse
import csv
from pathlib import Path

from app.services.jus_history import DATA_PATH, FIELDS, read_records
from app.services.jus_source import fetch_official_jus


def persist(record, path: Path = DATA_PATH) -> str:
    existing = read_records(path)
    same_date = next((item for item in existing if item.effective_date == record.effective_date), None)
    if same_date:
        if same_date.value_ars != record.value_ars:
            raise SystemExit(
                "La fuente publicó otro importe para una fecha ya registrada. "
                "Revisión manual necesaria; no se sobrescribió el histórico."
            )
        return "already-recorded"

    path.parent.mkdir(parents=True, exist_ok=True)
    write_header = not path.exists() or path.stat().st_size == 0
    with path.open("a", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=FIELDS)
        if write_header:
            writer.writeheader()
        writer.writerow({
            "effective_date": record.effective_date.isoformat(),
            "value_ars": format(record.value_ars, ".2f"),
            "source_url": record.source_url,
            "fetched_at": record.fetched_at.isoformat(),
        })
    return "imported"


def main() -> None:
    parser = argparse.ArgumentParser(description="Consultar/importar el JUS oficial de Córdoba.")
    parser.add_argument("--write", action="store_true", help="Guardar el dato en el histórico CSV.")
    parser.add_argument("--output", type=Path, default=DATA_PATH, help="Ruta CSV de destino.")
    args = parser.parse_args()

    record = fetch_official_jus()
    print(f"JUS: ARS {record.value_ars:.2f}")
    print(f"Vigente desde: {record.effective_date.isoformat()}")
    print(f"Fuente: {record.source_url}")
    if args.write:
        print(f"Resultado: {persist(record, args.output)}")
    else:
        print("Modo consulta: no se modificó ningún archivo. Usá --write para guardar.")


if __name__ == "__main__":
    main()
