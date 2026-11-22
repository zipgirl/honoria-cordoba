# Privacidad y anonimización documental

La anonimización es una función central y de alto riesgo. Debe diseñarse antes de integrar servicios de IA o almacenamiento de documentos.

## 1. Modelo de amenaza

Un documento puede revelar información personal incluso después de ocultar nombres visibles. Los datos pueden permanecer en:
- Texto seleccionable y capas OCR.
- Imágenes escaneadas, firmas, sellos y manuscritos.
- Encabezados, pies, comentarios, anotaciones y formularios.
- Metadatos, nombres de archivo, propiedades y adjuntos incrustados.
- Referencias indirectas que permitan reidentificar a una persona.

Por eso, cubrir texto con un rectángulo negro o reemplazar sólo coincidencias de expresiones regulares no constituye anonimización segura.

## 2. Flujo requerido

1. **Carga controlada:** validar tipo, tamaño y estructura; rechazar archivos no admitidos.
2. **Procesamiento aislado:** trabajar sobre una copia temporal; mantener el original sin modificaciones.
3. **Extracción:** obtener texto y, cuando corresponda, páginas renderizadas y OCR.
4. **Detección:** combinar patrones determinísticos, reconocimiento de entidades y análisis contextual.
5. **Revisión humana:** presentar cada hallazgo con contexto y permitir aceptar, rechazar, editar o añadir detecciones.
6. **Seudonimización consistente:** asignar etiquetas estables dentro del documento o lote, según el modo elegido.
7. **Redacción irreversible:** eliminar o sustituir el contenido subyacente y reconstruir el archivo de salida.
8. **Verificación:** volver a extraer texto, revisar metadatos y comprobar que los valores marcados no permanezcan en el archivo generado.
9. **Entrega y borrado:** ofrecer descarga y eliminar archivos temporales según una política de retención explícita.

## 3. Categorías de detección

- Identidad: nombres, apellidos, alias, DNI, pasaporte, CUIT/CUIL.
- Contacto y ubicación: domicilios, teléfonos, correos, códigos postales.
- Información profesional: matrículas, empleadores, cargos y datos identificadores.
- Información financiera: cuentas, CBU/CVU, tarjetas y operaciones.
- Información sensible: salud, discapacidad, biometría y vida sexual.
- Protección reforzada: niños, niñas y adolescentes; víctimas; denunciantes; testigos.
- Identificadores contextuales: patentes, expedientes, números de historia clínica y referencias que permitan identificar indirectamente.

La clasificación debe ser configurable y permitir agregar categorías específicas del ámbito judicial.

## 4. Modos de trabajo

- **Anonimizar:** sustituir identificadores por etiquetas consistentes.
- **Seudonimizar:** sustituir identificadores conservando una tabla de correspondencias separada, sólo si el usuario lo solicita expresamente y comprende el riesgo.
- **Redactar categorías:** eliminar por completo categorías seleccionadas sin preservar correspondencias.

La tabla de correspondencias nunca debe incrustarse en el documento anonimizado. Si se ofrece, debe descargarse por separado y con advertencia.

## 5. Reglas de privacidad

- No enviar archivos a proveedores externos por defecto.
- Antes de cualquier procesamiento externo, informar proveedor, finalidad, datos transmitidos, retención y solicitar consentimiento explícito.
- No utilizar documentos ni resultados para entrenamiento.
- No guardar contenido de documentos en logs, analítica, trazas ni mensajes de error.
- Cifrar datos en tránsito y en reposo cuando exista almacenamiento.
- Limitar acceso por usuario y aplicar expiración automática a temporales.
- Permitir borrado inmediato y verificable de los archivos retenidos por la aplicación.
- No usar documentos reales para pruebas; usar casos sintéticos.
- No registrar valores detectados en reportes técnicos.

## 6. Límites y advertencias

- OCR puede omitir caracteres o confundir letras y números.
- Las entidades pueden aparecer en imágenes, manuscritos o lenguaje indirecto.
- El reconocimiento automático puede producir falsos positivos y falsos negativos.
- Una revisión visual humana sigue siendo obligatoria antes de compartir.
- El producto debe describir con precisión qué capas y formatos pudo inspeccionar.
- No afirmar que un documento es anónimo o imposible de reidentificar.

## 7. Criterios de aceptación

- El archivo original no cambia.
- El archivo final no contiene el texto redactado en su capa textual.
- La redacción no es reversible mediante copiar/pegar, selección, extracción de texto o eliminación de una capa superpuesta.
- Metadatos, comentarios y anotaciones se inspeccionan y limpian cuando el formato lo permite.
- La verificación posterior informa páginas o elementos que requieren revisión manual.
- Los valores sensibles no aparecen en logs ni reportes.
- Las pruebas usan datos ficticios y cubren PDF digital y escaneado.
