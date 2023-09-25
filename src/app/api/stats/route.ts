import { prisma } from "@/lib/utils/database";
import { NextResponse } from "next/server";

export const GET = async(): Promise<NextResponse> => {
  const usersCount = await prisma.user.count();
  const tweetsCount = await prisma.tweets.count();

  return NextResponse.json({ usersCount, tweetsCount });
};