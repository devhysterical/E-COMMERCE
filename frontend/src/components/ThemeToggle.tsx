import { useTheme } from "../hooks/useTheme";
import { Sun, Moon, Monitor } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme, isMobile, resolvedTheme } = useTheme();

  // Mobile: Just show current theme indicator (follows system)
  if (isMobile) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
        <Monitor size={18} className="text-slate-500 dark:text-slate-400" />
        <span className="text-sm text-slate-600 dark:text-slate-300">
          Theo hệ thống ({resolvedTheme === "dark" ? "Tối" : "Sáng"})
        </span>
      </div>
    );
  }

  // Desktop: Toggle between light and dark
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
      <button
        onClick={() => setTheme("light")}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          theme === "light"
            ? "bg-white dark:bg-slate-700 shadow-sm text-amber-600"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
        aria-label="Chế độ sáng">
        <Sun size={18} />
        <span className="text-sm font-medium hidden sm:inline">Sáng</span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          theme === "dark"
            ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
        aria-label="Chế độ tối">
        <Moon size={18} />
        <span className="text-sm font-medium hidden sm:inline">Tối</span>
      </button>
    </div>
  );
};

export default ThemeToggle;
