import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { ThemeContext } from "./theme-context";

type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "e-commerce-theme";

// Detect mobile device
const getIsMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
};

// Get system preference
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [theme, setThemeState] = useState<Theme>(() => {
    // Mobile: always use system
    if (getIsMobile()) return "system";

    // Desktop: check localStorage
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    return stored || "light";
  });

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
    getSystemTheme,
  );

  // Compute resolved theme using useMemo (no setState in effect)
  const resolvedTheme = useMemo(() => {
    if (theme === "system") return systemTheme;
    return theme;
  }, [theme, systemTheme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Listen for window resize (mobile detection)
  useEffect(() => {
    const handleResize = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);

      // If switching to mobile, force system theme
      if (mobile && theme !== "system") {
        setThemeState("system");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      // Mobile always uses system
      if (isMobile) return;

      setThemeState(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    },
    [isMobile],
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, isMobile }),
    [theme, resolvedTheme, setTheme, isMobile],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
