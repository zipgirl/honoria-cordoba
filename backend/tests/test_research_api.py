from fastapi.testclient import TestClient

from app import main


def test_research_returns_no_answer_when_corpus_has_no_match(monkeypatch):
    # Isolate the API's no-source behavior: this test must never call Cohere.
    monkeypatch.setenv("COHERE_API_KEY", "test-key")
    monkeypatch.setattr(main, "retrieve_sources", lambda question: [])

    async def unexpected_provider_call(question, sources):
        raise AssertionError("Cohere must not be called when retrieval returns no sources.")

    monkeypatch.setattr(main, "generate_answer", unexpected_provider_call)
    client = TestClient(main.app)
    response = client.post(
        "/api/v1/research",
        json={"question": "¿Qué dijo la Cámara en el caso Pérez contra Gómez?"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["coverage"] == "insufficient"
    assert payload["sources"] == []
    assert "No encontré" in payload["answer"]


def test_research_returns_sources_and_answer_from_provider(monkeypatch):
    async def fake_answer(question, sources):
        assert "Ley 9459" in question
        assert any(source.article == "Artículo 36" for source in sources)
        return "La norma establece una escala mínima y un máximo."

    monkeypatch.setenv("COHERE_API_KEY", "test-key")
    monkeypatch.setattr(main, "generate_answer", fake_answer)
    client = TestClient(main.app)
    response = client.post(
        "/api/v1/research",
        json={"question": "¿Cuáles son los mínimos de honorarios de primera instancia según Ley 9459?"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["coverage"] == "limited"
    assert payload["answer"].startswith("La norma")
    assert any(source["article"] == "Artículo 36" for source in payload["sources"])


def test_research_requires_minimum_question_length():
    client = TestClient(main.app)
    response = client.post("/api/v1/research", json={"question": "hola"})
    assert response.status_code == 422
