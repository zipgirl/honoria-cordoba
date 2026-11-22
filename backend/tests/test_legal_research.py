import pytest

from app.services.legal_research import retrieve_sources


def test_retrieves_relevant_cordoba_arancel_articles():
    results = retrieve_sources("¿Cuáles son los mínimos de honorarios en primera instancia según la Ley 9459?")
    ids = {source.source_id for source in results}
    assert "cordoba-9459-art-36" in ids
    assert all(source.jurisdiction == "Provincia de Córdoba" for source in results)


def test_retrieval_returns_no_sources_for_uncovered_question():
    assert retrieve_sources("¿Qué dijo la Cámara en el caso Pérez contra Gómez?") == []


def test_retrieval_is_case_and_accent_insensitive():
    results = retrieve_sources("VALOR DEL JUS y actualización")
    assert any(source.source_id == "cordoba-9459-art-35" for source in results)


@pytest.mark.parametrize("question", ["", "   ", "???"])
def test_empty_or_punctuation_question_has_no_sources(question):
    assert retrieve_sources(question) == []
