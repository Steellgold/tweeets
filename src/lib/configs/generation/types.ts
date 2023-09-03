/* eslint-disable max-len */
type Props = {
  key: string;
  value: string;
  description: string;
};

export type Emotion = "emotion-default" | "emotion-enthusiasm" | "emotion-melancholy" | "emotion-joy" | "emotion-anxiety" | "emotion-confidence" | "emotion-wonder" | "emotion-anger" | "emotion-compassion" | "emotion-exhaustion" | "emotion-critical-thinking";

export type Style = "style-default" | "style-informative" | "style-poetic" | "style-humorous" | "style-formal" | "style-persuasive" | "style-descriptive" | "style-scientific" | "style-narrative" | "style-educational";

export type Tone = "tone-default" | "tone-optimistic" | "tone-ironic" | "tone-authoritative" | "tone-emphatic" | "tone-detached" | "tone-satirical" | "tone-reflective" | "tone-intimate" | "tone-engaged" | "tone-positive";

export type Target = "target-all" | "target-enterprises" | "target-professionals" | "target-particulars" | "target-entrepreneurs" | "target-students" | "target-children" | "target-teenagers" | "target-adults" | "target-seniors" | "target-parents";

export type Emoji = "emoji-default" | "emoji-reasonable" | "emoji-exaggeration" | "emoji-party";

export const emotions: Props[] = [
  { key: "emotion-default", value: "No emotion", description: "This category encompasses all possible emotions." },
  { key: "emotion-enthusiasm", value: "Enthusiasm", description: "Enthusiasm is a writing style that conveys a deep sense of excitement and optimism, it is often used to inspire and motivate." },
  { key: "emotion-melancholy", value: "Melancholy", description: "Melancholy is a writing style that evokes a gentle sense of sadness and reflection, it is often used to create a nostalgic atmosphere." },
  { key: "emotion-joy", value: "Joy", description: "Joy is a writing style that expresses deep happiness and contentment, it is used to share moments of joy and delight." },
  { key: "emotion-anxiety", value: "Anxiety", description: "Anxiety is a writing style that reflects worries and apprehensions, it is used to communicate feelings of concern or tension." },
  { key: "emotion-confidence", value: "Confidence", description: "Confidence is a writing style that conveys assurance and conviction, it is used to persuade and inspire confidence." },
  { key: "emotion-wonder", value: "Wonder", description: "Wonder is a writing style that invokes astonishment and admiration, it is used to share fascinating discoveries." },
  { key: "emotion-anger", value: "Anger", description: "Anger is a writing style that expresses frustration and indignation, it is often used to denounce injustices." },
  { key: "emotion-compassion", value: "Compassion", description: "Compassion is a writing style that demonstrates empathy and care for others, it is used to inspire understanding and mutual assistance." },
  { key: "emotion-exhaustion", value: "Exhaustion", description: "Exhaustion is a writing style that reflects fatigue and weariness, it is used to share experiences of overexertion." },
  { key: "emotion-critical-thinking", value: "Critical thinking", description: "Critical Thinking is a writing style that encourages analytical thinking and questioning, it is used to stimulate critical thought." }
];

export const getEmotion = (key: Emotion): Props => {
  const emotion = emotions.find((emotion) => emotion.key === key);
  if (!emotion) throw new Error(`Emotion ${key} not found`);
  return emotion;
};

export const styles: Props[] = [
  { key: "style-default", value: "Default style", description: "This category encompasses all possible writing styles." },
  { key: "style-informative", value: "Informative", description: "Informative Style is a way of writing that aims to convey facts in a clear and concise manner." },
  { key: "style-poetic", value: "Poetic", description: "Poetic Style is a way of writing that prioritizes linguistic creativity and emotional expression." },
  { key: "style-humorous", value: "Humorous", description: "Humorous Style is a way of writing that seeks to amuse and entertain the reader through humor and satire." },
  { key: "style-formal", value: "Formal", description: "Formal Style is characterized by the use of correct language and adherence to grammatical rules." },
  { key: "style-persuasive", value: "Persuasive", description: "Persuasive Style is a way of writing that aims to convince and persuade the reader to adopt a particular point of view or idea." },
  { key: "style-descriptive", value: "Descriptive", description: "Descriptive Style is a way of writing that focuses on creating vivid and detailed imagery in the reader's mind." },
  { key: "style-scientific", value: "Scientific", description: "Scientific Style is a way of writing that relies on data and verifiable facts to explain phenomena." },
  { key: "style-narrative", value: "Narrative", description: "Narrative Style is a way of writing that tells captivating stories and narratives." },
  { key: "style-educational", value: "Educational", description: "Educational Style is a way of writing that aims to teach and inform the reader about a particular subject." }
];

