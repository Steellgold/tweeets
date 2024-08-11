interface GeneratePromptOptions {
  type: "singleTweet" | "thread";
  tone: "humoristic" | "serious" | "informative" | "normal";
  threadLength?: number;
  minChars?: number;
  includeEmojis?: boolean;
  includeIndicators?: boolean;
  context: string;
}

export const generatePrompt = ({
  type,
  tone = "normal",
  threadLength = 12,
  minChars = 280,
  includeEmojis = false,
  includeIndicators = false,
  context,
}: GeneratePromptOptions): string => {
  const maxChars = minChars + 15;

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

  const basePrompt = `Generate ${A} ${B} about "${context}". ${C} must be between ${minChars} and ${maxChars} characters long. Ensure ${D} is detailed, engaging, and ${E} tone.`;
  
  const indicatorText = includeIndicators && type === "thread"
  ? " Include numbering or tweet indicators like '1/12', '2/12', etc."
  : " Do not include any numbering or tweet indicators like '1/12', '2/12', etc.";
  
  const emojiText = includeEmojis ? " Feel free to use emojis to enhance the content." : "Do not include emojis in the content.";

  const charsLimit = " Make sure that each tweet strictly adheres to the character limits.";
  
  const noHashtags = " Do not include any hashtags in the content.";

  console.log(type, tone, threadLength, minChars, includeEmojis, includeIndicators, context);

  return `${basePrompt}${indicatorText}${emojiText}${charsLimit}${noHashtags}`;
};
