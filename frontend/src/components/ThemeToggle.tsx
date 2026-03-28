import { useTheme } from "../hooks/useTheme";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";

const ThemeToggle = () => {
  const { t } = useTranslation();
  const { theme, setTheme, isMobile, resolvedTheme } = useTheme();
  const buttonClasses =
    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium";

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
      <button
        onClick={() => setTheme("system")}
        className={`${buttonClasses} ${
          theme === "system"
            ? "bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-slate-100"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
        aria-label={`${t("settings.system")} (${resolvedTheme === "dark" ? t("settings.dark") : t("settings.light")})`}
        aria-pressed={theme === "system"}>
        <Monitor size={18} />
        <span className={isMobile ? "hidden" : "hidden sm:inline"}>
          {t("settings.system")}
        </span>
      </button>
      <button
        onClick={() => setTheme("light")}
        className={`${buttonClasses} ${
          theme === "light"
            ? "bg-white dark:bg-slate-700 shadow-sm text-amber-600"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
        aria-label={t("settings.light")}
        aria-pressed={theme === "light"}>
        <Sun size={18} />
        <span className={isMobile ? "hidden" : "hidden sm:inline"}>
          {t("settings.light")}
        </span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`${buttonClasses} ${
          theme === "dark"
            ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
        aria-label={t("settings.dark")}
        aria-pressed={theme === "dark"}>
        <Moon size={18} />
        <span className={isMobile ? "hidden" : "hidden sm:inline"}>
          {t("settings.dark")}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
