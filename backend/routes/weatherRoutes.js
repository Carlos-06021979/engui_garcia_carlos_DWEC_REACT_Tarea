const express = require("express");
const router = express.Router();

// Importamos las funciones del servicio AEMET
const { fetchFromAemet } = require("../services/aemetService");

// Importamos los códigos de provincia
const codigosProvincia = require("../data/codigosProvincia");

/*
 Endpoint para obtener la lista de TODOS los municipios.
 Para el buscador del frontend.
 Ruta AEMET: /maestro/municipios
 */
router.get("/municipios", async (req, res) => {
  try {
    // Pedimos la lista maestra de municipios a AEMET
    const municipios = await fetchFromAemet("/maestro/municipios");

    /*
     Simplificamos los datos para enviarlos al frontend
     Solo necesitamos nombre y código (id)
    */
    const listaSimple = municipios.map((m) => {
      const idLimpio = m.id.replace("id", ""); // Quitamos el prefijo "id" del código

      // Obtenemos los dos primeros caracteres del código que son el código de provincia
      const codProv = idLimpio.substring(0, 2);

      /*
      Retornamos el objeto con el id, nombre y provincia, que es lo 
      que necesitamos en el buscador del frontend
      */
      return {
        id: idLimpio,
        nombre: m.nombre,
        /*
        Obtenemos el nombre d ela provincia de 3 formas:
        1. Si existe m.dprov, lo usamos
        2. Si no existe, buscamos en el objeto codigosProvincia
        3. Si no existe, usamos "Desconocida"
        */
        provincia: m.dprov || codigosProvincia[codProv] || "Desconocida",
      };
    });

    // Retornamos la lista simplificada y true en success
    res.json({ success: true, datos: listaSimple });

    // Si hay error, retornamos el error con un mensaje
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/*
Endpoint para obtener la predicción diaria de un municipio.
cod: El código del municipio (ej: 30030 para Murcia)
Ruta AEMET: /prediccion/especifica/municipio/diaria/{cod}
*/
router.get("/prediccion/:cod", async (req, res) => {
  // Obtenemos el código del municipio de los parámetros de la URL
  const { cod } = req.params;

  // Probamos a obtener la predicción
  try {
    // Mostramos un mensaje por consola para depuración
    console.log(`🔍 Buscando predicción para municipio: ${cod}`);

    // Obtenemos la predicción
    const prediccion = await fetchFromAemet(
      `/prediccion/especifica/municipio/diaria/${cod}`,
    );

    // Retornamos la predicción
    res.json({ success: true, datos: prediccion });

    // Si hay error, retornamos el error con un mensaje y false en success
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener predicción: " + error.message,
    });
  }
});

/*
  Endpoint para obtener la predicción por HORAS de un municipio.
  cod: El código del municipio (ej: 30030 para Murcia)
  Ruta AEMET: /prediccion/especifica/municipio/horaria/{cod}
*/
router.get("/prediccion-horas/:cod", async (req, res) => {
  // Obtenemos el código del municipio de los parámetros de la URL
  const { cod } = req.params;

  // Probamos a obtener la predicción por horas
  try {
    // Mostramos un mensaje por consola para depuración
    console.log(`🔍 Buscando predicción por horas para: ${cod}`);

    // Obtenemos la predicción por horas
    const prediccion = await fetchFromAemet(
      `/prediccion/especifica/municipio/horaria/${cod}`,
    );

    // Retornamos la predicción por horas
    res.json({ success: true, datos: prediccion });

    // Si hay error, retornamos el error con un mensaje y false en success
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener predicción por horas: " + error.message,
    });
  }
});

// Exportamos el router para que pueda ser usado en el servidor
module.exports = router;
