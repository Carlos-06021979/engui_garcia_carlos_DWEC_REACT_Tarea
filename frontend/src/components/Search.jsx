import { useState, useEffect, useRef } from "react"; // Importamos los hooks de React
import { Search as SearchIcon, X, Loader2, MapPin, Clock } from "lucide-react"; // Importamos los iconos de lucide-react
import { useLanguage } from "../context/LanguageContext"; // Importamos el contexto de idioma
import { getMunicipalities } from "../services/api"; // Importamos la función getMunicipalities de la API

/*
Componente Search: 
- Busca municipios por nombre
- Muestra resultados en un dropdown
- Muestra historial de búsqueda
- Muestra loading si está cargando
- Muestra no results si no hay resultados
*/
export const Search = ({ onSelect, onSearchChange }) => {
  const { t } = useLanguage(); // Obtenemos la función t del contexto de idioma
  const [query, setQuery] = useState(""); // Estado para almacenar la consulta de búsqueda
  const [municipalities, setMunicipalities] = useState([]); // Estado para almacenar los municipios
  const [results, setResults] = useState([]); // Estado para almacenar los resultados de la búsqueda
  const [history, setHistory] = useState([]); // Estado para almacenar el historial de búsqueda
  const [loading, setLoading] = useState(true); // Estado para indicar si se está cargando
  const [isOpen, setIsOpen] = useState(false); // Estado para indicar si el dropdown está abierto
  const wrapperRef = useRef(null);

  // Efecto para cargar los municipios y el historial al montar el componente
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Obtenemos la lista de municipios de la API
        const data = await getMunicipalities();
        setMunicipalities(data);

        // En caso de error, mostramos un mensaje
      } catch (error) {
        console.error("Failed to load municipalities");
      } finally {
        // Indicamos que la carga ha terminado
        setLoading(false);
      }
    };

    // Llamamos/invocamos a la función fetchAll
    fetchAll();

    // Recuperamos el historial de búsqueda del localStorage
    const storedHistory = localStorage.getItem("search_history");

    // Si existe el historial, lo parseamos y lo guardamos en el estado
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));

        // En caso de error, mostramos un mensaje
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []); // [] indica que se ejecute solo al montar el componente

  // Lógica de filtrado con ordenamiento mejorado
  useEffect(() => {
    // Si la consulta es muy corta, no mostramos resultados y salimos del efecto
    if (query.length < 2) {
      setResults([]);
      return;
    }

    // Función para normalizar texto (quitar tildes, minúsculas, caracteres especiales)
    const normalize = (str) =>
      str
        .toLowerCase() // pasamos a minúsculas
        .normalize("NFD") // normalizamos el texto
        .replace(/[\u0300-\u036f]/g, "") // quitamos los acentos
        .replace(/[,\-]/g, " "); // quitamos las comas y los guiones

    const normalizedQuery = normalize(query); // normalizamos la consulta

    // Filtramos los municipios
    const filtered = municipalities
      .filter((m) => {
        const normName = normalize(m.nombre); // normalizamos el nombre
        const normProv = normalize(m.provincia || ""); // normalizamos la provincia
        const id = m.id || ""; // obtenemos el id
        const cleanId = id.replace("id", ""); // quitamos "id" del id

        // Buscamos coincidencia en nombre, provincia o ID
        return (
          normName.includes(normalizedQuery) ||
          normProv.includes(normalizedQuery) ||
          cleanId.includes(normalizedQuery) ||
          id.includes(normalizedQuery)
        );
      })

      // Ordenamos los resultados
      .sort((a, b) => {
        const normA = normalize(a.nombre);
        const normB = normalize(b.nombre);

        // 1. Coincidencia exacta (Nombre) aparece primero
        if (normA === normalizedQuery && normB !== normalizedQuery) return -1;
        if (normB === normalizedQuery && normA !== normalizedQuery) return 1;

        // 2. Coincidencia exacta de Provincia (ej. buscar 'Murcia' muestra Cartagena)
        const provA = normalize(a.provincia || "");
        const provB = normalize(b.provincia || "");
        if (provA === normalizedQuery && provB !== normalizedQuery) return -1;
        if (provB === normalizedQuery && provA !== normalizedQuery) return 1;

        // 3. Empieza con la consulta (Nombre)
        if (
          normA.startsWith(normalizedQuery) &&
          !normB.startsWith(normalizedQuery)
        )
          return -1;
        if (
          normB.startsWith(normalizedQuery) &&
          !normA.startsWith(normalizedQuery)
        )
          return 1;

        return 0;
      })
      .slice(0, 10); // Limitamos a 10 resultados

    setResults(filtered);
  }, [query, municipalities]); // Se ejecuta cuando cambia la consulta o los municipios

  // Manejador del cambio en el input
  const handleInputChange = (e) => {
    const val = e.target.value; // obtenemos el valor del input

    setQuery(val); // actualizamos la consulta

    setIsOpen(true); // abrimos el dropdown

    // Limpiamos errores globales si se está escribiendo
    if (onSearchChange) onSearchChange();

    // Si el valor es igual a vacío, seleccionamos null
    if (val === "") onSelect(null);
  };

  // Manejador de selección de un municipio
  const handleSelect = (municipality) => {
    setQuery(municipality.nombre);
    setIsOpen(false);
    onSelect(municipality);

    // Añadir al historial (evitando duplicados y limitando a 5)
    const newHistory = [
      municipality,
      ...history.filter((h) => h.id !== municipality.id),
    ].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("search_history", JSON.stringify(newHistory));
  };

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    onSelect(null);
  };

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      // Si hacemos clic fuera del contenedor, cerramos el dropdown
      if (wrapperRef.current && !wrapperRef.current.contains(event.target))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const showHistory = query.length === 0 && history.length > 0; // Si la consulta es igual a vacío y el historial tiene elementos
  const showResults = query.length >= 2 && results.length > 0; // Si la consulta tiene 2 o más caracteres y hay resultados
  const showNoResults = query.length >= 2 && results.length === 0; // Si la consulta tiene 2 o más caracteres y no hay resultados

  return (
    /*
    Contenedor relativo para posicionar el dropdown absoluto de resultados:
    - relative: establece el contexto de posicionamiento
    - w-full max-w-md: ancho completo hasta un máximo
    - mx-auto: centrado horizontalmente
    - z-50: asegura que el buscador esté por encima de otros elementos (z-index alto)
    */
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-50">
      <div className="relative group">
        {/* Icono de búsqueda a la izquierda */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          /* 
          Input de búsqueda estilizado:
          - block w-full: ocupa todo el ancho disponible
          - pl-10: padding izquierdo para dejar sitio al icono
          - pr-10: padding derecho para dejar sitio al botón de borrar
          - py-3: padding vertical generoso
          - border border-slate-300: borde fino gris
          - rounded-xl: bordes moderadamente redondeados
          - focus:ring-4: anillo de enfoque azul suave
          - focus:border-blue-500: borde azul al enfocar
          - transition-all shadow-sm: transiciones suaves y sombra sutil
          */
          className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-xl leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
          /*
          Placeholder dinámico:
          - Muestra "Cargando..." mientras carga los municipios
          - Muestra "Busca tu municipio..." por defecto
          */
          placeholder={loading ? t("loading") : t("search_placeholder")}
          value={query} // Valor del input
          onChange={handleInputChange} // Manejador del cambio en el input
          onFocus={() => setIsOpen(true)} // Abre el dropdown al enfocar
          disabled={loading} // Desactivado mientras carga
        />
        {/* Botón de borrar  (X) */}
        {query && (
          <div
            /*
            Botón de borrar (X):
            - absolute inset-y-0 right-0 pr-3: posicionamiento absoluto a la derecha
            - flex items-center: centrado verticalmente
            - cursor-pointer: cursor de mano al pasar por encima
            */
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            /*
            Manejador del clic en el botón de borrar:
            - clearSearch: función que limpia la búsqueda
            */
            onClick={clearSearch}
          >
            {/*
            Icono de borrar (X):
            - h-5 w-5: tamaño del icono
            - text-slate-400: color del icono
            - hover:text-red-500: color del icono al pasar por encima
            - transition-colors: transición suave del color
            */}
            <X className="h-5 w-5 text-slate-400 hover:text-red-500 transition-colors" />
          </div>
        )}
      </div>

      {/* Dropdown de resultados (Lista desplegable) */}
      {isOpen && (
        /*
        Dropdown de resultados (Lista desplegable):
        - absolute z-10: posicionamiento absoluto flotante sobre el contenido
        - mt-2: margen superior para separar del input
        - w-full: mismo ancho que el input
        - shadow-xl: sombra muy pronunciada para destacar
        - max-h-60 overflow-auto: altura máxima limita con barra de desplazamiento si es necesario
        - rounded-xl: bordes redondeados
        */
        <ul className="absolute z-10 mt-2 w-full bg-white dark:bg-slate-800 shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-slate-100 dark:border-slate-700">
          {/* Sección de Historial */}

          {showHistory && (
            <>
              <li className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-700/50">
                Recientes
              </li>
              {history.map((municipio) => (
                <li
                  key={`hist-${municipio.id}`}
                  /*
                  Elemento de historial:
                  - cursor-pointer: cursor de mano
                  - hover:bg...: cambio de fondo suave
                  - border-b: línea separadora
                  */
                  className="cursor-pointer select-none relative py-3 pl-3 pr-9 hover:bg-slate-50 dark:hover:bg-slate-700 group transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                  /*
                  Manejador del clic en el elemento de historial:
                  - handleSelect: función que selecciona el municipio
                  */
                  onClick={() => handleSelect(municipio)}
                >
                  {/*
                  Contenedor de elementos:
                  - flex items-center: centrado verticalmente
                  - opacity-80: opacidad inicial
                  - group-hover:opacity-100: opacidad al pasar el ratón
                  */}
                  <div className="flex items-center opacity-80 group-hover:opacity-100">
                    {/*
                    Icono de reloj:
                    - p-2: padding
                    - bg-slate-100 dark:bg-slate-700: fondo
                    - rounded-lg: bordes redondeados
                    - mr-3: margen derecho
                    - text-slate-500 dark:text-slate-400: color
                    */}
                    <span className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg mr-3 text-slate-500 dark:text-slate-400">
                      <Clock size={16} />
                    </span>
                    {/*
                    Contenedor del nombre del municipio:
                    - div: contenedor
                    */}
                    <div>
                      {/*
                      Nombre del municipio:
                      - font-medium: fuente negrita
                      - block: bloque
                      - text-slate-700 dark:text-slate-200: color
                      */}
                      <span className="font-medium block text-slate-700 dark:text-slate-200">
                        {municipio.nombre}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </>
          )}

          {/* Sección de Resultados */}
          {showResults &&
            results.map((municipio) => (
              <li
                key={municipio.id} // clave única para cada elemento
                /* 
                Elemento de resultado:
                - cursor-pointer: interactivo
                - hover:bg-blue-50: fondo azul claro al pasar el ratón (modo claro)
                - dark:hover:bg-slate-700: fondo gris oscuro (modo oscuro)
                - transition-colors: animación suave
                - border-b: separador inferior
                */
                className="cursor-pointer select-none relative py-3 pl-3 pr-9 hover:bg-blue-50 dark:hover:bg-slate-700 group transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                /*
                Manejador del clic en el elemento de resultado:
                - handleSelect: función que selecciona el municipio
                */
                onClick={() => handleSelect(municipio)}
              >
                {/*
                Contenedor de elementos:
                - flex items-center: centrado verticalmente
                */}
                <div className="flex items-center">
                  {/* Icono de ubicación con fondo que cambia al hacer hover en el padre (group-hover) */}
                  {/*
                  Icono de ubicación:
                  - p-2: padding
                  - bg-blue-100 dark:bg-blue-900/50: fondo
                  - rounded-lg: bordes redondeados
                  - mr-3: margen derecho
                  - text-blue-600 dark:text-blue-400: color
                  - group-hover:bg-blue-200 dark:group-hover:bg-blue-800: cambio de color al pasar el ratón
                  - transition-colors: animación suave
                  */}
                  <span className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-3 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    {/*
                    Icono de ubicación:
                    - MapPin: icono de ubicación
                    - size={16}: tamaño del icono
                    */}
                    <MapPin size={16} />
                  </span>
                  <div>
                    {/*
                    Nombre del municipio:
                    - text-lg: tamaño de fuente grande
                    - block: bloque
                    - text-slate-900 dark:text-white: color
                    */}
                    <span className="text-lg block text-slate-900 dark:text-white">
                      {/*
                      Nombre del municipio:
                      - font-bold: fuente negrita
                      */}
                      {municipio.nombre}{" "}
                      {/*
                      Provincia:
                      - font-bold: fuente negrita
                      */}
                      <span className="font-bold">({municipio.provincia})</span>
                    </span>
                  </div>
                </div>
              </li>
            ))}

          {/* Mensaje de No Resultados */}
          {showNoResults && (
            /*
            Elemento de no resultados:
            - cursor-default: cursor por defecto
            - select-none: no se puede seleccionar
            - relative: posicionamiento relativo
            - py-3 pl-3 pr-9: padding
            - text-slate-500 dark:text-slate-400: color
            - text-center: centrado
            - italic: cursiva
            */
            <li className="cursor-default select-none relative py-3 pl-3 pr-9 text-slate-500 dark:text-slate-400 text-center italic">
              No se encontraron resultados
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
