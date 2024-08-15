"use server"

import { auth } from "@/auth";
import { stripe } from "@/config/stripe";
import { prisma } from "@/lib/prisma";

type Response = {
  isError: boolean;
  message?: string;
  email?: string;
}

export const defineMailAction = async (email: string): Promise<Response> => {
  const session = await auth();

  if (!session || !session.user) return { isError: true, message: "Not authenticated" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const emailExists = await prisma.user.findFirst({ where: { email } });

  if (emailExists) return { isError: true, message: "This email is already in use, please choose another one" };
  if (!user) return { isError: true, message: "User not found" };

  const customerExists = user.stripeCustomerId ? true : false;

  if (customerExists) return { isError: true, message: "You already have a stripe customer" };

  const stripeCustomerExists = await stripe.customers.list({ email });

  if (stripeCustomerExists.data.length > 0) return { isError: true, message: "A customer with this email already exists" };

  const stripeCustomer = await stripe.customers.create({ email });
  const userId = session.user.id;
  
  const data = await prisma.user.update({
    where: { id: userId },
    data: {
      email,
      stripeCustomerId: stripeCustomer.id
    }
  });

  if (!data) return { isError: true, message: "Could not update user" };

  return {
    isError: false,
    email: email
  };
}