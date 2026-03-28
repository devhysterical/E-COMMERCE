import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import vi from "./locales/vi.json";
import en from "./locales/en.json";
import { normalizeAppLanguage, type AppLanguage } from "./utils/language";

const LANGUAGE_STORAGE_KEY = "e-commerce-language";
const getStoredLanguage = () => {
  if (typeof window === "undefined") return undefined;
  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return storedLanguage ? normalizeAppLanguage(storedLanguage) : undefined;
};

const syncDocumentLanguage = (language: string | null | undefined) => {
  if (typeof document === "undefined") return;
  const nextLanguage = normalizeAppLanguage(language);
  document.documentElement.lang = nextLanguage;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
    },
    fallbackLng: "vi",
    supportedLngs: ["vi", "en"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    cleanCode: true,
    lng: getStoredLanguage(),
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
  });

syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language);
i18n.on("languageChanged", (language) => {
  syncDocumentLanguage(language);
});

// Helper to change language and persist
export const changeLanguage = (lang: AppLanguage) => {
  const nextLanguage = normalizeAppLanguage(lang);
  void i18n.changeLanguage(nextLanguage);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }
};

export default i18n;
