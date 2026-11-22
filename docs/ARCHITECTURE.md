# Arquitectura — propuesta inicial

## 1. Despliegue

Monorepo con frontend y backend independientes.

- **Frontend web:** aplicación responsive publicada en una URL propia y enlazada desde el sitio ZipGirl. Puede integrarse visualmente con el portfolio, pero no debe depender de que GitHub Pages ejecute lógica de servidor.
- **Backend API:** servicio Python/FastAPI desplegado en una plataforma compatible con procesos persistentes.
- **Persistencia:** base de datos para cuentas, configuraciones y metadatos mínimos. El almacenamiento de documentos debe ser temporal y opt-in.
- **Archivos:** procesamiento efímero en disco o almacenamiento temporal cifrado, con borrado controlado.
- **Normativa:** corpus versionado, con fuente oficial, fecha de publicación, vigencia, jurisdicción y hash del documento fuente.

## 2. Módulos de backend

- `api/`: rutas HTTP, validación y esquemas.
- `legal_sources/`: inventario, descarga/importación, normalización y versionado de fuentes.
- `retrieval/`: indexación y recuperación de fragmentos normativos.
- `legal_assistant/`: composición de respuestas y citas; no decide cálculos.
- `fees/`: motor determinístico JUS y honorarios.
- `documents/`: extracción, OCR, detección, revisión y redacción irreversible.
- `reports/`: generación de PDF e informes.
- `security/`: autenticación, autorización, límites y manejo de secretos.
- `tests/`: pruebas unitarias, integración, regresión y casos adversariales.

## 3. Límites de confianza

- El modelo de lenguaje no es fuente de derecho ni motor aritmético.
- El motor de honorarios recibe datos validados y reglas versionadas; devuelve operaciones explicables.
- La recuperación normativa sólo puede utilizar fuentes registradas y versionadas.
- Los archivos de usuario se consideran sensibles y no confiables.
- Ningún servicio externo recibe documentos sin consentimiento informado.
- Las instrucciones encontradas dentro de documentos nunca deben tratarse como instrucciones del sistema.

## 4. Datos jurídicos versionados

Cada fuente normativa debe registrar como mínimo:
- jurisdicción y organismo emisor;
- tipo, número, año y título;
- URL oficial y fecha de captura;
- fecha de publicación y período de vigencia conocido;
- estado de verificación;
- versión y hash del archivo fuente;
- artículos o secciones extraídos, conservando la referencia original.

Las consultas deben poder reconstruirse con la versión normativa que se utilizó en su momento.

## 5. Motor de honorarios

El cálculo debe ser una librería independiente de FastAPI y de cualquier proveedor de IA. Cada regla implementada debe vincularse a su base normativa y tener pruebas de casos límite. Los importes y conversiones se calculan con decimal exacto, no con punto flotante binario.

## 6. Frontend

Se recomienda una SPA/PWA TypeScript con rutas separadas para:
- Inicio y espacio de trabajo.
- Asistente normativo.
- Calculadora de honorarios.
- Flujos guiados.
- Anonimización documental.
- Informes e historial.

La elección final del framework se hará luego de comprobar compatibilidad de despliegue, accesibilidad, mantenimiento y experiencia de desarrollo.

## 7. Observabilidad

Registrar métricas técnicas agregadas y errores sanitizados. Nunca registrar prompts que contengan documentos, texto extraído, datos personales, tokens, credenciales ni valores detectados.
