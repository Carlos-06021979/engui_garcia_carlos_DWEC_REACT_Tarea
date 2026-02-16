import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, Loader2, MapPin, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getMunicipalities } from "../services/api";

export const Search = ({ onSelect, onSearchChange }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [municipalities, setMunicipalities] = useState([]);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Load history and municipalities on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getMunicipalities();
        setMunicipalities(data);
      } catch (error) {
        console.error("Failed to load municipalities");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();

    const storedHistory = localStorage.getItem("search_history");
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Filter logic with improved sorting
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const normalize = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[,\-]/g, " ");

    const normalizedQuery = normalize(query);

    const filtered = municipalities
      .filter((m) => {
        const normName = normalize(m.nombre);
        const normProv = normalize(m.provincia || "");
        const id = m.id || "";
        const cleanId = id.replace("id", "");

        return (
          normName.includes(normalizedQuery) ||
          normProv.includes(normalizedQuery) ||
          cleanId.includes(normalizedQuery) ||
          id.includes(normalizedQuery)
        );
      })
      .sort((a, b) => {
        const normA = normalize(a.nombre);
        const normB = normalize(b.nombre);

        // Exact match first (Name)
        if (normA === normalizedQuery && normB !== normalizedQuery) return -1;
        if (normB === normalizedQuery && normA !== normalizedQuery) return 1;

        // Exact Province match second (e.g. searching 'Murcia' shows Cartagena)
        const provA = normalize(a.provincia || "");
        const provB = normalize(b.provincia || "");
        if (provA === normalizedQuery && provB !== normalizedQuery) return -1;
        if (provB === normalizedQuery && provA !== normalizedQuery) return 1;

        // Starts with query third
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
      .slice(0, 10);

    setResults(filtered);
  }, [query, municipalities]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);

    // Clear global errors if typing
    if (onSearchChange) onSearchChange();

    if (val === "") {
      onSelect(null);
    }
  };

  const handleSelect = (municipality) => {
    setQuery(municipality.nombre);
    setIsOpen(false);
    onSelect(municipality);

    // Add to history
    const newHistory = [
      municipality,
      ...history.filter((h) => h.id !== municipality.id),
    ].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("search_history", JSON.stringify(newHistory));
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    onSelect(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const showHistory = query.length === 0 && history.length > 0;
  const showResults = query.length >= 2 && results.length > 0;
  const showNoResults = query.length >= 2 && results.length === 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-50">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-xl leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
          placeholder={loading ? t("loading") : t("search_placeholder")}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          disabled={loading}
        />
        {query && (
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={clearSearch}
          >
            <X className="h-5 w-5 text-slate-400 hover:text-red-500 transition-colors" />
          </div>
        )}
      </div>

      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full bg-white dark:bg-slate-800 shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-slate-100 dark:border-slate-700">
          {/* History Section */}
          {showHistory && (
            <>
              <li className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-700/50">
                Recientes
              </li>
              {history.map((municipio) => (
                <li
                  key={`hist-${municipio.id}`}
                  className="cursor-pointer select-none relative py-3 pl-3 pr-9 hover:bg-slate-50 dark:hover:bg-slate-700 group transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                  onClick={() => handleSelect(municipio)}
                >
                  <div className="flex items-center opacity-80 group-hover:opacity-100">
                    <span className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg mr-3 text-slate-500 dark:text-slate-400">
                      <Clock size={16} />
                    </span>
                    <div>
                      <span className="font-medium block text-slate-700 dark:text-slate-200">
                        {municipio.nombre}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </>
          )}

          {/* Results Section */}
          {showResults &&
            results.map((municipio) => (
              <li
                key={municipio.id}
                className="cursor-pointer select-none relative py-3 pl-3 pr-9 hover:bg-blue-50 dark:hover:bg-slate-700 group transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                onClick={() => handleSelect(municipio)}
              >
                <div className="flex items-center">
                  <span className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-3 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <MapPin size={16} />
                  </span>
                  <div>
                    <span className="text-lg block text-slate-900 dark:text-white">
                      {municipio.nombre}{" "}
                      <span className="font-bold">({municipio.provincia})</span>
                    </span>
                  </div>
                </div>
              </li>
            ))}

          {/* No Results */}
          {showNoResults && (
            <li className="cursor-default select-none relative py-3 pl-3 pr-9 text-slate-500 dark:text-slate-400 text-center italic">
              No se encontraron resultados
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
