// Importamos las librerías necesarias
const express = require("express"); // Framework para crear el servidor web
const cors = require("cors"); // Middleware para permitir peticiones desde otros dominios (el frontend)
require("dotenv").config(); // Librería para leer variables de entorno del archivo .env

// Inicializamos la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000; // Puerto donde escuchará el servidor
const API_KEY = process.env.AEMET_API_KEY; // Leemos la clave de la API de AEMET

// Configuración de Middlewares
app.use(cors()); // Habilitar CORS para que React (puerto 5173) pueda hablar con este Backend (puerto 3000)
app.use(express.json()); // Habilitar el parseo de datos JSON en las peticiones

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

/**
 * Función genérica para obtener datos de la API de AEMET.
 * La API de AEMET funciona en dos pasos:
 * 1. Hacemos una petición con la API Key. devuelven una URL de datos temporal.
 * 2. Hacemos una petición a esa URL temporal para obtener los datos reales.
 */
async function fetchFromAemet(endpoint) {
  try {
    // Paso 1: Solicitar URL de datos
    // Añadimos la api_key como query parameter (?api_key=...)
    const urlSolicitud = `https://opendata.aemet.es/opendata/api${endpoint}?api_key=${API_KEY}`;
    console.log(`📡 Consultando AEMET: ${urlSolicitud}`);

    const response1 = await fetch(urlSolicitud, {
      method: "GET",
      headers: { "cache-control": "no-cache" },
    });

    if (!response1.ok) {
      throw new Error(`Error AEMET Paso 1: ${response1.statusText}`);
    }

    const data1 = await response1.json();

    // Verificamos si AEMET nos ha devuelto un error en el JSON
    if (data1.estado === 401 || data1.estado === 403) {
      throw new Error("API Key inválida o acceso denegado por AEMET");
    }

    if (!data1.datos) {
      throw new Error(
        "AEMET no devolvió la URL de los datos: " + JSON.stringify(data1),
      );
    }

    // Paso 2: Obtener los datos reales desde la URL proporcionada
    const datosUrl = data1.datos;
    console.log(`🔗 Descargando datos desde: ${datosUrl}`);

    const response2 = await fetch(datosUrl);
    if (!response2.ok) {
      throw new Error(`Error AEMET Paso 2: ${response2.statusText}`);
    }

    // AEMET sometimes uses ISO-8859-1 (Latin1) and fetch.json() might fail or produce garbage UTF-8
    const arrayBuffer = await response2.arrayBuffer();
    const decoder = new TextDecoder("iso-8859-1"); // Force decoding as Latin1
    const text = decoder.decode(arrayBuffer);

    // Parse JSON manually from the decoded text
    return JSON.parse(text);
  } catch (error) {
    console.error("❌ Error en fetchFromAemet:", error.message);
    throw error; // Lanzamos el error para manejarlo en la ruta
  }
}

// ==========================================
// RUTAS DE LA API (ENDPOINTS)
// ==========================================

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor Backend AEMET funcionando 🚀", estado: "OK" });
});

/**
 * Endpoint para obtener la lista de TODOS los municipios.
 * Útil para el buscador del frontend.
 * Ruta AEMET: /maestro/municipios
 */
app.get("/api/municipios", async (req, res) => {
  try {
    // Pedimos la lista maestra de municipios
    const municipios = await fetchFromAemet("/maestro/municipios");

    // Simplificamos los datos para enviarlos al frontend
    // Solo necesitamos nombre y código (id)
    // Mapa de códigos de provincia
    const codigosProvincia = {
      "01": "Álava/Araba",
      "02": "Albacete",
      "03": "Alicante/Alacant",
      "04": "Almería",
      "05": "Ávila",
      "06": "Badajoz",
      "07": "Illes Balears",
      "08": "Barcelona",
      "09": "Burgos",
      10: "Cáceres",
      11: "Cádiz",
      12: "Castellón/Castelló",
      13: "Ciudad Real",
      14: "Córdoba",
      15: "A Coruña",
      16: "Cuenca",
      17: "Girona",
      18: "Granada",
      19: "Guadalajara",
      20: "Gipuzkoa",
      21: "Huelva",
      22: "Huesca",
      23: "Jaén",
      24: "León",
      25: "Lleida",
      26: "La Rioja",
      27: "Lugo",
      28: "Madrid",
      29: "Málaga",
      30: "Murcia",
      31: "Navarra",
      32: "Ourense",
      33: "Asturias",
      34: "Palencia",
      35: "Las Palmas",
      36: "Pontevedra",
      37: "Salamanca",
      38: "Santa Cruz de Tenerife",
      39: "Cantabria",
      40: "Segovia",
      41: "Sevilla",
      42: "Soria",
      43: "Tarragona",
      44: "Teruel",
      45: "Toledo",
      46: "Valencia/València",
      47: "Valladolid",
      48: "Bizkaia",
      49: "Zamora",
      50: "Zaragoza",
      51: "Ceuta",
      52: "Melilla",
    };

    // Simplificamos los datos para enviarlos al frontend
    // Solo necesitamos nombre y código (id)
    const listaSimple = municipios.map((m) => {
      const idLimpio = m.id.replace("id", "");
      const codProv = idLimpio.substring(0, 2);
      return {
        id: idLimpio,
        nombre: m.nombre,
        provincia: m.dprov || codigosProvincia[codProv] || "Desconocida",
      };
    });

    res.json({ success: true, datos: listaSimple });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Endpoint para obtener la predicción diaria de un municipio.
 * @param cod - El código del municipio (ej: 30030 para Murcia)
 * Ruta AEMET: /prediccion/especifica/municipio/diaria/{cod}
 */
app.get("/api/prediccion/:cod", async (req, res) => {
  const { cod } = req.params;

  try {
    console.log(`🔍 Buscando predicción para municipio: ${cod}`);
    const prediccion = await fetchFromAemet(
      `/prediccion/especifica/municipio/diaria/${cod}`,
    );

    res.json({ success: true, datos: prediccion });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener predicción: " + error.message,
    });
  }
});

/**
 * Endpoint para obtener la predicción por HORAS de un municipio.
 * @param cod - El código del municipio
 * Ruta AEMET: /prediccion/especifica/municipio/horaria/{cod}
 */
app.get("/api/prediccion-horas/:cod", async (req, res) => {
  const { cod } = req.params;

  try {
    console.log(`🔍 Buscando predicción por horas para: ${cod}`);
    const prediccion = await fetchFromAemet(
      `/prediccion/especifica/municipio/horaria/${cod}`,
    );

    res.json({ success: true, datos: prediccion });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener predicción por horas: " + error.message,
    });
  }
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
