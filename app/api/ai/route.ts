import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { generatePrompt } from "@/config/prompt";

const openai = new OpenAI();

const Tweet = z.object({
  id: z.number(),
  text: z.string(),
});

const Thread = z.object({
  tweets: z.array(Tweet),
});

const SingleTweet = z.object({
  text: z.string()
});

export const bodySchema = z.object({
  "type": z.enum(["singleTweet", "thread"]),
  "min-chars": z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : undefined),
    z.number().min(1)
  ),
  "include-emojis": z.boolean(),
  "include-indicators": z.boolean(),
  "context": z.string().min(1),
  "tone": z.enum(["humoristic", "serious", "informative", "normal"]),
  "thread-length": z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : undefined),
    z.number().min(1).max(12).optional()
  ),
});

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const body = await req.json();
  const parsedBody = bodySchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const {
    "type": type,
    "min-chars": minChars,
    "include-emojis": includeEmojis,
    "include-indicators": includeIndicators,
    "context": context,
    "tone": tone,
    "thread-length": threadLength,
  } = parsedBody.data;

  const userPrompt = generatePrompt({
    type,
    tone,
    threadLength,
    minChars,
    includeEmojis,
    includeIndicators,
    context
  });

  let responseSchema;

  if (type === "thread") responseSchema = Thread;
  else responseSchema = SingleTweet;
  
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: userPrompt }],
    max_tokens: 1300,
    response_format: zodResponseFormat(responseSchema, type === "thread" ? "tweets" : "text"),
  });

  const event = completion.choices[0].message.parsed;

  return NextResponse.json(event);
};