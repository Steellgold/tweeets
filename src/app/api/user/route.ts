import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/database";
import { z } from "zod";
import { ModelResponseSchema } from "@/lib/utils/schemas";

export async function GET(): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const data = await prisma.user.findUnique({ where: { id: user.id }, select: {
      isPro: true,
      models: true,
      fpDone: true,
      fpTweets: true,
      priority: true
    } });

    const schema = z.object({
      isPro: z.boolean(),
      fpDone: z.boolean(),
      priority: z.boolean(),
      fpTweets: z.array(z.object({
        id: z.string(),
        content: z.string(),
        userId: z.string()
      })).optional().nullable(),
      models: z.array(ModelResponseSchema).optional()
    }).safeParse(data);

    if (!schema.success) {
      return NextResponse.json({ isPro: false, priority: false, models: [], fpDone: false, fpTweets: [] });
    }

    return NextResponse.json({
      isPro: schema.data?.isPro || false,
      priority: schema.data?.priority || false,
      models: schema.data.models || [],
      fpDone: schema.data?.fpDone || true,
      fpTweets: schema.data?.fpTweets || []
    });
  }

  return NextResponse.json({ isPro: false, priority: false, models: [], fpDone: false, fpTweets: [] });
}