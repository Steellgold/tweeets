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
import { PenTool, SaveAll, User } from "lucide-react";
import { z } from "zod";
import { Input } from "@/lib/components/ui/input";

const getData = async(): Promise<{ isPro: boolean; message: string }> => {
  const response = await fetch("/api/isPro");
  const schema = z.object({
    isPro: z.boolean()
  }).safeParse(await response.json());

  const random = exampleTexts[Math.floor(Math.random() * exampleTexts.length)];

  if (!schema.success) return { isPro: false, message: random };
  return { isPro: schema.data.isPro, message: random };
};

const Home = (): ReactElement => {
  const media = useMediaQuery("(max-width: 640px)");
  const [isPro, setIsPro] = useState(false);
  const [length, setLength] = useState(10);
  const [isBlue, _] = useState(false);
  const [__, setSentiment] = useState<WritingSentiment>("sentiment-neutral");
  const [___, setStyle] = useState<WritingStyle>("style-neutral");
  const [____, setTone] = useState<WritingTone>("tone-neutral");
  const [random, setRandom] = useState("");
  const { user } = useUserContext();

  useEffect(() => {
    void getData().then((data) => {
      setIsPro(data.isPro);
      setRandom(data.message);
    });
  }, [isPro]);

  return (
    <div className="flex flex-col items-center justify-center mt-32 py-2 px-3">
      <Card className="w-full sm:w-[20rem] md:w-[30rem] lg:w-[40rem] xl:w-[50rem]">
        <CardHeader>
          <CardTitle>Tweet like a pro</CardTitle>
          <CardDescription>
            Tweeets is a tool for analyzing and creating tweets to make your life easier as a regular Twitter user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="context">Context of the tweet</Label>
            <Textarea id="context" placeholder={!random ? ". . ." : random} className="mb-4" disabled={!user} />
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
                Load template
              </Button>
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader>
                <SheetTitle>Templates</SheetTitle>
                <SheetDescription>
                  Save your own parameters to generate tweets faster, and share them with your friends.
                </SheetDescription>
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
                    <Button variant={"ghost"}>Cancel</Button>
                    <Button>Save</Button>
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

      {!user && (
        <Alert className="w-full sm:w-[20rem] md:w-[30rem] lg:w-[40rem] xl:w-[50rem]">
          <User className="h-4 w-4" />
          <AlertTitle>Log in to use Tweeets</AlertTitle>
          <AlertDescription>
            If you want use Tweeets, you need to log in with your Twitter account, for save your parameters and generate tweets.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Home;