import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Database } from "@/lib/utils/supabase";
import { prisma } from "@/lib/utils/database";

export const GET = async(): Promise<NextResponse> => {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null });

  const data = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, credits: true, saveTweets: true, tweets: true }
  });

  return NextResponse.json(data);
};