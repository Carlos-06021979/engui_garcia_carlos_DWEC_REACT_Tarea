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

### 3. ¿Cómo se complementan? (Flujo de Datos)

1.  **Inicio**: El usuario abre la web. `App.jsx` carga. `Header` y `Search` se muestran.
2.  **Búsqueda**: El usuario escribe "Madrid". `Search.jsx` pide lista al Backend (`/api/municipios`).
3.  **Selección**: Al hacer clic, `Search` avisa a `useWeather` (hook).
4.  **Carga**: `useWeather` activa `loading=true` y llama a `getWeatherPrediction` (frontend service).
5.  **Proxy**: La petición viaja a `backend/routes/weatherRoutes` -> `aemetService`.
6.  **AEMET**: El servicio pide datos a AEMET usando la API Key oculta.
7.  **Respuesta**: Los datos viajan de vuelta: AEMET -> Backend -> Frontend (`useWeather`).
8.  **Renderizado**: `useWeather` actualiza `weatherData`. React detecta el cambio y pinta `WeatherCard`, `HourlyForecast` y `WeatherForecast` con la nueva información.

Esta arquitectura separa responsabilidades: el **Frontend** solo se preocupa de mostrar datos bonitos, y el **Backend** se preocupa de conseguirlos de forma segura.

---

## 4. Configuración y Estilos (Tailwind CSS)

Para estilizar la aplicación se ha utilizado **Tailwind CSS**. La configuración seguida es la siguiente:

1.  **Instalación**: Se usó `npm` para instalar las dependencias de desarrollo necesarias: `tailwindcss`, `postcss` y `autoprefixer`.
2.  **Configuración (`tailwind.config.js`)**: Se definió qué archivos escanear en busca de clases (propiedad `content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`). Esto permite que Tailwind elimine el CSS no utilizado en producción (Tree Shaking).
3.  **Directivas (`index.css`)**: Se añadieron las 3 capas base de Tailwind (`@tailwind base`, `@tailwind components`, `@tailwind utilities`) al archivo CSS principal.
4.  **Integración**: Vite, mediante PostCSS, procesa estos archivos en tiempo de compilación, generando una hoja de estilos optimizada y minificada lista para el navegador.

---

## 5. Implementación del Tema (Oscuro/Claro)

Para manejar el cambio de tema se ha seguido la estrategia de clases de Tailwind (`darkMode: 'class'`) gestionada por un Contexto de React.

### 5.1 ThemeContext (`/context/ThemeContext.jsx`)

Este contexto actúa como la fuente de verdad del estado del tema.

- **Estado**: Guarda el tema actual (`'light'` o `'dark'`) en una variable de estado.
- **Persistencia**: Al cargar, comprueba `localStorage` o las preferencias del sistema operativo (`prefers-color-scheme`) para decidir el tema inicial.
- **Efecto**: Un `useEffect` escucha cambios en el estado y añade o quita la clase `dark` del elemento `<html>` del DOM (`document.documentElement.classList`).

### 5.2 Estilos en Componentes

Gracias a la clase `dark` en el `html`, Tailwind permite aplicar estilos condicionales usando el modificador `dark:`:

```jsx
// Ejemplo: Fondo blanco en claro, gris oscuro en oscuro
<div className="bg-white dark:bg-slate-800 ...">
  <h2 className="text-slate-900 dark:text-white ...">Título</h2>
</div>
```

Cuando el contexto cambia el tema, el DOM se actualiza y los estilos cambian automáticamente.

---

## 6. Internacionalización (i18n)

La aplicación soporta múltiples idiomas (actualmente Español e Inglés) mediante una implementación ligera de i18n sin librerías externas pesadas.

### 6.1 LanguageContext (`/context/LanguageContext.jsx`)

- **Estado**: Mantiene el idioma seleccionado (`'es'` o `'en'`).
- **Diccionario**: Importa un objeto JSON con todas las traducciones desde `/data/translations.js`.
- **Función `t(key)`**: Es la función que consumen los componentes. Recibe una clave (ej: `"humidity"`) y devuelve el texto en el idioma actual. Si no encuentra la clave, devuelve la propia clave como fallback.

### 6.2 Uso en Componentes

Los componentes se suscriben al contexto con el hook `useLanguage()`:

```jsx
const { t } = useLanguage();
return <p>{t("humidity")}</p>; // Renderiza "Humedad" o "Humidity"
```
