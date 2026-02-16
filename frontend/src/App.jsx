import { useState } from "react";
import { Header } from "./components/Header";
import { Search } from "./components/Search";
import { WeatherCard } from "./components/WeatherCard";
import { WeatherForecast } from "./components/WeatherForecast";
import { HourlyForecast } from "./components/HourlyForecast";
import { useLanguage } from "./context/LanguageContext";
import { getWeatherPrediction } from "./services/api";
import { Loader2 } from "lucide-react";

function App() {
  const { t } = useLanguage();
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

    // If no municipality selected (cleared), stop here
    if (!municipality) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Clean ID (remove 'id' prefix if present)
      const code = municipality.id.replace("id", "");

      const response = await getWeatherPrediction(code);
      // We also need hourly. Let's fetch it from our backend.
      const hourlyResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/prediccion-horas/${code}`,
      );
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
        err.message.includes("NetworkError")
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-10">
      <Header />

      <main className="container mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center max-w-4xl mx-auto border border-slate-200 dark:border-slate-700 transition-colors mb-8">
          <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">
            {t("title")}
          </h2>

          <div className="mb-8 max-w-md mx-auto">
            <Search
              onSelect={handleSelection}
              onSearchChange={() => setError(null)}
            />
          </div>

          {!selectedMunicipality && !loading && (
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              {t("select_municipality")}
            </p>
          )}

          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {weatherData && !loading && (
          <div className="animate-fade-in space-y-6">
            <WeatherCard
              data={weatherData}
              municipality={selectedMunicipality}
            />
            {hourlyData && <HourlyForecast data={hourlyData} />}
            <WeatherForecast data={weatherData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
