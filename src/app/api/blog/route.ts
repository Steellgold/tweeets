import { prisma } from "@/lib/utils/database";
import type { Database } from "@/lib/utils/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async(req: NextRequest): Promise<NextResponse> => {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const url = new URL(req.nextUrl);
  const slug = url.searchParams.get("slug");
  const eai = url.searchParams.get("eai");

  const include = {
    include: {
      author: {
        include: {
          posts: false
        }
      },
      tags: true,
      categories: true,
      comments: { include: { author: { include: { posts: false } } } },
      variants: true
    }
  };

  if (slug) {
    console.log(eai);
    if (!eai) await prisma.posts.update({ where: { slug }, data: { views: { increment: 1 } } });
    const post = await prisma.posts.findFirst({ ...include,  where: { slug } });
    if (!post) return NextResponse.json({ status: 404 });

    const { data: { user } } = await supabase.auth.getUser();
    if (!post.isPublic && !user) return NextResponse.json({ ...post, content: null, comments: null, variants: null });

    await prisma.$disconnect();
    return NextResponse.json(post);
  }

  const postByPinned = await prisma.posts.findMany({ ...include, orderBy: { createdAt: "desc" } });

  await prisma.$disconnect();
  return NextResponse.json(postByPinned.sort((a, b) => Number(b.isPinned ? 1 : 0) - Number(a.isPinned ? 1 : 0)));
};