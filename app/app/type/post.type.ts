import { z } from "zod";

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