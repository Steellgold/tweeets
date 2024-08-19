// TODO;

import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = async (): Promise<NextResponse> => {
  const session = await auth();

  if (!session) return NextResponse.redirect("/");

  const payments =await prisma.payments.findMany({
    where: {
      stripeCustomerId: session.user.stripeCustomerId,
    },
    select: {
      id: true,
      createdAt: true,

      credits: true,
      price: true,
      status: true,
      currency: true,
      
      expiresAt: true,
      liveMode: true,
      
      priceId: true,
      checkoutSessionId: true,
      checkoutSessionUrl: true,
      stripeCustomerId: true,
      
      invoiceUrl: true,
    }
  });

  return NextResponse.json({ payments });
}