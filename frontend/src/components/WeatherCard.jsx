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
          /* 
          Capa de imagen de fondo:
          - absolute inset-0: ocupa toda la tarjeta
          - z-0: está detrás de todo
          - opacity-60: semitransparente (60%)
          - dark:opacity-40: más transparente en modo oscuro
          - bg-cover: cubre toda la tarjeta
          - bg-center: centra la imagen
          - transition-opacity: suaviza el cambio de opacidad
          - duration-1000: duración de la transición en milisegundos
          */
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
          {/* Encabezado: Nombre, Provincia e Fecha */}
          {/* 
          Encabezado de la tarjeta:
          - flex flex-col md:flex-row: se adapta a móvil y escritorio
          - justify-between: separa el nombre de la fecha
          - items-start md:items-center: alinea los elementos
          - mb-8: margen inferior
          */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              {/* 
              Nombre del municipio:
              - text-3xl: tamaño de fuente grande (36px)
              - font-bold: fuente negrita
              - text-slate-900: color gris oscuro
              - dark:text-white: color blanco en modo oscuro
              - flex items-center: alinea el icono y el texto horizontalmente
              - gap-3: espacio de 0.75rem entre el icono y el texto
              - drop-shadow-sm: sombra sutil para mejorar la legibilidad
              */}
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 drop-shadow-sm">
                {municipality.nombre} {/* Muestra el nombre del municipio */}

                {/* 
                Nombre del municipio:
                - text-sm: tamaño de fuente pequeño (14px)
                - font-normal: fuente normal
                - text-slate-600: color gris medio
                - dark:text-slate-300: color gris medio en modo oscuro
                - bg-white/50: fondo blanco semitransparente
                - dark:bg-slate-700/50: fondo oscuro semitransparente en modo oscuro
                - backdrop-blur-md: aplica un desenfoque sutil al fondo (efecto cristal)
                - px-3 py-1: espacio interno horizontal y vertical
                - rounded-full: bordes redondeados
                - border border-slate-200: borde gris medio
                - dark:border-slate-600: borde gris medio en modo oscuro
                */}
                <span className="text-sm font-normal text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                  {municipality.provincia} {/* Muestra la provincia */}
                </span>
              </h2>

              {/* 
              Fecha actual:
              - text-slate-700: color gris oscuro
              - dark:text-slate-200: color gris muy oscuro en modo oscuro
              - mt-2: margen superior de 0.5rem
              - font-medium: fuente negrita
              */}
              <p className="text-slate-700 dark:text-slate-200 mt-2 font-medium">
                {fullDate} {/* Muestra la fecha actual */}
              </p>
            </div>
            <div
              /* 
              Icono dinámico:
              - mt-4 md:mt-0: margen superior en móvil, sin margen en escritorio
              - flex items-center: alinea el icono horizontalmente
              - title="Estado actual": muestra el estado actual al pasar el ratón
              */
              className="mt-4 md:mt-0 flex items-center"
              title="Estado actual"
            >
              {/* Icono Dinámico */}
              {weatherIcon}
            </div>

            {/* Temperature & Stats */}
            {/* 
            Temperatura y estadísticas:
            - flex-1: ocupa todo el espacio disponible
            - w-full md:w-auto: se adapta a móvil y escritorio
            */}
            <div className="flex-1 w-full md:w-auto">
              {/* 
              Temperatura:
              - flex justify-center md:justify-end: se centra en móvil, se alinea a la derecha en escritorio
              - items-baseline: alinea los elementos por la línea base
              - mb-6: margen inferior de 1.5rem
              */}
              <div className="flex justify-center md:justify-end items-baseline mb-6">
                {/* 
                Temperatura máxima:
                - text-6xl: tamaño de fuente grande (72px)
                - font-bold: fuente negrita
                - text-slate-900: color gris oscuro
                - dark:text-white: color blanco en modo oscuro
                */}
                <span className="text-6xl font-bold text-slate-900 dark:text-white">
                  {today.temperatura.maxima}
                </span>
                {/* 
                Temperatura mínima:
                - text-4xl: tamaño de fuente grande (48px)
                - text-slate-400: color gris medio
                - font-light: fuente ligera
                - ml-2: margen izquierdo de 0.5rem
                */}
                <span className="text-4xl text-slate-400 font-light ml-2">
                  / {today.temperatura.minima}°C
                </span> 
              </div>

              {/* Cuadrícula de estadísticas (Humedad, Viento, etc) usando StatCard */}
              {/* 
              Cuadrícula de estadísticas:
              - grid grid-cols-2: cuadrícula de 2 columnas
              - gap-4: espacio de 1rem entre las columnas
              */}
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
                {/* 
                Viento:
                - label: etiqueta de la estadística
                - value: valor de la estadística
                - icon: icono de la estadística
                - bgColor: clase de fondo del icono
                - textColor: clase de color del icono
                */}
                <StatCard
                  label={t("wind")}
                  value={`${today.viento[0]?.velocidad || 0} km/h`}
                  icon={<Wind size={20} aria-label={t("wind")} />}
                  bgColor="bg-teal-100 dark:bg-teal-900/50"
                  textColor="text-teal-600 dark:text-teal-400"
                />

                {/* Índice UV */}
                {/* 
                Índice UV:
                - label: etiqueta de la estadística
                - value: valor de la estadística
                - icon: icono de la estadística
                - bgColor: clase de fondo del icono
                - textColor: clase de color del icono
                */}
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
                {/* 
                Sensación Térmica:
                - label: etiqueta de la estadística
                - value: valor de la estadística
                - icon: icono de la estadística
                - bgColor: clase de fondo del icono
                - textColor: clase de color del icono
                */}
                <StatCard
                  label={t("thermal_sensation")}
                  value={`${today.sensTermica?.maxima}°C`}
                  icon={
                    /* 
                    Icono de sensación térmica:
                    - className: clase de estilo
                    - fill: color de relleno
                    - viewBox: tamaño del icono
                    - stroke: color del trazo
                    - aria-label: etiqueta para accesibilidad
                    */
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
                        // Dibuja un termómetro: línea vertical con una curva en la parte inferior
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  }

                  // Clases de fondo y texto para el icono
                  // bg-red-100: fondo rojo claro
                  // dark:bg-red-900/50: fondo rojo oscuro semitransparente en modo oscuro
                  // text-red-600: color rojo oscuro
                  // dark:text-red-400: color rojo claro en modo oscuro
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
