import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/database";
import { ModelResponseSchema } from "@/lib/utils/schemas";
import dayjs from "dayjs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const schema = ModelResponseSchema.safeParse(await request.json());
  if (!schema.success) return NextResponse.json(schema.error, { status: 400 });

  const { name, description, shareLink, sentiment, tone, style, context, gpt4, includeHashtags, hashtags, target } = schema.data;

  const model = await prisma.model.create({
    data: {
      name,
      description: description ?? "",
      shareLink: shareLink ?? "",
      createdAt: dayjs().toDate(),
      sentiment,
      tone,
      style,
      context,
      gpt4,
      includeHashtags,
      hashtags,
      target,
      user: { connect: { id: user.id } }
    }
  });

  return NextResponse.json(model, { status: 201 });
}