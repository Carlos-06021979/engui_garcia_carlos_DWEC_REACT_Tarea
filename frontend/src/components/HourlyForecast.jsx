import { useState } from "react"; // Importamos el hook useState
import { useLanguage } from "../context/LanguageContext"; // Importamos el hook useLanguage
import { Cloud, CloudRain, Sun, Wind } from "lucide-react"; // Importamos los iconos de lucide-react

export const HourlyForecast = ({ data }) => {
  const { t } = useLanguage(); // Obtenemos la función t para traducir

  const [showAll, setShowAll] = useState(false); // State for toggle

  // Si no hay datos, no mostramos nada
  if (
    !data ||
    !data.prediccion ||
    !data.prediccion.dia ||
    !data.prediccion.dia[0]
  )
    return null;

  /*
  La API devuelve días, y cada día tiene 'estadoCielo', 'precipitacion', 'temperatura', 'viento' como 
  arrays con 'periodo'
  'periodo' es usualmente "00", "01", ... "23" para las horas.

  Tomamos el primer día (hoy) y quizás el segundo día si es necesario, pero la AEMET por horas suele 
  ser los próximos 48h agrupados por día.
  Aplanaremos la lista para mostrar una línea de tiempo continua.
  */

  const today = data.prediccion.dia[0]; // Obtenemos el primer día (hoy)

  /*
  Para cada hora, obtenemos la descripción del estado del cielo, la temperatura, 
  la precipitación y la velocidad del viento
  */
  const extractHours = (dayData) => {
    // Si no hay datos, devolvemos un array vacío
    if (!dayData) return [];

    // estadoCielo es la referencia para las horas, usualmente.
    return (
      dayData.estadoCielo
        .map((sky, index) => {
          /*
        Encontrar datos correspondientes en otros arrays por índice o período?
        Los arrays de AEMET suelen coincidir en longitud para las horas.
        */
          return {
            period: sky.periodo, // Hora
            description: sky.descripcion, // Descripción del estado del cielo
            temp: dayData.temperatura[index]?.value, // Temperatura
            rain: dayData.precipitacion[index]?.value, // Precipitación

            /*
           El viento suele tener una estructura algo distinta, pero vamos a intentar el 
           acceso directo por índice.
          */
            wind:
              // Si hay datos de viento, obtenemos la velocidad, si no, 0
              dayData.vientoAndRachaMax && dayData.vientoAndRachaMax[index]
                ? dayData.vientoAndRachaMax[index].velocidad
                : 0,
          };
        })
        // Revisa cada elemento h y mira si tiene periodo, si no lo tiene, lo descarta
        .filter((h) => h.period)
        // Ordena los elementos por periodo
        .sort((a, b) => parseInt(a.period) - parseInt(b.period))
    );
  };

  // Obtenemos la hora actual
  const currentHour = new Date().getHours();

  // Filtra las horas basadas en el toggle
  const hoursToday = extractHours(today).filter((h) =>
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
            - flex-shrink-0: evita que la tarjeta se encoja
            - w-20: ancho de la tarjeta
            - flex flex-col items-center justify-between: disposición vertical con centrado
            - p-3: padding interno
            - bg-slate-50 dark:bg-slate-900/50: color de fondo
            - rounded-2xl: bordes redondeados
            - snap-start: comportamiento de ajuste magnético al hacer scroll
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
              - Si la lluvia es mayor a 0, muestra el icono de lluvia
              - Si no, muestra el icono de sol
              */}
              {hour.rain > 0 ? (
                /*
                Icono de lluvia:
                - CloudRain: icono de lluvia de lucide-react
                - w-6 h-6: tamaño del icono
                - text-blue-500: color del icono
                */
                <CloudRain className="w-6 h-6 text-blue-500" />
              ) : (
                /*
                Icono de sol:
                - Sun: icono de sol de lucide-react
                - w-6 h-6: tamaño del icono
                - text-orange-500: color del icono
                */
                <Sun className="w-6 h-6 text-orange-500" />
              )}
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
