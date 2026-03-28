export type AppLanguage = "vi" | "en";

export const normalizeAppLanguage = (
  language: string | null | undefined,
): AppLanguage => (language?.toLowerCase().startsWith("en") ? "en" : "vi");

export const getLanguageTag = (language: string | null | undefined) =>
  normalizeAppLanguage(language) === "en" ? "en-US" : "vi-VN";

export const formatCurrency = (
  value: number,
  language: string | null | undefined,
) =>
  new Intl.NumberFormat(getLanguageTag(language), {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export const formatNumber = (
  value: number,
  language: string | null | undefined,
) => new Intl.NumberFormat(getLanguageTag(language)).format(value);

export const formatDate = (
  value: string | number | Date,
  language: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
) =>
  new Intl.DateTimeFormat(getLanguageTag(language), options).format(
    new Date(value),
  );
