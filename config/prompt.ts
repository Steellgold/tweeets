import { z } from "zod";

export const EnumLanguages = z.enum([
  "English",
  "French",
  "Spanish",
  "Italian",
  "Portuguese",
  "German",
  "Argentinian",
  "Australian",
  "Brazilian",
  "Arabic",
  "Japanese",
  "Ukrainian",
  "Korean",
  "Turkish",
]);

export type Language = z.infer<typeof EnumLanguages>;

type GeneratePromptOptions = {
  type: "singleTweet" | "thread";
  tone: "humoristic" | "serious" | "informative" | "normal";
  threadLength?: number;
  chars?: number;
  includeEmojis?: boolean;
  includeIndicators?: boolean;
  context: string;
  language: Language;
}

export const generatePrompt = ({
  type,
  tone = "normal",
  threadLength = 12,
  chars = 280,
  includeEmojis = false,
  includeIndicators = false,
  language = "English",
  context,
}: GeneratePromptOptions): string => {
  const maxChars = chars + 15;

  const A = type === "thread" ? "a Twitter thread" : "a single tweet";
  const B = type === "thread" ? `of ${threadLength} tweets` : "tweet";
  const C = type === "thread" ? "Each tweets" : "The tweet";
  const D = type === "thread" ? "each tweet" : "the tweet";
  const E = tone === "informative"
              ? "informative"
                : tone === "serious"
                  ? "serious"
                    : tone === "humoristic"
                      ? "humoristic"
                        : "conversational"; 

  const basePrompt = `Generate ${A} ${B} about "${context}". ${C} must be between ${chars} and ${maxChars} characters long. Ensure ${D} is detailed, engaging, and ${E} tone.`;
  
  const indicatorText = includeIndicators && type === "thread"
  ? " Include numbering or tweet indicators like '1/12', '2/12', etc."
  : " Do not include any numbering or tweet indicators like '1/12', '2/12', etc.";
  
  const emojiText = includeEmojis ? " Feel free to use emojis to enhance the content." : "Do not include emojis in the content.";

  const charsLimit = " Make sure that each tweet strictly adheres to the character limits.";
  
  const noHashtags = " Do not include any hashtags in the content.";

  const langText = `The content should be in ${language}.`;

  console.log(type, tone, threadLength, chars, includeEmojis, includeIndicators, context, langText);

  return `${basePrompt}${indicatorText}${emojiText}${charsLimit}${noHashtags}${langText}`;
};
