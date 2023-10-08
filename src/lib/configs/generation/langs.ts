import type { Lang as DBLang } from "@prisma/client";

/* eslint-disable max-len */
export type Lang = "id" | "da" | "de" | "en-GB" | "en-US" | "es-ES" | "fr" | "hr" | "it" | "lt" | "hu" | "nl" | "no" | "pl" | "pt-BR" | "ro" | "fi" | "sv-SE" | "vi" | "tr" | "cs" | "el" | "bg" | "ru" | "uk" | "hi" | "th" | "zh-CN" | "ja" | "zh-TW" | "ko" | "ar";

type Langs= {
  key: Lang;
  value: string;
  nav: string[];
}

export const langs: Langs[] = [
  { key: "id", value: "Indonesian", nav: ["id", "in"] },
  { key: "da", value: "Danish", nav: ["da", "dk"] },
  { key: "de", value: "German", nav: ["de", "de-DE", "de-AT", "de-CH", "de-LU"] },
  { key: "en-GB", value: "English, UK", nav: ["en-GB", "en-UK"] },
  { key: "en-US", value: "English, US", nav: ["en-US", "en"] },
  { key: "es-ES", value: "Spanish", nav: ["es-ES", "es"] },
  { key: "fr", value: "French", nav: ["fr", "fr-FR", "fr-CA"] },
  { key: "hr", value: "Croatian", nav: ["hr", "hr-HR"] },
  { key: "it", value: "Italian", nav: ["it", "it-IT", "it-CH"] },
  { key: "lt", value: "Lithuanian", nav: ["lt", "lt-LT"] },
  { key: "hu", value: "Hungarian", nav: ["hu", "hu-HU"] },
  { key: "nl", value: "Dutch", nav: ["nl", "nl-NL", "nl-BE"] },
  { key: "no", value: "Norwegian", nav: ["no", "no-NO"] },
  { key: "pl", value: "Polish", nav: ["pl", "pl-PL"] },
  { key: "pt-BR", value: "Portuguese, Brazilian", nav: ["pt-BR", "pt"] },
  { key: "ro", value: "Romanian, Romania", nav: ["ro", "ro-RO"] },
  { key: "fi", value: "Finnish", nav: ["fi", "fi-FI"] },
  { key: "sv-SE", value: "Swedish", nav: ["sv-SE", "sv"] },
  { key: "vi", value: "Vietnamese", nav: ["vi", "vi-VN"] },
  { key: "tr", value: "Turkish", nav: ["tr", "tr-TR"] },
  { key: "cs", value: "Czech", nav: ["cs", "cs-CZ"] },
  { key: "el", value: "Greek", nav: ["el", "el-GR"] },
  { key: "bg", value: "Bulgarian", nav: ["bg", "bg-BG"] },
  { key: "ru", value: "Russian", nav: ["ru", "ru-RU"] },
  { key: "uk", value: "Ukrainian", nav: ["uk", "uk-UA"] },
  { key: "hi", value: "Hindi", nav: ["hi", "hi-IN"] },
  { key: "th", value: "Thai", nav: ["th", "th-TH"] },
  { key: "zh-CN", value: "Chinese, China", nav: ["zh-CN", "zh-Hans-CN", "zh"] },
  { key: "ja", value: "Japanese", nav: ["ja", "ja-JP"] },
  { key: "zh-TW", value: "Chinese, Taiwan", nav: ["zh-TW", "zh-Hant-TW"] },
  { key: "ko", value: "Korean", nav: ["ko", "ko-KR"] },
  { key: "ar", value: "Arabic", nav: ["ar", "ar-SA", "ar-AE", "ar-QA", "ar-KW"] }
];

export const isLanguageSupported = (languageCode: string): boolean => {
  return langs.some(l => l.nav.includes(languageCode));
};

export const getLangKeyByNav = (nav: string): Lang => {
  return langs.find((l: Langs) => l.nav.includes(nav))?.key || "en-US";
};

export const getLang = (lang: string): string => {
  return langs.find(l => l.key === lang)?.value || "Detect the langage";
};

export const stringToLang = (lang: string): DBLang => {
  switch (lang) {
    case "id":
      return "id";
    case "da":
      return "da";
    case "de":
      return "de";
    case "en-GB":
      return "en_GB";
    case "en-US":
      return "en_US";
    case "es-ES":
      return "es_ES";
    case "fr":
      return "fr";
    case "hr":
      return "hr";
    case "it":
      return "it";
    case "lt":
      return "lt";
    case "hu":
      return "hu";
    case "nl":
      return "nl";
    case "no":
      return "no";
    case "pl":
      return "pl";
    case "pt-BR":
      return "pt_BR";
    case "ro":
      return "ro";
    case "fi":
      return "fi";
    case "sv-SE":
      return "sv_SE";
    case "vi":
      return "vi";
    case "tr":
      return "tr";
    case "cs":
      return "cs";
    case "el":
      return "el";
    case "bg":
      return "bg";
    case "ru":
      return "ru";
    case "uk":
      return "uk";
    case "hi":
      return "hi";
    case "th":
      return "th";
    case "zh-CN":
      return "zh_CN";
    case "ja":
      return "ja";
    case "zh-TW":
      return "zh_TW";
    case "ko":
      return "ko";
    case "ar":
      return "ar";
    default:
      return "en_US";
  }
};

export const langToString = (lang: DBLang): Lang => {
  switch (lang) {
    case "id":
      return "id";
    case "da":
      return "da";
    case "de":
      return "de";
    case "en_GB":
      return "en-GB";
    case "en_US":
      return "en-US";
    case "es_ES":
      return "es-ES";
    case "fr":
      return "fr";
    case "hr":
      return "hr";
    case "it":
      return "it";
    case "lt":
      return "lt";
    case "hu":
      return "hu";
    case "nl":
      return "nl";
    case "no":
      return "no";
    case "pl":
      return "pl";
    case "pt_BR":
      return "pt-BR";
    case "ro":
      return "ro";
    case "fi":
      return "fi";
    case "sv_SE":
      return "sv-SE";
    case "vi":
      return "vi";
    case "tr":
      return "tr";
    case "cs":
      return "cs";
    case "el":
      return "el";
    case "bg":
      return "bg";
    case "ru":
      return "ru";
    case "uk":
      return "uk";
    case "hi":
      return "hi";
    case "th":
      return "th";
    case "zh_CN":
      return "zh-CN";
    case "ja":
      return "ja";
    case "zh_TW":
      return "zh-TW";
    case "ko":
      return "ko";
    case "ar":
      return "ar";
    default:
      return "en-US";
  }
};