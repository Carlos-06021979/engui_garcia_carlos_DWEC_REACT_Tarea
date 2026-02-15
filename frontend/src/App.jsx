import { useState } from "react";
import { Header } from "./components/Header";
import { Search } from "./components/Search";
import { useLanguage } from "./context/LanguageContext";

function App() {
  const { t } = useLanguage();
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  const handleSelection = (municipality) => {
    console.log("Municipio seleccionado:", municipality);
    setSelectedMunicipality(municipality);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-10">
      <Header />

      <main className="container mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center max-w-2xl mx-auto border border-slate-200 dark:border-slate-700 transition-colors">
          <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">
            {t("title")}
          </h2>

          <div className="mb-8">
            <Search onSelect={handleSelection} />
          </div>

          {!selectedMunicipality && (
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              {t("select_municipality")}
            </p>
          )}

          {selectedMunicipality && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-100 dark:border-green-800 animate-fade-in">
              <p className="text-green-700 dark:text-green-400 font-medium text-lg">
                ✅ Seleccionado: {selectedMunicipality.nombre}
              </p>
              <p className="text-sm text-green-600 dark:text-green-500">
                (ID: {selectedMunicipality.id})
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
