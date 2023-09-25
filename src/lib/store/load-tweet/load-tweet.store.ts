import type { TweetProps } from "@/lib/configs/generation/tweet";
import { create } from "zustand";

type TweetStore = {
  tweet: TweetProps | null;
  setTweet: (tweet: TweetProps | null) => void;
}

export const useLoadTweetStore = create<TweetStore>()((set) => ({
  tweet: null,
  setTweet: (by) => set({ tweet: by })
}));