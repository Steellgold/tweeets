import type { Lang } from "@/lib/configs/generation/langs";
import type { Emotion, Style, Target, Tone } from "@/lib/configs/generation/types";

export type TweetProps = {
  tweetContext: string;
  emotion: Emotion;
  style: Style;
  tone: Tone;
  target: Target;
  gpt: 3 | 4;
  lang: Lang;
};