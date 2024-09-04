import { z } from "zod";

import { EnumLanguages } from "@/config/prompt";

export const Tweet = z.object({
  id: z.number(),
  text: z.string(),
});
export const Thread = z.object({
  tweets: z.array(Tweet),
});

export const SingleTweet = z.object({
  text: z.string()
});
export const responseSchema = z.object({
  event: z.union([SingleTweet, Thread]),
  in: z.number(),
});

export const responseSingleTweet = z.object({
  event: SingleTweet,
  in: z.number(),
});

export const responseThread = z.object({
  event: Thread,
  in: z.number(),
});

export const bodySchema = z.object({
  type: z.enum(["singleTweet", "thread"]),
  chars: z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : undefined),
    z.number().min(1)
  ),
  includeEmojis: z.boolean(),
  includeIndicators: z.boolean(),
  context: z.string().min(1),
  tone: z.enum(["humoristic", "serious", "informative", "normal"]),
  threadLength: z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : undefined),
    z.number().min(1).max(12).optional()
  ),
  language: EnumLanguages,
});