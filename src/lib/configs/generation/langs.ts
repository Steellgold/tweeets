import type { Lang as DBLang } from "@prisma/client";

/* eslint-disable max-len */
export type Lang = "id" | "da" | "de" | "en-GB" | "en-US" | "es-ES" | "fr" | "hr" | "it" | "lt" | "hu" | "nl" | "no" | "pl" | "pt-BR" | "ro" | "fi" | "sv-SE" | "vi" | "tr" | "cs" | "el" | "bg" | "ru" | "uk" | "hi" | "th" | "zh-CN" | "ja" | "zh-TW" | "ko" | "ar";

export const langs = [
  { key: "id", value: "Indonesian" },
  { key: "da", value: "Danish" },
  { key: "de", value: "German" },
  { key: "en-GB", value: "English, UK" },
  { key: "en-US", value: "English, US" },
  { key: "es-ES", value: "Spanish" },
  { key: "fr", value: "French" },
  { key: "hr", value: "Croatian" },
  { key: "it", value: "Italian" },
  { key: "lt", value: "Lithuanian" },
  { key: "hu", value: "Hungarian" },
  { key: "nl", value: "Dutch" },
  { key: "no", value: "Norwegian" },
  { key: "pl", value: "Polish" },
  { key: "pt-BR", value: "Portuguese, Brazilian" },
  { key: "ro", value: "Romanian, Romania" },
  { key: "fi", value: "Finnish" },
  { key: "sv-SE", value: "Swedish" },
  { key: "vi", value: "Vietnamese" },
  { key: "tr", value: "Turkish" },
  { key: "cs", value: "Czech" },
  { key: "el", value: "Greek" },
  { key: "bg", value: "Bulgarian" },
  { key: "ru", value: "Russian" },
  { key: "uk", value: "Ukrainian" },
  { key: "hi", value: "Hindi" },
  { key: "th", value: "Thai" },
  { key: "zh-CN", value: "Chinese, China" },
  { key: "ja", value: "Japanese" },
  { key: "zh-TW", value: "Chinese, Taiwan" },
  { key: "ko", value: "Korean" },
  { key: "ar", value: "Arabic" }
];

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

export const langToString = (lang: DBLang): string => {
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