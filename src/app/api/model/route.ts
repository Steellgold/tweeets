import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/database";
import { ModelResponseSchema } from "@/lib/utils/schemas";
import dayjs from "dayjs";
import { z } from "zod";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const schema = ModelResponseSchema.safeParse(await request.json());
  if (!schema.success) return NextResponse.json(schema.error, { status: 400 });

  const { name, description, shareLink, sentiment, tone, style, context, gpt4, includeHashtags, hashtags, target, lang } = schema.data;

  const model = await prisma.model.create({
    data: {
      name,
      description: description ?? "",
      shareLink: shareLink ?? null,
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
      user: { connect: { id: user.id } }
    }
  });

  return NextResponse.json(model, { status: 201 });
}

// GET ROUTE - SHARE LINK.
// https://tweeets.app/share?={shareLink}
export async function GET(request: NextRequest): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const url = new URL(request.nextUrl);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.json({}, { status: 400 });

  const model = await prisma.model.findUnique({
    where: { shareLink: code },
    include: { user: false }
  });

  return NextResponse.json(model, { status: 200 });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const schema = z.object({
    id: z.string()
  }).safeParse(await request.json());

  if (!schema.success) return NextResponse.json(schema.error, { status: 400 });

  const model = await prisma.model.findUnique({
    where: { id: schema.data.id },
    include: { user: false }
  });

  if (!model) return NextResponse.json({}, { status: 404 });
  if (model.userId !== user.id) return NextResponse.json({}, { status: 401 });
  await prisma.model.delete({ where: { id: model.id } });
  return NextResponse.json({}, { status: 204 });
}