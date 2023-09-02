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
  return langs.find(l => l.value === lang)?.value || "Detect the langage";
};