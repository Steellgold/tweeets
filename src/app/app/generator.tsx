"use client";

import { Card, CardContent, CardFooter } from "@/lib/components/ui/card";
import { Textarea } from "@/lib/components/ui/textarea";
import { useState, type ReactElement, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select";
import type { Emotion, Style, Target, Tone } from "@/lib/configs/generation/types";
import {
  emotions, styles, targets, tones,
  getStyle, getEmotion, getTarget, getTone,
  toneToString, emotionToString, styleToString, targetToString,
  stringToTone, stringToEmotion, stringToStyle, stringToTarget
} from "@/lib/configs/generation/types";
import TweetsList from "./tweets";
import { Label } from "@/lib/components/ui/label";
import { langs, type Lang, langToString, stringToLang } from "@/lib/configs/generation/langs";
import { useUserContext } from "@/lib/contexts/UserProvider";
import BuyCredits from "./credits";
import { Alert, AlertDescription as AD, AlertTitle } from "@/lib/components/ui/alert";
import Generate from "./generate";
import useSWR from "swr";
import { AlertTriangle, Trash2 } from "lucide-react";
import AlertDescription from "@/lib/components/alert-description";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar";
import { Button, buttonVariants } from "@/lib/components/ui/button";
import Link from "next/link";
import { SiTwitter } from "@icons-pack/react-simple-icons";
import { useLoadTweetStore } from "@/lib/store/load-tweet/load-tweet.store";

type UserProps = {
  isFreeCredit: boolean;
}

type SharedUserProps = {
  name: string;
  arobase: string;
  pictureUrl: string;
}

const Generator = (): ReactElement => {
  const { user } = useUserContext();
  const [sharedUser, setSharedUser] = useState<SharedUserProps | null>(null);

  const { data, isLoading } = useSWR<UserProps>("/api/user");
  const { tweet, setTweet } = useLoadTweetStore();

  const [tweetContext, setContext] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("emotion-default");
  const [style, setStyle] = useState<Style>("style-default");
  const [tone, setTone] = useState<Tone>("tone-default");
  const [target, setTarget] = useState<Target>("target-all");
  const [lang, setLang] = useState<Lang>("en-US");
  const [gpt, setGPT] = useState<3 | 4>(3);
  const [loadFromModel, setIsLoadedFromModel] = useState(false);

  useEffect(() => {
    setIsLoadedFromModel(tweet !== null);
    setContext(tweet?.tweetContext ?? "");
    setEmotion(tweet?.emotion ?? "emotion-default");
    setStyle(tweet?.style ?? "style-default");
    setTone(tweet?.tone ?? "tone-default");
    setTarget(tweet?.target ?? "target-all");
    setLang(tweet?.lang ?? "en-US");
    setGPT(tweet?.gpt ?? 3);
  }, [tweet]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const fetchData = async(model: string): Promise<void> => {
      const response = await fetch("/api/share?model=" + model);

      const schema = z.object({
        model: z.object({
          tone: z.string(),
          style: z.string(),
          emotion: z.string(),
          target: z.string(),
          lang: z.string(),
          gpt: z.number(),
          tweetContext: z.string(),
          by: z.object({
            name: z.string(),
            arobase: z.string(),
            pictureUrl: z.string()
          })
        })
      }).safeParse(await response.json());

      if (!schema.success) return;
      setTone(toneToString(stringToTone(schema.data.model.tone)));
      setStyle(styleToString(stringToStyle(schema.data.model.style)));
      setEmotion(emotionToString(stringToEmotion(schema.data.model.emotion)));
      setTarget(targetToString(stringToTarget(schema.data.model.target)));
      setLang(langToString(stringToLang(schema.data.model.lang)));
      setGPT(schema.data.model.gpt as 3 | 4);
      setContext(schema.data.model.tweetContext);
      setSharedUser(schema.data.model.by);
    };

    if (params.has("model")) {
      void fetchData(params.get("model") as string);
    }
  }, []);

  const clearShare = (): void => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    params.delete("model");
    window.history.replaceState({}, "", url.toString());

    setTone("tone-default");
    setStyle("style-default");
    setEmotion("emotion-default");
    setTarget("target-all");
    setLang("en-US");
    setGPT(3);
    setContext("");
    setSharedUser(null);
  };

  return (
    <>
      <CardContent>
        {sharedUser && (
          <Card className="flex justify-between p-3 mb-3">
            <div className="flex flex-col space-y-1">
              <span className="text-muted-foreground text-xs">model shared by</span>
              <div className="flex items-center gap-1">
                {sharedUser.pictureUrl ? (
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage src={sharedUser.pictureUrl} alt={sharedUser.name} />
                    <AvatarFallback>@</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarFallback>@</AvatarFallback>
                  </Avatar>
                )}

                <span>
                  {sharedUser.name} <span className="text-gray-400">(@{sharedUser.arobase})</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size={"sm"} onClick={() => {
                clearShare();
              }}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Link
                className={buttonVariants({ variant: "twitter", size: "sm" })}
                href={`https://twitter.com/${sharedUser.arobase}`}>
                <SiTwitter className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        )}

        {loadFromModel && (
          <Card className="flex justify-between items-center p-3 mb-3">
            <span className="text-muted-foreground">
              You are using one of your old tweets.
            </span>

            <Button variant="outline" size={"sm"} onClick={() => {
              setIsLoadedFromModel(false);
              setTweet(null);
            }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        )}

        <Textarea
          placeholder="Enter your tweet content here"
          disabled={!user}
          minLength={10}
          className="resize-none"
          value={tweetContext}
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

        {!isLoading && gpt == 4 && data?.isFreeCredit && (
          <Alert className="mt-3" variant="yellow">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Ooops!</AlertTitle>
            <AD>
              GPT-4 is only available for users that have bought credits. <br />You can generate this tweet but it will use automatically GPT-3.
            </AD>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <div className="flex gap-2">
          <Generate
            tw={{
              tweetContext,
              emotion,
              gpt: parseInt(gpt == 3 ? "3" : data?.isFreeCredit ? "3" : "4") as 3 | 4,
              lang,
              style,
              target,
              tone
            }}
          />
          <TweetsList />
        </div>
        <BuyCredits />
      </CardFooter>
    </>
  );
};

export default Generator;