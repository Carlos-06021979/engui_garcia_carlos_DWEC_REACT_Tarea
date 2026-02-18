# Aplicación Meteorológica (React + Node.js)

Proyecto desarrollado para la asignatura de Desarrollo Web en Entorno Cliente (DWEC). Es una aplicación de consulta meteorológica que consume datos de la API de AEMET, con un frontend moderno en React y un backend proxy en Node.js.

## 🚀 Características Principales

- **Búsqueda de Municipios:** Autocompletado y búsqueda por nombre.
- **Predicción Meteorológica:**
  - Estado actual (Temperatura, humedad, viento, UV, sensación térmica).
  - Predicción por horas (Gráfico/Iconos deslizables).
  - Predicción a 7 días.
- **Diseño Responsivo y Moderno:**
  - UI construida con Tailwind CSS.
  - Modo Oscuro/Claro automático.
  - Animaciones fluidas y fondos dinámicos según el municipio.
- **Internacionalización:** Soporte para Español e Inglés (i18n).

## 🛠️ Arquitectura y Refactorización

El código ha sido refactorizado para seguir principios de arquitectura limpia y modularidad:

### Frontend (`/frontend`)

- **Componentes Modulares:**
  - `StatCard.jsx`: Componente reutilizable para tarjetas de estadísticas.
  - `WeatherCard.jsx`: Tarjeta principal del clima actual.
  - `HourlyForecast.jsx`: Predicción por horas con scroll horizontal.
  - `WeatherForecast.jsx`: Lista de predicción diaria.
- **Hooks Personalizados:**
  - `useWeather.js`: Centraliza toda la lógica de estado, llamadas a API y manejo de errores, dejando `App.jsx` limpio.
- **Servicios y Adaptadores:**
  - `dataAdapter.js`: Transforma los datos crudos de AEMET en formatos consumibles por los componentes.
  - `weatherUtils.js`: Utilidades puras para formateo de fechas y selección de iconos.
- **Contextos:**
  - `LanguageContext`: Manejo global del idioma.
  - `ThemeContext`: Manejo del tema (Oscuro/Claro).

### Backend (`/backend`)

Actúa como proxy para evitar problemas de CORS y proteger la API Key de AEMET.

- **Endpoints:**
  - `GET /api/municipios`: Retorna lista filtrada de municipios.
  - `GET /api/prediccion-semanal/:codigo`: Proxy a AEMET (Predicción diaria).
  - `GET /api/prediccion-horas/:codigo`: Proxy a AEMET (Predicción horaria).
- **Servicios:**
  - `aemetService.js`: Lógica de comunicación con la API externa.
- **Datos:**
  - `codigosProvincia.js`: Mapeo estático de códigos de provincia.

## 📦 Instalación y Uso

### Prerrequisitos

- Node.js (v16 o superior)
- NPM

### Pasos

1.  **Backend:**

    ```bash
    cd backend
    npm install
    # Crear archivo .env con: AEMET_API_KEY=tu_api_key
    npm start
    ```

2.  **Frontend:**

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3.  Abrir navegador en `http://localhost:5173`.

## 📝 Autor

Carlos Enguí García - DWEC 2025-26
