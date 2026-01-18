import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import vi from "./locales/vi.json";
import en from "./locales/en.json";

const LANGUAGE_STORAGE_KEY = "e-commerce-language";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
    },
    fallbackLng: "vi", // Default to Vietnamese
    lng: localStorage.getItem(LANGUAGE_STORAGE_KEY) || "vi",
    interpolation: {
      escapeValue: false, // React already handles XSS
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
  });

// Helper to change language and persist
export const changeLanguage = (lang: "vi" | "en") => {
  i18n.changeLanguage(lang);
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
};

export default i18n;
