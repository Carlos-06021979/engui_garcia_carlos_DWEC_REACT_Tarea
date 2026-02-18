import { useLanguage } from "../context/LanguageContext";
import { getWeatherIcon, formatDayName } from "../utils/weatherUtils";

// Componente que muestra la predicción del tiempo para los próximos 5 días
export const WeatherForecast = ({ data }) => {

  // Recibe como props: data (datos del clima)

  const { t } = useLanguage(); // Obtenemos la función t del contexto de idioma

  // Si no hay datos, no mostramos nada
  if (!data || !data.prediccion || !data.prediccion.dia) return null;

  return (
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
        {t("forecast") || "Próximos Días"} {/* Muestra la predicción del tiempo para los próximos 5 días*/}
      </h3>

      {/* 
      Grid responsivo para los días:
      - grid: activa grid layout
      - grid-cols-2: por defecto (móvil) 2 columnas
      - md:grid-cols-5: en pantallas medianas (md) cambia a 5 columnas (una por día)
      - gap-4: espacio entre celdas del grid
      */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Mapeamos cada día de la predicción */}
        {data.prediccion.dia.map((day, index) => {
          // Obtenemos el nombre del día formateado
          const dayName = formatDayName(day.fecha);

          // Obtenemos el icono usando la utilidad
          const weatherIcon = getWeatherIcon(
            day.probPrecipitacion[0]?.value || 0,
            day.estadoCielo[0]?.descripcion || "",
            "text-blue-500 w-8 h-8",
          );

          return (
            <div key={index}>
              {/* 
              Nombre del día:
              - text-slate-500: color de texto gris medio
              - dark:text-slate-400: gris más claro en modo oscuro
              - font-medium: peso de fuente medio
              - capitalize: primera letra mayúscula
              - mb-2: margen inferior
              */}
              <span className="text-slate-500 dark:text-slate-400 font-medium capitalize mb-2">
                {dayName} {/* Muestra el nombre del día */} 
              </span>
              <div
                /* 
                Icono dinámico:
                - mb-2: margen inferior
                - title: muestra la descripción del estado del cielo al pasar el ratón
                */
                className="mb-2"
                title={day.estadoCielo[0]?.descripcion || ""}
              >
                {weatherIcon} {/* Muestra el icono dinámico */}
              </div>
              {/* 
              Temperaturas Máx/Min:
              - flex items-center gap-2: alineación horizontal con espacio
              - text-sm: texto pequeño
              - font-semibold: negrita media
              */}
              <div className="flex items-center gap-2 text-sm font-semibold">
                {/* 
                Temperatura máxima:
                - text-slate-900: color gris oscuro
                - dark:text-white: color blanco en modo oscuro
                */}
                <span className="text-slate-900 dark:text-white">
                  {day.temperatura.maxima}° {/* Muestra la temperatura máxima */}
                </span>
                {/* 
                Temperatura mínima:
                - text-slate-400: color gris medio
                - dark:text-slate-500: color gris medio en modo oscuro
                */}
                <span className="text-slate-400 dark:text-slate-500">
                  {day.temperatura.minima}° {/* Muestra la temperatura mínima */}
                </span>
              </div>
              {/* 
              Probabilidad de Lluvia:
              - mt-2: margen superior
              - text-xs: texto muy pequeño
              - text-blue-500: color azul
              - font-medium: peso medio
              */}
              <div className="mt-2 text-xs text-blue-500 font-medium">
                {day.probPrecipitacion[0]?.value || 0}% Lluvia {/* Muestra la probabilidad de lluvia */} 
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
