/* eslint-disable camelcase */
import { prisma } from "@/lib/utils/database";
import { stripe } from "@/lib/utils/stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(process.env.NEXT_PUBLIC_URL || "https://tweeets.app/");

  const requestUrl = new URL(request.url);
  const mode = requestUrl.searchParams.get("mode");
  const priceId = mode === "monthly" ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY : process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY;

  const data = await prisma.subscription.findUnique({ where: { userId: user.id } });
  if (data) return NextResponse.redirect(process.env.NEXT_PUBLIC_URL || "https://tweeets.app/");

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items: [{ price: priceId || "", quantity: 1 }],
    mode: "subscription",
    allow_promotion_codes: true,
    metadata: { userId: user.id, plan: mode },
    success_url: (process.env.NEXT_PUBLIC_URL || "https://tweeets.app") + "/auth/payment?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: process.env.NEXT_PUBLIC_URL
  });

  if (!session.url) return NextResponse.redirect(process.env.NEXT_PUBLIC_URL || "https://tweeets.app/");
  return NextResponse.json({ url: session.url }, { status: 303 });
}