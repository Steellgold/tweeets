import { getPriceIdCreditsCountKeyByValue, priceIdByType, stripe } from "@/lib/utils/stripe";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/utils/database";

export const GET = async(request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url);
  const sessionid = requestUrl.searchParams.get("session_id");

  if (!sessionid) return NextResponse.json({ error: "Session id is undefined" });

  const session = await stripe.checkout.sessions.retrieve(sessionid);
  if (session.status !== "complete" || session.payment_status !== "paid") return NextResponse.redirect(requestUrl.origin);

  const metadata = session.metadata;

  const schema = z.object({
    userId: z.string(),
    priceId: z.string()
  }).safeParse(metadata);

  if (schema.success) {
    await prisma.user.update({
      where: { id: schema.data.userId },
      data: { credits: { increment: parseInt(getPriceIdCreditsCountKeyByValue(schema.data.priceId) ?? priceIdByType["50"]) } }
    });
  }

  return NextResponse.redirect(requestUrl.origin);
};