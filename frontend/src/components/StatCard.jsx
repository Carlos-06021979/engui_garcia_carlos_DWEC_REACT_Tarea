/**
 * Componente reutilizable para mostrar una estadística individual del clima.
 * @param {Object} props
 * @param {JSX.Element} props.icon - Icono a mostrar.
 * @param {string} props.label - Etiqueta o título de la estadística.
 * @param {string|number} props.value - Valor de la estadística.
 * @param {string} props.bgColor - Clase de fondo para el contenedor del icono (opcional).
 * @param {string} props.textColor - Clase de color de texto para el icono (opcional).
 */
export const StatCard = ({
  icon,
  label,
  value,
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
      title={label}
    >
      <div className={`p-2 rounded-lg ${bgColor} ${textColor}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
};
