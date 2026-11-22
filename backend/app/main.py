import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field

from app.services.jus_history import ars_to_jus, jus_to_ars, read_records, value_on
from app.services.jus_source import JusSourceError, fetch_official_jus
from app.services.legal_research import generate_answer, retrieve_sources

app = FastAPI(
    title="Honoria Córdoba API",
    version="0.1.0",
    description="Servicios jurídicos y arancelarios para la Provincia de Córdoba.",
)

allowed_origins = [origin.strip() for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/v1/jus/current")
def current_jus() -> dict[str, str]:
    source_status = "live"
    try:
        record = fetch_official_jus()
    except JusSourceError:
        records = read_records()
        if not records:
            raise HTTPException(
                status_code=503,
                detail="La fuente oficial no está disponible y no hay un valor JUS verificado en caché.",
            )
        record = records[-1]
        source_status = "cached"
    return {
        "value_ars": format(record.value_ars, ".2f"),
        "effective_date": record.effective_date.isoformat(),
        "source_url": record.source_url,
        "fetched_at": record.fetched_at.isoformat(),
        "source_status": source_status,
    }


@app.get("/api/v1/jus/historical")
def historical_jus(on: date) -> dict[str, str]:
    try:
        record = value_on(on, read_records())
    except JusSourceError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {
        "value_ars": format(record.value_ars, ".2f"),
        "effective_date": record.effective_date.isoformat(),
        "source_url": record.source_url,
    }


@app.get("/api/v1/jus/convert")
def convert_jus(amount: Decimal, on: date | None = None) -> dict[str, str]:
    try:
        record = value_on(on or date.today(), read_records())
        return {
            "jus": str(amount),
            "ars": format(jus_to_ars(amount, record), ".2f"),
            "jus_value_ars": format(record.value_ars, ".2f"),
            "effective_date": record.effective_date.isoformat(),
        }
    except JusSourceError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@app.get("/api/v1/jus/convert-to-jus")
def convert_to_jus(amount_ars: Decimal, on: date | None = None) -> dict[str, str]:
    try:
        record = value_on(on or date.today(), read_records())
        return {
            "ars": str(amount_ars),
            "jus": format(ars_to_jus(amount_ars, record), ".4f"),
            "jus_value_ars": format(record.value_ars, ".2f"),
            "effective_date": record.effective_date.isoformat(),
        }
    except JusSourceError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


class ResearchRequest(BaseModel):
    question: str = Field(min_length=8, max_length=3000)


@app.post("/api/v1/research")
async def legal_research(request: ResearchRequest) -> dict:
    question = request.question.strip()
    if len(question) < 8:
        raise HTTPException(status_code=422, detail="La consulta debe tener al menos 8 caracteres.")

    sources = retrieve_sources(question)
    if not sources:
        return {
            "answer": (
                "No encontré extractos suficientemente relacionados en el corpus normativo "
                "disponible. No se generó una respuesta. La cobertura inicial es limitada "
                "y esta consulta requiere ampliar o verificar las fuentes."
            ),
            "sources": [],
            "coverage": "insufficient",
        }

    if not os.getenv("COHERE_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="El proveedor de investigación no está configurado en el servidor.",
        )
    try:
        answer = await generate_answer(question, sources)
    except Exception as exc:
        # Never expose provider response bodies, credentials, or request content.
        raise HTTPException(
            status_code=502,
            detail="No se pudo generar la respuesta con el proveedor de IA. Intentá nuevamente.",
        ) from exc

    return {
        "answer": answer,
        "coverage": "limited",
        "sources": [
            {
                "id": source.source_id,
                "title": source.title,
                "article": source.article,
                "jurisdiction": source.jurisdiction,
                "version": source.version,
                "captured_at": source.captured_at,
                "url": source.url,
                "excerpt": source.text,
            }
            for source in sources
        ],
    }
