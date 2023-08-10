/* eslint-disable camelcase */
import { prisma } from "@/lib/utils/database";
import { stripe } from "@/lib/utils/stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(process.env.NEXT_PUBLIC_URL || "https://tweeets.app/");

  const data = await prisma.subscription.findUnique({ where: { userId: user.id } });
  if (!data) return NextResponse.redirect(process.env.NEXT_PUBLIC_URL || "https://tweeets.app/");

  const session = await stripe.billingPortal.sessions.create({
    customer: data.cusId,
    return_url: `${process.env.NEXT_PUBLIC_URL || "https://tweeets.app/"}`
  });

  if (!session.url) return NextResponse.redirect(process.env.NEXT_PUBLIC_URL || "https://tweeets.app/");
  return NextResponse.json({ url: session.url }, { status: 200 });
}