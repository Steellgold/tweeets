import { PrismaAdapter } from "@auth/prisma-adapter"
import Twitter from "next-auth/providers/twitter"
import NextAuth, { type DefaultSession } from "next-auth"

import { prisma } from "./lib/prisma"
import { stripe } from "./config/stripe"

declare module "next-auth" {
  interface Session {
    user: {
      credits: number
    } & DefaultSession["user"]
  }

  interface User {
    credits: number;
    stripeCustomerId: string;
  }
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  providers: [Twitter],

  events: {
    createUser: async (message) => {
      const userId = message. user.id;
      const email = message.user.email;

      if (!userId || !email) return;

      const stripeCustomer = await stripe.customers.create({ email });

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: stripeCustomer.id
        }
      });
    }
  },

  callbacks: {
    async session({ session, user}) {
      return {
        ...session,
        user: {
          ...session.user,
          credits: user.credits
        }
      }
    }
  }
})