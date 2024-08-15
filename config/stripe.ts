import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true
});

type PricesIdsType = {
  [key in 10 | 50 | 100 | 500]: { dev: string; prod: string; };
};

const PricesIds: PricesIdsType = {
  "10": { dev: "price_1PoB5QEEDyBTUKxwhrNG7cjc", prod: "price_1PoCH3EEDyBTUKxwnah7o03t" },
  "50": { dev: "price_1PoB6EEEDyBTUKxwlO5k9z4y", prod: "price_1PoCH2EEDyBTUKxwEkR4MMSH" },
  "100": { dev: "price_1PoB6yEEDyBTUKxw5SmWIOxa", prod: "price_1PoCH0EEDyBTUKxwJCfFiNgL" },
  "500": { dev: "price_1PoB8pEEDyBTUKxwG0mCGtw7", prod: "price_1PoCGyEEDyBTUKxwTupRGMe9" }
}

export const getPriceIdToUse = (priceId: "10" | "50" | "100" | "500") =>
  process.env.NODE_ENV === "development"
    ? PricesIds[priceId].dev
    : PricesIds[priceId].prod;

export const priceIdToCredits = (priceId: string) => {
  const credits = Object.entries(PricesIds).find(([key, value]) => value.dev === priceId || value.prod === priceId);

  if (!credits) return 0;

  return parseInt(credits[0]);
};

export const getReceiptUrl = async(id: string | null): Promise<string | null> => {
  if (!id) return null;
  const charge = await stripe.charges.list({ payment_intent: id });

  return charge.data[0].receipt_url || null;
};