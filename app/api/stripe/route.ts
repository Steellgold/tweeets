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

    await prisma.payments.update({
      where: {
        checkoutSessionId: session.id
      },
      data: {
        status: "FAILED"
      }
    });
  }

  if (schema.success && session.status === "complete" && session.payment_status === "paid") {
    console.log("Payment completed 💖");
    const receiptUrl = await getReceiptUrl(session.payment_intent?.toString() || null);

    const user = await prisma.user.findUnique({ where: { id: schema.data.userId } });
    const credits = user?.credits!;
    const newCredits = credits + priceIdToCredits(schema.data.priceId);

    await prisma.user.update({
      where: {
        id: schema.data.userId
      },
      data: {
        credits: newCredits,
        payments: {
          update: {
            where: {
              checkoutSessionId: session.id
            },
            data: {
              status: "SUCCESS",
              invoiceUrl: receiptUrl
            }
          }
        }
      }
    });
    
    unstable_update({ ...user, user: { credits: newCredits } });
  }

  return NextResponse.redirect(process.env.URL + "/app" ?? "");
}