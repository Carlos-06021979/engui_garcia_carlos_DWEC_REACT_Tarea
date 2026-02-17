// Importamos las librerías necesarias
const express = require("express");
/* 
Mi Frontend (Vite/React) corre en el puerto 5173 y mi Backend en el 3000. Sin esta línea, 
el navegador bloquearía la comunicación por seguridad.
*/
const cors = require("cors");
require("dotenv").config(); // Librería para leer variables de entorno del archivo .env

// Importamos las rutas
const weatherRoutes = require("./routes/weatherRoutes");

const app = express(); // Inicializamos la aplicación Express
const PORT = process.env.PORT || 3000; // Puerto donde escuchará el servidor

// Configuración de Middlewares
app.use(cors()); // Habilitar CORS para que React (puerto 5173) pueda hablar con este Backend (puerto 3000)
app.use(express.json()); // Habilitar el parseo de datos JSON en las peticiones

// Rutas
// Usamos el prefijo /api para todas las rutas del clima
// Cualquier petición que empiece por /api se redirigirá a weatherRoutes
app.use("/api", weatherRoutes);

// Ruta de prueba (checkeo de funcionamiento a la ruta raíz - http://localhost:3000/ desde el navegador)
app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor Backend AEMET funcionando", estado: "OK" });
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
