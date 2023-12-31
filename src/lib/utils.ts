import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const toTweetUrl = (content: string): string => {
  return `https://twitter.com/share?text=${encodeURIComponent(content + " #withTweeets")}`;
};

export const tejlesHashtags = (text: string): string => {
  const texteSansHashtags = text.replace(/#\w+/g, "");
  return texteSansHashtags;
};

export const rau = (text: string, prefix: string): string => {
  return text.replace(prefix, "").replace(/^\w/, (c) => c.toUpperCase());
};

export const gen = (count: number): string => {
  const result = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < count; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }

  return result.join("");
};

export const intify = (num: number): string => {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(1) + "K";
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num < 900) {
    return num.toString() + " ";
  }

  return num.toString();
};