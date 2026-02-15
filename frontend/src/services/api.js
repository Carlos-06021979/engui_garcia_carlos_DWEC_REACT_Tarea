const API_URL = "http://localhost:3000/api";

/**
 * Fetch all municipalities from the backend.
 * @returns {Promise<Array>} List of municipalities { id, nombre, provincia }
 */
export const getMunicipalities = async () => {
  try {
    const response = await fetch(`${API_URL}/municipios`);
    if (!response.ok) throw new Error("Error fetching municipalities");
    const data = await response.json();
    return data.success ? data.datos : [];
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

/**
 * Fetch daily weather prediction for a specific municipality code.
 * @param {string} code - Municipality code (e.g., "30030")
 */
export const getWeatherPrediction = async (code) => {
  try {
    const response = await fetch(`${API_URL}/prediccion/${code}`);
    if (!response.ok) throw new Error("Error fetching prediction");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
