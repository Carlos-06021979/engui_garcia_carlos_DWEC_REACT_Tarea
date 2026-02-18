/*
 * Componente reutilizable para mostrar una estadística individual del clima.
  props
  props.icon - Icono a mostrar.
  props.label - Etiqueta o título de la estadística.
  props.value - Valor de la estadística.
  props.bgColor - Clase de fondo para el contenedor del icono (opcional).
  props.textColor - Clase de color de texto para el icono (opcional).
 */
export const StatCard = ({
  icon,
  label,
  value,

  // Clases de fondo y texto para el icono
  // Por defecto, el icono será azul en modo claro y azul oscuro en modo oscuro
  bgColor = "bg-blue-100 dark:bg-blue-900/50",
  textColor = "text-blue-600 dark:text-blue-400",
}) => {
  return (
    <div
      /* 
      Tarjeta de estadística:
      - bg-slate-50: fondo muy claro (casi blanco)
      - dark:bg-slate-700/30: fondo oscuro semitransparente en modo oscuro
      - p-4: espacio interno de 1rem
      - rounded-2xl: bordes muy redondeados
      - flex items-center: alinea el icono y el texto horizontalmente
      - gap-3: espacio de 0.75rem entre el icono y el texto
      - transition-colors: suaviza el cambio de color al hacer hover
      - hover:bg-slate-100: cambia el fondo al pasar el ratón (modo claro)
      - dark:hover:bg-slate-700/50: cambia el fondo al pasar el ratón (modo oscuro)
      - backdrop-blur-sm: aplica un desenfoque sutil al fondo (efecto cristal)
      */
      className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl flex items-center gap-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50 backdrop-blur-sm"
      title={label} // Muestra la etiqueta al pasar el ratón
    >
      {/* Icono de la estadística */}
      <div className={`p-2 rounded-lg ${bgColor} ${textColor}`}>{icon}</div>
      <div>
        {/* Etiqueta de la estadística */}
        {/* text-xs: tamaño de fuente pequeño (12px) */}
        {/* text-slate-500: color gris medio */}
        {/* dark:text-slate-400: color gris medio en modo oscuro */}
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        {/* Valor de la estadística */}
        {/* font-semibold: fuente negrita */}
        {/* text-slate-700: color gris oscuro */}
        {/* dark:text-slate-200: color gris muy oscuro en modo oscuro */}
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          {value} {/* Muestra el valor de la estadística */}
        </p>
      </div>
    </div>
  );
};
