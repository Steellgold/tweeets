"use client";

import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger } from "@/lib/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/lib/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/lib/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/lib/components/ui/sheet";
import type { WritingSentiment, WritingStyle, WritingTone, WritingTarget } from "@/lib/configs/generation/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { sentimentOptions, styleOptions, targetOptions, testProSelected, toneOptions } from "@/lib/configs/generation/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select";
import { ModelResponseSchema, ModelShareResponseSchema, TweetResponseSchema, UserResponseSchema, buildJsonModelString,
  buildJsonTweetString } from "@/lib/utils/schemas";
import { BookDown, BookUp, Coins, Copy, FileInput, Hash, Loader2, PenTool, SaveAll, Share2, Trash2, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/lib/components/ui/alert";
import { Button, buttonVariants } from "@/lib/components/ui/button";
import { useState, type ReactElement, useEffect } from "react";
import { exampleTexts } from "@/lib/configs/generation/ideas";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { SiOpenai, SiTwitter } from "@icons-pack/react-simple-icons";
import { Textarea } from "@/lib/components/ui/textarea";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Badge } from "@/lib/components/ui/badge";
import type { Model, Tweet  } from "@/lib/utils/types";
import { useMediaQuery } from "usehooks-ts";
import Link from "next/link";
import dayjs from "dayjs";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { gen, rau, tweet } from "@/lib/utils";
import { readStream } from "@/lib/utils/stream";
import { Toggle } from "@/lib/components/ui/toggle";
import { getLang, langs } from "@/lib/utils/langs";
import Image from "next/image";

type Response = {
  isPro: boolean;
  message: string;
  models?: Model[];
  tweets?: Tweet[];
  fpDone: boolean;
  priority: boolean;
  loadModel: Model | null;
  usage: number;
};

const getData = async(): Promise<Response> => {
  const response = await fetch("/api/user");
  const schema = UserResponseSchema.safeParse(await response.json());
  const random = exampleTexts[Math.floor(Math.random() * exampleTexts.length)];

  let model: Model | null = null;
  const urlParams = new URLSearchParams(window.location.search);
  const share = urlParams.get("share");
  if (share) {
    const response = await fetch(`/api/model?code=${share}`);
    const schema = ModelResponseSchema.safeParse(await response.json());
    if (!schema.success) {
      model = null;
    } else {
      model = schema.data;
    }
  }

  if (!schema.success) {
    return { isPro: false, message: random, models: [], tweets: [], fpDone: false, priority: false, loadModel: model, usage: 0 };
  }

  return {
    isPro: schema.data.isPro,
    message: random,
    models: schema.data.models || [],
    tweets: schema.data.tweets || [],
    fpDone: schema.data.fpDone,
    priority: schema.data.priority,
    loadModel: model,
    usage: schema.data.usage
  };
};

const navigatorLanguage = (): string => {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.split("-")[0];
};

