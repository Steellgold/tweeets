import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/database";

export const GET = async(): Promise<NextResponse> => {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const payments = await prisma.payments.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ payments });
};