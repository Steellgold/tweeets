import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Database } from "@/lib/utils/supabase";
import { z } from "zod";
import { stringToLang } from "@/lib/configs/generation/langs";
import { prisma } from "@/lib/utils/database";
import { stringToEmotion, stringToStyle, stringToTarget, stringToTone } from "@/lib/configs/generation/types";

export const POST = async(request: NextRequest): Promise<NextResponse> => {
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
    }),
    tweet: z.string()
  }).safeParse(await request.json());

  if (!schema.success) {
    console.log(schema.error);
    return NextResponse.json({ data: null });
  }

  const res = await prisma.tweets.create({
    data: {
      context: schema.data.tw.tweetContext,
      generated: schema.data.tweet,
      emotion: stringToEmotion(schema.data.tw.emotion),
      style: stringToStyle(schema.data.tw.style),
      tone: stringToTone(schema.data.tw.tone),
      target: stringToTarget(schema.data.tw.target),
      lang: stringToLang(schema.data.tw.lang),
      gpt: schema.data.tw.gpt,
      user: {
        connect: {
          id: user.id
        }
      }
    }
  });

  return NextResponse.json({ tweet: res });
};