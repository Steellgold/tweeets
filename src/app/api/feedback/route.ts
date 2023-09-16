import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { EmailTemplate } from "./feedback";
import type React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

const formSchema = z.object({
  email: z.string().email(),
  feedback: z.string().min(1).max(5000)
});

export const POST = async(request: NextRequest): Promise<NextResponse> => {
  const schema = formSchema.safeParse(await request.json());

  if (!schema.success) {
    console.log(schema.error);
    return NextResponse.json({ error: schema.error });
  }

  try {
    const data = await resend.emails.send({
      from: "Feedback <feedback@tweeets.app>",
      to: ["contact@tweeets.app"],
      subject: "New feedback",
      react: EmailTemplate({ email: schema.data.email, feedback: schema.data.feedback }) as React.ReactElement
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
};