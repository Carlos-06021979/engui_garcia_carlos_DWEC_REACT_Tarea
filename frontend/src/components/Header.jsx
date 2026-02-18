import { Moon, Sun, Languages } from "lucide-react"; // Importamos los iconos de lucide-react
import { useTheme } from "../context/ThemeContext"; // Importamos el hook useTheme
import { useLanguage } from "../context/LanguageContext"; // Importamos el hook useLanguage

export const Header = () => {
  const { theme, toggleTheme } = useTheme(); // Obtenemos el tema actual y la función para cambiarlo

  /*
  Para que cualquier componente pueda hablar varios idiomas sin tener que pasar datos de padre a hijo manualmente
  Usamos el hook useLanguage que nos da acceso al idioma actual, la función para cambiarlo y la función t para traducir
    language: es el idioma actual
    setLanguage: es la función para cambiar el idioma
    t: es la función para traducir(translate)
  */
  const { language, setLanguage, t } = useLanguage(); // Obtenemos el idioma actual y la función para cambiarlo

  return (
    /* 
    Header:
    - bg-white: fondo blanco en modo claro
    - dark:bg-slate-800: fondo gris oscuro en modo oscuro
    - shadow-md: sombra media en la parte inferior
    - transition-colors duration-300: animación suave de cambio de color
    */
    <header className="bg-white dark:bg-slate-800 shadow-md transition-colors duration-300">
      {/* 
      Contenedor principal:
      - container mx-auto: centra el contenido con un ancho máximo
      - px-4 py-4: padding horizontal y vertical
      - flex justify-between items-center: flexbox para separar logo y botones
      */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        {/* 
        Título con degradado:
        - text-xl md:text-2xl: tamaño de texto responsivo
        - font-bold: negrita
        - bg-gradient-to-r...: degradado de azul a cian
        - bg-clip-text text-transparent: hace que el texto tome el color del fondo (degradado)
        */}
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          MeteoApp España
        </h1>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            // Al hacer clic en el botón, se cambia el idioma
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            /* 
            Botón de idioma:
            - flex items-center gap-2: alinea icono y texto
            - px-3 py-1.5: padding botón
            - rounded-lg: bordes redondeados
            - hover:bg...: cambio de fondo al pasar el ratón (claro/oscuro)
            - text-slate...: color del texto según tema
            */
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
            title={t("switch_language_tooltip")} // Tooltip que indica el cambio de idioma
          >
            {/* 
            Icono de idioma de lucide-react:
            - Languages: icono de idiomas
            - size={20}: tamaño del icono
            */}
            <Languages size={20} />
            {/* 
            Texto del idioma:
            - font-medium: fuente mediana
            - uppercase: texto en mayúsculas
            */}
            <span className="font-medium uppercase">{language}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            /* 
            Botón de tema (Sol/Luna):
            - p-2 rounded-full: botón circular con padding
            - hover...: fondo al pasar el ratón
            - text...: color del icono (amarillo en oscuro para el sol)
            */
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-yellow-400"
            title={t("toggle_theme_tooltip")} // Tooltip que indica el cambio de tema
          >
            {/* 
            Icono de sol/luna de lucide-react:
            - Moon: icono de luna
            - Sun: icono de sol
            - size={24}: tamaño del icono
            - fill-slate-600: color del icono en modo claro
            - fill-yellow-400: color del icono en modo oscuro
            */}
            {/* Si el tema es claro, se muestra el icono de la luna, si no, el del sol */}
            {theme === "light" ? (
              <Moon size={24} className="fill-slate-600" />
            ) : (
              <Sun size={24} className="fill-yellow-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
