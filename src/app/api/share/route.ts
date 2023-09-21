import { prisma } from "@/lib/utils/database";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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