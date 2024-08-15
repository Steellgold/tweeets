"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { stripe } from "@/config/stripe";

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

  redirect(checkoutSession.url);
}