import { NextRequest, NextResponse } from "next/server";
import { zodResponseFormat } from "openai/helpers/zod";
import dayjs from "dayjs";

import { generatePrompt } from "@/config/prompt";
import { getTokensCount } from "@/config/credits";
import { bodySchema, SingleTweet, Thread } from "@/app/app/type/post.type";
import { openai } from "@/lib/openai";

export const maxDuration = 30;

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
    messages: [
      { role: "user", content: userPrompt }
    ],
    max_tokens: getTokensCount(chars, type == "thread", type == "thread" ? threadLength : 1),
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