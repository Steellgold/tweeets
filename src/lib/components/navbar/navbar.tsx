/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Button } from "@/lib/components/ui/button";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar";
import { Gem, Twitter } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export const Navbar = (): ReactElement => {
  const supabase = createClientComponentClient();
  const { user, setUser } = useUserContext();

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      setUser(session.user);
    }
  });

  return (
    <nav className={cn("mx-auto mt-3 flex max-w-screen-xl items-center justify-between px-5")} suppressHydrationWarning>
      <Link href={"/"}>
        <Image src={"/logo.png"} alt={"Linkfy"} width={40} height={40} />
      </Link>

      <div className="flex h-5 items-center space-x-2 text-sm">
        {user ? (
          <>
            <Button variant={"outline"} className="text-blue-300 hover:text-blue-300">
              <Gem size={20} className="mr-2 text-blue-300" />
              Upgrade
            </Button>
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
                <DropdownMenuItem>Billing</DropdownMenuItem>
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
          </>
        ) : (
          <Button variant={"twitter"} onClick={() => {
            void supabase.auth.signInWithOAuth({ provider: "twitter", options: {
              redirectTo: `${window.location.origin}/auth/callback`
            } });
          }}>
            <Twitter size={20} className="mr-2 text-white fill-current" />
            &nbsp;Login with Twitter
          </Button>
        )}
      </div>
    </nav>
  );
};