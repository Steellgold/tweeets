/* eslint-disable camelcase */
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16"
});

export const priceIdByType = {
  50: "price_1NmJhdEEDyBTUKxwRNIYh5rw",
  100: "price_1NmJhdEEDyBTUKxw2Sj4FYe1",
  300: "price_1NqPGCEEDyBTUKxwDbXD03Dg"
};

export const getPriceIdCreditsCountKeyByValue = (value: string): string | undefined => {
  return Object.keys(priceIdByType).find(key => priceIdByType[key as "50" | "100" | "300"] === value);
};

export const createPaymentLink = async(type: 50 | 100 | 300, user: { email: string; id: string }): Promise<string> => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: user.email,
    allow_promotion_codes: true,
    line_items: [
      {
        price: priceIdByType[type],
        quantity: 1
      }
    ],
    metadata: {
      userId: user.id,
      priceId: priceIdByType[type]
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL ?? ""}/api/stripe/credits?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL ?? ""}/app`
  });

  if (!session.url) {
    throw new Error("Stripe session url is undefined");
  }

  return session.url;
};