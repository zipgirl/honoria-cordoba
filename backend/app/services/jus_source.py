"""Obtención y validación del valor JUS desde la fuente oficial del Colegio.

No consulta ni carga variables de entorno. Solo acepta el dominio oficial configurado.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timezone
from decimal import Decimal, InvalidOperation
import re
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup

OFFICIAL_URL = "https://www.abogado.org.ar/valores-y-tasas/"
OFFICIAL_HOST = "www.abogado.org.ar"


class JusSourceError(RuntimeError):
    """La fuente oficial no pudo leerse o no pasó las validaciones."""


@dataclass(frozen=True)
class JusRecord:
    value_ars: Decimal
    effective_date: date
    source_url: str
    fetched_at: datetime


def _argentine_decimal(raw: str) -> Decimal:
    normalized = raw.strip().replace("$", "").replace(" ", "")
    normalized = normalized.replace(".", "").replace(",", ".")
    try:
        value = Decimal(normalized)
    except InvalidOperation as exc:
        raise JusSourceError(f"Importe JUS inválido: {raw!r}") from exc
    if not value.is_finite() or value <= 0:
        raise JusSourceError("El importe JUS debe ser un decimal positivo y finito.")
    return value.quantize(Decimal("0.01"))


def parse_official_page(html: str, *, fetched_at: datetime | None = None) -> JusRecord:
    """Extrae el importe y la fecha que aparecen inmediatamente bajo 'Valor Jus'."""
    soup = BeautifulSoup(html, "html.parser")
    lines = [re.sub(r"\s+", " ", line).strip() for line in soup.get_text("\n").splitlines()]
    lines = [line for line in lines if line]
    try:
        index = next(i for i, line in enumerate(lines) if line.casefold() == "valor jus")
    except StopIteration as exc:
        raise JusSourceError("La página oficial no contiene el rótulo 'Valor Jus'.") from exc

    value_line = next((line for line in lines[index + 1:index + 4] if "$" in line), None)
    if value_line is None:
        raise JusSourceError("No se encontró el importe junto al rótulo 'Valor Jus'.")
    date_line = next(
        (line for line in lines[index + 1:index + 5]
         if re.fullmatch(r"\d{2}/\d{2}/\d{4}", line)),
        None,
    )
    if date_line is None:
        raise JusSourceError("No se encontró la fecha de vigencia del valor JUS.")

    try:
        effective = datetime.strptime(date_line, "%d/%m/%Y").date()
    except ValueError as exc:
        raise JusSourceError("La fecha de vigencia publicada no es válida.") from exc

    return JusRecord(
        value_ars=_argentine_decimal(value_line),
        effective_date=effective,
        source_url=OFFICIAL_URL,
        fetched_at=fetched_at or datetime.now(timezone.utc),
    )


def fetch_official_jus(client: httpx.Client | None = None) -> JusRecord:
    """Descarga la página oficial con timeout y validación del host de destino."""
    parsed = urlparse(OFFICIAL_URL)
    if parsed.scheme != "https" or parsed.hostname != OFFICIAL_HOST:
        raise JusSourceError("La URL configurada no pertenece al host oficial permitido.")

    owns_client = client is None
    http = client or httpx.Client(
        timeout=httpx.Timeout(15.0),
        follow_redirects=True,
        headers={"User-Agent": "HonoriaCordoba/0.1 (public JUS value importer)"},
    )
    try:
        response = http.get(OFFICIAL_URL)
        response.raise_for_status()
        final_host = urlparse(str(response.url)).hostname
        if final_host != OFFICIAL_HOST:
            raise JusSourceError("La página redirigió fuera del dominio oficial.")
        return parse_official_page(response.text)
    except httpx.HTTPError as exc:
        raise JusSourceError(f"No se pudo consultar la página oficial: {exc}") from exc
    finally:
        if owns_client:
            http.close()
