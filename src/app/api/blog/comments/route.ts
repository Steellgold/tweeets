import { prisma } from "@/lib/utils/database";
import type { Database } from "@/lib/utils/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

export const POST = async(req: NextRequest): Promise<NextResponse> => {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const schema = z.object({
    content: z.string().nonempty(),
    postID: z.string().nonempty()
  }).safeParse(await req.json());

  if (!schema.success) return NextResponse.json({ error: schema.error }, { status: 400 });
  const { content, postID } = schema.data;

  const comment = await prisma.comments.findFirst({ where: { postId: postID, authorId: user.id } });
  if (comment) return NextResponse.json({ error: "You have already commented on this post" }, { status: 400 });

  return NextResponse.json(await prisma.comments.create({
    data: {
      content,
      post: { connect: { id: postID } },
      author: { connect: { id: user.id } }
    }
  }), { status: 200 });
};