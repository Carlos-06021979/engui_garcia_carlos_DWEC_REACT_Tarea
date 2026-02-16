import { useLanguage } from "../context/LanguageContext";
import { Cloud, Sun, CloudRain, Wind, Droplets, Calendar } from "lucide-react";

export const WeatherCard = ({ data, municipality }) => {
  const { t } = useLanguage();

  if (!data) return null;

  // Helper to get icon based on state (simplified logic)
  const getWeatherIcon = (state) => {
    // AEMET returns state codes, but for now we'll map simple text or default
    // Real implementation would map AEMET codes to icons
    return <Sun className="w-16 h-16 text-yellow-500 animate-pulse-slow" />;
  };

  const today = data.prediccion.dia[0];
  const tomorrow = data.prediccion.dia[1];

  // Helper to get icon based on sky state and rain probability (Consistent with WeatherForecast)
  const getIcon = () => {
    // If we have precise sky state
    const skyState = today.estadoCielo.descripcion?.toLowerCase() || "";
    const rainProb = today.probPrecipitacion[0]?.value || 0;

    if (
      rainProb >= 50 ||
      skyState.includes("lluvia") ||
      skyState.includes("tormenta")
    ) {
      return (
        <CloudRain className="text-blue-500 w-20 h-20 animate-pulse-slow" />
      );
    } else if (
      skyState.includes("nuboso") ||
      skyState.includes("cubierto") ||
      skyState.includes("nubes")
    ) {
      return <Cloud className="text-slate-500 w-20 h-20" />;
    } else {
      return <Sun className="text-yellow-500 w-20 h-20 animate-spin-slow" />;
    }
  };

  // Custom date formatter to match user request (Capitalized, with Year)
  const formatDate = () => {
    const d = new Date();
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
  };

  const fullDate = formatDate();

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      {/* Main Card (Today) with Background Image */}
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-300 transform hover:scale-[1.01] relative">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 z-0 opacity-60 dark:opacity-40 bg-cover bg-center transition-opacity duration-1000"
          style={{
            // Try to find specific city image, fallback to spain/landscape
            backgroundImage: `url('https://loremflickr.com/1600/900/${municipality.nombre},spain,landscape/all')`,
          }}
        />
        {/* Gradient Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/30 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-900/30 z-0 pointer-events-none" />

        {/* Content Layer */}
        <div className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 drop-shadow-sm">
                {municipality.nombre}
                <span className="text-sm font-normal text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                  {municipality.provincia}
                </span>
              </h2>
              <p className="text-slate-700 dark:text-slate-200 mt-2 font-medium">
                {fullDate}
              </p>
            </div>
            <div
              className="mt-4 md:mt-0 flex items-center"
              title="Estado actual"
            >
              {/* Dynamic Icon */}
              {getIcon()}
            </div>

            {/* Temperature & Stats */}
            <div className="flex-1 w-full md:w-auto">
              <div className="flex justify-center md:justify-end items-baseline mb-6">
                <span className="text-6xl font-bold text-slate-900 dark:text-white">
                  {today.temperatura.maxima}
                </span>
                <span className="text-4xl text-slate-400 font-light ml-2">
                  / {today.temperatura.minima}°C
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Humidity */}
                <div
                  className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl flex items-center gap-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50 backdrop-blur-sm"
                  title={t("humidity")}
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                    <Droplets size={20} aria-label={t("humidity")} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t("humidity")}
                    </p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {today.humedadRelativa.maxima}%
                    </p>
                  </div>
                </div>

                {/* Wind */}
                <div
                  className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl flex items-center gap-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50 backdrop-blur-sm"
                  title={t("wind")}
                >
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-lg text-teal-600 dark:text-teal-400">
                    <Wind size={20} aria-label={t("wind")} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t("wind")}
                    </p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {today.viento[0]?.velocidad || 0} km/h
                    </p>
                  </div>
                </div>

                {/* UV Index */}
                {today.uvMax && (
                  <div
                    className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl flex items-center gap-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50 backdrop-blur-sm"
                    title={t("uv_index")}
                  >
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 dark:text-orange-400">
                      <Sun size={20} aria-label={t("uv_index")} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t("uv_index")}
                      </p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">
                        {today.uvMax}
                      </p>
                    </div>
                  </div>
                )}

                {/* Thermal Sensation */}
                <div
                  className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl flex items-center gap-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50 backdrop-blur-sm"
                  title={t("thermal_sensation")}
                >
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-600 dark:text-red-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-label={t("thermal_sensation")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t("thermal_sensation")}
                    </p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {today.sensTermica?.maxima}°C
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
