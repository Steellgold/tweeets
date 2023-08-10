import { z } from "zod";
import type { Model, Tweet } from "./types";

export const ModelResponseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  shareLink: z.string().nullable(),
  sentiment: z.string(),
  style: z.string(),
  tone: z.string(),
  context: z.string(),
  gpt4: z.boolean(),
  includeHashtags: z.boolean(),
  hashtags: z.array(z.string()),
  target: z.string(),
  lang: z.string()
});

export const TweetResponseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  userId: z.string(),
  sentiment: z.string(),
  style: z.string(),
  tone: z.string(),
  context: z.string(),
  gpt4: z.boolean(),
  includeHashtags: z.boolean(),
  hashtags: z.array(z.string()),
  target: z.string(),
  lang: z.string(),
  result: z.string()
});

export const ModelShareResponseSchema = z.object({
  id: z.string(),
  shareLink: z.string()
});

export const ModelShareInputSchema = z.object({
  modelId: z.string(),
  link: z.string()
});

export const buildJsonModelString = (model: Model): string => {
  return JSON.stringify({
    id: model.id,
    createdAt: model.createdAt,
    userId: model.userId,
    name: model.name,
    description: model.description,
    shareLink: model.shareLink,
    sentiment: model.sentiment,
    style: model.style,
    tone: model.tone,
    context: model.context,
    gpt4: model.gpt4,
    includeHashtags: model.includeHashtags,
    hashtags: model.hashtags,
    target: model.target,
    lang: model.lang
  });
};

export const buildJsonTweetString = (model: Tweet): string => {
  return JSON.stringify({
    id: model.id,
    createdAt: model.createdAt,
    userId: model.userId,
    sentiment: model.sentiment,
    style: model.style,
    tone: model.tone,
    context: model.context,
    gpt4: model.gpt4,
    includeHashtags: model.includeHashtags,
    hashtags: model.hashtags,
    target: model.target,
    lang: model.lang,
    result: model.result
  });
};

export const UserResponseSchema = z.object({
  isPro: z.boolean(),
  fpDone: z.boolean(),
  priority: z.boolean(),
  usage: z.number().default(0),
  models: z.array(ModelResponseSchema).optional(),
  tweets: z.array(TweetResponseSchema).optional()
});

export const UserNBResponseSchema = z.object({
  isPro: z.boolean()
});