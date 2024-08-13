"use server";

import { z } from "zod";

import { bodySchema } from "@/app/api/ai/route";
import { auth } from "@/auth";

export const generateAction = async(data: z.infer<typeof bodySchema>): Promise<any> => {
  const session = await auth();

  const formData = bodySchema.safeParse(data);

  if (!formData.success) return { isError: true, errorType: "alert", message: "It seems that the content sent is not valid, please try again, if the problem persists, contact support" };

  if (!session) return { isError: true, errorType: "alert", message: "You need to be logged in to generate content, please login" };

  const context = data.context.replace(/[^a-zA-Z]/g, '');

  if (!context || context.length < 10) return { isError: true, errorType: "textarea", message: "Context is required and should be at least 10 characters" };

  const res = await fetch(process.env.URL + "/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.SAK,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  console.log(result);

  return {
    isError: false,
    message: `Generated content for context: ${data.context}`,
  };
}