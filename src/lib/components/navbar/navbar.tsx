/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Button } from "@/lib/components/ui/button";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar";
import { Gem, Twitter } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { UserNBResponseSchema } from "@/lib/utils/schemas";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { SiOpenai } from "@icons-pack/react-simple-icons";
import { Badge } from "../ui/badge";

const getData = async(): Promise<{ isPro: boolean }> => {
  const response = await fetch("/api/user");
  const schema = UserNBResponseSchema.safeParse(await response.json());

  if (!schema.success) return { isPro: false };
  return { isPro: schema.data.isPro };
};

export const Navbar = (): ReactElement => {
  const supabase = createClientComponentClient();
  const { user, setUser } = useUserContext();
  const [isPro, setPro] = useState(false);

  useEffect(() => {
    void getData().then((data) => {
      setPro(data.isPro);
    });
  }, [isPro]);

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      setUser(session.user);
    }
  });

  const handleBilling = async(): Promise<void> => {
    if (!user) return;
    const res = await fetch("/api/user/stripe/portal");
    const { url } = await res.json();
    window.location.href = url;
  };


  const handleUpgrade = async(plan: "yearly" | "monthly"): Promise<void> => {
    if (!user) return;
    const res = await fetch(`/api/user/stripe/upgrade?mode=${plan}`);
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <nav className={cn("mx-auto mt-3 flex max-w-screen-xl items-center justify-between px-5")} suppressHydrationWarning>
      <Link href={"/"}>
        <Image src={"/logo.png"} alt={"Tweeets"} width={60} height={60} />
      </Link>

      <div className="flex h-5 items-center space-x-2 text-sm">
        {user ? (
          <>
            {!isPro && (
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant={"outline"} className="text-blue-300 hover:text-blue-300">
                    <Gem size={20} className="mr-2 text-blue-300" />
                    Upgrade
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      With <strong>Tweeets Pro</strong> you get access to premium selections of contexts and more usage per month
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex flex-col space-y-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex gap-2 items-center">Yearly Plan <Badge className="ml-2">-20%</Badge></CardTitle>
                        {/* Le span doit être barré */}
                        <CardDescription>For <strong className="text-gray-400">64,99$/year</strong></CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          You can generate your tweets with <span className="flex gap-2 items-center"><SiOpenai size={16} /> GPT-4</span>
                        </div>

                        <Button variant={"outline"} className="mt-2" onClick={() => {
                          void handleUpgrade("yearly");
                        }}>
                            Upgrade
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Plan</CardTitle>
                        <CardDescription>For <strong className="text-gray-400">6,99$/month</strong></CardDescription>
                      </CardHeader>
                      <CardContent>
                          You get all features of Tweeets Pro but no access to GPT-4
                        <Button variant={"outline"} className="mt-2" onClick={() => {
                          void handleUpgrade("monthly");
                        }}>
                            Upgrade
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
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
                <DropdownMenuItem disabled={!isPro} onClick={() => {
                  void handleBilling();
                }}>
                  Billing
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