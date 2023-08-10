import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/database";
import { z } from "zod";
import { ModelResponseSchema, TweetResponseSchema } from "@/lib/utils/schemas";
import { checkSubscriptionStatus } from "@/lib/utils/stripe";

export async function GET(): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const data = await prisma.user.findUnique({ where: { id: user.id }, select: {
      isPro: true,
      usage: true,
      models: true,
      fpDone: true,
      fpTweets: true,
      priority: true,
      tweets: true
    } });

    const schema = z.object({
      isPro: z.boolean(),
      fpDone: z.boolean(),
      priority: z.boolean(),
      usage: z.number().default(0),
      fpTweets: z.array(z.object({
        id: z.string(),
        content: z.string(),
        userId: z.string()
      })).optional().nullable(),
      models: z.array(ModelResponseSchema).optional(),
      tweets: z.array(TweetResponseSchema).optional()
    }).safeParse(data);

    if (!schema.success) {
      return NextResponse.json({ isPro: false, priority: false, models: [], fpDone: false, fpTweets: [], tweets: [], usage: 0 });
    }

    if (schema.data.isPro) {
      const subscriptionId = await prisma.subscription.findUnique({ where: { userId: user.id } }).then(sub => sub?.id);
      if (subscriptionId && !(await checkSubscriptionStatus(subscriptionId))) {
        await prisma.user.update({ where: { id: user.id }, data: { isPro: false, priority: false } });
        return NextResponse.json({
          isPro: false,
          priority: false,
          models: schema.data.models || [],
          tweets: schema.data.tweets || [],
          fpDone: schema.data?.fpDone || true,
          fpTweets: schema.data?.fpTweets || [],
          usage: schema.data?.usage || 0
        });
      }
    }

    return NextResponse.json({
      isPro: schema.data?.isPro || false,
      priority: schema.data?.priority || false,
      models: schema.data.models || [],
      tweets: schema.data.tweets || [],
      fpDone: schema.data?.fpDone || true,
      fpTweets: schema.data?.fpTweets || [],
      usage: schema.data?.usage || 0
    });
  }

  return NextResponse.json({ isPro: false, priority: false, models: [], tweets: [], fpDone: false, fpTweets: [] });
}