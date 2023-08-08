import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/database";
import { z } from "zod";

export async function GET(): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const data = await prisma.user.findUnique({ where: { id: user.id }, select: {
      isPro: true,
      models: true,
      fpDone: true,
      fpTweets: true
    } });

    const schema = z.object({
      isPro: z.boolean(),
      fpDone: z.boolean(),
      fpTweets: z.array(z.object({
        id: z.string(),
        content: z.string(),
        userId: z.string()
      })).optional().nullable(),
      models: z.array(z.object({
        id: z.string(),
        createdAt: z.date(),
        userId: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        shareLink: z.string().nullable(),
        context: z.string(),
        sentiment: z.string(),
        style: z.string(),
        tone: z.string(),
        length: z.number()
      })).optional()
    }).safeParse(data);

    if (!schema.success) return NextResponse.json({ isPro: false, models: [], fpDone: false, fpTweets: [] });

    return NextResponse.json({
      isPro: schema.data?.isPro || false,
      models: schema.data.models || [],
      fpDone: schema.data?.fpDone || false,
      fpTweets: schema.data?.fpTweets || []
    });
  }

  return NextResponse.json({ isPro: false, models: [], fpDone: false, fpTweets: [] });
}