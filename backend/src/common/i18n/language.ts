export type AppLanguage = 'vi' | 'en';

const LANGUAGE_TAGS: Record<AppLanguage, string> = {
  vi: 'vi-VN',
  en: 'en-US',
};

const normalizeLanguageCode = (
  language: string | null | undefined,
): AppLanguage | null => {
  if (!language) {
    return null;
  }

  const normalized = language.toLowerCase();
  if (normalized.startsWith('en')) {
    return 'en';
  }

  if (normalized.startsWith('vi')) {
    return 'vi';
  }

  return null;
};

export const resolveAppLanguage = (
  acceptLanguage: string | string[] | null | undefined,
): AppLanguage => {
  if (Array.isArray(acceptLanguage)) {
    return resolveAppLanguage(acceptLanguage.join(','));
  }

  if (!acceptLanguage) {
    return 'vi';
  }

  const rankedLanguages = acceptLanguage
    .split(',')
    .map((part) => {
      const [rawCode, ...params] = part.trim().split(';');
      const qValue = params.find((param) => param.trim().startsWith('q='));
      const parsedWeight = qValue ? Number.parseFloat(qValue.split('=')[1]) : 1;

      return {
        code: rawCode,
        weight: Number.isFinite(parsedWeight) ? parsedWeight : 1,
      };
    })
    .sort((a, b) => b.weight - a.weight);

  for (const candidate of rankedLanguages) {
    const resolved = normalizeLanguageCode(candidate.code);
    if (resolved) {
      return resolved;
    }
  }

  return 'vi';
};

export const getLanguageTag = (language: AppLanguage) => LANGUAGE_TAGS[language];
