"use server";

import { z } from "zod";

import { auth, unstable_update } from "@/auth";
import { openai } from "@/lib/openai";
import { bodySchema, responseSchema } from "@/app/app/type/post.type";

import { prisma } from "../prisma";

export const generateAction = async(data: z.infer<typeof bodySchema>): Promise<any> => {
  const session = await auth();
  const formData = bodySchema.safeParse(data);
  
  if (!formData.success) {
    if (formData.error.errors[0].path[0] === "context") return { isError: true, errorType: "textarea", message: "Context is required and should be at least 10 characters" };

    return {
      isError: true,
      errorType: "alert",
      message: "An error occurred while generating content, please try again, if the problem persists, contact support"
    };
  }

  if (!session) return { isError: true, errorType: "alert", message: "You need to be logged in to generate content, please login" };

  if (!data.context || data.context.length < 10) {
    return { isError: true, errorType: "textarea", message: "Context is required and should be at least 10 characters" }
  }

  if (!await hasEnoughCredits(data.type == "thread", data.threadLength || 1)) {
    console.log("Not enough credits");

    return { isError: true, errorType: "alert", message: "You do not have enough credits to generate this content, please purchase more credits" };
  }

  const moderation = await openai.moderations.create({ input: data.context });

  if (moderation.results[0].flagged) {
    return { isError: true, errorType: "alert", message: "The content you provided is not allowed, please review and try again" };
  }

  const res = await fetch(`${process.env.URL}/api/ai`, {
    method: "GET",
    headers: new Headers({
      "x-api-key": process.env.SAK!,
      "x-data-type": data.type,
      "x-data-chars": data.chars.toString(),
      "x-data-include-emojis": data.includeEmojis.toString(),
      "x-data-include-indicators": data.includeIndicators.toString(),
      "x-data-context": data.context,
      "x-data-tone": data.tone,
      "x-data-thread-length": data.threadLength!.toString(),
      "x-data-language": data.language,
    }),
  });

  const result = await res.json();
  const parsedResult = responseSchema.safeParse(result);

  if (!parsedResult.success) {
    return {
      isError: true, errorType: "alert", message: "An error occurred while generating content, please try again, if the problem persists, contact support"
    }
  }

  const newCreditsCount = await deduceCredits(data.type == "thread", data.threadLength || 1, session.user.id!);

  return {
    isError: false,
    errorType: undefined,
    data: parsedResult.data,
    newCreditsCount
  };
}

const deduceCredits = async (thread: boolean, tweetsCount: number, userId: string): Promise<number> => {
  const session = await auth();

  if (!session) return 0;

  let count = 1;

  if (thread && tweetsCount > 1) count = tweetsCount;
  if (thread && tweetsCount >= 6) count = count - 1;  

  const newCreditsCount = session.user.credits - count;

  await prisma.$executeRaw`UPDATE "User" SET credits = ${newCreditsCount} WHERE id = ${userId}`;
  await unstable_update({ user: { credits: newCreditsCount } });

  return newCreditsCount;
}

const hasEnoughCredits = async (thread: boolean, tweetsCount: number): Promise<boolean> => {
  const session = await auth();

  if (!session) return false;

  let count = 1;

  if (thread && tweetsCount > 1) count = tweetsCount;
  if (thread && tweetsCount >= 6) count = count - 1;  

  return session.user.credits >= count;
}
