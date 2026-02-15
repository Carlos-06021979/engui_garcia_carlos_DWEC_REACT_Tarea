import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, Loader2, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getMunicipalities } from "../services/api";

export const Search = ({ onSelect }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [municipalities, setMunicipalities] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Fetch municipalities on mount
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
  }, []);

  // Filter logic with debounce implicitly handled by React fast state updates,
  // but for large lists, we might want a real debounce.
  // For 8000 items, simple filtering is usually fast enough in modern JS.
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const filtered = municipalities
      .filter((m) => m.nombre.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10); // Limit to 10 results for performance

    setResults(filtered);
    setIsOpen(true);
  }, [query, municipalities]);

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

  const handleSelect = (municipality) => {
    setQuery(municipality.nombre);
    setIsOpen(false);
    onSelect(municipality);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-50">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-xl leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
          placeholder={loading ? t("loading") : t("search_placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
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
          {results.length > 0 ? (
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
                    <span className="font-medium block text-slate-900 dark:text-white">
                      {municipio.nombre}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {municipio.provincia}
                    </span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="cursor-default select-none relative py-3 pl-3 pr-9 text-slate-500 dark:text-slate-400 text-center italic">
              No se encontraron resultados
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
