"use client";

import { Button, buttonVariants } from "@/lib/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { SiOpenai, SiTwitter } from "@icons-pack/react-simple-icons";
import { Flag, ListRestart, MessageCircle, PenLine, PenTool, Share2, Smile, Target } from "lucide-react";
import type { ReactElement } from "react";
import dayjs from "dayjs";
import { getLang, langToString } from "@/lib/configs/generation/langs";
import { emotionToString, getEmotion, getStyle, getTarget, getTone, styleToString, targetToString, toneToString }
  from "@/lib/configs/generation/types";
import Link from "next/link";
import { toTweetUrl } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

type TweetProps = Prisma.TweetsGetPayload<{
  include: { user: false };
}> & { first: boolean };

const Tweet = ({ createdAt, emotion, generated, gpt, lang, style, target, tone, first }: TweetProps): ReactElement => {
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
          <span className="text-muted-foreground line-clamp-2">
            {generated}
          </span>

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

        <CardFooter className="flex gap-2">
          <Button variant={"outline"}>
            <ListRestart size={18} />
          </Button>
          <Button variant={"outline"}>
            <Share2 size={18} />
          </Button>
          <Link className={buttonVariants({ variant: "outline" })} href={toTweetUrl(generated)} target={"_blank"}>
            <SiTwitter size={18} />
          </Link>
          <Button variant={"outline"} disabled>
            {first ? (
              <>
                <PenLine size={18} />&nbsp;
                Edit (Coming soon)
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