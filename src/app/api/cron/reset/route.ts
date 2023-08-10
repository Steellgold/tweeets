import { prisma } from "@/lib/utils/database";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

let date = dayjs();

export async function GET(): Promise<NextResponse> {
  const now = dayjs();
  if (now.month() !== date.month()) {
    date = now;

    await prisma.user.updateMany({
      data: { usage: 0 },
      where: { usage: { not: 0 } }
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false });
}