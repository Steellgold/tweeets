import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getReceiptUrl, priceIdToCredits, stripe } from "@/config/stripe";
import { prisma } from "@/lib/prisma";
import { unstable_update } from "@/auth";

export const GET = async(req: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(req.url);
  const sessionId = requestUrl.searchParams.get("session_id");

  if (!sessionId) return NextResponse.json({ error: "Session id is undefined" });

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const metadata = session.metadata;

  const schema = z.object({ userId: z.string(), priceId: z.string() }).safeParse(metadata);

  if (session.status !== "complete" || session.payment_status !== "paid") {
    console.log("Payment failed 💔");
  }

  if (schema.success && session.status === "complete" && session.payment_status === "paid") {
    console.log("Payment completed 💖");
    const receiptUrl = await getReceiptUrl(session.payment_intent?.toString() || null);
    
    console.log("Your receipt url is (saved in database/billing page):", receiptUrl);

    const user = await prisma.user.findUnique({ where: { id: schema.data.userId } });
    const credits = user?.credits!;
    const newCredits = credits + priceIdToCredits(schema.data.priceId);

    await prisma.user.update({ where: { id: schema.data.userId }, data: { credits: newCredits } });
    unstable_update({ ...user, user: { credits: newCredits } });
  }

  return NextResponse.redirect(process.env.URL + "/app" ?? "");
}