const express = require("express");
const router = express.Router();
const { fetchFromAemet } = require("../services/aemetService");
const codigosProvincia = require("../data/codigosProvincia");

/*
 Endpoint para obtener la lista de TODOS los municipios.
 Para el buscador del frontend.
 Ruta AEMET: /maestro/municipios
 */
router.get("/municipios", async (req, res) => {
  try {
    // Pedimos la lista maestra de municipios
    const municipios = await fetchFromAemet("/maestro/municipios");

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
router.get("/prediccion/:cod", async (req, res) => {
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
router.get("/prediccion-horas/:cod", async (req, res) => {
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

module.exports = router;
