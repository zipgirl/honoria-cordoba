# Backend — Honoria Córdoba

API inicial, motor arancelario determinístico e investigación normativa asistida.

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

El importador solo consulta HTTPS en `www.abogado.org.ar`, conserva el histórico y usa `Decimal`. No necesita credenciales ni lee archivos de entorno.

## Investigación normativa

- `POST /api/v1/research` — recibe `{"question":"..."}`, recupera extractos de un corpus inicial y sintetiza una respuesta con Cohere.
- Requiere `COHERE_API_KEY` como variable protegida del servicio. Opcional: `COHERE_MODEL`.
- El modelo no es fuente de derecho: las citas las adjunta el backend desde el corpus recuperado.
- Si no hay coincidencias suficientes, no se llama al modelo y se devuelve una respuesta explícita sin fuentes.
- El corpus inicial es deliberadamente limitado a artículos seleccionados de la Ley cordobesa 9459 y el Código Civil y Comercial nacional. No cubre toda la legislación ni reemplaza la verificación del texto vigente. No incluye jurisprudencia.
- Cada resultado identifica jurisdicción, norma, artículo, URL oficial y fecha de captura del extracto.

Fuentes oficiales consultadas:
- Ley 9459 (texto actualizado): https://www.argentina.gob.ar/normativa/provincial/ley-9459-123456789-0abc-defg-954-9000ovorpyel/actualizacion
- Código Civil y Comercial, Ley 26.994 (texto actualizado): https://www.argentina.gob.ar/normativa/nacional/c%C3%B3digo-civil-y-comercial-de-la-naci%C3%B3n-235975/actualizacion

## JUS endpoints

- `GET /health`
- `GET /api/v1/jus/current`
- `GET /api/v1/jus/historical?on=YYYY-MM-DD`
- `GET /api/v1/jus/convert?amount=2&on=YYYY-MM-DD`
- `GET /api/v1/jus/convert-to-jus?amount_ars=104642.94&on=YYYY-MM-DD`

El histórico inicial contiene el valor oficial publicado con vigencia 1/11/2026. No se inventan valores anteriores.