export const getStyle = (key: Style): Props => {
  const style = styles.find((style) => style.key === key);
  if (!style) throw new Error(`Style ${key} not found`);
  return style;
};

export const tones: Props[] = [
  { key: "tone-default", value: "Default tone", description: "This category encompasses all possible tones." },
  { key: "tone-optimistic", value: "Optimistic", description: "Optimistic Tone is a positive attitude that encourages hope and confidence." },
  { key: "tone-ironic", value: "Ironic", description: "Ironic Tone is characterized by the use of irony to express a meaning opposite to what is said." },
  { key: "tone-authoritative", value: "Authoritative", description: "Authoritative Tone is used with clear authority or expertise to persuade the reader." },
  { key: "tone-emphatic", value: "Emphatic", description: "Emphatic Tone is marked by strong emphasis and intense expression of emotions." },
  { key: "tone-detached", value: "Detached", description: "Detached Tone is neutral and objective, devoid of personal emotion." },
  { key: "tone-satirical", value: "Satirical", description: "Satirical Tone uses irony and mockery to critique and ridicule." },
  { key: "tone-reflective", value: "Reflective", description: "Reflective Tone encourages deep reflection and contemplation." },
  { key: "tone-intimate", value: "Intimate", description: "Intimate Tone creates a personal and close connection with the reader." },
  { key: "tone-engaged", value: "Engaged", description: "Engaged Tone shows strong emotional or social engagement." },
  { key: "tone-positive", value: "Positive", description: "Positive Tone promotes a constructive and encouraging attitude." }
];

export const getTone = (key: Tone): Props => {
  const tone = tones.find((tone) => tone.key === key);
  if (!tone) throw new Error(`Tone ${key} not found`);
  return tone;
};

export const targets: Props[] = [
  { key: "target-all", value: "All audiences", description: "The 'All' category encompasses all possible target audiences, making it a versatile choice for comprehensive communication." },
  { key: "target-enterprises", value: "Enterprises", description: "The 'Enterprises' category includes businesses and large organizations, making it ideal for B2B communication strategies." },
  { key: "target-professionals", value: "Professionals", description: "The 'Professionals' category is tailored to individuals in various professional fields, allowing you to target a diverse group of experts." },
  { key: "target-particulars", value: "Particulars", description: "The 'Particulars' category refers to specific individuals or entities, providing flexibility for personalized messaging." },
  { key: "target-entrepreneurs", value: "Entrepreneurs", description: "The 'Entrepreneurs' category is designed for individuals who aspire to start their own businesses, offering insights and guidance for budding entrepreneurs." },
  { key: "target-students", value: "Students", description: "The 'Students' category includes individuals who are currently pursuing education, making it an excellent choice for educational content." },
  { key: "target-children", value: "Children", description: "The 'Children' category pertains to young individuals who are not yet teenagers, offering content tailored to their unique needs and interests." },
  { key: "target-teenagers", value: "Teenagers", description: "The 'Teenagers' category includes adolescents in the teenage age group, providing information and engagement strategies suitable for this demographic." },
  { key: "target-adults", value: "Adults", description: "The 'Adults' category refers to individuals who have reached adulthood, allowing you to address a mature audience with diverse interests." },
  { key: "target-seniors", value: "Seniors", description: "The 'Seniors' category includes elderly individuals, typically in retirement age, offering content and services tailored to their life stage." },
  { key: "target-parents", value: "Parents", description: "The 'Parents' category pertains to individuals who are caregivers and have children, providing resources and support for family-oriented messaging." }
];

export const getTarget = (key: string): Props => {
  const target = targets.find((target) => target.key === key);
  if (!target) throw new Error(`Target ${key} not found`);
  return target;
};

export const emojis: Props[] = [
  { key: "emoji-default", value: "Few emojis", description: "This category encompasses all possible emojis." },
  { key: "emoji-reasonable", value: "Reasonable use of emojis", description: "Reasonable use of emojis" },
  { key: "emoji-exaggeration", value: "Exaggeration of emojis", description: "Exaggeration of emojis" },
  { key: "emoji-party", value: "It's the party 🎊", description: "It's the party 🎊" }
];