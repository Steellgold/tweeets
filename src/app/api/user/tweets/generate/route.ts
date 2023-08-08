// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import type { ChatCompletionRequestMessage } from "openai-edge";
// import { OpenAIStream, StreamingTextResponse } from "ai";
// import { getPrompt } from "@/lib/utils/openai";
// import { prisma } from "@/lib/utils/database";
import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { z } from "zod";

export function POST(): NextResponse {
  // const supabase = createRouteHandlerClient({ cookies });
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) return NextResponse.json({}, { status: 401 });

  return NextResponse.json({ data: {
    "Not ready yet": "Sorry, this feature is not ready yet. Please check back later."
  } }, { status: 200 });

  // const schema = z.object({
  //   tweetsCount: z.number().default(1),
  //   tweetContext: z.string(),
  //   tweetChars: z.number().default(280),
  //   tweetSentiment: z.string().default("sentiment-neutral"),
  //   tweetTone: z.string().default("tone-normal"),
  //   tweetStyle: z.string().default("style-normal"),
  //   tweetTarget: z.string().default("target-all"),
  //   tweetLang: z.string().default("Detect language"),
  //   tweets: z.array(z.object({
  //     content: z.string()
  //   })).default([])
  // }).safeParse(await request.json());

  // if (!schema.success) return NextResponse.json({ error: schema.error }, { status: 400 });

  // const userPrompt = await getPrompt(schema.data.tweets.length > 0 ? "userDefault" : "userWithoutTweets");

  // return NextResponse.json({ data: schema.data }, { status: 200 });
}