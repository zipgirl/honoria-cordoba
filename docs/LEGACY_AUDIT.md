# Auditoría inicial del proyecto de origen

Repositorio revisado: `Agus-03/finalAgusPerez`  
Destino de trabajo: `zipgirl/honoria-cordoba`

## 1. Componentes aprovechables

El proyecto de origen ya contiene una base Python/FastAPI con:
- recuperación normativa (RAG), reranking y generación de respuestas;
- integración con Cohere y ChromaDB;
- clasificación de intenciones;
- almacenamiento de historial;
- módulo inicial de consulta del valor JUS y consulta histórica;
- reglas documentadas para separar cálculos determinísticos del modelo de lenguaje;
- alcance declarado exclusivamente para Córdoba.

La documentación funcional y de lógica determinística es un buen punto de partida conceptual. No debe migrarse código sin pruebas y revisión de seguridad.

## 2. Hallazgos técnicos que requieren corrección

### Valor JUS
- `get_jus_actual()` toma la primera fila del CSV y asume que el archivo está ordenado correctamente.
- El parseo numérico elimina puntos y reemplaza comas, pero no valida formatos, valores negativos, duplicados ni fechas inválidas.
- `get_jus_por_anio()` filtra por prefijo de texto y no ordena explícitamente los resultados, aunque su documentación afirma que devuelve orden descendente.
- Las operaciones usan `float`; para importes monetarios se debe migrar a `Decimal`.
- No hay una consulta robusta del valor vigente para una fecha arbitraria ni manejo explícito de períodos sin datos.

### API y clasificación jurisdiccional
- La detección de provincias y localidades mediante búsquedas de subcadenas es frágil: puede producir coincidencias parciales, falsos positivos y falsos negativos.
- La lista extensa de localidades está embebida en el archivo de rutas y debería reemplazarse por una estrategia de jurisdicción más simple y validada.
- Hay una inconsistencia de nombre entre `aclaracion_localidad` y `aclaracion_loclidad`, por lo que la aclaración prevista no se aplica.
- La selección de intención y tipo documental usa palabras clave simples; preguntas mixtas pueden ser clasificadas incorrectamente.
- El endpoint recibe parámetros simples y necesita esquemas Pydantic, límites, errores tipados y validación.
- El historial se guarda para consultas RAG, pero no hay una política documentada de retención ni sanitización de datos.

### RAG y respuestas
- La respuesta generada se enriquece con pesos después de la generación; la conversión debe moverse a un servicio determinístico con datos de vigencia explícitos.
- Se debe exigir metadata de fuente y artículo en cada fragmento normativo y validar las citas antes de devolverlas.
- Se necesitan controles para corpus vacío, recuperación insuficiente, documentos contradictorios y normas fuera de vigencia.
- El modelo debe tratar el texto recuperado como contenido no confiable, nunca como instrucciones.

## 3. Hallazgo crítico de seguridad

El repositorio de origen contiene un archivo `.env` versionado según la inspección previa. No se deben copiar sus contenidos ni trasladar credenciales al nuevo repositorio.

Acciones necesarias:
1. comprobar localmente qué secretos reales pudieron quedar expuestos, sin imprimirlos ni compartirlos;
2. revocar y rotar cualquier clave o token que haya sido válido y estuviera versionado;
3. eliminar el archivo del historial del repositorio de origen si corresponde, además de retirarlo del árbol actual;
4. guardar secretos únicamente en variables de entorno del entorno de despliegue;
5. mantener sólo un `.env.example` con nombres de variables y valores ficticios.

No se reproducen aquí valores, nombres sensibles ni contenidos del archivo.

## 4. Brechas de producto

El proyecto de origen no implementa todavía:
- frontend completo responsive;
- flujos guiados de actuaciones;
- calculadora integral por servicios, instancias y etapas;
- tablas estructuradas de honorarios;
- división de honorarios;
- exportación de informes;
- anonimización documental;
- autenticación y gestión de sesiones con garantías de privacidad;
- inventario de fuentes con versionado y fechas de vigencia.

La anonimización debe desarrollarse como módulo independiente, con procesamiento aislado, revisión humana, redacción irreversible y verificación posterior. No se debe enviar documentación sensible a Cohere ni a otro servicio externo por defecto.

## 5. Decisión de migración

Se recomienda migrar por componentes, no copiar el proyecto completo:
1. rescatar y corregir el modelo de datos JUS;
2. reconstruir el motor arancelario como librería independiente y testeable;
3. conservar la idea de RAG, pero rehacer ingestión, metadata, citas y control temporal;
4. diseñar la API con contratos explícitos;
5. implementar anonimización antes de habilitar carga documental para consultas de IA;
6. crear el frontend como aplicación independiente conectada a la API.

## 6. Criterio de salida de auditoría

No se considera listo para producción hasta contar con:
- inventario de fuentes oficiales revisado;
- reglas de honorarios verificadas contra normativa vigente;
- pruebas automatizadas para cálculos y fechas;
- pruebas de privacidad y redacción documental;
- revisión de secretos y dependencias;
- política de retención y borrado;
- despliegue separado de frontend y backend con HTTPS.
