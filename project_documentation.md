# Documentación del Proyecto: Aplicación Meteorológica con React y AEMET

## 1. Introducción y Objetivos

El objetivo principal de este proyecto es desarrollar una aplicación web moderna (Single Page Application) utilizando **React** para el frontend y **Node.js con Express** para el backend. La finalidad es consumir datos reales de la API de **AEMET (Agencia Estatal de Meteorología)** de forma segura y eficiente.

Uno de los requisitos más importantes que he tenido en cuenta es la arquitectura de la aplicación. Para no exponer mi clave privada de la API de AEMET en el navegador del cliente (algo inseguro), he implementado un servidor intermedio (proxy) en Node.js. Así, la comunicación sigue este flujo:
`Cliente React` -> `Mi Servidor Express` -> `API AEMET`.

## 2. Tecnologías y Decisiones Técnicas

### Frontend (React)

He elegido **Vite** como empaquetador porque es mucho más rápido que `create-react-app` y ofrece una experiencia de desarrollo más fluida.
Para el diseño, he optado por **Tailwind CSS**. Me ha permitido crear una interfaz responsiva y moderna sin tener que escribir cientos de líneas de CSS tradicional, y facilita mucho la implementación del **Modo Oscuro**.

### Gestión del Estado (Internacionalización y temas)

Para funcionalidades globales como el cambio de idioma (Inglés/Español) y el tema (Claro/Oscuro), he decidido no usar librerías externas complejas como Redux. En su lugar, he utilizado el propio **Context API** de React (`useContext`).

**Implementación Técnica:**

- **ThemeContext**: Detecta automáticamente si el usuario prefiere modo oscuro en su sistema operativo al cargar la página. Guarda la preferencia en `localStorage` para que se recuerde en futuras visitas.
- **LanguageContext**: Utiliza un diccionario de traducciones (`src/data/translations.js`) y expone una función `t('clave')` que devuelve el texto en el idioma seleccionado.

### Hooks Utilizados (Requisito Clave)

He hecho un uso extensivo de los Hooks de React para gestionar el ciclo de vida y el estado de los componentes funcionales:

1.  **`useState`**: Para gestionar estados locales como la query del buscador, los datos del tiempo cargados, el estado de carga (loading) y errores.
2.  **`useEffect`**: Fundamental para operaciones con efectos secundarios, como llamar a la API cuando cambia el municipio seleccionado o filtrar la lista de búsqueda cuando el usuario escribe.
3.  **`useContext`**: Para consumir los contextos globales de Tema e Idioma en cualquier componente sin prop-drilling.
4.  **`useMemo`** (implícito en optimizaciones): Para evitar recálculos innecesarios en listas grandes.

Esto me ha permitido aplicar el patrón "Provider", donde un componente padre envuelve a toda la aplicación y provee el estado del idioma o del tema a cualquier componente hijo que lo necesite, evitando tener que pasar "props" manualmente por todos los niveles (prop drilling).

### Backend (Node + Express) y Adaptación

Partiendo de la plantilla base, he realizado las siguientes **adaptaciones y ampliaciones**:

1.  **Proxy Reverso y CORS**: Configuré el servidor para aceptar peticiones desde mi frontend (puerto 5173) y redirigirlas a AEMET, solucionando el problema de CORS que bloquea las peticiones directas desde el navegador.
2.  **Decodificación de Caracteres**: Implementé un middleware personalizado para transformar la respuesta de AEMET (ISO-8859-1) a UTF-8 antes de enviarla a React.
3.  **Nuevos Endpoints**:
    - `/api/municipios`: Obtiene y cachea la lista maestra.
    - `/api/prediccion/:cod`: Obtiene la predicción diaria.
    - `/api/prediccion-horas/:cod`: Obtiene la predicción horaria (nueva funcionalidad).
4.  **Gestión de Errores**: Middleware para capturar fallos de red o errores 401/403 de la API externa y devolver mensajes JSON limpios al cliente.

## 3. Instalación y Ejecución

Para poner en marcha el proyecto, he seguido estos pasos:

