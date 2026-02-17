// Importamos las librerías necesarias
const express = require("express"); // Framework para crear el servidor web

/* 
Mi Frontend (Vite/React) corre en el puerto 5173 y mi Backend en el 3000. Sin esta línea, 
el navegador bloquearía la comunicación por seguridad.
*/
const cors = require("cors");
require("dotenv").config(); // Librería para leer variables de entorno del archivo .env

// Inicializamos la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000; // Puerto donde escuchará el servidor
const API_KEY = process.env.AEMET_API_KEY; // Leemos la clave de la API de AEMET

// Configuración de Middlewares
app.use(cors()); // Habilitar CORS para que React (puerto 5173) pueda hablar con este Backend (puerto 3000)
app.use(express.json()); // Habilitar el parseo de datos JSON en las peticiones

/*
 Función genérica para obtener datos de la API de AEMET.
 La API de AEMET funciona en dos pasos:
 Primero hacemos una petición con la API Key. Devuelven una URL de datos temporal.
 Posteriormente hacemos una petición a esa URL temporal para obtener los datos reales.
 */
async function fetchFromAemet(endpoint) {
  try {
    // Paso 1: Solicitar URL de datos
    // Añadimos la api_key como query parameter (?api_key=...)
    const urlSolicitud = `https://opendata.aemet.es/opendata/api${endpoint}?api_key=${API_KEY}`;

    // Para verlo en la consola si hubiera algún error ver la solicitud realizada
    console.log(`📡 Consultando AEMET: ${urlSolicitud}`);

    // Hacemos la petición a la API de AEMET
    const response1 = await fetch(urlSolicitud, {
      method: "GET", // Método GET
      headers: { "cache-control": "no-cache" }, // Evitamos que el navegador cachee la respuesta
    });

    // Si la petición no es correcta, lanzamos un error
    if (!response1.ok)
      throw new Error(`Error AEMET Paso 1: ${response1.statusText}`);

    const data1 = await response1.json(); // Parseamos la respuesta a JSON

    // Si AEMET nos ha devuelto un error (401 o 403) en el JSON
    if (data1.estado === 401 || data1.estado === 403)
      throw new Error("API Key inválida o acceso denegado por AEMET");

    // Si AEMET no nos ha devuelto la URL de los datos
    if (!data1.datos)
      throw new Error( // Lanzamos un error con el mensaje de AEMET
        "AEMET no devolvió la URL de los datos: " + JSON.stringify(data1),
      );

    // Paso 2: Obtener los datos reales desde la URL proporcionada
    const datosUrl = data1.datos; // Obtenemos la URL de los datos

    console.log(`🔗 Descargando datos desde: ${datosUrl}`); // Mostramos la URL de los datos por consola

    const response2 = await fetch(datosUrl); // Hacemos la petición a la URL de los datos

    // Si la petición no es correcta (distinta de 200), lanzamos un error
    if (!response2.ok)
      throw new Error(`Error AEMET Paso 2: ${response2.statusText}`); // Lanzamos un error con el mensaje de AEMET

    // La API de la AEMET es antigua y a veces envía los datos con una codificación antigua (ISO-8859-1 (Latin1)) que no es UTF-8 por lo que no se pueden mostrar correctamente los acentos y las "ñ" de los municipios
    const arrayBuffer = await response2.arrayBuffer(); // Convertimos la respuesta a un array de bytes crudos

    const decoder = new TextDecoder("iso-8859-1"); // Decodificamos el array de bytes crudos con la codificación ISO-8859-1

    const text = decoder.decode(arrayBuffer); // Convertimos el array de bytes crudos a texto

    // Parseamos el texto a JSON
    return JSON.parse(text);

    // Capturamos cualquier error que pueda ocurrir
  } catch (error) {
    // Mostramos el error por consola
    console.error("❌ Error en fetchFromAemet:", error.message);

    throw error; // Lanzamos el error para manejarlo en la ruta
  }
}

// RUTAS DE LA API (ENDPOINTS)

// Ruta de prueba (checkeo de funcionamiento a la ruta raíz - http://localhost:3000/ desde el navegador)
app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor Backend AEMET funcionando 🚀", estado: "OK" });
});

/*
 Endpoint para obtener la lista de TODOS los municipios.
 Para el buscador del frontend.
 Ruta AEMET: /maestro/municipios
 */
app.get("/api/municipios", async (req, res) => {
  try {
    // Pedimos la lista maestra de municipios
    const municipios = await fetchFromAemet("/maestro/municipios");

    /*
       Simplificamos los datos para enviarlos al frontend
       Nombre y código (id)
       Mapa de códigos de provincia 
       Uso "" para los códigos con 0 a la izquierda para 
       que no los intreprete como números enteros sin el cero
    */
    const codigosProvincia = require("./data/codigosProvincia");

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
