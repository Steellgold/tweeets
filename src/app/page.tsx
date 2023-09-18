import { buttonVariants } from "@/lib/components/ui/button";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import { cn } from "@/lib/utils";
import { PenSquare } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

const Landing = (): ReactElement => {
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
          "mt-8 mb-8"
        )}>
          <PenSquare size={18} />&nbsp;
            Get started
        </Link>

        <div className="flex flex-col items-center w-full px-4">
          <CardSpotlight
            className="w-full animate-fade-up animate-delay-200 animate-duration-500 aspect-[8/5]"
            style={{ backgroundImage: "url(/assets/cards/cover.png)" }}>
          </CardSpotlight>
        </div>
      </div>
    </div>
  );
};

export default Landing;