import { getPriceIdCreditsCountKeyByValue, getReceiptUrl, priceIdByType, stripe } from "@/lib/utils/stripe";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/utils/database";

export const GET = async(request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url);
  const sessionid = requestUrl.searchParams.get("session_id");

  if (!sessionid) return NextResponse.json({ error: "Session id is undefined" });

  const session = await stripe.checkout.sessions.retrieve(sessionid);
  const metadata = session.metadata;

  const schema = z.object({
    userId: z.string(),
    priceId: z.string()
  }).safeParse(metadata);

  if (session.status !== "complete" || session.payment_status !== "paid") {
    console.log("Payment failed 💔");
    await prisma.payments.update({
      where: { referenceId: sessionid || "" },
      data: { status: "FAILED" }
    });
  }

  if (schema.success && session.status === "complete" && session.payment_status === "paid") {
    console.log("Payment completed 💖");
    const receiptUrl = await getReceiptUrl(session.payment_intent?.toString() || null);
    console.log("Your receipt url is (saved in database/billing page):", receiptUrl);

    await prisma.user.update({
      where: { id: schema.data.userId },
      data: {
        credits: { increment: parseInt(getPriceIdCreditsCountKeyByValue(schema.data.priceId) ?? priceIdByType["50"]) },
        isFreeCredit: false,
        payments: {
          update: {
            where: { referenceId: sessionid || "" },
            data: {
              status: "COMPLETED",
              invoiceUrl: receiptUrl
            }
          }
        }
      }
    });
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL ?? ""}/app`);
};