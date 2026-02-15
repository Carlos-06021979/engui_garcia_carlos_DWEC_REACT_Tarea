import { Header } from "./components/Header";
import { useLanguage } from "./context/LanguageContext";

function App() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-10">
      <Header />

      <main className="container mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center max-w-2xl mx-auto border border-slate-200 dark:border-slate-700">
          <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">
            {t("title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg mb-6">
            {t("select_municipality")}
          </p>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">
              Backend Status:{" "}
              <span className="text-green-600 dark:text-green-400">
                Connected
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
