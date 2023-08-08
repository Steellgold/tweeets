import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/database";
import { z } from "zod";

export async function PUT(): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const data = await prisma.user.update({
      where: { id: user.id },
      data: {
        fpDone: true
      }
    });

    const schema = z.object({
      fpDone: z.boolean()
    }).safeParse(data);

    if (!schema.success) return NextResponse.json({ fpDone: false });
    return NextResponse.json({ fpDone: true });
  }

  return NextResponse.json({ fpDone: true });
}