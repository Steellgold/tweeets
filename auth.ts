import { PrismaAdapter } from "@auth/prisma-adapter"
import Twitter from "next-auth/providers/twitter"
import NextAuth, { type DefaultSession } from "next-auth"

import { prisma } from "./lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      credits: number
    } & DefaultSession["user"]
  }

  interface User {
    credits: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  providers: [Twitter],
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