import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { ChatCompletionRequestMessage } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { getPrompt, openai } from "@/lib/utils/openai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/utils/database";

export async function POST(request: NextRequest): Promise<NextResponse | StreamingTextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const schema = z.object({
    tweetContext: z.string(),
    tweetSentiment: z.string().default("sentiment-neutral"),
    tweetTone: z.string().default("tone-normal"),
    tweetStyle: z.string().default("style-normal"),
    tweetTarget: z.string().default("target-all"),
    model: z.string().default("gpt-3.5-turbo-16k"),
    tweets: z.array(z.object({
      content: z.string()
    })).default([])
  }).safeParse(await request.json());

  if (!schema.success) return NextResponse.json({ error: schema.error }, { status: 400 });

  const userPrompt = await getPrompt(schema.data.tweets.length > 0 ? "userDefault" : "userWithoutTweets");
  const systemPrompt = await getPrompt("systemPrompt");

  const userFinalPrompt = userPrompt
    .replace("[TWEET_CONTEXT]", schema.data.tweetContext)
    .replace("[TWEET_SENTIMENT]", schema.data.tweetSentiment)
    .replace("[TWEET_TONE]", schema.data.tweetTone)
    .replace("[TWEET_STYLE]", schema.data.tweetStyle)
    .replace("[TWEET_PUBLIC]", schema.data.tweetTarget)
    .replace("[TWEET_EXAMPLES]", schema.data.tweets.map((tweet) => tweet.content).join("\n"));

  const messages: ChatCompletionRequestMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userFinalPrompt }
  ];

  let model = "gpt-3.5-turbo-16k";
  if (schema.data.model !== "gpt-3.5-turbo-16k") {
    const data = await prisma.user.findUnique({ where: { id: user.id }, select: { priority: true } });
    const schemaModel = z.object({ priority: z.boolean() }).safeParse(data);
    if (!schemaModel.success) return NextResponse.json({ error: schemaModel.error }, { status: 400 });

    if (schemaModel.data.priority) model = schema.data.model;
    else model = "gpt-3.5-turbo-16k";
  }

  const res = await openai.createChatCompletion({
    messages,
    model,
    stream: true,
    stop: ["#"],
    temperature: 0.2
  });

  const stream: ReadableStream<any> = OpenAIStream(res);
  return new StreamingTextResponse(stream);
}