import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { StreamingTextResponse } from "ai";
import { OpenAIStream } from "ai";
import type { Database } from "@/lib/utils/supabase";
import { z } from "zod";
import { getPrompt, openai } from "@/lib/utils/openai";
import type { ChatCompletionRequestMessage } from "openai-edge";
import { getLang } from "@/lib/configs/generation/langs";
import { prisma } from "@/lib/utils/database";

export const POST = async(request: NextRequest): Promise<NextResponse | StreamingTextResponse> => {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null });

  const schema = z.object({
    tw: z.object({
      // eslint-disable-next-line max-len
      emotion: z.string().regex(/^(emotion-default|emotion-enthusiasm|emotion-melancholy|emotion-joy|emotion-anxiety|emotion-confidence|emotion-wonder|emotion-anger|emotion-compassion|emotion-exhaustion|emotion-critical-thinking)$/),
      // eslint-disable-next-line max-len
      style: z.string().regex(/^(style-default|style-informative|style-poetic|style-humorous|style-formal|style-persuasive|style-descriptive|style-scientific|style-narrative|style-educational)$/),
      // eslint-disable-next-line max-len
      tone: z.string().regex(/^(tone-default|tone-optimistic|tone-ironic|tone-authoritative|tone-emphatic|tone-detached|tone-satirical|tone-reflective|tone-intimate|tone-engaged|tone-positive)$/),
      // eslint-disable-next-line max-len
      target: z.string().regex(/^(target-all|target-enterprises|target-professionals|target-particulars|target-entrepreneurs|target-students|target-children|target-teenagers|target-adults|target-seniors|target-parents)$/),
      tweetContext: z.string(),
      // eslint-disable-next-line max-len
      lang: z.string().regex(/^(id|da|de|en-GB|en-US|es-ES|fr|hr|it|lt|hu|nl|no|pl|pt-BR|ro|fi|sv-SE|vi|tr|cs|el|bg|ru|uk|hi|th|zh-CN|ja|zh-TW|ko|ar)$/),
      gpt: z.number().min(3).max(4)
    })
  }).safeParse(await request.json());

  if (!schema.success) {
    console.log(schema.error);
    return NextResponse.json({ data: null });
  }

  const systemPrompt = await getPrompt("system");
  const userPrompt = await getPrompt("user");
  const userFinalPrompt = userPrompt
    .replace("[emotion]", schema.data.tw.emotion)
    .replace("[style]", schema.data.tw.style)
    .replace("[tone]", schema.data.tw.tone)
    .replace("[target]", schema.data.tw.target)
    .replace("[language]", getLang(schema.data.tw.lang))
    .replace("[context]", schema.data.tw.tweetContext);

  const messages: ChatCompletionRequestMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userFinalPrompt }
  ];

  await prisma.user.update({
    data: { credits: { decrement: 1 } },
    where: { id: user.id }
  });

  const res = await openai.createChatCompletion({
    messages,
    model: schema.data.tw.gpt === 4 ? "gpt-4" : "gpt-3.5-turbo",
    stream: true,
    stop: ["#"],
    temperature: 0.2
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream: ReadableStream<any> = OpenAIStream(res);
  return new StreamingTextResponse(stream);
};