const Home = (): ReactElement => {
  const { user } = useUserContext();
  const media = useMediaQuery("(max-width: 640px)");

  const [isPro, setIsPro] = useState(false);
  const [isPriority, setPriority] = useState(false);

  const [sentiment, setSentiment] = useState<WritingSentiment>("sentiment-neutral");
  const [style, setStyle] = useState<WritingStyle>("style-neutral");
  const [tone, setTone] = useState<WritingTone>("tone-neutral");
  const [target, setTarget] = useState<WritingTarget>("target-all");
  const [lang, setLang] = useState<string>(navigatorLanguage);

  const [random, setRandom] = useState("");
  const [context, setContext] = useState("");

  const [gptFourEnabled, setGptFourEnabled] = useState<boolean>(false);

  const [includeHTags, setIncludeHTags] = useState<boolean>(false);
  const [hTags, setHTags] = useState<string[]>([]);

  const [answering, setAnswering] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");

  // const [fpDone, setFpDone] = useState(true);

  const [tweets, setTweets] = useState<Tweet[]>([]);

  const [models, setModels] = useState<Model[]>([]);
  const [modelName, setModelName] = useState<string>("");
  const [modelDescription, setModelDescription] = useState<string>("");

  const [usage, setUsage] = useState<number>(0);

  useEffect(() => {
    void getData().then((data) => {
      setIsPro(data.isPro);
      setRandom(data.message);
      setModels(data.models ?? []);
      // setFpDone(data.fpDone);
      setTweets(data.tweets ?? []);
      setPriority(data.priority);
      setUsage(data.usage);
      if (data.loadModel) handleLoad(data.loadModel);
    });
  }, [isPro]);

  const handleShareModel = async(model: Model): Promise<void> => {
    if (!user) return;
    if (answering) return;

    const link = gen(5);

    const newModels = models.map((m) => {
      if (m.id === model.id) m.shareLink = link;
      return m;
    });

    setModels(newModels);

    const response = await fetch("/api/model/share", { method: "POST", body: JSON.stringify({
      link: link,
      modelId: model.id
    }) });

    const schema = ModelShareResponseSchema.safeParse(await response.json());
    if (!schema.success) return;
  };

  const handleModelSave = async(): Promise<void> => {
    if (!user) return;
    if (answering) return;
    if (models.length === (isPro ? 50 : 3)) return;

    const response = await fetch("/api/model", { method: "POST", body: buildJsonModelString({
      id: `model-${dayjs().unix()}`,
      userId: user.id,
      name: modelName,
      description: modelDescription ?? null,
      shareLink: null,
      createdAt: dayjs().toDate().toDateString(),
      sentiment,
      style,
      tone,
      target,
      context,
      lang,
      gpt4: gptFourEnabled,
      includeHashtags: includeHTags, hashtags: hTags
    }) });
    const schema = ModelResponseSchema.safeParse(await response.json());

    if (!schema.success) return;
    setModels([...models, schema.data]);
    return;
  };

  // const handleFpDone = async(): Promise<void> => {
  //   if (!user) return;
  //   setFpDone(true);
  //   await fetch("/api/user/fpdone", { method: "PUT" });
  // };

  const handleGenerate = async(): Promise<void> => {
    if (!user) return;
    if (answering) return;
    if (!testProSelected(isPro, [sentiment, style, tone, target])) return;
    if (usage >= (isPro ? 50 : 10)) return;

    setAnswering(true);
    setAnswer("");
    setUsage(usage + 1);

    const response = await fetch("/api/user/tweets/generate", {
      method: "POST",
      body: JSON.stringify({
        tweetContext: context,
        tweetSentiment: sentiment,
        tweetTone: tone,
        tweetStyle: style,
        tweetTarget: target,
        tweetLang: lang,
        model: gptFourEnabled ? "gpt-4-turbo-32k" : "gpt-3.5-turbo-16k"
      })
    });

    if (!response.ok || response.status !== 200 || response.body === null) {
      setAnswering(false);
      return;
    }

    let result = "";
    await readStream(response.body, (chunk) => {
      result += chunk;
      setAnswer(result);
    }).finally(() => {
      if (result.startsWith("\"")) result = result.substring(1);
      if (result.endsWith("\"")) result = result.substring(0, result.length - 1);
      if (includeHTags && hTags.length > 0) result += " " + hTags.map((tag) => tag).join(" ");
      setAnswer(result);
    });

    setAnswering(false);
  };

  const handleSave = async(): Promise<void> => {
    if (!user) return;
    if (answering) return;
    if (tweets.find((tweet) => tweet.context === context && tweet.result === answer)) return;
    if (!testProSelected(isPro, [sentiment, style, tone, target])) return;
    const tweet: Tweet = {
      id: `tweet-${dayjs().unix()}`,
      userId: user.id,
      context,
      sentiment,
      style,
      tone,
      target,
      lang,
      includeHashtags: includeHTags,
      hashtags: hTags,
      result: answer,
      gpt4: gptFourEnabled,
      createdAt: dayjs().toDate().toDateString()
    };

    setTweets([...tweets, tweet]);

    const response = await fetch("/api/user/tweets", {
      method: "POST",
      body: buildJsonTweetString(tweet)
    });

    if (!response.ok || response.status !== 200 || response.body === null) return;

    const schema = TweetResponseSchema.safeParse(await response.json());
    if (!schema.success) {
      return;
    }
  };

  const handleTweetDelete = async(tweet: Tweet): Promise<void> => {
    if (!user) return;
    if (answering) return;
    if (tweets.length === 0) return;
    if (tweets.find((t) => t.id === tweet.id) === undefined) return;

    const newTweets = tweets.filter((t) => t.id !== tweet.id);
    setTweets(newTweets);

    const response = await fetch("/api/user/tweets", {
      method: "DELETE",
      body: JSON.stringify({ id: tweet.id })
    });

    if (!response.ok || response.status !== 200 || response.body === null) return;
  };


  const handleLoad = (model: Model | Tweet): void => {
    setSentiment(model.sentiment as WritingSentiment);
    setStyle(model.style as WritingStyle);
    setTone(model.tone as WritingTone);
    setTarget(model.target as WritingTarget);
    setIncludeHTags(model.includeHashtags);
    setHTags(model.hashtags ?? []);
    setGptFourEnabled(model.gpt4);
    setContext(model.context);
    setLang(model.lang);

    if ("result" in model) {
      if (model.result === undefined) return;
      setAnswer(model.result ?? "");
    }
  };

  const handleModelDelete = async(model: Model): Promise<void> => {
    if (!user) return;
    if (answering) return;
    if (models.length === 0) return;
    if (models.find((m) => m.id === model.id) === undefined) return;

    const newModels = models.filter((m) => m.id !== model.id);
    setModels(newModels);

    const response = await fetch("/api/model", {
      method: "DELETE",
      body: JSON.stringify({ id: model.id })
    });

    if (!response.ok || response.status !== 200 || response.body === null) return;
  };

  return (
    <div className="flex flex-col items-center justify-center mt-3 md:mt-12 py-2 px-3">
      {!user && (
        <Alert className="w-full sm:w-[20rem] md:w-[25rem] lg:w-[30rem] xl:w-[35rem] mb-4">
          <User className="h-4 w-4" />
          <AlertTitle>Log in to use Tweeets</AlertTitle>
          <AlertDescription>
            If you want use Tweeets, you need to log in with your Twitter account, for save your parameters and generate tweets.
          </AlertDescription>
        </Alert>
      )}

      {user && (usage >= (isPro ? 25 : 5)) && (
        <Alert className="w-full sm:w-[20rem] md:w-[25rem] lg:w-[30rem] xl:w-[35rem] mb-4" variant={
          usage == (isPro ? 50 : 10) ? "destructive" : (usage >= (isPro ? 25 : 5) ? "warning" : "default")
        }>
          <Coins className="h-4 w-4" />
          <AlertTitle>You&apos;re {usage == (isPro ? 50 : 10) ? "" : "almost "}out of usage</AlertTitle>
          <AlertDescription>
            You&apos;re {usage == (isPro ? 50 : 10) ? "" : "almost "}out of usage,
            you&apos;ve used <strong>{usage}</strong> of <strong>{isPro ? 50 : 10}</strong> tweets this month.
          </AlertDescription>
        </Alert>
      )}

      {/* {!fpDone && user && (
        <Alert className="w-full sm:w-[20rem] md:w-[25rem] lg:w-[30rem] xl:w-[35rem] mb-4">
          <User className="h-4 w-4" />
          <AlertTitle>Finish your profile</AlertTitle>
          <AlertDescription>
            If you want your generated tweets to be based on your Twitter profile, you can give us up to 10 contents of
            your tweets so we can generate more personalized tweets for you based on your writing style
            <strong>as well as</strong> the parameters you chose below.

            <div className="mt-2 flex justify-end gap-2">
              <Button variant={"destructive"} size={"sm"} onClick={() => void handleFpDone()}>
                No, thanks
              </Button>
              <Link href={"/fptweets"} className={buttonVariants({ variant: "default", size: "sm" })}>
                Finish my profile
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )} */}

      <Card className="w-full sm:w-[20rem] md:w-[25rem] lg:w-[30rem] xl:w-[35rem] mb-4">
        <CardHeader>
          <CardTitle>Tweet like a pro</CardTitle>
          <CardDescription>
            Tweeets is a tool for analyzing and creating tweets to make your life easier as a regular Twitter user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-5">
            <Label htmlFor="context" className="mb-0.5">Context of the tweet</Label>
            <Textarea
              id="context"
              placeholder={!random ? ". . ." : random}
              disabled={!user || answering}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              lw8={(context.toLowerCase().includes("lw8") && context.split(" ").length === 1) || false}
              supabase={(context.toLowerCase().includes("supabase") && context.split(" ").length === 1) || false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            <div className="space-y-2">
              <Label htmlFor="sentiment">Sentiment</Label>
              <Select
                defaultValue="sentiment-neutral"
                value={sentiment}
                onValueChange={(value) => setSentiment(value as WritingSentiment)} disabled={!user || answering}>
                <SelectTrigger id="sentiment">
                  <SelectValue placeholder="Select a sentiment" />
                </SelectTrigger>
                <SelectContent>
                  {sentimentOptions.map((option) => (
                    <SelectItem key={option.key} id={option.key} value={option.key} disabled={option.isPro && !isPro || answering}>
                      {option.value} {!isPro && option.isPro && <Badge variant={"pro"}>Pro</Badge>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Writing style</Label>
              <Select
                defaultValue="style-neutral"
                value={style}
                onValueChange={(value) => setStyle(value as WritingStyle)} disabled={!user || answering}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select a writing style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option.key} id={option.key} value={option.key} disabled={option.isPro && !isPro || answering}>
                      {option.value} {!isPro && option.isPro && <Badge variant={"pro"}>Pro</Badge>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select
                defaultValue="tone-neutral"
                value={tone}
                onValueChange={(value) => setTone(value as WritingTone)} disabled={!user || answering}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.key} id={option.key} value={option.key} disabled={option.isPro && !isPro || answering}>
                      {option.value} {!isPro && option.isPro && <Badge variant={"pro"}>Pro</Badge>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Audience target</Label>
              <Select
                defaultValue="target-all"
                value={target}
                onValueChange={(value) => setTarget(value as WritingTarget)} disabled={!user || answering}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  {targetOptions.map((option) => (
                    <SelectItem key={option.key} id={option.key} value={option.key} disabled={option.isPro && !isPro || answering}>
                      {option.value} {!isPro && option.isPro && <Badge variant={"pro"}>Pro</Badge>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="lang">Generate the tweet in: </Label>
            {lang == "ru" && (
              <CardDescription className="text-xs text-muted-foreground mb-2">
                Write your context in Russian for a better result. <br />
                Для получения лучшего результата напишите свой контекст на русском языке.
              </CardDescription>
            )}
            <Select
              defaultValue={lang}
              value={lang}
              onValueChange={(value) => setLang(value)} disabled={!user || answering}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {langs.map((lang) => (
                  <SelectItem key={lang.value} id={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Toggle aria-label="Include hashtags" onPressedChange={(value) => setIncludeHTags(value)}>
              <Hash size={16} />
            </Toggle>

            <Input
              placeholder={includeHTags ? "Ex: #buildinpublic, #firstproject" : "Hashtags (click on the toggle to enable)"}
              disabled={!user || answering || !includeHTags}
              value={hTags.join(", ")}
              onChange={(e) => setHTags(e.target.value.split(", ").map((tag) => tag.trim()))} />
          </div>

          <div className="mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size={"sm"} disabled={!user || answering}>
                  <SiOpenai className="h-4 w-4" />&nbsp;&nbsp;GPT-{gptFourEnabled ? "4" : "3"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Choose a model</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => void setGptFourEnabled(false)}>
                  <SiOpenai className="h-4 w-4" />&nbsp;&nbsp;GPT-3
                </DropdownMenuItem>
                <DropdownMenuItem disabled={!isPriority} onClick={() => void setGptFourEnabled(true)}>
                  <SiOpenai className="h-4 w-4" />&nbsp;&nbsp;GPT-4
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-2">
          <Sheet>
            <SheetTrigger disabled={!user || answering}>
              <Button size={"sm"} variant={"link"} disabled={!user || answering}>
                Load models
              </Button>
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader>
                <SheetTitle>Models ({models.length}/{isPro ? 50 : 3})</SheetTitle>
                <SheetDescription>
                  Save your own parameters to generate tweets faster, and share them with your friends.
                </SheetDescription>

                {models.length === 0 && (
                  <SheetDescription className="mt-2">
                    You don&apos;t have any templates yet.
                  </SheetDescription>
                )}

                {models.length === (isPro ? 50 : 3) && (
                  <>
                    {isPro ? (
                      <Alert className="mt-2">
                        <AlertTitle>Pro limit reached</AlertTitle>
                        <AlertDescription>
                          You have reached the limit of 50 models (wow). You can delete some of them to create new ones.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="mt-2" variant={"destructive"}>
                        <AlertTitle>Free limit reached</AlertTitle>
                        <AlertDescription>
                          You have reached the limit of 3 models. You can delete some of them to create new ones.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                {models.length > 0 && models.map((model) => (
                  <Card key={model.id} className="mt-2">
                    <CardHeader>
                      <CardTitle className="text-base">{model.name}</CardTitle>
                      {model.description && <CardDescription className="text-xs text-gray-400">{model.description}</CardDescription>}
                      <CardDescription className="text-xs text-gray-400">
                        Model created the:&nbsp;
                        {dayjs(model.createdAt).format("DD/MM/YYYY")} at {dayjs(model.createdAt).format("HH:mm")} <br />
                        <SiOpenai className="h-4 w-4 inline-block ml-1" /> {model.gpt4 ? "GPT-4" : "GPT-3"} <br />
                        Tone: {rau(model.tone, "tone-")} <br />
                        Sentiment: {rau(model.sentiment, "sentiment-")} <br />
                        Style: {rau(model.style, "style-")} <br />
                        Target: {rau(model.target, "target-")} <br />
                        Language: {getLang(model.lang)}
                      </CardDescription>

                      {model.shareLink && (
                        <Input
                          className="mt-2"
                          value={`${process.env.NEXT_PUBLIC_URL ?? "tweeets.app"}/?share=${model.shareLink}`}
                          disabled
                          readOnly />
                      )}
                    </CardHeader>

                    <CardFooter className="flex justify-end gap-2">
                      <Button variant={"ghost"} size={"icon"} onClick={() => {
                        if (model.shareLink !== null) return;
                        void handleShareModel(model);
                      }}>
                        <Share2 size={16} />
                      </Button>
                      <Button variant={"destructive"} size={"icon"} onClick={() => void handleModelDelete(model)}>
                        <Trash2 size={16} />
                      </Button>
                      <Button variant={"default"} size={"sm"} onClick={() => void handleLoad(model)}>
                        <FileInput size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger disabled={!user || answering}>
                <Button size={media ? "icon" : "sm"} disabled={!user || answering || context == ""}>
                  {media ? <SaveAll /> : "Save"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save as template</DialogTitle>
                  <DialogDescription>
                    Save your parameters to generate tweets faster, and share them with your friends.
                    <Input
                      placeholder="Template name"
                      className="mt-2"
                      disabled={!user || answering}
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)} />
                    <Textarea
                      placeholder="Template description (optional)"
                      className="mt-2"
                      disabled={!user || answering}
                      value={modelDescription}
                      onChange={(e) => setModelDescription(e.target.value)} />
                  </DialogDescription>

                  <DialogFooter className="flex justify-end gap-2 mt-2">
                    <Button variant={"default"} size={"sm"} onClick={() => void handleModelSave()}>
                      Save
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {user && (isPro && usage >= 50 || !isPro && usage >= 10) ? (
              <Button variant={"destructive"} size={media ? "icon" : "sm"} disabled>
                <Coins />&nbsp;&nbsp;Out of usage
              </Button>
            ) : (
              <Button size={media || answering ? "icon" : "sm"} disabled={!user || answering || context == ""} onClick={() => {
                void handleGenerate();
              }}>
                {answering ? <Loader2 className="animate-spin" /> : <>
                  {media ? <PenTool /> : "Generate"}
                </>}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {user && answer !== "" ? (
        <Card className="w-full sm:w-[20rem] md:w-[25rem] lg:w-[30rem] xl:w-[35rem] mb-4">
          <CardHeader>
            <CardTitle>Generated tweet</CardTitle>
            <CardDescription>
              Here is your generated tweet, you can copy it to your clipboard or share on Twitter/X.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={answer} className="max-h-72 h-fit h-[130px]" readOnly />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"} size={"icon"}>
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Think twice before clicking that button, did you save the tweet? You won&apos;t be able to retrieve it later
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => void setAnswer("")}>
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant={"default"} size={"sm"} onClick={() => void handleSave()}>
              <BookDown size={16} />&nbsp;&nbsp;Save
            </Button>
            <Button variant={"default"} size={"icon"}>
              <Copy size={16} />
            </Button>
            <Link target="_blank" href={tweet(answer)} className={buttonVariants({ variant: "default", size: "icon" })}>
              <SiTwitter size={16} />
            </Link>
          </CardFooter>
        </Card>
      ) : null}

      {user && tweets.length > 0 ? (
        <>
          {tweets.map((tweet) => (
            <Card key={tweet.id} className="w-full sm:w-[20rem] md:w-[25rem] lg:w-[30rem] xl:w-[35rem] mb-4">
              <CardHeader>
                <CardDescription>{tweet.result}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-end gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"destructive"} size={"icon"}>
                      <Trash2 size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        If you delete it, you will never be able to find this item again in the history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => void handleTweetDelete(tweet)}>
                        Yes, delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button variant={"default"} size={"sm"} onClick={() => void handleLoad(tweet)}>
                  <BookUp size={16} />&nbsp;&nbsp;Load
                </Button>
              </CardFooter>
            </Card>
          ))}
        </>
      ) : null}

      <Link href={"https://linkfy.fr/6yck"} target="_blank">
        <Image
          src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=546656&theme=neutral"
          alt="Tweeets - Tweet&#0032;with&#0032;AI | Product Hunt"
          style={{
            width: "250px",
            height: "54px"
          }}
          className="opacity-20 hover:opacity-100 transition-opacity duration-300"
          width="250"
          height="54"
        />
      </Link>
    </div>
  );
};

export default Home;