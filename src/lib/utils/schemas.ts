import { z } from "zod";
import type { Model } from "./types";

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
  length: z.number()
});

export const buildJsonModelString = (model: Model): string => {
  return JSON.stringify({
    name: model.name,
    description: model.description ?? null,
    sentiment: model.sentiment,
    style: model.style,
    tone: model.tone,
    context: model.context,
    length: model.length
  });
};

export const UserResponseSchema = z.object({
  isPro: z.boolean(),
  fpDone: z.boolean(),
  models: z.array(z.object({
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
    length: z.number()
  })).optional()
});