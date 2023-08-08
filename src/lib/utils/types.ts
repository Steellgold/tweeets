export type Model = {
  id: string;
  createdAt: string;
  userId: string;
  name: string;
  description?: string | null;
  shareLink?: string | null;
  sentiment: string;
  style: string;
  tone: string;
  context: string;
  length: number;
};