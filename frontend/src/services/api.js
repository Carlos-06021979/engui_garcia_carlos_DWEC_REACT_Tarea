// Definimos la URL base de nuestra API (backend).
// Si existe una variable de entorno VITE_API_URL, la usamos; si no, usamos localhost por defecto.
const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api";

/*
 Función para obtener todos los municipios desde el backend.
 Realiza una petición GET a /api/municipios.
 Retorna una lista de objetos { id, nombre, provincia }.
 */
export const getMunicipalities = async () => {
  try {
    
    // Hacemos la petición HTTP GET al endpoint de municipios
    const response = await fetch(`${API_URL}/municipios`);

    // Verificamos si la respuesta del servidor fue exitosa (código 2xx)
    // Si no es exitosa, lanzamos un error manual
    if (!response.ok) throw new Error("Error fetching municipalities");

    // Convertimos el cuerpo de la respuesta (stream) a un objeto JSON JavaScript
    const data = await response.json();

    // Verificamos la propiedad 'success' del backend.
    // Si es true, devolvemos el array 'datos'. Si no, devolvemos un array vacío.
    return data.success ? data.datos : [];
  } catch (error) {
    // Si ocurre cualquier error (red, servidor, parsing), lo capturamos aquí.
    // Mostramos el error en la consola para depuración.
    console.error("API Error:", error);
    // Devolvemos un array vacío para que la interfaz no se rompa.
    return [];
  }
};

/*
 Función para obtener la predicción meteorológica DIARIA de un municipio específico.
 Recibe el código del municipio (ej: "30030") como argumento.
 */
export const getWeatherPrediction = async (code) => {
  try {
    // Usamos fetch interpolando la URL con el código del municipio recibido
    const response = await fetch(`${API_URL}/prediccion/${code}`);

    // Si la respuesta no es OK (ej: 404, 500), lanzamos un error
    if (!response.ok) throw new Error("Error fetching prediction");

    // Parseamos la respuesta a JSON y la devolvemos directamente
    // Nota: aquí esperamos que quien llame a la función maneje la estructura del JSON
    return await response.json();
  } catch (error) {
    // En caso de error, lo registramos en la consola
    console.error("API Error:", error);
    // Y relanzamos (re-throw) el error para que el componente que llamó (hook) se entere y muestre la alerta
    throw error;
  }
};
