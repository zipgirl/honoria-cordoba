from datetime import date
from decimal import Decimal

import pytest

from app.services.jus_source import JusSourceError, parse_official_page


PAGE = """
<html><body>
<h2>Valores y Tasas</h2>
<h3>Valor Jus</h3>
<p>$52.321,47</p>
<p>01/11/2026</p>
</body></html>
"""


def test_parse_official_jus_value_and_effective_date():
    record = parse_official_page(PAGE)
    assert record.value_ars == Decimal("52321.47")
    assert record.effective_date == date(2026, 11, 1)
    assert record.source_url == "https://www.abogado.org.ar/valores-y-tasas/"


def test_parser_rejects_missing_jus_label():
    with pytest.raises(JusSourceError):
        parse_official_page("<html><body>$52.321,47</body></html>")
