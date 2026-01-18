import { useTranslation } from "react-i18next";
import { changeLanguage } from "../i18n";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
      <button
        onClick={() => changeLanguage("vi")}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          currentLang === "vi"
            ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
        aria-label="Tiếng Việt">
        <span className="text-base">🇻🇳</span>
        <span className="text-sm font-medium hidden sm:inline">VI</span>
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          currentLang === "en"
            ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
        aria-label="English">
        <span className="text-base">🇬🇧</span>
        <span className="text-sm font-medium hidden sm:inline">EN</span>
      </button>
    </div>
  );
};

// Compact version for header
export const LanguageSwitcherCompact = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    changeLanguage(currentLang === "vi" ? "en" : "vi");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      aria-label="Đổi ngôn ngữ">
      <Globe size={18} className="text-slate-600 dark:text-slate-400" />
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {currentLang === "vi" ? "VI 🇻🇳" : "EN 🇬🇧"}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
