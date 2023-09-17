/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from "@/lib/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/lib/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/lib/components/ui/tooltip";
import { toast } from "@/lib/components/ui/use-toast";
import type { TweetProps } from "@/lib/configs/generation/tweet";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { cn, toTweetUrl } from "@/lib/utils";
import type { Component } from "@/lib/utils/component";
import { fetcher } from "@/lib/utils/fetcher";
import { readStream } from "@/lib/utils/stream";
import type { User } from "@prisma/client";
import { Copy, Loader2Icon, RefreshCcw, Twitter } from "lucide-react";
import Link from "next/link";
import { useState, type ReactElement } from "react";
import useSwr from "swr";
import { useCopyToClipboard, useLocalStorage } from "usehooks-ts";

const Generate: Component<{ tw: TweetProps }> = ({ tw }): ReactElement => {
  const { user } = useUserContext();
  const { data, isLoading } = useSwr<User>("/api/user", fetcher);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [regenLocked, setRegenLocked] = useState<boolean>(true);
  const [gTweet, setTweet] = useState<string>("");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [isAutoSaveTweets] = useLocalStorage<boolean>("auto-save-tweets", true);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [_, copy] = useCopyToClipboard();
  const ctc = (text: string): void => {
    copy(text)
      .then(() => {
        toast({
          title: "Tweet copied to clipboard!",
          description: "You can now paste it on Twitter."
        });
      })
      .catch(() => {
        toast({
          title: "An error occurred while copying your tweet.",
          description: "Please try again."
        });
      });
  };

  const generateTweet = async(): Promise<void> => {
    setWaiting(true);
    setRegenLocked(true);
    setTweet("");

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        tw
      })
    });

    if (!res.ok || res.status !== 200 || res.body == null) {
      setWaiting(false);
      setTweet("An error occurred while generating your tweet.");
      return;
    } else {
      setWaiting(false);
    }

    let result = "";
    await readStream(res.body, (chunk) => {
      result += chunk;
      setTweet(result);
    }).finally(() => {
      result = result.replace(/#\w+\s?/g, "");
      result = result.replace(/^"/, "");

      setTweet(result);
      setRegenLocked(false);

      if (isAutoSaveTweets) {
        void fetch("/api/save", {
          method: "POST",
          body: JSON.stringify({
            tw,
            tweet: gTweet
          })
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={!user || isLoading}>
        {!isLoading ? (
          <Button size={"sm"} variant={
            user && data && data.credits > 0 ? "default" : "destructive"
          } disabled={!user || data?.credits == 0} onClick={() => void generateTweet()}>
            {user && data && data.credits > 0 ? "Generate" : "Out of credits"}
          </Button>
        ) : (
          <Button size={"sm"} disabled>Generate</Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {waiting ? (
              <div className="flex gap-2 items-center">
                You tweet is being generated...
              </div>
            ) : (
              <>Your tweet has been generated!</>
            )}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2",
          "text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        )}>
          {waiting ? (
            <div className="flex items-center justify-center w-full">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : (
            <span className="text-muted-foreground line-clamp-2">
              {gTweet}
            </span>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={waiting || !user || isLoading || regenLocked}>
            Close
          </AlertDialogCancel>

          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild disabled={waiting || !user || isLoading || regenLocked}>
                {gTweet.length > 0 ? (
                  <Link className={buttonVariants({ variant: "outline" })} href={toTweetUrl(gTweet)} target={"_blank"}>
                    <Twitter size={18} />
                  </Link>
                ) : (
                  <Button variant={"outline"} disabled={waiting || !user || isLoading || regenLocked}>
                    <Twitter size={18} />
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                Share on Twitter
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild onClick={() => ctc(gTweet)} disabled={waiting || !user || isLoading || regenLocked}>
                <Button variant={"outline"} disabled={waiting || !user || isLoading || regenLocked}>
                  <Copy size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Copy to clipboard
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild disabled={waiting || !user || isLoading || regenLocked}>
                <Button variant={"outline"} onClick={() => void generateTweet()} disabled={waiting || !user || isLoading || regenLocked}>
                  <RefreshCcw size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Regenerate
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Generate;