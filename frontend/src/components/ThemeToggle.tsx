import { useTheme } from "../hooks/useTheme";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";

const ThemeToggle = () => {
  const { t } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const buttonClasses =
    "grid h-10 w-10 place-items-center rounded-lg transition-all duration-200";

  return (
    <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/80 p-1 shadow-sm shadow-slate-200/60 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-slate-950/60">
      <button
        onClick={() => setTheme("system")}
        className={`${buttonClasses} ${
          theme === "system"
            ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        }`}
        aria-label={`${t("settings.system")} (${resolvedTheme === "dark" ? t("settings.dark") : t("settings.light")})`}
        aria-pressed={theme === "system"}>
        <Monitor size={18} />
        <span className="sr-only">{t("settings.system")}</span>
      </button>
      <button
        onClick={() => setTheme("light")}
        className={`${buttonClasses} ${
          theme === "light"
            ? "bg-amber-100 text-amber-700 shadow-sm dark:bg-amber-400/20 dark:text-amber-200"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        }`}
        aria-label={t("settings.light")}
        aria-pressed={theme === "light"}>
        <Sun size={18} />
        <span className="sr-only">{t("settings.light")}</span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`${buttonClasses} ${
          theme === "dark"
            ? "bg-indigo-100 text-indigo-700 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-200"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        }`}
        aria-label={t("settings.dark")}
        aria-pressed={theme === "dark"}>
        <Moon size={18} />
        <span className="sr-only">{t("settings.dark")}</span>
      </button>
    </div>
  );
};

export default ThemeToggle;
