import { useLanguage } from "../context/LanguageContext"; // Importamos el contexto de idioma
import { StatCard } from "./StatCard"; // Importamos el componente reutilizable StatCard
import { getWeatherIcon, formatCurrentDate } from "../utils/weatherUtils"; // Importamos utilidades
import { Wind, Droplets, Sun } from "lucide-react"; // Iconos para pasar como props o usar directamente

// Muestra la información del clima para un municipio
export const WeatherCard = ({ data, municipality }) => {
  // Recibe como props: data (datos del clima) y municipality (datos del municipio)

  const { t } = useLanguage(); // Obtenemos la función t del contexto de idioma

  if (!data) return null; // Si no hay datos, no mostramos nada

  // Obtenemos los datos de hoy
  const today = data.prediccion.dia[0];

  // Obtenemos la fecha formateada desde la utilidad
  const fullDate = formatCurrentDate();

  // Obtenemos el icono dinámico desde la utilidad
  const weatherIcon = getWeatherIcon(
    today.probPrecipitacion[0]?.value || 0,
    today.estadoCielo.descripcion,
    "w-20 h-20 animate-pulse-slow",
  );

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      {/* Tarjeta Principal (Hoy) con Imagen de Fondo */}
      {/* 
      Tarjeta principal del clima:
      - w-full max-w-4xl mx-auto: ancho y centrado
      - rounded-3xl shadow-xl: bordes y sombra pronunciados
      - overflow-hidden: para que la imagen de fondo no se salga
      - hover:scale-[1.01]: efecto zoom al pasar el ratón
      - relative: para posicionar capas internas absolutas
      */}
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-300 transform hover:scale-[1.01] relative">
        {/* Capa de Imagen de Fondo */}
        <div
          className="absolute inset-0 z-0 opacity-60 dark:opacity-40 bg-cover bg-center transition-opacity duration-1000"
          style={{
            // Intentamos encontrar una imagen específica de la ciudad, si no, usamos españa/paisaje
            backgroundImage: `url('https://loremflickr.com/1600/900/${municipality.nombre},spain,landscape/all')`,
          }}
        />
        {/* Capa de degradado para mejorar legibilidad del texto sobre la imagen */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/30 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-900/30 z-0 pointer-events-none" />

        {/* Contenido principal (z-10 para estar sobre el fondo) */}
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
              {/* Icono Dinámico */}
              {weatherIcon}
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

              {/* Cuadrícula de estadísticas (Humedad, Viento, etc) usando StatCard */}
              <div className="grid grid-cols-2 gap-4">
                {/* Humedad */}
                <StatCard
                  label={t("humidity")}
                  value={`${today.humedadRelativa.maxima}%`}
                  icon={<Droplets size={20} aria-label={t("humidity")} />}
                  bgColor="bg-blue-100 dark:bg-blue-900/50"
                  textColor="text-blue-600 dark:text-blue-400"
                />

                {/* Viento */}
                <StatCard
                  label={t("wind")}
                  value={`${today.viento[0]?.velocidad || 0} km/h`}
                  icon={<Wind size={20} aria-label={t("wind")} />}
                  bgColor="bg-teal-100 dark:bg-teal-900/50"
                  textColor="text-teal-600 dark:text-teal-400"
                />

                {/* Índice UV */}
                {today.uvMax && (
                  <StatCard
                    label={t("uv_index")}
                    value={today.uvMax}
                    icon={<Sun size={20} aria-label={t("uv_index")} />}
                    bgColor="bg-orange-100 dark:bg-orange-900/50"
                    textColor="text-orange-600 dark:text-orange-400"
                  />
                )}

                {/* Sensación Térmica */}
                <StatCard
                  label={t("thermal_sensation")}
                  value={`${today.sensTermica?.maxima}°C`}
                  icon={
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
                  }
                  bgColor="bg-red-100 dark:bg-red-900/50"
                  textColor="text-red-600 dark:text-red-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
