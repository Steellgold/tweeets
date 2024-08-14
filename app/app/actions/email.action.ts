"use server"

import { auth, unstable_update } from "@/auth";
import { stripe } from "@/config/stripe";
import { prisma } from "@/lib/prisma";

type Response = {
  isError: boolean;
  message?: string;
  email?: string;
}

export const defineMailAction = async (email: string): Promise<Response> => {
  const session = await auth();

  unstable_update({ user: { email } });

  
  const stripeCustomer = await stripe.customers.create({ email });

  if (!session || !session.user) return { isError: true, message: "Not authenticated" };
  const userId = session.user.id;
  
  const data = await prisma.user.update({
    where: { id: userId },
    data: {
      email,
      stripeCustomerId: stripeCustomer.id
    }
  });

  console.log(data);
  if (!data) return { isError: true, message: "Could not update user" };

  return {
    isError: false,
    email: email
  };
}