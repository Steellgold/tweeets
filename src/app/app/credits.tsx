/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from "@/lib/components/ui/alert-dialog";
import { Badge } from "@/lib/components/ui/badge";
import { Button, buttonVariants } from "@/lib/components/ui/button";
import { CardDescription, CardTitle } from "@/lib/components/ui/card";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import { Skeleton } from "@/lib/components/ui/skeleton";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { fetcher } from "@/lib/utils/fetcher";
import type { User } from "@prisma/client";
import { ArrowRight, Coins, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, type ReactElement } from "react";
import useSwr from "swr";
import { z } from "zod";

const BuyCredits = ({ showT = true } : { showT?: boolean }): ReactElement => {
  const { user } = useUserContext();

  const { data, isLoading } = useSwr<User>("/api/user", fetcher);

  const [isBuying, setIsBuying] = useState<50 | 100 | 300 | null>(null);

  const handleBuyCredits = async(type: 50 | 100 | 300): Promise<void> => {
    if (!user || isLoading || !data) return;

    setIsBuying(type);
    const res = await fetch(`/api/stripe/create-checkout-session?count=${type}`);

    const success = z.object({
      url: z.string()
    }).safeParse(await res.json());

    if (!success.success) {
      setIsBuying(null);
      return;
    }

    const { url } = success.data;
    window.location.href = url;
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={!user || isLoading}>
        {!isLoading ? (
          <>
            {user && data && data.credits > 0 ? (
              <Button variant="outline">
                <Coins size={18} className="mr-2" />
                You have {data?.credits} credits
              </Button>
            ) : (
              <Button variant={"outline"} size={"sm"} disabled={!user}>
                <Coins size={18} className="mr-2" />
                Buy more credits
              </Button>
            )}
          </>
        ) : (
          <Button variant={"outline"} size={"sm"} className="flex gap-0.5" disabled>
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Need more credits?</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-col space-y-2">
          <CardSpotlight>
            <div className="flex justify-between items-center">
              <div className="flex flex-col -space-y-1">
                <CardTitle className="text-lg ml-2">50 credits</CardTitle>
                <CardDescription className="text-sm ml-2">
                  The smallest pack of credits for only <span className="text-white">4.99$</span>
                </CardDescription>
              </div>
              <Button variant={"outline"} className="group" onClick={() => void handleBuyCredits(50)} disabled={isBuying !== null}>
                {isBuying === 50 ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-100" />
                )}
              </Button>
            </div>
          </CardSpotlight>

          <CardSpotlight special className="h-32">
            <div className="flex justify-between items-center h-full">
              <div className="flex flex-col space-y-2">
                <CardTitle className="text-lg ml-2">100 credits <Badge>Most popular</Badge></CardTitle>
                <CardDescription className="text-sm ml-2">
                  The best value pack of credits for only <span className="text-white">9.99$</span>
                </CardDescription>
              </div>
              <Button variant={"outline"} className="group" onClick={() => void handleBuyCredits(100)} disabled={isBuying !== null}>
                Buy&nbsp;
                {isBuying === 100 ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-100" />
                )}
              </Button>
            </div>
          </CardSpotlight>

          <CardSpotlight>
            <div className="flex justify-between items-center">
              <div className="flex flex-col space-y-2">
                <CardTitle className="text-lg ml-2">300 credits</CardTitle>
                <CardDescription className="text-sm ml-2">
                  The biggest pack of credits for only <span className="text-white">14.99$</span>
                </CardDescription>
              </div>
              <Button variant={"outline"} className="group" onClick={() => void handleBuyCredits(300)} disabled={isBuying !== null}>
                {isBuying === 300 ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-100" />
                )}
              </Button>
            </div>
          </CardSpotlight>
        </div>

        {/* <Separator className="my-2" />

        <CardDescription className="text-muted-foreground text-center">
          <span className="text-black dark:text-white">
            You don&apos;t want to pay? We totally understand you! That&apos;s why you can earn credits by inviting your friends.&nbsp;
            <Link href={"/invite"} className="text-blue-500 hover:underline hover:text-blue-600">More information</Link></span>
        </CardDescription> */}

        <AlertDialogFooter>
          {showT && (
            <Link className={buttonVariants({ variant: "outline" })} href={"/billing"}>
              Transactions
            </Link>
          )}
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BuyCredits;