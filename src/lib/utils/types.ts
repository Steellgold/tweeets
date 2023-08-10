export type Model = {
  id: string;
  createdAt: string;
  userId: string;
  name: string;
  description?: string | null;
  shareLink?: string | null;
  sentiment: string | "sentiment-neutral";
  style: string | "style-neutral";
  tone: string | "tone-neutral";
  target: string | "target-all";
  includeHashtags: boolean;
  hashtags?: string[] | null;
  context: string;
  gpt4: boolean;
};