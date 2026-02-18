# Arquitectura del Proyecto y Descripción de Archivos

Este documento detalla la estructura del proyecto, la responsabilidad de cada archivo y cómo interactúan entre sí para formar la aplicación completa.

---

## 1. Frontend (`/frontend/src/`)

El frontend es una Single Page Application (SPA) construida con **React** y estilizada con **Tailwind CSS**.

### 1.1 Configuración y Entrada

- **`main.jsx`**: Punto de entrada de React. Monta la aplicación en el DOM y envuelve a `App` con los proveedores de contexto (`LanguageProvider`, `ThemeProvider`).
- **`App.jsx`**: Componente raíz. Define la estructura visual base (Layout) y orquesta la aplicación usando el hook `useWeather`. No contiene lógica compleja, solo visualización.

### 1.2 Hooks (`/hooks`)

- **`useWeather.js`**: **[CEREBRO]** Custom hook que centraliza la lógica de negocio.
  - Gestiona los estados (`loading`, `error`, `weatherData`, `hourlyData`).
  - Llama al backend (`api.js`) para obtener datos.
  - Provee funciones `handleSelection` y `clearError` a los componentes.

### 1.3 Componentes (`/components`)

- **`Search.jsx`**: Buscador de municipios.
  - Llama a `/api/municipios` para autocompletado.
  - Al seleccionar, comunica el municipio elegido a `App` (y este a `useWeather`).
- **`WeatherCard.jsx`**: Muestra el clima **actual**.
  - Recibe `weatherData` (día actual).
  - Usa `StatCard` para mostrar métricas.
  - Usa `weatherUtils` para iconos y fechas.
- **`StatCard.jsx`**: Componente UI reutilizable para mostrar un dato (icono + etiqueta + valor), usado masivamente en `WeatherCard`.
- **`HourlyForecast.jsx`**: Carrusel de predicción por horas.
  - Recibe datos crudos y usa `dataAdapter` para transformarlos.
  - Renderiza una lista horizontal con scroll.
- **`WeatherForecast.jsx`**: Lista vertical de predicción a 7 días.
  - Itera sobre `data.prediccion.dia` y renderiza filas con resumen diario.
- **`Header.jsx`**: Barra superior. Contiene el selector de idioma y el botón de cambio de tema (Sol/Luna).

### 1.4 Utilidades y Servicios (`/utils`, `/services`)

- **`services/api.js`**: Cliente HTTP (usando `fetch` o `axios`) que conecta con el Backend. Define funciones como `getMunicipalities` y `getWeatherPrediction`.
- **`services/dataAdapter.js`**: **[TRANSFORMADOR]** Convierte el formato complejo y anidado de AEMET en objetos simples que los componentes entienden fácilmente.
- **`utils/weatherUtils.jsx`**: Funciones puras de ayuda.
  - `getWeatherIcon`: Decide qué icono mostrar (Sol, Lluvia, Nube) según probabilidad y estado.
  - `formatCurrentDate`: Formatea fechas al español.

### 1.5 Contextos (`/context`)

- **`LanguageContext.jsx`**: Provee la función `t()` para traducir textos (i18n).
- **`ThemeContext.jsx`**: Gestiona el estado Oscuro/Claro y aplica la clase `dark` al `html`.

---

## 2. Backend (`/backend/`)

Servidor **Node.js + Express** que actúa como intermediario (Proxy) para ocultar la API Key y resolver CORS.

### 2.1 Núcleo

- **`server.js`**: Punto de entrada. Inicia Express, configura middlewares (CORS, JSON) y monta las rutas.
- **`.env`**: Guarda secretos como `AEMET_API_KEY` y `PORT`. **Nunca se sube al repositorio.**

### 2.2 Rutas y Controladores (`/routes`)

- **`routes/weatherRoutes.js`**: Define los endpoints públicos de nuestra API:
  - `GET /api/municipios`: Devuelve la lista de pueblos.
  - `GET /api/prediccion/:cod`: Pide datos diarios a AEMET.
  - `GET /api/prediccion-horas/:cod`: Pide datos horarios a AEMET.

### 2.3 Servicios (`/services`)

- **`services/aemetService.js`**: Encargado de hablar con AEMET.
  - Construye las URLs correctas con la API Key.
  - Maneja los reintentos y la obtención de la URL real de datos (AEMET funciona en 2 pasos: petición -> URL de datos -> datos JSON).

### 2.4 Datos (`/data`)

- **`codigosProvincia.js`**: Diccionario estático auxiliar para mapear códigos (ej: "30") a nombres ("Murcia").

---

## 3. ¿Cómo se complementan? (Flujo de Datos)

1.  **Inicio**: El usuario abre la web. `App.jsx` carga. `Header` y `Search` se muestran.
2.  **Búsqueda**: El usuario escribe "Madrid". `Search.jsx` pide lista al Backend (`/api/municipios`).
3.  **Selección**: Al hacer clic, `Search` avisa a `useWeather` (hook).
4.  **Carga**: `useWeather` activa `loading=true` y llama a `getWeatherPrediction` (frontend service).
5.  **Proxy**: La petición viaja a `backend/routes/weatherRoutes` -> `aemetService`.
6.  **AEMET**: El servicio pide datos a AEMET usando la API Key oculta.
7.  **Respuesta**: Los datos viajan de vuelta: AEMET -> Backend -> Frontend (`useWeather`).
8.  **Renderizado**: `useWeather` actualiza `weatherData`. React detecta el cambio y pinta `WeatherCard`, `HourlyForecast` y `WeatherForecast` con la nueva información.

Esta arquitectura separa responsabilidades: el **Frontend** solo se preocupa de mostrar datos bonitos, y el **Backend** se preocupa de conseguirlos de forma segura.
