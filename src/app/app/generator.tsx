"use client";

import { Button } from "@/lib/components/ui/button";
import { CardContent, CardFooter } from "@/lib/components/ui/card";
import { Checkbox } from "@/lib/components/ui/checkbox";
import { Input } from "@/lib/components/ui/input";
import { Textarea } from "@/lib/components/ui/textarea";
import { useState, type ReactElement } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select";
import type { Emoji, Emotion, Style, Target, Tone } from "@/lib/configs/generation/types";
import { emojis, emotions, getEmotion, getStyle, getTarget, getTone, styles, targets, tones } from "@/lib/configs/generation/types";
import TweetsList from "./tweets";
import AlertDescription from "@/lib/components/alert-description";
import { Label } from "@/lib/components/ui/label";
import { langs, type Lang } from "@/lib/configs/generation/langs";
import { Coins } from "lucide-react";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { cn } from "@/lib/utils";

const Generator = (): ReactElement => {
  const { user } = useUserContext();

  const [addInstructions, setAddInstructions] = useState(false);
  // const [instructions, setInstructions] = useState("");
  const [addNInstructions, setAddNInstructions] = useState(false);
  // const [negativeInstructions, setNegativeInstructions] = useState("");
  const [addEmojis, setAddEmojis] = useState(false);
  const [_emojis, setEmojis] = useState<Emoji>("emoji-default");

  const [gptVersion, setGptVersion] = useState<"3" | "4">("3");

  const [emotion, setEmotion] = useState<Emotion>("emotion-default");
  const [style, setStyle] = useState<Style>("style-default");
  const [tone, setTone] = useState<Tone>("tone-default");
  const [target, setTarget] = useState<Target>("target-all");
  const [lang, setLang] = useState<Lang>("en-US");

  return (
    <>
      <CardContent>
        <Textarea placeholder="Enter your tweet content here" disabled={!user} className="resize-none" />

        <div className="flex gap-4 items-center mt-4">
          <Checkbox onCheckedChange={(checked: boolean) => setAddInstructions(checked)} disabled={!user} defaultChecked={addInstructions} />
          <Input placeholder="Customize the instructions" disabled={!addInstructions} />
        </div>

        <div className="flex gap-4 items-center mt-2">
          <Checkbox onCheckedChange={(checked: boolean) => setAddNInstructions(checked)} disabled={!user} defaultChecked={addNInstructions} />
          <Input placeholder="Customize the negative instructions" disabled={!addNInstructions} />
        </div>

        <div>
          <Label htmlFor="emojis" className={cn({ "flex gap-1.5 mt-4": true, "hidden": !user || !addEmojis })}>
            Emojis
            <AlertDescription
              title={<span className="text-primary">What are emojis?</span>}
              description="Add the emojis you want, separating them with a comma, or leave blank if you want to use any existing emoji!"
            />
          </Label>
          <div className="flex gap-4 items-center mt-2">
            <Checkbox onCheckedChange={(checked: boolean) => setAddEmojis(checked)} disabled={!user} defaultChecked={addEmojis} />
            <div className="flex gap-2 items-center w-full">
              <Input id="emojis" placeholder="Add emojis to your tweet" disabled={!addEmojis} />
              <Select
                value={_emojis}
                defaultValue={"emoji-default"}
                onValueChange={(value: Emoji) => setEmojis(value)}
                disabled={!addEmojis}>
                <SelectTrigger className="w-full md:w-[380px]">
                  <SelectValue placeholder="Select an emoji level" />
                </SelectTrigger>

                <SelectContent className="!overflow-scroll max-h-[300px]">
                  {emojis.map((emoji) => (
                    <SelectItem key={emoji.key} id={emoji.key} value={emoji.key}>{emoji.value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

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
              onValueChange={(value: Emotion) => setEmotion(value)}>
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
              onValueChange={(value: Style) => setStyle(value)}>
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
              onValueChange={(value: Tone) => setTone(value)}>
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
              onValueChange={(value: Target) => setTarget(value)}>
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
              value={gptVersion}
              defaultValue={"3"}
              onValueChange={(value: "3" | "4") => setGptVersion(value)}>
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
              onValueChange={(value: Lang) => setLang(value)}>
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
          <Button size={"sm"}>Generate</Button>
          <TweetsList newCount={0} />
        </div>
        <Button variant={"link"} size={"sm"}>
          <Coins size={20} />
          <span className="ml-2">Buy more credits</span>
        </Button>
      </CardFooter>
    </>
  );
};

export default Generator;