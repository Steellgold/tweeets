import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Twitter from "next-auth/providers/twitter"

import { prisma } from "./lib/prisma"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [ Twitter ],
})