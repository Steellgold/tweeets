/* eslint-disable camelcase */
"use client";

import CardSpotlight from "@/lib/components/ui/card-spotlight";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { buttonVariants } from "@/lib/components/ui/button";
import { Badge } from "@/lib/components/ui/badge";
import { Kaushan_Script } from "next/font/google";
import type { ReactElement } from "react";
import { PenSquare } from "lucide-react";
import { cn, intify } from "@/lib/utils";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/utils/fetcher";

const ks = Kaushan_Script({ style: "normal", weight: "400", subsets: ["latin"] });

type Stats = {
  usersCount: number;
  tweetsCount: number;
}

const Landing = (): ReactElement => {
  const { user } = useUserContext();
  const { data, isLoading } = useSWR<Stats>("/api/stats", fetcher);

  return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl" suppressHydrationWarning>
      <div className="flex flex-col items-center justify-center mb-10">
        <span className="relative inline-block w-fit mx-auto overflow-hidden rounded-full p-[1px]">
          <span className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#71717a_0%,#27272a_50%,#71717a_100%)]" />
          <div className={cn(
            "flex gap-1 h-full w-full items-center justify-center rounded-full bg-zinc-950 px-3 py-1 text-sm text-zinc-200 backdrop-blur-3xl"
          )}>
            <p>Tweeets now work with a credit system.</p>
          </div>
        </span>

        <div className="flex flex-col items-center w-full px-4">
          <h1 className={cn(
            "text-2xl font-bold tracking-tighter sm:text-5xl xl:text-6xl bg-clip-text text-transparent",
            "bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500 h-full text-center py-3"
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
          <PenSquare size={18} className="mr-3" />{user ? "Write a tweet" : "Get started"}
          {!user && <Badge variant={"dnh"} className="border-[#262626] border-2 mt-4 absolute right-7.5 -top-8">5 free credits</Badge>}
        </Link>

        <div className="flex flex-col items-center w-full px-4">
          <CardSpotlight
            className="w-full aspect-[8/5]"
            style={{ backgroundImage: "url(/assets/cards/cover.png)" }}>
          </CardSpotlight>

          <CardSpotlight className="w-full mt-8" hoverEffect={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8 mb-8 select-none">
              <div className="flex flex-col items-center w-full px-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                  {/* Last data from 26/09/2023 */}
                  {isLoading ? intify(1100) : intify(data?.tweetsCount || 507)}
                  <span className={ks.className}>+</span>
                </h1>
                <p className="md:text-xl text-zinc-400 mx-auto text-center">tweets generated.</p>
              </div>

              <div className="flex flex-col items-center w-full px-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                  {/* Last data from 26/09/2023 */}
                  {isLoading ? intify(180) : intify(data?.usersCount || 186)}
                  <span className={ks.className}>+</span>
                </h1>
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