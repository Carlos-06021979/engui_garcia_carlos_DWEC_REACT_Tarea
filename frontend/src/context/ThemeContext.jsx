import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // 1. Comprobar si hay preferencia guardada en localStorage
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme"); // Devuelve la preferencia guardada
    }
    // 2. Comprobar preferencia del sistema operativo
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light"; // Por defecto
  });

  // Hook para cambiar el tema
  useEffect(() => {
    // Cambia el tema según la preferencia del usuario
    const root = window.document.documentElement;

    // Si el tema es oscuro, añade la clase 'dark' al elemento raíz, añadiendo así el CSS del tema oscuro
    if (theme === "dark") root.classList.add("dark");
    // Si el tema es claro, elimina la clase 'dark' del elemento raíz, eliminando así el CSS del tema oscuro
    else root.classList.remove("dark");

    localStorage.setItem("theme", theme); // Guarda la preferencia en localStorage
  }, [theme]); // Se ejecuta cada vez que cambia el tema

  // Función para cambiar el tema
  const toggleTheme = () => {
    // Cambia el tema según la preferencia del usuario
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Exportamos el contexto
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar el contexto
export const useTheme = () => useContext(ThemeContext);
