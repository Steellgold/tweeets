type Prompt = "user" | "system";
import { Configuration, OpenAIApi } from "openai-edge";

export const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_KEY }));

const URLS: Record<Prompt, string> = {
  user: process.env.USER_PROMPT || "",
  system: process.env.SYSTEM_PROMPT || ""
};

export const getPrompt = async(prompt: Prompt): Promise<string> => {
  try {
    const response = await fetch(URLS[prompt]);

    if (!response.ok) throw new Error(`Fetch error: ${response.status} ${response.statusText}`);

    const text = await response.text();
    return text;
  } catch (error) {
    throw new Error("Error fetching text from URL");
  }
};