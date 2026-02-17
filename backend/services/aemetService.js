const API_KEY = process.env.AEMET_API_KEY;

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

    /*
    La API de la AEMET es antigua y a veces envía los datos con una codificación antigua (Latin1) que 
    no es UTF-8 por lo que no se pueden mostrar correctamente los acentos y las "ñ" de los municipios
    */
    const arrayBuffer = await response2.arrayBuffer(); // Convertimos la respuesta a un array de bytes crudos

    const decoder = new TextDecoder("iso-8859-1"); // Decodificamos el array de bytes crudos con la codificación ISO-8859-1

    const text = decoder.decode(arrayBuffer); // Convertimos el array de bytes crudos a textoº

    // Parseamos el texto a JSON
    return JSON.parse(text);

    // Capturamos cualquier error que pueda ocurrir
  } catch (error) {
    // Mostramos el error por consola
    console.error("❌ Error en fetchFromAemet:", error.message);

    throw error; // Lanzamos el error para manejarlo en la ruta
  }
}

// Exportamos la función
module.exports = { fetchFromAemet };
