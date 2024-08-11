import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { generatePrompt } from "@/config/prompt";

const openai = new OpenAI();

const Tweet = z.object({
  id: z.number(),
  text: z.string(),
});

const Thread = z.object({
  tweets: z.array(Tweet),
});

const SingleTweet = z.object({
  text: z.string()
});

const bodySchema = z.object({
  "speed-mode": z.enum(["fast", "normal"]),
  "type": z.enum(["singleTweet", "thread"]),
  "min-chars": z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : undefined),
    z.number().min(1)
  ),
  "include-emojis": z.boolean(),
  "include-indicators": z.boolean(),
  "context": z.string().min(1),
  "tone": z.enum(["humoristic", "serious", "informative", "normal"]),
  "thread-length": z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : undefined),
    z.number().min(1).max(12).optional()
  ),
});

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const body = await req.json();
  const parsedBody = bodySchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const {
    "speed-mode": speedMode,
    "type": type,
    "min-chars": minChars,
    "include-emojis": includeEmojis,
    "include-indicators": includeIndicators,
    "context": context,
    "tone": tone,
    "thread-length": threadLength,
  } = parsedBody.data;

  const userPrompt = generatePrompt({
    type,
    tone,
    threadLength,
    minChars,
    includeEmojis,
    includeIndicators,
    context
  });

  let responseSchema;

  if (type === "thread") {
    responseSchema = Thread;
  } else {
    responseSchema = SingleTweet;
  }

  if (speedMode === "fast") {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: 1300,
      response_format: zodResponseFormat(responseSchema, type === "thread" ? "tweets" : "text"),
    });

    const event = completion.choices[0].message.parsed;

    return NextResponse.json(event);
  } else {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            You are a helpful assistant. When the user asks for a response, you should structure your reply according to the following format:

            ${type === "thread" ? `
            1. Respond with a JSON object.
            2. The JSON object should contain a key "tweets" which maps to an array.
            3. Each item in the array should be an object with the following structure:
                - "id": a unique identifier for the tweet (a number).
                - "text": the content of the tweet (a string).
            ` : `
            1. Respond with a JSON object.
            2. The JSON object should contain a key "text" which maps to a string.
            `}

            Example of the expected format:
            ${type === "thread" ? `
            {
                "tweets": [
                    {
                        "id": 1,
                        "text": "This is an example tweet."
                    },
                    {
                        "id": 2,
                        "text": "Another example tweet."
                    }
                ]
            }
            ` : `
            {
                "text": "This is an example tweet."
            }
            `}
                
            Make sure to strictly follow this format when generating your responses. Pay careful attention to the following:
            - Each ${type === "thread" ? "tweet" : "message"} must be between ${minChars} and ${minChars + 15} characters long.
            - Ensure that the content is engaging, and fits the specified tone and context.
            - Do not include any additional text outside of the JSON object.
          `,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: 900,
    });

    const event = completion.choices[0].message.content;

    return NextResponse.json(transformAndValidate(event as string, responseSchema));
  }
};

const transformAndValidate = (response: string, schema: z.ZodSchema) => {
  const cleanString = response.replace(/\\n/g, '').replace(/\\\"/g, '"').replace(/\s\s+/g, ' ').trim();

  const parsedJSON = JSON.parse(cleanString);

  const validation = schema.safeParse(parsedJSON);

  if (validation.success) {
      return validation.data;
  } else {
      throw new Error('Invalid JSON format');
  }
};