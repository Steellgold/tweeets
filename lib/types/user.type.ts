import { z } from "zod";

export const paymentSchema = z.object({
  id: z.string(),

  createdAt: z.string(),

  credits: z.number(),
  price: z.number(),
  status: z.enum(["PENDING", "FAILED", "SUCCESS", "EXPIRED", "REFUNDED"]),
  currency: z.string(),

  expiresAt: z.string(),
  liveMode: z.boolean(),

  priceId: z.string(),
  checkoutSessionId: z.string(),
  checkoutSessionUrl: z.string(),
  stripeCustomerId: z.string(),
  
  invoiceUrl: z.string().optional(),
});

export const paymentsSchema = z.array(paymentSchema);