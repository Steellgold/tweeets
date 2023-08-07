import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/database";

export async function GET(): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const data = await prisma.user.findUnique({ where: { id: user.id } });
    return NextResponse.json({ isPro: data?.isPro || false });
  }

  return NextResponse.json({ isPro: false });
}