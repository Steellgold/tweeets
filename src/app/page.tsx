import { buttonVariants } from "@/lib/components/ui/button";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import { PenSquare } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

const Landing = (): ReactElement => {
  return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl" suppressHydrationWarning>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-normal text-center text-black dark:text-white">
          Tweet <span className="font-semibold">like a</span><br />
          <span className="font-semibold">pro</span> with <span className="text-[#cecc63] font-bold">Tweeets</span>
        </h1>
        <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
          A simple, powerful, and beautiful tweet ai writer.
        </p>

        <div className="mt-5 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
          <Link href={"/app"} className={buttonVariants({ variant: "outline" })}>
            <PenSquare size={20} className="mr-2" />
            Start writing
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center w-full px-4">
        <CardSpotlight
          className="w-full mt-8 animate-fade-up animate-delay-200 animate-duration-500 aspect-[16/9] md:aspect-[8/5]"
          style={{ backgroundImage: "url(/assets/cards/cover.png)" }}>
        </CardSpotlight>
      </div>
    </div>
  );
};

export default Landing;