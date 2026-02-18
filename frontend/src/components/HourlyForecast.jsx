import { useState } from "react"; // Importamos el hook useState
import { useLanguage } from "../context/LanguageContext"; // Importamos el hook useLanguage
import { CloudRain, Sun, Wind } from "lucide-react"; // Importamos los iconos de lucide-react
import { extractHourlyData } from "../services/dataAdapter"; // Importamos el adaptador de datos
import { getWeatherIcon } from "../utils/weatherUtils"; // Importamos la utilidad de iconos

export const HourlyForecast = ({ data }) => {
  const { t } = useLanguage(); // Obtenemos la función t para traducir

  const [showAll, setShowAll] = useState(false); // Estado para el botón de mostrar/ocultar

  // Si no hay datos, no mostramos nada
  if (
    !data ||
    !data.prediccion ||
    !data.prediccion.dia ||
    !data.prediccion.dia[0]
  )
    return null;

  const today = data.prediccion.dia[0]; // Obtenemos el primer día (hoy)

  // Obtenemos la hora actual
  const currentHour = new Date().getHours();

  // Usamos el adaptador para obtener los datos transformados
  const hoursToday = extractHourlyData(today).filter((h) =>
    /*
    Si showAll es true, muestra todas las horas, si no, muestra solo las horas 
    actuales o posteriores
    */
    showAll ? true : parseInt(h.period) >= currentHour,
  );

  return (
    /*
    Contenedor principal de pronóstico por horas:
    - w-full max-w-4xl: ancho completo con límite
    - bg-white: fondo blanco
    - rounded-3xl: bordes redondeados
    - shadow-lg: sombra suave
    - p-6: padding interno
    - animate-slide-up: animación de entrada deslizando hacia arriba
    */
    <div className="w-full max-w-4xl mx-auto mt-6 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 animate-slide-up">
      {/*
      Contenedor de título y botón:
      - flex: disposición flexible horizontal
      - justify-between: separa el título del botón
      - items-center: centra los elementos verticalmente
      - mb-4: margen inferior
      - pl-2 pr-2: padding interno
      */}
      <div className="flex justify-between items-center mb-4 pl-2 pr-2">
        {/*
        Título del pronóstico por horas:
        - text-xl: tamaño de fuente
        - font-bold: negrita
        - text-slate-800 dark:text-white: color del texto
        */}
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          {t("hourly_forecast") || "Por Horas"}
        </h3>

        {/*
        Botón para mostrar/ocultar horas pasadas:
        - onClick: cambia el estado de showAll
        - text-xs: tamaño de fuente pequeño
        - font-medium: fuente semi-negrita
        - text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300: color del texto
        - transition-colors: transición suave de colores
        - bg-blue-50 dark:bg-blue-900/30: color de fondo
        - px-3 py-1: padding interno
        - rounded-full: bordes redondeados
        */}
        <button
          // Al hacer clic en el botón, cambia el estado de showAll
          onClick={() => setShowAll(!showAll)}
          /*
          Estilos del botón:
          - text-xs: tamaño de fuente pequeño
          - font-medium: fuente semi-negrita
          - text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300: color del texto
          - transition-colors: transición suave de colores
          - bg-blue-50 dark:bg-blue-900/30: color de fondo
          - px-3 py-1: padding interno
          - rounded-full: bordes redondeados
          */
          className="text-xs font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full"
        >
          {/* Si showAll es true, muestra "Ocultar horas pasadas", si no, muestra "Mostrar horas pasadas" */}
          {showAll ? t("hide_past_hours") : t("show_past_hours")}
        </button>
      </div>

      {/*
      Contenedor de lista horizontal con scroll:
      - flex: disposición flexible horizontal
      - overflow-x-auto: permite desplazamiento horizontal
      - pb-4: padding inferior
      - gap-4: espacio entre elementos
      - scrollbar-hide: clase para ocultar la barra de scroll (estética)
      - snap-x: comportamiento de ajuste magnético al hacer scroll
      */}
      <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
        {/* Mapeamos cada hora del día */}
        {hoursToday.map((hour, index) => (
          <div
            key={index}
            /*
            Tarjeta de hora individual:
            - flex-shrink-0: evita que la tarjeta se encoja si falta espacio, forzando el scroll
            - w-20: ancho fijo de 5rem (80px) para cada tarjeta
            - flex flex-col: disposición vertical de los elementos internos
            - items-center: centra los elementos horizontalmente
            - justify-between: distribuye el espacio verticalmente entre los elementos
            - p-3: padding interno de 0.75rem
            - bg-slate-50: fondo claro en modo normal
            - dark:bg-slate-900/50: fondo oscuro al 50% de opacidad en modo oscuro
            - rounded-2xl: bordes redondeados
            - snap-start: punto de anclaje para el scroll magnético (al principio de la tarjeta)
            */
            className="flex-shrink-0 w-20 flex flex-col items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl snap-start"
          >
            {/*
            Hora:
            - text-sm: tamaño de fuente pequeño
            - font-medium: fuente semi-negrita
            - text-slate-500 dark:text-slate-400: color del texto
            */}
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {hour.period}:00
            </span>

            {/*
            Contenedor de icono:
            - my-2: margen vertical
            */}
            <div className="my-2">
              {/*
              Lógica de icono:
              Usamos la utilidad getWeatherIcon pasando la lluvia y la descripción
              */}
              {getWeatherIcon(hour.rain, hour.description, "w-6 h-6")}
            </div>

            {/*
            Temperatura:
            - text-lg: tamaño de fuente grande
            - font-bold: negrita
            - text-slate-800 dark:text-white: color del texto
            */}
            <span className="text-lg font-bold text-slate-800 dark:text-white">
              {hour.temp}°
            </span>

            {/*
            Contenedor de viento:
            - mt-2: margen superior
            - flex items-center gap-1: disposición flexible horizontal con centrado
            - text-xs: tamaño de fuente pequeño
            - text-slate-400: color del texto
            */}
            <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              {/*
              Icono de viento:
              - Wind: icono de viento de lucide-react
              - size={12}: tamaño del icono
              */}
              <Wind size={12} />

              {/* Valor numérico del viento */}
              <span>{hour.wind}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
