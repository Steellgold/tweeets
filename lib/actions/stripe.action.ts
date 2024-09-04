"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { priceIdToCredits, stripe } from "@/config/stripe";

import { prisma } from "../prisma";

export const createCheckoutSessionAction = async(priceId: string): Promise<{
  isError?: boolean;
  message?: string;
}> => {
  const session = await auth();

  if (!session) return { isError: true, message: "You are not authenticated" };
  if (!session.user.email || !session.user.id) return { isError: true, message: "User email or ID is undefined" };

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer: session.user.stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    metadata: { userId: session.user.id, priceId },
    mode: "payment",
    success_url: `${process.env.URL ?? ""}/api/stripe?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.URL ?? ""}/api/stripe?session_id={CHECKOUT_SESSION_ID}`
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe session url is undefined");
  }

  await prisma.payments.create({
    data: {
      user: { connect: { id: session.user.id } },
      priceId,
      stripeCustomerId: session.user.stripeCustomerId,
      price: checkoutSession.amount_total! / 100,
      credits: priceIdToCredits(priceId),
      currency: checkoutSession.currency?.toString(),
      
      liveMode: checkoutSession.livemode,
      expiresAt: new Date(checkoutSession.expires_at! * 1000),

      checkoutSessionId: checkoutSession.id,
      checkoutSessionUrl: checkoutSession.url
    }
  });

  redirect(checkoutSession.url);
}