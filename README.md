# Honoria Córdoba

**Asistente jurídico y de gestión de honorarios para la Provincia de Córdoba, Argentina.**

Honoria Córdoba es una aplicación web responsive orientada a abogados y estudiantes de Derecho. Reúne investigación normativa, cálculo transparente de honorarios conforme al régimen cordobés y herramientas de trabajo documental, con especial atención a la anonimización segura de documentos.

## Objetivos

- Consultar legislación y normativa aplicable en Córdoba con referencias verificables.
- Calcular honorarios y presupuestos mediante reglas determinísticas, trazables y actualizables.
- Guiar la preparación y análisis de actuaciones y trámites.
- Anonimizar documentos antes de compartirlos o analizarlos, permitiendo revisar y corregir cada detección.
- Generar informes y exportaciones útiles para el trabajo profesional y académico.

## Alcance jurídico

El sistema se limita al derecho positivo y a las fuentes normativas de la Provincia de Córdoba, incluyendo la Ley 9459 y sus modificatorias, el régimen oficial del JUS, códigos procesales provinciales y normativa nacional relevante cuando corresponda. La primera versión no incorporará jurisprudencia.

No reemplaza el criterio profesional ni debe presentar sus respuestas como asesoramiento jurídico definitivo. Toda respuesta jurídica debe identificar las fuentes utilizadas y advertir cuando la información disponible sea insuficiente.

## Arquitectura prevista

- **Frontend:** aplicación web responsive, instalable como PWA si resulta conveniente.
- **Backend:** API Python/FastAPI para consultas, autenticación y servicios.
- **Motor de honorarios:** módulo determinístico independiente del modelo de lenguaje.
- **Capa normativa:** corpus versionado de fuentes oficiales y recuperación con citas.
- **Documentos:** pipeline de detección, revisión y redacción irreversible de datos personales.
- **Despliegue:** frontend accesible desde el sitio ZipGirl y mediante URL propia; backend desplegado por separado.

La arquitectura final y los proveedores se confirmarán durante la auditoría técnica y de privacidad.

## Principios no negociables

1. **Córdoba primero:** no mezclar JUS, aranceles ni reglas de otras jurisdicciones.
2. **Fuentes antes que afirmaciones:** cada respuesta normativa debe poder rastrearse.
3. **Cálculos reproducibles:** la IA no realiza aritmética ni inventa valores.
4. **Privacidad por diseño:** no enviar documentos sensibles a servicios externos sin información clara y consentimiento explícito.
5. **Anonimización real:** eliminar o sustituir datos en el contenido del archivo; no simular redacción con una capa visual.
6. **Transparencia:** explicar límites, supuestos, vigencia normativa y operaciones realizadas.

## Estado

Proyecto en etapa de definición y construcción de la base técnica. Consultar [la hoja de ruta](docs/ROADMAP.md), [los requisitos funcionales](docs/PRODUCT_SPEC.md), [la arquitectura](docs/ARCHITECTURE.md) y [la política de privacidad documental](docs/DOCUMENT_PRIVACY.md).
