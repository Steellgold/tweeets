import { Configuration, OpenAIApi } from "openai-edge";

export const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));