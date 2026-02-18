import { useState } from "react";
import { getWeatherPrediction } from "../services/api";

/**
 * Hook personalizado para manejar la lógica del clima.
 * Gestiona el estado de:
 * - selectedMunicipality: Municipio seleccionado por el usuario.
 * - weatherData: Datos de predicción diaria.
 * - hourlyData: Datos de predicción por horas.
 * - loading: Estado de carga.
 * - error: Mensajes de error.
 *
 * @returns {Object} Objeto con estados y funciones de manejo.
 */
export const useWeather = () => {
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelection = async (municipality) => {
    console.log("Municipio seleccionado:", municipality);
    setSelectedMunicipality(municipality);
    setError(null);
    setWeatherData(null);
    setHourlyData(null);

    // Si no hay municipio seleccionado (se ha limpiado), paramos aquí
    if (!municipality) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Limpiar ID (eliminar prefijo 'id' si está presente)
      const code = municipality.id.replace("id", "");

      const response = await getWeatherPrediction(code);
      // También necesitamos la predicción por horas. La pedimos a nuestro backend.
      const hourlyResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/prediccion-horas/${code}`,
      );
      // Verificar si la respuesta es OK antes de hacer json()
      if (!hourlyResponse.ok) {
        throw new Error(
          `Error fetching hourly data: ${hourlyResponse.statusText}`,
        );
      }

      const hourlyJson = await hourlyResponse.json();

      if (response.success && response.datos) {
        setWeatherData(response.datos[0]);
      } else {
        throw new Error("No daily data received");
      }

      if (hourlyJson.success && hourlyJson.datos) {
        setHourlyData(hourlyJson.datos[0]);
      }
    } catch (err) {
      console.error(err);
      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError") ||
        err.message.includes("Network request failed")
      ) {
        setError(
          "No se pudo conectar con el servidor. Revisa tu conexión a internet o si el backend está encendido.",
        );
      } else {
        setError("Error al cargar la predicción. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

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
