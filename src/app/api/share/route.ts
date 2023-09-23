import { prisma } from "@/lib/utils/database";
import type { Database } from "@/lib/utils/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

export const GET = async(request: NextRequest): Promise<NextResponse> => {
  const url = new URL(request.nextUrl);
  const model = url.searchParams.get("model");
  if (!model) return NextResponse.json({ data: null });

  const data = await prisma.tweets.findUnique({
    where: { sharedTemplateSlug: model, isShared: true },
    include: { user: true }
  });

  if (!data) return NextResponse.json({ data: null });

  return NextResponse.json({
    model: {
      tone: data.tone,
      style: data.style,
      emotion: data.emotion,
      target: data.target,
      lang: data.lang,
      gpt: data.gpt,
      tweetContext: data.context,
      by: {
        name: data.user.username,
        arobase: data.user.arobase,
        pictureUrl: data.user.pictureUrl
      }
    }
  });
};

export const POST = async(request: NextRequest): Promise<NextResponse> => {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null });

  const schema = z.object({
    userId: z.string(),
    id: z.string(),
    action: z.string().regex(/^(share|unshare)$/)
  }).safeParse(await request.json());

  if (!schema.success) {
    console.log(schema.error);
    return NextResponse.json({ data: null });
  }

  const slug = Math.random().toString(36).substring(7).toString();

  const res = await prisma.tweets.update({
    data: {
      isShared: schema.data.action === "share",
      sharedTemplateSlug: schema.data.action === "share" ? slug : null
    },
    where: {
      id: schema.data.id
    }
  });

  await prisma.$disconnect();

  return NextResponse.json({
    id: res.id,
    slug: res.sharedTemplateSlug,
    action: schema.data.action
  });
};