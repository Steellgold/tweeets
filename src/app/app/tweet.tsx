"use client";

import { Button, buttonVariants } from "@/lib/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { SiOpenai, SiTwitter } from "@icons-pack/react-simple-icons";
import { Book, Brain, Clipboard, ExternalLink, Flag, ListRestart, Loader2, MessageCircle, PenLine, PenTool, Share2, Smile, Target,
  Trash,
  XCircle } from "lucide-react";
import { useState, type ReactElement } from "react";
import dayjs from "dayjs";
import { getLang, langToString } from "@/lib/configs/generation/langs";
import { emotionToString, getEmotion, getStyle, getTarget, getTone, styleToString, targetToString, toneToString }
  from "@/lib/configs/generation/types";
import Link from "next/link";
import { toTweetUrl } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { toast } from "@/lib/components/ui/use-toast";
import { Input } from "@/lib/components/ui/input";
import { Badge } from "@/lib/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/lib/components/ui/alert-dialog";
import { useLoadTweetStore } from "@/lib/store/load-tweet/load-tweet.store";

type TweetProps = Prisma.TweetsGetPayload<{
  include: { user: false };
}> & { first: boolean };

const Tweet = ({
  userId, createdAt, emotion, generated, gpt, lang, style, target, tone, first, id, isShared, sharedTemplateSlug, context
}: TweetProps): ReactElement => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState(sharedTemplateSlug);
  const [isSharedState, setIsSharedState] = useState(isShared);
  const [isDeleted, setIsDeleted] = useState(false);
  const { tweet, setTweet } = useLoadTweetStore();

  const share = async(): Promise<void> => {
    setIsSharing(true);
    if (!isSharedState) {
      toast({ title: "Sharing...", description: "Please wait while we share your tweet." });
    } else {
      toast({ title: "Unshared!", description: "Your tweet has been unshared." });
      setShareUrl(null);
      setIsSharing(false);
      setIsSharedState(false);
    }

    const res = await fetch("/api/share", {
      method: "POST",
      body: JSON.stringify({
        userId,
        id,
        action: isSharedState ? "unshare" : "share"
      }),
      headers: { "Content-Type": "application/json" }
    });

    const schema = z.object({
      id: z.string(),
      slug: z.string().nullable(),
      action: z.string().regex(/^(share|unshare)$/)
    }).safeParse(await res.json());

    if (!schema.success) {
      toast({ title: "Oh no!", description: "Something went wrong while sharing your tweet." });
      setIsSharing(false);
      return;
    }

    const { slug, action } = schema.data;
    if (!slug && action === "share") return;
    setShareUrl(!slug ? null : `https://tweeets.app/app?model=${slug}`);
    setIsSharing(false);
    setIsSharedState(!isSharedState);
  };

  const deleteTweet = async(): Promise<void> => {
    setIsDeleted(true);
    const res = await fetch("/api/save", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" }
    });

    const schema = z.object({ deleted: z.boolean() }).safeParse(await res.json());

    if (!schema.success) {
      toast({ title: "Oh no!", description: "Something went wrong while deleting your tweet." });
      setIsDeleted(false);
      return;
    }

    if (schema.data.deleted) {
      toast({ title: "Deleted!", description: "Your tweet has been deleted." });
      setIsDeleted(true);
    } else {
      toast({ title: "Oh no!", description: "Something went wrong while deleting your tweet." });
      setIsDeleted(false);
    }
  };

  if (isDeleted) return (<></>);

  return (
    <div>
      <Card className="mt-4">
        <CardHeader>
          <div className="flex flex-col">
            <CardTitle className="text-base">Generated Tweet</CardTitle>
            <CardDescription className="text-sm">
            Generated on {dayjs(createdAt).format("DD MMM YYYY")}
            &nbsp;at {dayjs(createdAt).format("HH:mm")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <span className="text-muted-foreground line-clamp-2 flex items-center space-x-2">
              <div><Book size={20} /></div>
              <div>{context}</div>
            </span>

            <span className="text-muted-foreground line-clamp-2 flex items-center space-x-2">
              <div><Brain size={20} /></div>
              <div>{generated}</div>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex gap-2 items-center">
              <Flag size={20} />
              {getLang(langToString(lang))}
            </div>

            <div className="flex gap-2 items-center">
              <Smile size={20} />
              {getEmotion(emotionToString(emotion)).value}
            </div>

            <div className="flex gap-2 items-center">
              <PenTool size={20} />
              {getStyle(styleToString(style)).value}
            </div>

            <div className="flex gap-2 items-center">
              <MessageCircle size={20} />
              {getTone(toneToString(tone)).value}
            </div>

            <div className="flex gap-2 items-center">
              <Target size={20} />
              {getTarget(targetToString(target)).value}
            </div>

            <div className="flex gap-2 items-center">
              <SiOpenai size={20} />
              GPT-{gpt}
            </div>
          </div>
        </CardContent>

        {isSharedState && shareUrl && (
          <div className="flex gap-2 p-6 pt-0 pb-0">
            <Input
              value={shareUrl}
              placeholder="Share URL"
              readOnly
              className="w-full"
            />
            <Button variant="outline" onClick={() => {
              void navigator.clipboard.writeText(shareUrl);
              toast({ title: "Copied!", description: "The share URL has been copied to your clipboard." });
            }}>
              <Clipboard size={18} />
            </Button>
            <Link href={shareUrl} target="_blank" className={buttonVariants({ variant: "outline" })}>
              <ExternalLink size={18} />
            </Link>
          </div>
        )}

        <CardFooter className="flex gap-2 pt-0 mt-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"outline"}>
                <ListRestart size={18} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will replace your current parameters with the ones from this tweet.
                  Are you absolutely sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  setTweet({
                    tweetContext: context,
                    emotion: emotionToString(emotion),
                    style: styleToString(style),
                    tone: toneToString(tone),
                    target: targetToString(target),
                    gpt: gpt as 3 | 4,
                    lang: langToString(lang)
                  });
                }} className={buttonVariants({ variant: "destructive" })}>
                    Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant={"outline"} disabled={isSharing} onClick={() => void share()}>
            {!isSharedState && <>{isSharing ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}</>}
            {isSharedState && <>{isSharing ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}</>}
          </Button>
          <Link className={buttonVariants({ variant: "outline" })} href={toTweetUrl(generated)} target={"_blank"}>
            <SiTwitter size={18} />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Trash size={18} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  generated tweet.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  void deleteTweet();
                }} className={buttonVariants({ variant: "destructive" })}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant={"outline"} disabled>
            {first ? (
              <>
                <PenLine size={18} />&nbsp;
                Edit&nbsp;&nbsp;<Badge variant="default">Available soon</Badge>
              </>
            ) : (
              <PenLine size={18} />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Tweet;