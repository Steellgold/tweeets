"use client";

import { Button } from "@/lib/components/ui/button";
// import { Verified } from "lucide-react";
import Image from "next/image";
import type { ReactElement } from "react";

const Invite = (): ReactElement => {
  return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-md mt-10" suppressHydrationWarning>
      <div className="flex w-full items-center justify-between gap-10">
        <div>
          <div className="flex flex-col">
            <span className="text-sm">Someone invited you to join Tweeets</span>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold">Gaëtan</h1>
              {/* <Verified size={24} className="text-blue-500" /> */}
            </div>

            <p className="text-muted-foreground text-xl">
              Get <strong>10 credits</strong> totally free by creating an account with this person&apos;s link.
            </p>
          </div>

          <Button variant={"twitter"} className="mt-4">
            Create account with Twitter
          </Button>
        </div>

        <Image
          src={"https://pbs.twimg.com/profile_images/1684529899262840833/QfDNyhd-_400x400.jpg"}
          alt={"Tweeets"} className="rounded-full" width={200} height={200} />
      </div>
    </div>
  );
};

export default Invite;