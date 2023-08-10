import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/database";
import { TweetResponseSchema } from "@/lib/utils/schemas";
import dayjs from "dayjs";
import { z } from "zod";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const schema = TweetResponseSchema.safeParse(await request.json());
  if (!schema.success) return NextResponse.json(schema.error, { status: 400 });

  const { sentiment, tone, style, context, gpt4, includeHashtags, hashtags, target, result, lang } = schema.data;

  const model = await prisma.tweet.create({
    data: {
      createdAt: dayjs().toDate().toDateString(),
      sentiment,
      tone,
      style,
      context,
      gpt4,
      includeHashtags,
      hashtags,
      target,
      lang,
      result,
      user: { connect: { id: user.id } }
    }
  });

  return NextResponse.json(model, { status: 201 });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const schema = z.object({
    id: z.string()
  }).safeParse(await request.json());

  if (!schema.success) return NextResponse.json(schema.error, { status: 400 });

  const model = await prisma.tweet.delete({
    where: { id: schema.data.id }
  });

  return NextResponse.json(model, { status: 200 });
}