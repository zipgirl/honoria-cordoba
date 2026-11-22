# Backend — Honoria Córdoba

API inicial y motor arancelario determinístico. La integración del JUS consulta la página pública del Colegio de Abogados de Córdoba y valida importe y fecha de vigencia.

## Requisitos

Python 3.11+

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -e ".[dev]"
pytest
uvicorn app.main:app --reload
```

## JUS oficial

Consultar el valor publicado sin modificar datos:

```bash
honoria-import-jus
```

Guardar un nuevo valor en el histórico solo tras validar la salida:

```bash
honoria-import-jus --write
```

El importador:
- Solo consulta HTTPS en `www.abogado.org.ar`.
- Extrae valor y fecha de vigencia desde la sección “Valor Jus”.
- Conserva el histórico; no sobrescribe automáticamente una fecha existente si el importe cambia.
- Usa decimales exactos (`Decimal`), nunca `float`.
- No necesita credenciales, no lee archivos de entorno y no requiere tocar `.env`.

Fuente oficial: https://www.abogado.org.ar/valores-y-tasas/

## Endpoints

- `GET /health`
- `GET /api/v1/jus/current` — consulta online del valor actual.
- `GET /api/v1/jus/historical?on=YYYY-MM-DD` — valor histórico guardado.
- `GET /api/v1/jus/convert?amount=2&on=YYYY-MM-DD` — JUS a pesos.
- `GET /api/v1/jus/convert-to-jus?amount_ars=104642.94&on=YYYY-MM-DD` — pesos a JUS.

El histórico inicial contiene el valor oficial publicado con vigencia 1/11/2026. No se inventan valores anteriores. La disponibilidad del endpoint histórico depende de que existan registros para la fecha consultada.
