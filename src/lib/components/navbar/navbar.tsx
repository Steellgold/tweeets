/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useEffect, type ReactElement } from "react";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { Feedback } from "./feedback";
import { LoginWithTwitter } from "./login-with-twitter";

export const Navbar = (): ReactElement => {
  const supabase = createClientComponentClient();
  const { user, setUser } = useUserContext();
  const [isAutoSaveTweets, setIsAutoSaveTweets] = useLocalStorage<boolean>("auto-save-tweets", true);
  const [vreleased, setVReleased] = useLocalStorage<string>("v2-released", "v1");

  useEffect(() => {
    if (!user) return;

    if (vreleased === null || vreleased !== "v2") {
      void supabase.auth.signOut().then(() => {
        toast({
          title: "New version released!",
          description: "We logged you out to update your account automatically on your next login!"
        });

        setUser(null);
        setVReleased("v2");
      });
    }
  }, [user, supabase.auth, setUser, vreleased, setVReleased]);

  const toggleAutoSaveTweets = (): void => {
    setIsAutoSaveTweets((prev) => !prev);
    toast({
      title: `Auto-save tweets ${isAutoSaveTweets ? "disabled" : "enabled"}`,
      description: isAutoSaveTweets ? "Your tweets will no longer be saved automatically." : "Your tweets will now be saved automatically.",
      action: (
        <ToastAction altText="Undo" onClick={() => {
          setIsAutoSaveTweets((prev) => !prev);
        }}>
          Undo
        </ToastAction>
      )
    });
  };

  return (
    <nav className={cn("mx-auto mt-3 flex max-w-screen-xl items-center justify-between px-5")} suppressHydrationWarning>
      <Link href={"/"}>
        <Image src={"/logo.png"} alt={"Tweeets"} width={60} height={60} />
      </Link>

      <div className="flex h-5 items-center space-x-2 text-sm">
        <Link href={"/blog"} className={buttonVariants({ variant: "outline" })} prefetch>Blog</Link>
        <Feedback />

        {!user && <LoginWithTwitter />}

        {user == "loading" && (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[56px]" />
              <Skeleton className="h-2 w-[86px]" />
            </div>
          </div>
        )}

        {user && user !== "loading" && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={"ghost"} className="flex">
                {user && user.user_metadata.avatar_url ? (
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.user_name} />
                    <AvatarFallback>@</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarFallback>@</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col items-start">
                  {user.user_metadata.full_name}
                  <span className="text-gray-400">@{user.user_metadata.user_name}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>{user.user_metadata.full_name}</DropdownMenuLabel>
              <DropdownMenuLabel className="-mt-3 text-gray-400">{user.user_metadata.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <DropdownMenuItem asChild>
                <Link href={"/billing"} className="cursor-pointer">
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start" disabled>
                <div>
                  Invite friends
                  <Badge variant={"blue"} className="ml-2">Soon</Badge>
                </div>
                <span className="text-muted-foreground text-xs font-normal items-start">
                  Invite your friends and get free credits
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleAutoSaveTweets}>
                Auto-save tweets
                <Badge variant={isAutoSaveTweets ? "green" : "red"} className="ml-2">{isAutoSaveTweets ? "On" : "Off"}</Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                void supabase.auth.signOut().then(() => {
                  setUser(null);
                });
              }} className="cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};