/* eslint-disable camelcase */
import Stripe from "stripe";
import { prisma } from "./database";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16"
});

export const priceIdByType: Record<"50" | "100" | "300", {
  "prod": string;
  "dev": string;
}> = {
  50: {
    "dev": "price_1NmJhdEEDyBTUKxwRNIYh5rw",
    "prod": "price_1NsSN2EEDyBTUKxwSBUrqwLL"
  },
  100: {
    "dev": "price_1NmJhdEEDyBTUKxw2Sj4FYe1",
    "prod": "price_1NsSN2EEDyBTUKxwJGNbBqui"
  },
  300: {
    "dev": "price_1NsPwgEEDyBTUKxw4EoTWZq8",
    "prod": "price_1NsSN2EEDyBTUKxwPvUnEHia"
  }
};

export const getStripePriceId = (type: 50 | 100 | 300): string => {
  if (process.env.NODE_ENV === "development") return priceIdByType[type].dev;
  return priceIdByType[type].prod;
};

export const pricesByType = {
  50: 4.99,
  100: 9.99,
  300: 14.99
};

export const getPriceIdCreditsCountKeyByValue = (value: string): string | undefined => {
  if (process.env.NODE_ENV === "development") {
    return Object.keys(priceIdByType).find((key) => priceIdByType[key as "50" | "100" | "300"].dev === value);
  }

  return Object.keys(priceIdByType).find((key) => priceIdByType[key as "50" | "100" | "300"].prod === value);
};


export const createPaymentLink = async(type: 50 | 100 | 300, user: { email: string; id: string }): Promise<string> => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: user.email,
    allow_promotion_codes: true,
    line_items: [
      {
        price: getStripePriceId(type),
        quantity: 1
      }
    ],
    metadata: {
      userId: user.id,
      priceId: getStripePriceId(type)
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL ?? ""}/api/stripe/credits?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL ?? ""}/api/stripe/credits?session_id={CHECKOUT_SESSION_ID}`
  });

  if (!session.url) {
    throw new Error("Stripe session url is undefined");
  }


  await prisma.payments.create({
    data: {
      amount: pricesByType[type],
      currency: "usd",
      email: user.email,
      referenceId: session.id,
      status: "PENDING",
      user: { connect: { id: user.id } }
    }
  });

  return session.url;
};

export const getReceiptUrl = async(id: string | null): Promise<string | null> => {
  if (!id) return null;
  const charge = await stripe.charges.list({ payment_intent: id });
  return charge.data[0].receipt_url || null;
};