/* eslint-disable camelcase */
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/database";
import { cookies } from "next/headers";
import { z } from "zod";

export const dynamic = "force-dynamic";

export const GET = async(request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const resp = await supabase.auth.exchangeCodeForSession(code);

    const existingUser = await prisma.user.findUnique({ where: { id: resp.data.user?.id } });
    if (existingUser) return NextResponse.redirect(requestUrl.origin);

    const schema = z.object({
      avatar_url: z.string(),
      email: z.string(),
      email_verified: z.boolean(),
      full_name: z.string(),
      iss: z.string(),
      name: z.string(),
      picture: z.string(),
      preferred_username: z.string(),
      provider_id: z.string(),
      sub: z.string(),
      user_name: z.string()
    }).safeParse(resp.data.user?.user_metadata);

    await prisma.user.create({
      data: {
        id: resp.data.user?.id || Math.random().toString(36).substring(7).toString(),
        email: resp.data.user?.email || "",
        credits: 5,
        username: schema.success ? schema.data.full_name : (resp.data.user?.email || ""),
        arobase: schema.success ? schema.data.preferred_username : (resp.data.user?.email || "anonymious@supabase.best").split("@")[0],
        pictureUrl: schema.success ? schema.data.picture : "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
      }
    });

    await prisma.$disconnect();
  }

  return NextResponse.redirect(requestUrl.origin);
};