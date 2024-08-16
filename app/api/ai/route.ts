import { NextResponse } from "next/server";
import { zodResponseFormat } from "openai/helpers/zod";
import dayjs from "dayjs";

import { generatePrompt } from "@/config/prompt";
import { getTokensCount } from "@/config/credits";
import { bodySchema, SingleTweet, Thread } from "@/app/app/type/post.type";
import { openai } from "@/lib/openai";

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export const GET = async (req: Request): Promise<NextResponse> => {
  const time1 = dayjs().format("YYYY-MM-DD HH:mm:ss:sss");

  const headers = req.headers;

  const data = {
    type: headers.get("x-data-type") || "",
    chars: parseInt(headers.get("x-data-chars") || "0"),
    "include-emojis": headers.get("x-data-include-emojis") === "true",
    "include-indicators": headers.get("x-data-include-indicators") === "true",
    context: headers.get("x-data-context") || "",
    tone: headers.get("x-data-tone") || "",
    threadLength: parseInt(headers.get("x-data-thread-length") || "1"),
    language: headers.get("x-data-language") || "en",
  };

  const parsedBody = bodySchema.safeParse(data);

  console.log(parsedBody);

  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (apiKey !== process.env.AIG) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const {
    chars,
    "include-emojis": includeEmojis,
    "include-indicators": includeIndicators,
    "thread-length": threadLength,
    context,
    tone,
    type,
    language,
  } = parsedBody.data;

  console.log(1);

  const userPrompt = generatePrompt({
    type,
    tone,
    threadLength,
    chars,
    includeEmojis,
    includeIndicators,
    context,
    language,
  });

  let responseSchema;

  if (type === "thread") responseSchema = Thread;
  else responseSchema = SingleTweet;

  console.log(2, userPrompt);

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: userPrompt }
    ],
    max_tokens: getTokensCount(chars, type === "thread", type === "thread" ? threadLength : 1),
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
