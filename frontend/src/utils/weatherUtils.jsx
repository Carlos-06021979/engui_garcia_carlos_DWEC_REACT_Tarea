import { Cloud, Sun, CloudRain } from "lucide-react";

/**
 * Obtiene el componente de icono correspondiente basado en el estado del cielo y la probabilidad de lluvia.
 * @param {number} rainProb - Probabilidad de precipitación (0-100).
 * @param {string} skyState - Descripción del estado del cielo.
 * @param {string} className - Clases CSS adicionales para el icono.
 * @returns {JSX.Element} Componente de icono de Lucide-React.
 */
export const getWeatherIcon = (rainProb, skyState, className = "w-8 h-8") => {
  const state = skyState?.toLowerCase() || "";

  /*
  Lógica de selección de icono:
  1. Si llueve (>50%) o la descripción menciona lluvia/tormenta: Icono de Lluvia
  2. Si está nuboso o cubierto: Icono de Nube
  3. Por defecto: Icono de Sol
  */
  if (
    rainProb >= 50 ||
    state.includes("lluvia") ||
    state.includes("tormenta")
  ) {
    return <CloudRain className={`text-blue-500 ${className}`} />;
  } else if (state.includes("nuboso") || state.includes("cubierto")) {
    return <Cloud className={`text-slate-500 ${className}`} />;
  } else {
    return <Sun className={`text-yellow-500 ${className}`} />;
  }
};

/**
 * Formatea una fecha al estilo "DíaSemana, Día de Mes de Año".
 * Ejemplo: "Lunes, 16 de Octubre de 2023"
 * @returns {string} Fecha formateada.
 */
export const formatCurrentDate = () => {
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

/**
 * Formatea una fecha para mostrar el nombre del día y número.
 * Ejemplo: "Lun 16"
 * @param {string} dateString - Fecha en formato string compatible con Date.
 * @returns {string} Fecha formateada corta.
 */
export const formatDayName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
  });
};
