"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { Button } from "../ui/button";
import { Twitter } from "lucide-react";

export const Navbar = (): ReactElement => {
  return (
    <nav className={cn("mx-auto mt-3 flex max-w-screen-xl items-center justify-between px-5")} suppressHydrationWarning>
      <Link href={"/"}>
        <Image src={"/logo.png"} alt={"Tweeets"} width={60} height={60} />
      </Link>

      <div className="flex h-5 items-center space-x-2 text-sm">
        <Button variant={"twitter"}>
          <Twitter size={20} className="mr-2 text-white fill-current" />
          &nbsp;Login with Twitter
        </Button>
      </div>
    </nav>
  );
};