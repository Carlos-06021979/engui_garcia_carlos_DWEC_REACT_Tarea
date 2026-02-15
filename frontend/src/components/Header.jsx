import { Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          AEMET React
        </h1>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
            title="Switch Language"
          >
            <Languages size={20} />
            <span className="font-medium uppercase">{language}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-yellow-500 dark:text-blue-400"
            title="Toggle Theme"
          >
            {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};
