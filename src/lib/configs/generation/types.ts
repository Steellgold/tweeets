export type WritingSentiment =
  "sentiment-neutral" |
  "sentiment-joyful" |
  "sentiment-sad" |
  "sentiment-energetic" |
  "sentiment-calm" |
  "sentiment-confident" |
  "sentiment-hopeful" |
  "sentiment-sarcastic" |
  "sentiment-playful" |
  "sentiment-thoughtful" |
  "sentiment-motivational" |
  "sentiment-appreciative" |
  "sentiment-curious" |
  "sentiment-exhilarated" |
  "sentiment-grateful" |
  "sentiment-adventurous";

export type WritingStyle = "style-neutral" |
 "style-friendly" |
 "style-formal" |
 "style-humorous" |
 "style-informative" |
 "style-inspirational" |
 "style-educational" |
 "style-poetic" |
 "style-controversial" |
 "style-sentimental" |
 "style-mysterious" |
 "style-engaging" |
 "style-narrative";

export type WritingTone = "tone-neutral" |
 "tone-optimistic" |
 "tone-pessimistic" |
 "tone-angry" |
 "tone-joyful" |
 "tone-sad" |
 "tone-energetic" |
"tone-appreciative" |
 "tone-curious" |
 "tone-motivational";

export type WritingTarget = "target-all" |
  "target-enterprises" |
  "target-professionals" |
  "target-particulars" |
  "target-entrepreneurs" |
  "target-students" |
  "target-children" |
  "target-teenagers" |
  "target-adults" |
  "target-seniors";

const proSelects = [
  "sentiment-exhilarated",
  "sentiment-grateful",
  "sentiment-adventurous",
  "style-friendly",
  "style-informative",
  "style-poetic",
  "tone-appreciative",
  "tone-curious",
  "tone-motivational",
  "target-enterprises"
];

type Props = {
  key: string;
  value: string;
  isPro?: boolean;
};

export const sentimentOptions: Props[] = [
  { key: "sentiment-neutral", value: "Neutral" },
  { key: "sentiment-exhilarated", value: "Exhilarated", isPro: true },
  { key: "sentiment-grateful", value: "Grateful", isPro: true },
  { key: "sentiment-adventurous", value: "Adventurous", isPro: true },
  { key: "sentiment-joyful", value: "Joyful" },
  { key: "sentiment-sad", value: "Sad" },
  { key: "sentiment-energetic", value: "Energetic" },
  { key: "sentiment-calm", value: "Calm" },
  { key: "sentiment-confident", value: "Confident" },
  { key: "sentiment-hopeful", value: "Hopeful" },
  { key: "sentiment-sarcastic", value: "Sarcastic" },
  { key: "sentiment-playful", value: "Playful" },
  { key: "sentiment-thoughtful", value: "Thoughtful" },
  { key: "sentiment-motivational", value: "Motivational" },
  { key: "sentiment-appreciative", value: "Appreciative" },
  { key: "sentiment-curious", value: "Curious" }
];

export const styleOptions: Props[] = [
  { key: "style-neutral", value: "Neutral" },
  { key: "style-informative", value: "Informative", isPro: true },
  { key: "style-friendly", value: "Friendly", isPro: true },
  { key: "style-poetic", value: "Poetic", isPro: true },
  { key: "style-formal", value: "Formal" },
  { key: "style-humorous", value: "Humorous" },
  { key: "style-inspirational", value: "Inspirational" },
  { key: "style-educational", value: "Educational" },
  { key: "style-controversial", value: "Controversial" },
  { key: "style-sentimental", value: "Sentimental" },
  { key: "style-mysterious", value: "Mysterious" },
  { key: "style-engaging", value: "Engaging" },
  { key: "style-narrative", value: "Narrative" }
];

export const toneOptions: Props[] = [
  { key: "tone-neutral", value: "Neutral" },
  { key: "tone-appreciative", value: "Appreciative", isPro: true },
  { key: "tone-curious", value: "Curious", isPro: true },
  { key: "tone-motivational", value: "Motivational", isPro: true },
  { key: "tone-optimistic", value: "Optimistic" },
  { key: "tone-pessimistic", value: "Pessimistic" },
  { key: "tone-angry", value: "Angry" },
  { key: "tone-joyful", value: "Joyful" },
  { key: "tone-sad", value: "Sad" },
  { key: "tone-energetic", value: "Energetic" }
];

export const targetOptions: Props[] = [
  { key: "target-all", value: "All" },
  { key: "target-enterprises", value: "Enterprises", isPro: true },
  { key: "target-professionals", value: "Professionals" },
  { key: "target-particulars", value: "Particulars" },
  { key: "target-entrepreneurs", value: "Entrepreneurs" },
  { key: "target-students", value: "Students" },
  { key: "target-children", value: "Children" },
  { key: "target-teenagers", value: "Teenagers" },
  { key: "target-adults", value: "Adults" },
  { key: "target-seniors", value: "Seniors" },
  { key: "target-parents", value: "Parents" }
];

export const testProSelected = (isPro: boolean, selected: string[]): boolean => {
  if (!isPro) return !selected.some((option) => proSelects.includes(option));
  return true;
};