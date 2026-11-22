# Requisitos funcionales — Honoria Córdoba

## 1. Usuarios y objetivos

Público inicial:
- Abogados/as que ejercen en la Provincia de Córdoba.
- Estudiantes de Derecho que necesitan consultar normativa y comprender procedimientos y cálculos.

La experiencia debe ser clara para estudiantes y suficientemente rigurosa, auditable y configurable para profesionales.

## 2. Módulos del producto

### 2.1 Inicio y espacio de trabajo
- Acceso rápido a consultas jurídicas, cálculo de honorarios y anonimización.
- Historial de trabajos recientes, si el usuario habilita guardado.
- Avisos visibles sobre vigencia de fuentes y estado de actualización.
- Diseño responsive para escritorio, tablet y móvil.

### 2.2 Asistente de investigación normativa
- Responder preguntas sobre legislación aplicable en Córdoba.
- Permitir consultas combinadas de procedimiento y normativa.
- Citar norma, artículo, texto o fragmento relevante, fuente oficial y fecha/versión consultada.
- Diferenciar texto normativo, explicación del sistema y dato no confirmado.
- Indicar expresamente cuando no encuentra sustento suficiente.
- Permitir abrir la fuente primaria y copiar/exportar la respuesta con sus citas.
- No incluir jurisprudencia en la primera versión.

### 2.3 Motor de honorarios y JUS
- Consultar el valor actual e histórico del JUS con fecha de vigencia y fuente.
- Convertir JUS a pesos y pesos a JUS usando aritmética determinística.
- Guiar cálculos por tipo de actuación, instancia, etapa, complejidad y demás variables que establezca la normativa cordobesa.
- Contemplar primera y segunda instancia.
- Contemplar profesionales y auxiliares de justicia cuando exista base normativa verificable.
- Mostrar mínimos, máximos y rangos cuando la norma así los establezca.
- Permitir distribuir honorarios entre profesionales o etapas cuando la regla aplicable lo permita.
- Explicar fórmula, variables, supuestos, redondeo, norma y versión del JUS utilizada.
- No elegir arbitrariamente un punto dentro de un rango legal.
- No calcular un total cerrado cuando faltan variables o la norma sólo ofrece un rango.

### 2.4 Flujos guiados
- Entrevistas o asistentes paso a paso para reunir los datos necesarios.
- Guías de actuaciones y procedimientos con requisitos, etapas y normativa asociada.
- Formularios adaptativos: preguntar sólo los datos necesarios para el caso seleccionado.
- Resumen editable antes de ejecutar un cálculo o generar un informe.
- Señalar qué datos son obligatorios, opcionales o desconocidos.

### 2.5 Anonimización documental — prioridad crítica
- Cargar documentos PDF y formatos de texto habituales; definir soporte adicional luego de la prueba técnica.
- Detectar posibles datos personales y confidenciales: nombres, DNI, CUIT/CUIL, domicilios, teléfonos, correos, matrículas, datos bancarios, datos de menores, datos de salud y otros identificadores.
- Detectar entidades contextuales que no responden a patrones simples, como nombres dentro de narraciones o referencias cruzadas.
- Mostrar detecciones en contexto y permitir aceptar, rechazar, editar o agregar manualmente.
- Ofrecer sustituciones consistentes (por ejemplo, PERSONA_01) para mantener legibilidad y referencias internas.
- Generar un archivo nuevo con redacción irreversible, sin alterar el original.
- Eliminar texto oculto, metadatos, comentarios, anotaciones y capas OCR que puedan revelar el contenido redactado, dentro de las capacidades del formato.
- Permitir descargar el resultado y un reporte de categorías tratadas, sin incluir los valores sensibles.
- Advertir sobre OCR, imágenes, manuscritos, firmas, sellos y contenido que no pudo verificarse.
- Nunca prometer anonimización perfecta: incluir revisión humana obligatoria antes de compartir.
- No utilizar documentos cargados para entrenar modelos.

### 2.6 Informes y exportación
- Exportar cálculos y reportes en PDF.
- Incluir fecha de generación, fuentes, versión normativa, valor JUS y operaciones.
- Permitir exportar una consulta jurídica con sus referencias.
- No incluir datos personales que el usuario haya anonimizado o excluido.

### 2.7 Cuenta, privacidad e historial
- El modo sin cuenta debe ser considerado para tareas documentales sensibles.
- Guardar historial sólo con control explícito del usuario.
- Permitir borrar documentos, resultados e historial.
- Separar datos de cuenta de los documentos procesados.
- Incorporar autenticación y permisos antes de habilitar espacios de trabajo compartidos.

## 3. Fuentes jurídicas incluidas

Primera etapa:
- Ley provincial 9459 y modificatorias.
- Resoluciones y publicaciones oficiales relacionadas con el valor del JUS.
- Código Procesal Civil y Comercial de Córdoba.
- Código Civil y Comercial de la Nación, en las disposiciones pertinentes.
- Normativa procesal y legislación provincial relevante para los flujos que se implementen.

No se incorpora jurisprudencia en el alcance inicial. Las fuentes y sus versiones deben registrarse en un inventario verificable.

## 4. Requisitos de calidad

- Toda operación monetaria debe tener pruebas automatizadas.
- Toda respuesta jurídica debe conservar trazabilidad hasta una fuente identificable.
- Los datos normativos deben incluir vigencia temporal.
- La interfaz debe funcionar en móvil y escritorio y ser accesible por teclado.
- Los errores y la falta de información deben comunicarse sin inventar respuestas.
- Los archivos originales deben mantenerse intactos.
- La aplicación debe minimizar la retención de datos y no registrar contenido documental sensible.

## 5. Fuera de alcance inicial

- Jurisprudencia y predicción de resultados judiciales.
- Presentaciones automáticas ante tribunales.
- Sustitución del asesoramiento profesional.
- Cálculos basados en aranceles de otras provincias.
