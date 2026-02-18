import { createContext, useState, useContext } from "react";
import { translations } from "../data/translations";

const LanguageContext = createContext();

// Proveedor del contexto de idioma
export const LanguageProvider = ({ children }) => {

  const [language, setLanguage] = useState("es"); // Por defecto 'es' (español)

  const t = (key) => {
    // Devuelve la traducción o la clave si no existe
    return translations[language][key] || key;
  };

  // Exportamos el contexto
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook para usar el contexto
export const useLanguage = () => useContext(LanguageContext);
