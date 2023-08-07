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
      models: true
    } });

    console.log(data);

    const schema = z.object({
      isPro: z.boolean(),
      models: z.array(z.object({
        id: z.string(),
        createdAt: z.date(),
        userId: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        shareLink: z.string().nullable()
      })).optional()
    }).safeParse(data);

    console.log(schema);

    if (!schema.success) return NextResponse.json({ isPro: false, models: [] });
    return NextResponse.json({ isPro: data?.isPro || false, models: data?.models || [] });
  }

  return NextResponse.json({ isPro: false, models: [] });
}