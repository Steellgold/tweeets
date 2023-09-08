"use client";

import { Badge } from "@/lib/components/ui/badge";
import { Button, buttonVariants } from "@/lib/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/lib/components/ui/sheet";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { SiOpenai, SiTwitter } from "@icons-pack/react-simple-icons";
import { Flag, ListRestart, MessageCircle, PenTool, Share2, Smile, Target } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

type TweetsListProps = {
  newCount: number;
};

const TweetsList = ({ newCount }: TweetsListProps): ReactElement => {
  const { user } = useUserContext();

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant={"secondary"} size={"sm"} className="flex gap-1" disabled={!user}>
          All generated tweets
          {newCount > 0 && (
            <Badge className="mt-1">{newCount} new</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="!overflow-y-scroll !max-w-[600px]">
        <SheetHeader>
          <SheetTitle>List of generated tweets</SheetTitle>
          <SheetDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus repellat mollitia nobis ipsam labore saepe...
          </SheetDescription>
        </SheetHeader>

        <div>
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <CardTitle className="text-base">Generated Tweets</CardTitle>
                  <CardDescription className="text-sm">Posted on 2021-09-01 12:00:00</CardDescription>
                </div>
                <div>
                  <Link href={"https://twitter.com/"} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                    <SiTwitter size={20} />
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus repellat mollitia nobis ipsam labore saepe...
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex gap-2 items-center">
                  <Flag size={20} />
                  English
                </div>

                <div className="flex gap-2 items-center">
                  <Smile size={20} />
                  Joy
                </div>

                <div className="flex gap-2 items-center">
                  <PenTool size={20} />
                  Poetic
                </div>

                <div className="flex gap-2 items-center">
                  <MessageCircle size={20} />
                  Optimistic
                </div>

                <div className="flex gap-2 items-center">
                  <Target size={20} />
                  Entrepreneurs
                </div>

                <div className="flex gap-2 items-center">
                  <SiOpenai size={20} />
                  GPT-3
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
      </SheetContent>
    </Sheet>
  );
};

export default TweetsList;