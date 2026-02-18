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
    /*
    Contenedor principal de la aplicación:
    - min-h-screen: ocupa al menos toda la altura de la pantalla
    - bg-slate-50: fondo claro por defecto
    - dark:bg-slate-900: fondo oscuro en modo dark
    - transition-colors duration-300: suaviza el cambio de tema
    - pb-10: padding inferior
    */
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-10">
      <Header />

      {/* Margen superior para separar del header */}
      <main className="container mx-auto px-4 mt-8">
        {/* 
        Tarjeta del buscador y título:
        - bg-white: fondo blanco en modo claro
        - dark:bg-slate-800: fondo gris oscuro en modo oscuro
        - p-8: padding interno generoso
        - rounded-2xl: bordes muy redondeados
        - shadow-lg: sombra pronunciada para dar profundidad
        - text-center: alinea el texto al centro
        - max-w-4xl mx-auto: limita el ancho y centra horizontalmente
        - border...: borde sutil paara separar
        */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center max-w-4xl mx-auto border border-slate-200 dark:border-slate-700 transition-colors mb-8">
          {/* Título principal traducible */}
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

          {/* Si está cargando, mostramos el spinner */}
          {loading && (
            <div className="flex justify-center py-10">
              {/* Spinner de carga: animate-spin hace que gire infinitamente */}
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          )}

          {/* Si hay error, mostramos el mensaje */}
          {error && (
            /* 
            Mensaje de error:
            - p-4: padding
            - bg-red-50: fondo rojo muy claro
            - text-red-600: texto rojo
            - rounded-xl: bordes redondeados
            */
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Si hay datos y no está cargando, mostramos los resultados */}
        {weatherData && !loading && (
          /* 
          Contenedor de resultados:
          - animate-fade-in: animación de entrada suave
          - space-y-6: separación vertical entre hijos de 1.5rem
          */
          <div className="animate-fade-in space-y-6">
            {/* Tarjeta del clima actual */}
            <WeatherCard
              data={weatherData}
              municipality={selectedMunicipality}
            />
            {/* Pronóstico por horas (si existe) */}
            {hourlyData && <HourlyForecast data={hourlyData} />}
            {/* Pronóstico a 7 días */}
            <WeatherForecast data={weatherData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
