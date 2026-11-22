import { useEffect, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Calculator,
  Check, ChevronDown, ChevronRight, CircleHelp, FileCheck2, FileLock2,
  FileText, Gavel, LayoutDashboard, Menu, Search, Settings2, ShieldCheck,
  Sparkles, UploadCloud, X,
} from "lucide-react";

type Section = "inicio" | "investigacion" | "honorarios" | "anonimizacion";
type JusInfo = { value_ars: string; effective_date: string; source_url: string; fetched_at: string; source_status: "live" | "cached" };
type JusConversion = { ars: string };
type ArsConversion = { jus: string };
type ResearchSource = { id: string; title: string; article: string; jurisdiction: string; version: string; captured_at: string; url: string; summary: string };
type ResearchResult = { answer: string; coverage: "limited" | "insufficient"; sources: ResearchSource[] };
const API = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");
const money = (value: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 }).format(value);

function App() {
  const [section, setSection] = useState<Section>("inicio");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [jus, setJus] = useState<JusInfo | null>(null);
  const [apiState, setApiState] = useState<"loading" | "online" | "offline">("loading");
  const [jusAmount, setJusAmount] = useState("2");
  const [arsAmount, setArsAmount] = useState("100000");
  const [convertedJus, setConvertedJus] = useState<JusConversion | null>(null);
  const [convertedArs, setConvertedArs] = useState<ArsConversion | null>(null);
  const [question, setQuestion] = useState("");
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState("");

  useEffect(() => {
    if (!API) { setApiState("offline"); return; }
    fetch(`${API}/health`)
      .then((response) => { if (!response.ok) throw new Error("API unavailable"); setApiState("online"); })
      .catch(() => setApiState("offline"));
    fetch(`${API}/api/v1/jus/current`)
      .then((response) => { if (!response.ok) throw new Error("JUS value unavailable"); return response.json(); })
      .then((data: JusInfo) => setJus(data))
      .catch(() => setJus(null));
  }, []);

  useEffect(() => {
    if (!API || !jus || !jusAmount || !arsAmount) { setConvertedJus(null); setConvertedArs(null); return; }
    const controller = new AbortController();
    const paramsJus = new URLSearchParams({ amount: jusAmount });
    const paramsArs = new URLSearchParams({ amount_ars: arsAmount });
    Promise.all([
      fetch(`${API}/api/v1/jus/convert?${paramsJus}`, { signal: controller.signal }).then(r => r.ok ? r.json() : Promise.reject(new Error("JUS conversion unavailable"))),
      fetch(`${API}/api/v1/jus/convert-to-jus?${paramsArs}`, { signal: controller.signal }).then(r => r.ok ? r.json() : Promise.reject(new Error("ARS conversion unavailable"))),
    ]).then(([jusResult, arsResult]: [JusConversion, ArsConversion]) => {
      setConvertedJus(jusResult);
      setConvertedArs(arsResult);
    }).catch(error => { if (!(error instanceof DOMException && error.name === "AbortError")) { setConvertedJus(null); setConvertedArs(null); } });
    return () => controller.abort();
  }, [jus, jusAmount, arsAmount]);
  const nav = [
    { id: "inicio" as const, label: "Inicio", icon: LayoutDashboard },
    { id: "investigacion" as const, label: "Investigación jurídica", icon: BookOpen },
    { id: "honorarios" as const, label: "Honorarios y JUS", icon: Calculator },
    { id: "anonimizacion" as const, label: "Anonimización", icon: FileLock2 },
  ];
  const titles: Record<Section, { eyebrow: string; title: string; description: string }> = {
    inicio: { eyebrow: "ESPACIO DE TRABAJO", title: "Buenas tardes.", description: "Tu espacio de trabajo jurídico, con Córdoba como punto de partida." },
    investigacion: { eyebrow: "INVESTIGACIÓN NORMATIVA", title: "Investigar con fundamento.", description: "Consultá legislación aplicable en Córdoba y seguí cada respuesta hasta su fuente." },
    honorarios: { eyebrow: "CÁLCULO ARANCELARIO", title: "Honorarios claros.", description: "Consultá el JUS y explorá cálculos transparentes basados en normativa cordobesa." },
    anonimizacion: { eyebrow: "PRIVACIDAD DOCUMENTAL", title: "Compartir sin exponer.", description: "Prepará documentos para compartir con detección revisable y redacción real." },
  };
  const active = titles[section];

  function changeSection(id: Section) { setSection(id); setMobileOpen(false); }

  async function submitResearch() {
    if (!API || !question.trim() || researchLoading) return;
    setResearchLoading(true);
    setResearchError("");
    setResearchResult(null);
    try {
      const response = await fetch(`${API}/api/v1/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "No se pudo procesar la consulta.");
      setResearchResult(data as ResearchResult);
    } catch (error) {
      setResearchError(error instanceof Error ? error.message : "Ocurrió un error inesperado.");
    } finally {
      setResearchLoading(false);
    }
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><img src="/images/H.webp" alt="Logo de Honoria" /></div><div><strong>Honoria</strong><span>CÓRDOBA · ARGENTINA</span></div><button className="mobile-close icon-button" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú"><X size={18}/></button></div>
      <div className="workspace-label">ESPACIO PERSONAL</div>
      <nav className="main-nav" aria-label="Navegación principal">
        {nav.map(item => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${section === item.id ? "active" : ""}`} onClick={() => changeSection(item.id)}><Icon size={18}/><span>{item.label}</span>{section === item.id && <span className="nav-dot"/>}</button>; })}
      </nav>
      <div className="sidebar-bottom">
        <div className="privacy-note"><div className="privacy-icon"><ShieldCheck size={17}/></div><div><strong>Privacidad primero</strong><p>Tus documentos no se guardan en este prototipo.</p></div></div>
        <button className="nav-item muted"><Settings2 size={18}/><span>Configuración</span></button>
        <div className="profile"><div className="avatar">HC</div><div><strong>Espacio de trabajo</strong><span>Modo de prueba</span></div><ChevronDown size={15}/></div>
      </div>
    </aside>

    {mobileOpen && <button className="mobile-scrim" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Abrir menú"><Menu size={20}/></button><div className="breadcrumb">Honoria <ChevronRight size={14}/> <span>{nav.find(n => n.id === section)?.label}</span></div><div className="topbar-right"><span className="jurisdiction"><span/> Córdoba, Argentina</span><button className="help-button"><CircleHelp size={17}/> Ayuda</button></div></header>
      <div className="page-content">
        <section className="page-heading"><div><div className="eyebrow">{active.eyebrow}</div><h1>{active.title}</h1><p>{active.description}</p></div><div className="heading-date">SÁBADO, 22 DE NOVIEMBRE</div></section>

        {section === "inicio" && <>
          <section className="welcome-banner"><div className="welcome-copy"><div className="banner-kicker"><Sparkles size={14}/> TU ASISTENTE JURÍDICO</div><h2>El derecho, con contexto.<br/><em>El trabajo, más simple.</em></h2><p>Investigación, honorarios y documentos en un solo lugar. Siempre con fuentes y reglas de Córdoba.</p><button className="light-button" onClick={() => changeSection("investigacion")}>Comenzar una consulta <ArrowRight size={16}/></button></div><div className="banner-art" aria-hidden="true"><div className="art-circle circle-one"/><div className="art-circle circle-two"/><div className="art-orbit"/><div className="art-document"><div className="doc-seal"><Gavel size={24}/></div><i/><i/><i/><i/><span>LEX · CÓRDOBA</span></div><div className="art-spark spark-a">✳</div><div className="art-spark spark-b">✧</div></div></section>
          <div className="section-title-row"><div><h2>Tu espacio de trabajo</h2><p>Elegí por dónde querés empezar.</p></div><span className="subtle-label">TRES HERRAMIENTAS</span></div>
          <section className="tool-grid">
            <button className="tool-card" onClick={() => changeSection("investigacion")}><div className="tool-icon lilac"><BookOpen size={20}/></div><div className="tool-meta">01 · NORMATIVA</div><h3>Investigación jurídica</h3><p>Encontrá normas, artículos y referencias oficiales para fundamentar tu trabajo.</p><span className="card-link">Explorar normativa <ArrowUpRight size={15}/></span></button>
            <button className="tool-card" onClick={() => changeSection("honorarios")}><div className="tool-icon sand"><Calculator size={20}/></div><div className="tool-meta">02 · ARANCELES</div><h3>Honorarios y JUS</h3><p>Consultá valores y realizá conversiones con operaciones explicadas.</p><span className="card-link">Abrir calculadora <ArrowUpRight size={15}/></span></button>
            <button className="tool-card" onClick={() => changeSection("anonimizacion")}><div className="tool-icon sage"><FileLock2 size={20}/></div><div className="tool-meta">03 · DOCUMENTOS</div><h3>Anonimización</h3><p>Detectá datos sensibles y revisá qué información debe ocultarse.</p><span className="card-link">Proteger documento <ArrowUpRight size={15}/></span></button>
          </section>
          <section className="bottom-grid"><div className="panel jus-panel"><div className="panel-heading"><div><span className="panel-kicker">INDICADOR OFICIAL</span><h3>Valor del JUS</h3></div><span className={`status-pill ${apiState === "online" ? "status-ok" : "status-pending"}`}><span/>{apiState === "loading" ? "Verificando API" : apiState === "online" ? "API conectada" : "API sin conexión"}</span></div><div className="jus-value">{jus ? money(Number(jus.value_ars)) : "—"}</div><div className="panel-foot">{jus ? <>Vigente desde {new Date(jus.effective_date + "T12:00:00").toLocaleDateString("es-AR")} · {jus.source_status === "cached" ? "Último valor verificado guardado; consulta en vivo temporalmente no disponible" : "Consulta oficial en vivo"} · <a href={jus.source_url} target="_blank" rel="noreferrer">Fuente oficial <ArrowUpRight size={12}/></a></> : "El valor JUS no está disponible en este momento."}</div></div><div className="panel focus-panel"><div className="focus-icon"><ShieldCheck size={19}/></div><div><span className="panel-kicker">UN COMPROMISO CENTRAL</span><h3>Los documentos son tuyos.</h3><p>La privacidad no es una función extra. Es parte de cómo está diseñada Honoria.</p><button onClick={() => changeSection("anonimizacion")}>Conocer la herramienta <ArrowRight size={14}/></button></div></div></section>
        </>}

        {section === "investigacion" && <section className="module-layout"><div className="panel module-panel"><div className="module-icon lilac"><BookOpen size={21}/></div><span className="panel-kicker">ASISTENTE NORMATIVO · CÓRDOBA</span><h2>¿Qué necesitás investigar?</h2><p className="module-intro">Formulá una pregunta jurídica. Las respuestas deberán basarse en fuentes normativas identificables y mostrar su vigencia.</p><label className="field-label" htmlFor="legal-query">Tu consulta</label><textarea id="legal-query" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ej. ¿Qué establece la Ley 9459 sobre la regulación de honorarios en primera instancia?" rows={5}/><div className="form-actions"><span className="field-hint"><ShieldCheck size={14}/> No incluyas datos personales ni información confidencial.</span><button className="primary-button" disabled={!question.trim() || researchLoading || !API} onClick={submitResearch}>{researchLoading ? "Investigando…" : "Investigar consulta"} <ArrowRight size={16}/></button></div>{!API && <div className="notice-box"><Activity size={17}/><div><strong>API no configurada</strong><p>No se encontró la dirección del backend.</p></div></div>}{researchError && <div className="notice-box"><Activity size={17}/><div><strong>No se pudo completar la consulta</strong><p>{researchError}</p></div></div>}{researchResult && <div className="research-result"><div className="research-result-heading"><strong>{researchResult.coverage === "limited" ? "Respuesta basada en fuentes recuperadas" : "Cobertura normativa insuficiente"}</strong><span>{researchResult.coverage === "limited" ? "CORPUS INICIAL" : "SIN RESPALDO SUFICIENTE"}</span></div><p className="research-answer">{researchResult.answer}</p>{researchResult.sources.length > 0 && <div className="research-citations"><strong>Fuentes consultadas</strong>{researchResult.sources.map(source => <article className="research-citation" key={source.id}><div><b>{source.title}</b> · {source.article}</div><p><b>Síntesis orientativa (no transcripción literal):</b> {source.summary}</p><small>{source.jurisdiction} · {source.version} · Captura: {source.captured_at}</small><a href={source.url} target="_blank" rel="noreferrer">Abrir texto oficial <ArrowUpRight size={13}/></a></article>)}</div>}<p className="research-disclaimer">Cobertura limitada: el corpus contiene artículos seleccionados, no toda la legislación vigente. Verificá siempre el texto oficial y el caso concreto. No incluye jurisprudencia.</p></div>}</div><aside className="side-info"><div className="panel"><span className="panel-kicker">FUENTES PREVISTAS</span><h3>Marco normativo</h3><ul className="source-list"><li><FileText size={16}/> Ley provincial 9459 y modificatorias</li><li><FileText size={16}/> Código Procesal Civil y Comercial de Córdoba</li><li><FileText size={16}/> Código Civil y Comercial de la Nación</li><li><FileText size={16}/> Resoluciones oficiales del JUS</li></ul><div className="info-foot">La primera versión no incluye jurisprudencia.</div></div></aside></section>}

        {section === "honorarios" && <section className="module-layout"><div className="panel module-panel calculator-panel"><div className="module-icon sand"><Calculator size={21}/></div><span className="panel-kicker">CONVERSOR JUS · PESOS</span><h2>Calculá con transparencia.</h2><p className="module-intro">Conversión informativa usando el último valor disponible en la API. No reemplaza la determinación de honorarios conforme a la ley.</p><div className="conversion-block"><div className="conversion-head"><label htmlFor="jus-amount">JUS a pesos</label><span>CONVERSIÓN DIRECTA</span></div><div className="conversion-input"><input id="jus-amount" type="number" min="0" step="0.01" value={jusAmount} onChange={e => setJusAmount(e.target.value)}/><span>JUS</span></div><div className="conversion-result"><span>Resultado estimado</span><strong>{convertedJus === null ? "Calculando…" : money(Number(convertedJus.ars))}</strong></div></div><div className="conversion-block"><div className="conversion-head"><label htmlFor="ars-amount">Pesos a JUS</label><span>CONVERSIÓN INVERSA</span></div><div className="conversion-input"><span className="currency-prefix">$</span><input id="ars-amount" type="number" min="0" step="0.01" value={arsAmount} onChange={e => setArsAmount(e.target.value)}/><span>ARS</span></div><div className="conversion-result"><span>Resultado estimado</span><strong>{convertedArs === null ? "Calculando…" : `${Number(convertedArs.jus).toLocaleString("es-AR", { maximumFractionDigits: 4 })} JUS`}</strong></div></div><div className="calculator-note"><CircleHelp size={15}/><span>La conversión usa el valor JUS vigente devuelto por el backend. Los cálculos de honorarios por actuación se incorporarán cuando cada regla tenga respaldo normativo verificado.</span></div></div><aside className="side-info"><div className="panel"><span className="panel-kicker">VALOR DE REFERENCIA</span><h3>JUS Córdoba</h3><div className="side-jus">{jus ? money(Number(jus.value_ars)) : "No disponible"}</div><p className="side-copy">{jus ? `Vigencia: ${new Date(jus.effective_date + "T12:00:00").toLocaleDateString("es-AR")}${jus.source_status === "cached" ? " · valor guardado" : " · consulta en vivo"}` : "El valor oficial no está disponible temporalmente."}</p>{jus && <a className="source-link" href={jus.source_url} target="_blank" rel="noreferrer">Consultar fuente <ArrowUpRight size={14}/></a>}<div className="info-foot">Jurisdicción: exclusivamente Provincia de Córdoba.</div></div></aside></section>}

        {section === "anonimizacion" && <section className="module-layout"><div className="panel module-panel anonymize-panel"><div className="module-icon sage"><FileLock2 size={21}/></div><span className="panel-kicker">PROTECCIÓN DOCUMENTAL</span><h2>Antes de compartir, protegé.</h2><p className="module-intro">La anonimización debe eliminar los datos del archivo, no simplemente cubrirlos en pantalla. Esta función todavía está en desarrollo.</p><div className="upload-zone"><div className="upload-icon"><UploadCloud size={25}/></div><strong>Prepará tu documento</strong><p>La carga de archivos se habilitará cuando el procesamiento seguro esté implementado.</p><button className="secondary-button" disabled><UploadCloud size={16}/> Próximamente</button></div><div className="privacy-checks"><div><Check size={15}/><span>El original debe conservarse sin modificaciones.</span></div><div><Check size={15}/><span>Las detecciones deben poder revisarse y corregirse.</span></div><div><Check size={15}/><span>El archivo final debe verificarse después de la redacción.</span></div></div></div><aside className="side-info"><div className="panel privacy-side"><div className="privacy-icon large"><ShieldCheck size={21}/></div><span className="panel-kicker">DISEÑO CON PRIVACIDAD</span><h3>Sin falsas garantías.</h3><p>OCR, manuscritos, firmas, sellos y metadatos requieren controles específicos. Siempre habrá una revisión humana antes de compartir.</p></div></aside></section>}
        <footer className="page-footer"><span>Honoria Córdoba</span><span>Una herramienta de apoyo. No reemplaza el criterio profesional.</span><span>HECHO CON CUIDADO <span className="footer-heart">✳</span></span></footer>
      </div>
    </main>
  </div>;
}

export default App;
