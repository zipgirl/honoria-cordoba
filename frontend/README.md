# Honoria Córdoba — frontend

Aplicación web React + TypeScript + Vite.

## Desarrollo

```bash
cd frontend
npm install
npm run dev
```

## Producción

```bash
npm run build
npm run preview
```

La URL del backend se configura con `VITE_API_BASE_URL` en el entorno de compilación. Si no se define, la interfaz muestra el estado de conexión como no configurado. No se requiere ni se lee el archivo `.env` existente en la raíz del repositorio.

La primera pantalla incluye navegación funcional entre los módulos de inicio, investigación, honorarios y anonimización. La integración con servicios jurídicos y de documentos se habilitará cuando esos endpoints estén implementados y validados.