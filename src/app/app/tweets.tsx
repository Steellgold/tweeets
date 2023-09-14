"use client";

import { Badge } from "@/lib/components/ui/badge";
import { Button, buttonVariants } from "@/lib/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/lib/components/ui/sheet";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { fetcher } from "@/lib/utils/fetcher";
import { SiOpenai, SiTwitter } from "@icons-pack/react-simple-icons";
import type { Prisma } from "@prisma/client";
import { Flag, ListRestart, MessageCircle, PenTool, Share2, Smile, Target } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import useSWR from "swr";
import dayjs from "dayjs";
import { getLang, langToString } from "@/lib/configs/generation/langs";
import { emotionToString, getEmotion, getStyle, getTarget, getTone, styleToString, targetToString, toneToString }
  from "@/lib/configs/generation/types";
import { Skeleton } from "@/lib/components/ui/skeleton";

type UserIncludeAll = Prisma.UserGetPayload<{
  include: { tweets: true };
}>

type TweetsListProps = {
  newCount: number;
};

const TweetsList = ({ newCount }: TweetsListProps): ReactElement => {
  const { user } = useUserContext();
  const { data, isLoading } = useSWR<UserIncludeAll>("/api/user", fetcher);

  return (
    <Sheet>
      <SheetTrigger disabled={!user || isLoading || data?.tweets.length == 0}>
        {isLoading ? (
          <Button variant={"outline"} size={"sm"} className="flex gap-1" disabled={!user || isLoading}>
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          </Button>
        ) : (
          <Button variant={"secondary"} size={"sm"} className="flex gap-1" disabled={!user || isLoading || data?.tweets.length == 0}>
            All generated tweets
            {newCount > 0 && (
              <Badge className="mt-1">{newCount} new</Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="!overflow-y-scroll !max-w-[600px]">
        <SheetHeader>
          <SheetTitle>List of generated tweets</SheetTitle>
          <SheetDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus repellat mollitia nobis ipsam labore saepe...
          </SheetDescription>
        </SheetHeader>

        {!isLoading && data?.tweets && data.tweets.length > 0 && data.tweets.map((tweet) => (
          <div key={tweet.id}>
            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <CardTitle className="text-base">Generated Tweet</CardTitle>
                    <CardDescription className="text-sm">
                      Generated on {dayjs(tweet.createdAt).format("DD MMM YYYY")}
                      &nbsp;at {dayjs(tweet.createdAt).format("HH:mm")}
                    </CardDescription>
                  </div>
                  <div>
                    <Link href={"https://twitter.com/"} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                      <SiTwitter size={20} />
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <span className="text-muted-foreground line-clamp-2">
                  {tweet.generated}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex gap-2 items-center">
                    <Flag size={20} />
                    {getLang(langToString(tweet.lang))}
                  </div>

                  <div className="flex gap-2 items-center">
                    <Smile size={20} />
                    {getEmotion(emotionToString(tweet.emotion)).value}
                  </div>

                  <div className="flex gap-2 items-center">
                    <PenTool size={20} />
                    {getStyle(styleToString(tweet.style)).value}
                  </div>

                  <div className="flex gap-2 items-center">
                    <MessageCircle size={20} />
                    {getTone(toneToString(tweet.tone)).value}
                  </div>

                  <div className="flex gap-2 items-center">
                    <Target size={20} />
                    {getTarget(targetToString(tweet.target)).value}
                  </div>

                  <div className="flex gap-2 items-center">
                    <SiOpenai size={20} />
                    GPT-{tweet.gpt}
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
              </CardFooter>
            </Card>
          </div>
        ))}
      </SheetContent>
    </Sheet>
  );
};

export default TweetsList;