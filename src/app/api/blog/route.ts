import { prisma } from "@/lib/utils/database";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const GET = async(req: NextRequest): Promise<NextResponse> => {
  const url = new URL(req.nextUrl);
  const slug = url.searchParams.get("slug");

  const include = {
    include: {
      author: {
        include: {
          posts: false
        }
      },
      tags: true,
      categories: true,
      comments: true,
      variants: true
    }
  };

  if (slug) {
    return NextResponse.json(await prisma.posts.findFirst({
      ...include,
      where: { slug }
    }));
  }

  return NextResponse.json(await prisma.posts.findMany({
    ...include,
    orderBy: {
      createdAt: "desc"
    }
  }));
};