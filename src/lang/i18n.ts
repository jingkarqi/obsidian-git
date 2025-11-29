import zhCn from "./locales/zh-cn";

export type Locale = "en" | "zh-cn";
export type LanguageSetting = "system" | Locale;
export type TranslationValues = Record<string, string | number>;

const FALLBACK_LOCALE: Locale = "en";

const localeAliases: Record<string, Locale> = {
    en: "en",
    "en-us": "en",
    "en-gb": "en",
    "en-au": "en",
    "en-ca": "en",
    zh: "zh-cn",
    "zh-cn": "zh-cn",
    "zh-hans": "zh-cn",
    "zh-sg": "zh-cn",
};

const translations: Record<Locale, Record<string, string>> = {
    en: {},
    "zh-cn": zhCn,
};

let activeLocale: Locale = FALLBACK_LOCALE;

export function normalizeLocale(locale?: string | null): Locale {
    if (!locale) return FALLBACK_LOCALE;
    const normalized = locale.toLowerCase();
    return localeAliases[normalized] ?? FALLBACK_LOCALE;
}

export function resolveLocale(
    language: LanguageSetting,
    systemLocale?: string | null
): Locale {
    if (language === "system") {
        return normalizeLocale(systemLocale);
    }
    return normalizeLocale(language);
}

export function setLocale(
    language: LanguageSetting,
    systemLocale?: string | null
): Locale {
    activeLocale = resolveLocale(language, systemLocale);
    return activeLocale;
}

export function getLocale(): Locale {
    return activeLocale;
}

export function t(key: string, values?: TranslationValues): string {
    const template =
        translations[activeLocale][key] ??
        translations[FALLBACK_LOCALE][key] ??
        key;

    if (!values) return template;

    return template.replace(/\{(\w+)\}/g, (match, token) => {
        const replacement = values[token];
        if (replacement === undefined || replacement === null) return match;
        return String(replacement);
    });
}

export const LANGUAGE_OPTIONS = [
    { value: "system", label: "System default" },
    { value: "en", label: "English" },
    { value: "zh-cn", label: "简体中文" },
];
