/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Twitter } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger } from "../ui/dropdown-menu";
import type { ReactElement } from "react";
import { Skeleton } from "../ui/skeleton";

export const Navbar = (): ReactElement => {
  const supabase = createClientComponentClient();
  const { user, setUser } = useUserContext();

  return (
    <nav className={cn("mx-auto mt-3 flex max-w-screen-xl items-center justify-between px-5")} suppressHydrationWarning>
      <Link href={"/"}>
        <Image src={"/logo.png"} alt={"Tweeets"} width={60} height={60} />
      </Link>

      <div className="flex h-5 items-center space-x-2 text-sm">
        {!user && (
          <Button variant={"twitter"} onClick={() => {
            void supabase.auth.signInWithOAuth({ provider: "twitter", options: {
              redirectTo: `${window.location.origin}/auth/callback`
            } });
          }}>
            <Twitter size={20} className="mr-2 text-white fill-current" />
            &nbsp;Login with Twitter
          </Button>
        )}

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
                {user.user_metadata.avatar_url ? (
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
            <DropdownMenuContent className="w-60">
              <DropdownMenuLabel>{user.user_metadata.full_name}</DropdownMenuLabel>
              <DropdownMenuLabel className="-mt-3 text-gray-400">{user.user_metadata.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                void supabase.auth.signOut().then(() => {
                  setUser(null);
                });
              }} className="hover:text-red-500">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};