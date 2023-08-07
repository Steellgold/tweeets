"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/lib/components/ui/sheet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/lib/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select";
import type { WritingSentiment, WritingStyle, WritingTone } from "@/lib/configs/generation/types";
import { Alert, AlertDescription, AlertTitle } from "@/lib/components/ui/alert";
import { useState, type ReactElement, useEffect } from "react";
import { exampleTexts } from "@/lib/configs/generation/ideas";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { Textarea } from "@/lib/components/ui/textarea";
import { Slider } from "@/lib/components/ui/slider";
import { Button } from "@/lib/components/ui/button";
import { Label } from "@/lib/components/ui/label";
import { Badge } from "@/lib/components/ui/badge";
import { useMediaQuery } from "usehooks-ts";
import { FileInput, PenTool, SaveAll, Share2, Trash2, User } from "lucide-react";
import { z } from "zod";
import { Input } from "@/lib/components/ui/input";
import dayjs from "dayjs";

type Model = {
  id: string;
  createdAt: string;
  userId: string;
  name: string;
  description?: string | null;
  shareLink?: string | null;
};

const getData = async(): Promise<{ isPro: boolean; message: string; models?: Model[] }> => {
  const response = await fetch("/api/user");
  const schema = z.object({
    isPro: z.boolean(),
    models: z.array(z.object({
      id: z.string(),
      createdAt: z.string(),
      userId: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      shareLink: z.string().nullable()
    })).optional()
  }).safeParse(await response.json());

  const random = exampleTexts[Math.floor(Math.random() * exampleTexts.length)];

  if (!schema.success) {
    console.log(schema.error);
    return { isPro: false, message: random, models: [] };
  }
  return { isPro: schema.data.isPro, message: random, models: schema.data.models || [] };
};

