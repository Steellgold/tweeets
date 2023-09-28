import { prisma } from "@/lib/utils/database";
import { NextResponse } from "next/server";

export const GET = async(): Promise<NextResponse> => {
  return NextResponse.json(await prisma.posts.findMany({
    include: {
      author: {
        include: {
          posts: false
        }
      },
      tags: true,
      categories: true,
      comments: true
    },
    orderBy: {
      createdAt: "desc"
    }
  }));
};