import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import dayjs from "dayjs";

import { EnumLanguages, generatePrompt } from "@/config/prompt";

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
  "chars": z.preprocess(
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
  language: EnumLanguages,
});

export const responseSchema = z.object({
  event: z.union([SingleTweet, Thread]),
  in: z.number(),
});

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const time1 = dayjs().format("YYYY-MM-DD HH:mm:ss:sss");

  const body = await req.json();
  const parsedBody = bodySchema.safeParse(body);

  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (apiKey !== process.env.AIG) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const {
    "type": type,
    "chars": chars,
    "include-emojis": includeEmojis,
    "include-indicators": includeIndicators,
    "context": context,
    "tone": tone,
    "thread-length": threadLength,
    language,
  } = parsedBody.data;

  const userPrompt = generatePrompt({
    type,
    tone,
    threadLength,
    chars,
    includeEmojis,
    includeIndicators,
    context,
    language
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
  const time2 = dayjs().format("YYYY-MM-DD HH:mm:ss:sss");

  const timeDiff = dayjs(time2).diff(time1, "millisecond", true);
  const seconds = Math.floor(timeDiff / 1000);
  const milliseconds = (timeDiff % 1000).toString().padStart(3, '0').slice(0, 2);
  
  return NextResponse.json({
    event,
    in: parseFloat(`${seconds}.${milliseconds}`),
  });
};