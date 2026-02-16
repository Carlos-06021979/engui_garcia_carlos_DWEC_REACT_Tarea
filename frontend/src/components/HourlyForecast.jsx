import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";

export const HourlyForecast = ({ data }) => {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false); // State for toggle

  if (
    !data ||
    !data.prediccion ||
    !data.prediccion.dia ||
    !data.prediccion.dia[0]
  )
    return null;

  // The API returns days, and each day has 'estadoCielo', 'precipitacion', 'temperatura', 'viento' as arrays with 'periodo'
  // 'periodo' is usually "00", "01", ... "23" for hourly.

  // Let's take the first day (today) and maybe the second day if needed, but AEMET hourly is usually next 48h grouped by day.
  // We will flatten the list to show a continuous timeline.

  const today = data.prediccion.dia[0];

  // Helper to extract hourly data from the complex AEMET structure
  const extractHours = (dayData) => {
    if (!dayData) return [];

    // estadoCielo is the reference for hours, usually.
    return dayData.estadoCielo
      .map((sky, index) => {
        // Find corresponding data in other arrays by index or period?
        // AEMET arrays usually match in length for hourly.
        return {
          period: sky.periodo,
          description: sky.descripcion,
          temp: dayData.temperatura[index]?.value,
          rain: dayData.precipitacion[index]?.value,
          // Wind is slightly different structure often, but let's try direct index
          wind:
            dayData.vientoAndRachaMax && dayData.vientoAndRachaMax[index]
              ? dayData.vientoAndRachaMax[index].velocidad
              : 0,
        };
      })
      .filter((h) => h.period)
      .sort((a, b) => parseInt(a.period) - parseInt(b.period));
  };

  const currentHour = new Date().getHours();
  // Filter hours based on toggle
  const hoursToday = extractHours(today).filter((h) =>
    showAll ? true : parseInt(h.period) >= currentHour,
  );

  // Optional: If we are late in the day, maybe show some hours from tomorrow?
  // Let's stick to simple "Filter out past" for now as requested.

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 animate-slide-up">
      <div className="flex justify-between items-center mb-4 pl-2 pr-2">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          {t("hourly_forecast") || "Por Horas"}
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full"
        >
          {showAll ? t("hide_past_hours") : t("show_past_hours")}
        </button>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
        {hoursToday.map((hour, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-20 flex flex-col items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl snap-start"
          >
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {hour.period}:00
            </span>

            <div className="my-2">
              {/* Placeholder icon logic */}
              {hour.rain > 0 ? (
                <CloudRain className="w-6 h-6 text-blue-500" />
              ) : (
                <Sun className="w-6 h-6 text-orange-500" />
              )}
            </div>

            <span className="text-lg font-bold text-slate-800 dark:text-white">
              {hour.temp}°
            </span>

            <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              <Wind size={12} />
              <span>{hour.wind}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
