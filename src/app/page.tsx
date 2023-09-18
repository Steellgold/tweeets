"use client";

import { Badge } from "@/lib/components/ui/badge";
import { buttonVariants } from "@/lib/components/ui/button";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { cn } from "@/lib/utils";
import { Globe, PenSquare } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

const Landing = (): ReactElement => {
  const { user } = useUserContext();

  return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl" suppressHydrationWarning>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center w-full px-4">
          <h1 className={cn(
            "text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl bg-clip-text text-transparent",
            "bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500"
          )}>
            Revolutionize the way you tweet.
          </h1>

          <p className="md:text-xl text-zinc-400 mx-auto w-[75%] text-center">
            Tweeets is a new way to tweet. Write your tweets in a distraction-free environment, and save them for later.
          </p>
        </div>

        <Link href="/app" className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "mt-8 mb-8 relative"
        )}>
          {!user && (
            <>
              <PenSquare size={18} />&nbsp;Get started
            </>
          )}
          {user && (
            <>
              <Globe size={18} />&nbsp;Go to app
            </>
          )}

          {!user && (
            <Badge variant={"dnh"} className="border-[#262626] border-2 mt-4 absolute right-7.5 -top-8">
              5 free credits
            </Badge>
          )}
        </Link>

        <div className="flex flex-col items-center w-full px-4">
          <CardSpotlight
            className="w-full aspect-[8/5]"
            style={{ backgroundImage: "url(/assets/cards/cover.png)" }}>
          </CardSpotlight>

          <CardSpotlight className="w-full mt-8" hoverEffect={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8 mb-8 select-none">
              <div className="flex flex-col items-center w-full px-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">1k+</h1>
                <p className="md:text-xl text-zinc-400 mx-auto text-center">tweets generated.</p>
              </div>

              <div className="flex flex-col items-center w-full px-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">170+</h1>
                <p className="md:text-xl text-zinc-400 mx-auto text-center">users registered.</p>
              </div>
            </div>
          </CardSpotlight>
        </div>
      </div>
    </div>
  );
};

export default Landing;