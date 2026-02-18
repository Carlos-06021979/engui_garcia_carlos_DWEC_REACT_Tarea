import { useState } from "react";
import { getWeatherPrediction } from "../services/api";

/*
 Hook personalizado para manejar la lógica del clima.
 Gestiona el estado de:
 - selectedMunicipality: Municipio seleccionado por el usuario.
 - weatherData: Datos de predicción diaria.
 - hourlyData: Datos de predicción por horas.
 - loading: Estado de carga.
 - error: Mensajes de error.

 @returns Objeto con estados y funciones de manejo.
 */
export const useWeather = () => {
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función que se ejecuta cuando el usuario selecciona un municipio
  const handleSelection = async (municipality) => {
    // Muestra el municipio seleccionado por consola
    console.log("Municipio seleccionado:", municipality);

    // Actualiza el estado del municipio seleccionado
    setSelectedMunicipality(municipality);

    // Limpia los errores y los datos anteriores
    setError(null);
    setWeatherData(null);
    setHourlyData(null);

    // Si no hay municipio seleccionado (se ha limpiado), paramos aquí
    if (!municipality) {
      setLoading(false);
      return;
    }

    setLoading(true); // Muestra el indicador de carga

    try {
      // Limpiar ID (eliminar prefijo 'id' si está presente)
      const code = municipality.id.replace("id", "");

      // Obtenemos la predicción diaria
      const response = await getWeatherPrediction(code);

      // También necesitamos la predicción por horas. La pedimos a nuestro backend.
      const hourlyResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/prediccion-horas/${code}`,
      );

      // Verificar si la respuesta es OK antes de hacer json()
      if (!hourlyResponse.ok)
        throw new Error(
          `Error fetching hourly data: ${hourlyResponse.statusText}`,
        );

      // Convertimos el cuerpo de la respuesta (stream) a un objeto JSON JavaScript
      const hourlyJson = await hourlyResponse.json();

      /*
      Verificamos la propiedad 'success' del backend.
      Si es true, devolvemos el array 'datos'. Si no, devolvemos un array vacío.
      */
      if (response.success && response.datos) setWeatherData(response.datos[0]);
      else throw new Error("No daily data received");

      // Si la respuesta es exitosa y hay datos, los guardamos
      if (hourlyJson.success && hourlyJson.datos) setHourlyData(hourlyJson.datos[0]);

    // Si hay un error, lo mostramos
    } catch (err) {
      console.error(err);

      // Si el error es de red, mostramos un mensaje específico
      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError") ||
        err.message.includes("Network request failed")
      ) {
        setError(
          "No se pudo conectar con el servidor. Revisa tu conexión a internet o si el backend está encendido.",
        );

      // Si el error es de otro tipo, mostramos un mensaje genérico
      } else {
        setError("Error al cargar la predicción. Inténtalo de nuevo.");
      }
    } finally {

      // Oculta el indicador de carga
      setLoading(false);
    }
  };

  // Función para limpiar el error
  const clearError = () => setError(null);

  // Devolvemos los estados y las funciones
  return {
    selectedMunicipality,
    weatherData,
    hourlyData,
    loading,
    error,
    handleSelection,
    clearError,
  };
};
