import { createContext } from "react";

type Theme = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  isMobile: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