const Home = (): ReactElement => {
  const media = useMediaQuery("(max-width: 640px)");
  const [isPro, setIsPro] = useState(false);
  const [models, setModels] = useState<Model[]>([]);

  const [length, setLength] = useState(10);
  const [isBlue, _] = useState(false);
  const [__, setSentiment] = useState<WritingSentiment>("sentiment-neutral");
  const [___, setStyle] = useState<WritingStyle>("style-neutral");
  const [____, setTone] = useState<WritingTone>("tone-neutral");
  const [random, setRandom] = useState("");
  const { user } = useUserContext();

  const [model, setModel] = useState<Model | null>(null);

  useEffect(() => {
    void getData().then((data) => {
      setIsPro(data.isPro);
      setRandom(data.message);
      setModels(data.models ?? []);
      console.log("aaaaaaaa", data.models);
    });
  }, [isPro]);

  const handleModelSave = async(): Promise<void> => {
    if (!user) return;
    if (!model) return;
    if (models.length === (isPro ? 50 : 3)) return;

    const response = await fetch("/api/model", {
      method: "POST",
      body: JSON.stringify({
        name: model.name,
        description: model.description ?? null
      })
    });

    const schema = z.object({
      id: z.string(),
      createdAt: z.string(),
      userId: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      shareLink: z.string().nullable()
    }).safeParse(await response.json());

    if (!schema.success) {
      console.log(schema.error);
      return;
    }

    setModels([...models, schema.data]);
    return;
  };


  return (
    <div className="flex flex-col items-center justify-center mt-3 md:mt-32 py-2 px-3">
      {!user && (
        <Alert className="w-full sm:w-[20rem] md:w-[30rem] lg:w-[40rem] xl:w-[50rem] mb-4">
          <User className="h-4 w-4" />
          <AlertTitle>Log in to use Tweeets</AlertTitle>
          <AlertDescription>
            If you want use Tweeets, you need to log in with your Twitter account, for save your parameters and generate tweets.
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full sm:w-[30rem] md:w-[30rem] lg:w-[40rem] xl:w-[50rem]">
        <CardHeader>
          <CardTitle>Tweet like a pro</CardTitle>
          <CardDescription>
            Tweeets is a tool for analyzing and creating tweets to make your life easier as a regular Twitter user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-5">
            <Label htmlFor="context">Context of the tweet</Label>
            <Textarea id="context" placeholder={!random ? ". . ." : random} disabled={!user} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 mt-1.5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sentiment">Sentiment</Label>
              <Select defaultValue="sentiment-neutral" onValueChange={(value) => setSentiment(value as WritingSentiment)} disabled={!user}>
                <SelectTrigger id="sentiment">
                  <SelectValue placeholder="Select a sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem id="sentiment-neutral" value="sentiment-neutral">Neutral</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-adventurous" disabled={!isPro}>
                    Adventurous {!isPro && <Badge variant={"pro"}>Pro</Badge>}</SelectItem>
                  <SelectItem id="sentiment-exhilarated" value="sentiment-exhilarated" disabled={!isPro}>
                    Exhilarated {!isPro && <Badge variant={"pro"}>Pro</Badge>}</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-grateful" disabled={!isPro}>
                    Grateful {!isPro && <Badge variant={"pro"}>Pro</Badge>}</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-joyful">Joyful</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-sad">Sad</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-energetic">Energetic</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-calm">Calm</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-confident">Confident</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-hopeful">Hopeful</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-sarcastic">Sarcastic</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-playful">Playful</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-thoughtful">Thoughtful</SelectItem>
                  <SelectItem id="sentiment-neutral" value="sentiment-motivational">Motivational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Writing style</Label>
              {/* can click on "friendy", "informative" and "poetic" even if not pro but the select value doesn't change */}
              <Select defaultValue="style-neutral" onValueChange={(value) => setStyle(value as WritingStyle)} disabled={!user}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select a writing style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem id="style-neutral" value="style-neutral">Neutral</SelectItem>

                  <SelectItem id="style-friendly" value="style-friendly" disabled={!isPro}>
                    Friendly {!isPro && <Badge variant={"pro"}>Pro</Badge>}</SelectItem>
                  <SelectItem id="style-informative" value="style-informative" disabled={!isPro}>
                    Informative {!isPro && <Badge variant={"pro"}>Pro</Badge>}</SelectItem>
                  <SelectItem id="style-poetic" value="style-poetic" disabled={!isPro}>
                    Poetic {!isPro && <Badge variant={"pro"}>Pro</Badge>}</SelectItem>
                  <SelectItem id="style-formal" value="style-formal">Formalb</SelectItem>
                  <SelectItem id="style-humorous" value="style-humorous">Humorous</SelectItem>
                  <SelectItem id="style-inspirational" value="style-inspirational">Inspirational</SelectItem>
                  <SelectItem id="style-educational" value="style-educational">Educational</SelectItem>
                  <SelectItem id="style-controversial" value="style-controversial">Controversial</SelectItem>
                  <SelectItem id="style-sentimental" value="style-sentimental">Sentimental</SelectItem>
                  <SelectItem id="style-mysterious" value="style-mysterious">Mysterious</SelectItem>
                  <SelectItem id="style-engaging" value="style-engaging">Engaging</SelectItem>
                  <SelectItem id="style-narrative" value="style-narrative">Narrative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select defaultValue="tone-neutral" onValueChange={(value) => setTone(value as WritingTone)} disabled={!user}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                {/* flex, 2 per lines for md: and default 1 per line */}
                <SelectContent>
                  <SelectItem id="tone-neutral" value="tone-neutral">Neutral</SelectItem>
                  <SelectItem id="tone-appreciative" value="tone-appreciative" disabled={!isPro}>
                    Appreciative {!isPro && <Badge variant={"pro"}>Pro</Badge>}</SelectItem>
                  <SelectItem id="tone-curious" value="tone-curious" disabled={!isPro}>
                    Curious {!isPro && <Badge variant={"pro"}>Pro</Badge>}</SelectItem>
                  <SelectItem id="tone-motivational" value="tone-motivational" disabled={!isPro}>
                    Motivational {!isPro && <Badge variant={"pro"}>Pro</Badge>}</SelectItem>
                  <SelectItem id="tone-optimistic" value="tone-optimistic">Optimistic</SelectItem>
                  <SelectItem id="tone-pessimistic" value="tone-pessimistic">Pessimistic</SelectItem>
                  <SelectItem id="tone-angry" value="tone-angry">Angry</SelectItem>
                  <SelectItem id="tone-joyful" value="tone-joyful">Joyful</SelectItem>
                  <SelectItem id="tone-sad" value="tone-sad">Sad</SelectItem>
                  <SelectItem id="tone-energetic" value="tone-energetic">Energetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-1.5 items-center">
            <div className="space-y-2">
              <Label htmlFor="length">Length {length}/{isBlue ? 4000 : 280}</Label>
              <Slider
                id="length"
                defaultValue={[length]}
                max={isBlue ? (isPro ? 4000 : 280) : 280}
                step={isBlue ? 25 : 1}
                onValueChange={(value) => setLength(value[0])}
                disabled={!user} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-2">
          <Sheet>
            <SheetTrigger disabled={!user}>
              <Button size={"sm"} variant={"link"} disabled={!user}>
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
                        {dayjs(model.createdAt).format("DD/MM/YYYY")} at {dayjs(model.createdAt).format("HH:mm")}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter className="flex justify-end gap-2">
                      <Button variant={"ghost"} size={"icon"}>
                        <Share2 size={16} />
                      </Button>
                      <Button variant={"destructive"} size={"icon"}>
                        <Trash2 size={16} />
                      </Button>
                      <Button variant={"default"} size={"sm"}>
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
              <DialogTrigger disabled={!user}>
                <Button size={media ? "icon" : "sm"} disabled={!user}>
                  {media ? <SaveAll /> : "Save parameters"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save as template</DialogTitle>
                  <DialogDescription>
                    Save your parameters to generate tweets faster, and share them with your friends.
                    <Input placeholder="Template name" className="mt-2" />
                    <Textarea placeholder="Template description (optional)" className="mt-2" />
                  </DialogDescription>

                  <DialogFooter className="flex justify-end gap-2 mt-2">
                    <Button variant={"default"} size={"sm"}>
                      Save
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Button size={media ? "icon" : "sm"} disabled={!user}>
              {media ? <PenTool /> : "Generate"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;