1.  **Backend**:
    - Entrar en la carpeta `backend`.
    - Instalar dependencias: `npm install`.
    - Crear archivo `.env` con la API Key de AEMET.
    - Arrancar servidor: `npm run dev`.

2.  **Frontend**:
    - Inicializar proyecto con Vite: `npm create vite@latest frontend -- --template react`.
    - Instalar Tailwind CSS (ver sección desarrollo).
    - Arrancar cliente: `npm run dev`.

## 4. Desafíos y Soluciones Encontradas

Durante el desarrollo, nos hemos enfrentado a varios retos técnicos interesantes que vale la pena mencionar:

### A. Codificación de Caracteres (Charset)

- **Problema**: La API de AEMET devuelve los datos en `ISO-8859-1` (alfabeto latino antiguo), lo que hacía que nombres como "Fuente Álamo" se vieran con símbolos extraños en React.
- **Solución**: Implementamos un `TextDecoder` en el backend para transformar los datos binarios a `UTF-8` antes de enviarlos al frontend, asegurando que todas las tildes y ñ se vean perfectas.

### B. Comportamiento del Buscador

- **Problema**: Al seleccionar un municipio de la lista, el componente detectaba el cambio de texto y volvía a abrir las sugerencias, creando un bucle molesto para el usuario.
- **Solución**: Refactorizamos la lógica del `useEffect` y creamos un manejador `handleInputChange` separado. Ahora la lista solo se abre cuando el usuario _escribe_, no cuando el sistema rellena el campo.

### C. Inconsistencias en Nombres de Municipios

- **Solución**: Se ha mejorado la lógica de búsqueda normalizando el texto (quitando acentos y signos de puntuación). Además, **se ha implementado la búsqueda por Provincia y por Código de Municipio (INE)**.
  > **Nota**: El sistema utiliza el código oficial del municipio (INE) que proporciona AEMET (ej: 30030 para Murcia), el cual puede identificarse en la herramienta.

### E. Mejoras Visuales y Accesibilidad

- **Fondo Dinámico**: Se ha implementado un sistema de fondos aleatorios de paisajes de ciudades de España (vía LoremFlickr) que mejora la apariencia visual.
- **Accesibilidad**: Se han revisado los contrastes y se han añadido etiquetas ARIA en los iconos.
- **Feedback**: El sistema de gestión de errores ahora es más reactivo, limpiando los mensajes en cuanto el usuario interactúa con el buscador.

### D. Visualización de Datos Horarios

- **Problema**: Mostrar todas las horas del día a veces saturaba al usuario.
- **Solución**: Se ha implementado un componente `HourlyForecast` con scroll horizontal y filtrado de horas pasadas.

### E. Experiencia de Usuario (Mejoras Visuales)

- **Fondos Dinámicos**: Se ha integrado una imagen de fondo que cambia según el municipio seleccionado (usando la API de Unsplash), aportando un toque visual único.
- **Accesibilidad**: Se han añadido `tooltips` en todos los iconos y etiquetas `aria-label` para mejorar la accesibilidad de la aplicación.
- **Histórico de Búsquedas**: Se guardan las últimas 5 búsquedas en el `localStorage` para facilitar el acceso rápido a los municipios frecuentes.

## 5. Conclusiones

Este proyecto ha sido una excelente oportunidad para profundizar en la arquitectura **Frontend-Backend desacoplada**. He aprendido a:

1.  **Gestionar la asincronía real**: Consumir APIs externas no es solo hacer `fetch`; implica manejar tiempos de espera, errores de red y formatos de datos inesperados (como el charset de AEMET).
2.  **Modularizar con React**: La separación en componentes (`Search`, `WeatherCard`, etc.) hace que el código sea mantenible y escalable.
3.  **Proteger secretos**: La importancia del Middleware en Node.js para ocultar la API Key y transformar datos antes de que lleguen al cliente.
4.  **Cuidar la UX**: Pequeños detalles como el filtrado de horas pasadas, los tooltips de accesibilidad o el modo oscuro mejoran drásticamente la percepción de calidad de la aplicación.

En definitiva, se ha construido una aplicación robusta, funcional y estéticamente moderna que cumple con todos los requisitos didácticos del módulo.
