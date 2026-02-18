import { useLanguage } from "../context/LanguageContext";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from "lucide-react";

export const WeatherForecast = ({ data }) => {
  const { t } = useLanguage();

  if (!data || !data.prediccion || !data.prediccion.dia) return null;

  // Helper to get icon (simplified)
  // In a real app, map 'estadoCielo' codes from AEMET to icons
  // Helper to get icon based on sky state and rain probability
  const getIcon = (day) => {
    const rainProb = day.probPrecipitacion[0]?.value || 0;
    const skyState = day.estadoCielo[0]?.descripcion?.toLowerCase() || "";

    if (
      rainProb >= 50 ||
      skyState.includes("lluvia") ||
      skyState.includes("tormenta")
    ) {
      return <CloudRain className="text-blue-500 w-8 h-8" />;
    } else if (skyState.includes("nuboso") || skyState.includes("cubierto")) {
      return <Cloud className="text-slate-500 w-8 h-8" />;
    } else {
      return <Sun className="text-yellow-500 w-8 h-8" />;
    }
  };

    /*
    Contenedor principal de predicción a 5 días:
    - mt-6: margen superior para separar
    - bg-white: fondo blanco para la tarjeta
    - rounded-3xl: bordes redondeados modernos
    - shadow-lg: sombra para dar elevación
    - p-6: espaciado interno
    - animate-slide-up: animación de entrada
    */
    <div className="w-full max-w-4xl mx-auto mt-6 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 animate-slide-up">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 pl-2">
        {t("forecast") || "Próximos Días"}
      </h3>

      {/* 
      Grid responsivo para los días:
      - grid: activa grid layout
      - grid-cols-2: por defecto (móvil) 2 columnas
      - md:grid-cols-5: en pantallas medianas (md) cambia a 5 columnas (una por día)
      - gap-4: espacio entre celdas del grid
      */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {days.map((day, index) => {
          const date = new Date(day.fecha);
          // Format: "Lun 16"
          const dayName = date.toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
          });

          return (
            <div
              key={index}
            >
              <span className="text-slate-500 dark:text-slate-400 font-medium capitalize mb-2">
                {dayName}
              </span>
              <div
                className="mb-2"
                title={day.estadoCielo[0]?.descripcion || ""}
              >
                {getIcon(day)}
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="text-slate-900 dark:text-white">
                  {day.temperatura.maxima}°
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                  {day.temperatura.minima}°
                </span>
              </div>
              <div className="mt-2 text-xs text-blue-500 font-medium">
                {day.probPrecipitacion[0]?.value || 0}% Lluvia
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
