# Backend App Meteorológica - Node.js + Express

Backend para la aplicación de predicción meteorológica que consume la API de AEMET.

## 📋 Características

- ✅ Servidor Express configurado
- ✅ CORS habilitado para conectar con Frontend (Vite/React)
- ✅ Consumo de API de AEMET (OpenData)
- ✅ Modularización de servicios, rutas y datos
- ✅ Variables de entorno para seguridad (API Key)

## 🚀 Instalación y Uso

1. **Instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**
   Crea un archivo `.env` basado en `.env.example` y añade tu API Key de AEMET:

```env
PORT=3000
AEMET_API_KEY=tu_api_key_aqui
```

3. **Iniciar el servidor:**
   - **Modo desarrollo** (con recarga automática):

   ```bash
   npm run dev
   ```

   - **Modo producción:**

   ```bash
   npm start
   ```

El servidor estará disponible en `http://localhost:3000`.

## 📁 Estructura del Proyecto

El proyecto ha sido modularizado para mejorar la mantenibilidad y escalabilidad:

```
backend/
├── data/
│   └── codigosProvincia.js    # Mapeo de códigos de provincia y nombres
├── routes/
│   └── weatherRoutes.js       # Definición de endpoints de la API (/api/...)
├── services/
│   └── aemetService.js        # Lógica de conexión con la API de AEMET (Paso 1 y 2)
├── .env                       # Variables de entorno (NO subir al repo)
├── .env.example               # Plantilla de variables de entorno
├── server.js                  # Punto de entrada y configuración del servidor
└── package.json               # Dependencias y scripts
```

## 📍 Endpoints Disponibles

Todas las rutas del clima están bajo el prefijo `/api`.

### 1. Obtener lista de municipios simplificada

- **Ruta:** `GET /api/municipios`
- **Descripción:** Devuelve listado de municipios con ID, nombre y provincia.
- **Uso:** Utilizado por el buscador del frontend.

### 2. Predicción Diaria

- **Ruta:** `GET /api/prediccion/:cod`
- **Parámetro:** `cod` (Código del municipio, ej: 30030)
- **Descripción:** Devuelve la predicción diaria para el municipio especificado.

### 3. Predicción por Horas

- **Ruta:** `GET /api/prediccion-horas/:cod`
- **Parámetro:** `cod` (Código del municipio)
- **Descripción:** Devuelve la predicción horaria para el municipio especificado.

## 🛠️ Tecnologías

- **Node.js**
- **Express**
- **Axios / Fetch** (Nativo de Node 18+)
- **CORS**
- **Dotenv**
