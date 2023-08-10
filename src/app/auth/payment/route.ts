import type { NextRequest } from "next/server";
import { stripe } from "@/lib/utils/stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/database";
import dayjs from "dayjs";

export const GET = async(request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url);
  const sessionId = requestUrl.searchParams.get("session_id");

  if (sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (session.metadata && userId && plan && session.payment_status === "paid") {
      await prisma.subscription.create({
        data: {
          cusId: session.customer?.toString() || "",
          subId: session.subscription?.toString() || "",
          createdAt: dayjs().toDate(),
          startAt: dayjs().toDate(),
          endAt: plan == "monthly" ? dayjs().add(1, "month").toDate() : dayjs().add(1, "year").toDate(),
          plan: plan == "monthly" ? "MONTHLY" : "YEARLY",
          user: {
            connect: {
              id: userId
            }
          }
        }
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          isPro: true,
          priority: plan == "yearly" ? true : false
        }
      });
    }
  }

  return NextResponse.redirect(requestUrl.origin);
};