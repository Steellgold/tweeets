"use client";

import { CardContent, CardFooter } from "@/lib/components/ui/card";
import { Textarea } from "@/lib/components/ui/textarea";
import { useState, type ReactElement } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select";
import type { Emotion, Style, Target, Tone } from "@/lib/configs/generation/types";
import { emotions, getEmotion, getStyle, getTarget, getTone, styles, targets, tones } from "@/lib/configs/generation/types";
import TweetsList from "./tweets";
import AlertDescription from "@/lib/components/alert-description";
import { Label } from "@/lib/components/ui/label";
import { langs, type Lang } from "@/lib/configs/generation/langs";
import { useUserContext } from "@/lib/contexts/UserProvider";
import BuyCredits from "./credits";
import Generate from "./generate";

const Generator = (): ReactElement => {
  const { user } = useUserContext();

  const [gpt, setGPT] = useState<3 | 4>(3);

  const [tweetContext, setContext] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("emotion-default");
  const [style, setStyle] = useState<Style>("style-default");
  const [tone, setTone] = useState<Tone>("tone-default");
  const [target, setTarget] = useState<Target>("target-all");
  const [lang, setLang] = useState<Lang>("en-US");

  const [newNotReadCount, setNewNotReadCount] = useState<number>(0);

  return (
    <>
      <CardContent>
        <Textarea
          placeholder="Enter your tweet content here"
          disabled={!user}
          minLength={10}
          className="resize-none"
          lw8={tweetContext == "lw8"}
          supabase={tweetContext == "supabase"}
          onChange={(event) => setContext(event.target.value)} />

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="emotion" className="flex gap-1.5">
              Emotion
              <AlertDescription
                title={
                  <span className="text-primary">
                    What is the <kbd className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5">{emotion}</kbd>&nbsp;?
                  </span>
                }
                description={getEmotion(emotion).description}
              />
            </Label>

            <Select
              value={emotion}
              defaultValue={"emotion-default"}
              onValueChange={(value: Emotion) => setEmotion(value)}
              disabled={!user}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select a emotion" />
              </SelectTrigger>

              <SelectContent className="!overflow-scroll max-h-[300px]">
                {emotions.map((emotion) => (
                  <SelectItem key={emotion.key} id={emotion.key} value={emotion.key}>{emotion.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="style" className="flex gap-1.5">
              Style
              <AlertDescription
                title={
                  <span className="text-primary">
                    What is the <kbd className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5">{style}</kbd>&nbsp;?
                  </span>
                }
                description={getStyle(style).description}
              />
            </Label>

            <Select
              value={style}
              defaultValue={"style-default"}
              onValueChange={(value: Style) => setStyle(value)}
              disabled={!user}>
              <SelectTrigger className="w-full md:w-[180px]" id="style">
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>

              <SelectContent className="!overflow-scroll max-h-[300px]">
                {styles.map((style) => (
                  <SelectItem key={style.key} id={style.key} value={style.key}>{style.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tone" className="flex gap-1.5">
              Tone
              <AlertDescription
                title={
                  <span className="text-primary">
                    What is the <kbd className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5">{tone}</kbd>&nbsp;?
                  </span>
                }
                description={getTone(tone).description}
              />
            </Label>
            <Select
              value={tone}
              defaultValue={"tone-default"}
              onValueChange={(value: Tone) => setTone(value)}
              disabled={!user}>
              <SelectTrigger className="w-full md:w-[180px]" id="tone">
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>

              <SelectContent className="!overflow-scroll max-h-[300px]">
                {tones.map((tone) => (
                  <SelectItem key={tone.key} id={tone.key} value={tone.key}>
                    {tone.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="target" className="flex gap-1.5">
              Target
              <AlertDescription
                title={
                  <span className="text-primary">
                    What is the <kbd className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5">{target}</kbd>&nbsp;?
                  </span>
                }
                description={getTarget(target).description}
              />
            </Label>
            <Select
              value={target}
              defaultValue={"target-all"}
              onValueChange={(value: Target) => setTarget(value)}
              disabled={!user}>
              <SelectTrigger className="w-full md:w-[180px]" id="target">
                <SelectValue placeholder="Select a target" />
              </SelectTrigger>

              <SelectContent className="!overflow-scroll max-h-[300px]">
                {targets.map((target) => (
                  <SelectItem key={target.key} id={target.key} value={target.key}>{target.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gpt-version" className="flex gap-1.5">GPT Version</Label>

            <Select
              value={gpt == 3 ? "3" : "4"}
              defaultValue={"3"}
              onValueChange={(value: string) => setGPT(value == "3" ? 3 : 4)}
              disabled={!user}>
              <SelectTrigger className="w-full md:w-[180px]" id="gpt-version">
                <SelectValue placeholder="Select a GPT version" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem key={"3"} id={"3"} value={"3"}>GPT-3</SelectItem>
                <SelectItem key={"4"} id={"4"} value={"4"}>GPT-4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lang" className="flex gap-1.5">Language</Label>
            <Select
              value={lang}
              defaultValue={"en-US"}
              onValueChange={(value: Lang) => setLang(value)}
              disabled={!user}>
              <SelectTrigger className="w-full md:w-[180px]" id="target">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>

              <SelectContent className="!overflow-scroll max-h-[300px]">
                {langs.map((target) => (
                  <SelectItem key={target.key} id={target.key} value={target.key}>{target.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <div className="flex gap-2">
          <div onClick={() => setNewNotReadCount(newNotReadCount + 1)}>
            <Generate
              tw={{
                tweetContext,
                emotion,
                gpt,
                lang,
                style,
                target,
                tone
              }}
            />
          </div>
          <div onClick={() => setNewNotReadCount(0)}>
            <TweetsList newCount={newNotReadCount} />
          </div>
        </div>
        <BuyCredits />
      </CardFooter>
    </>
  );
};

export default Generator;