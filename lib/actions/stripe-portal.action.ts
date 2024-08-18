"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { stripe } from "@/config/stripe";

export const stripePortalAction = async () => {
  const data = await auth();

  if (!data) return;
  if (!data.user.stripeCustomerId) return `${process.env.URL}/app`;

  const session = await stripe.billingPortal.sessions.create({
    customer: data.user.stripeCustomerId,
    return_url: `${process.env.URL}/app`,
  });

  if (!session.url) return;
  redirect(session.url);
};