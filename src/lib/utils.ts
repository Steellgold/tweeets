import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const tweet = (content: string): string => {
  return `https://twitter.com/share?text=${encodeURIComponent(content)}`;
};