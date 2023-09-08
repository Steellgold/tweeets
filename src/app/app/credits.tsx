/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from "@/lib/components/ui/alert-dialog";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import { CardDescription, CardTitle } from "@/lib/components/ui/card";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import { Separator } from "@/lib/components/ui/separator";
import { Skeleton } from "@/lib/components/ui/skeleton";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { fetcher } from "@/lib/utils/fetcher";
import type { User } from "@prisma/client";
import { ArrowRight, Coins } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import useSwr from "swr";

const BuyCredits = (): ReactElement => {
  const { user } = useUserContext();

  const { data, isLoading } = useSwr<User>("/api/user", fetcher);

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
              <Button variant={"outline"} className="group">
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-100" />
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
              <Button variant={"outline"} className="group">
                Buy&nbsp;
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-100" />
              </Button>
            </div>
          </CardSpotlight>

          <CardSpotlight>
            <div className="flex justify-between items-center">
              <div className="flex flex-col space-y-2">
                <CardTitle className="text-lg ml-2">300 credits</CardTitle>
                <CardDescription className="text-sm ml-2">
                  The biggest pack of credits for only <span className="text-white">19.99$</span>
                </CardDescription>
              </div>
              <Button variant={"outline"} className="group">
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-100" />
              </Button>
            </div>
          </CardSpotlight>
        </div>

        <Separator className="my-2" />

        <CardDescription className="text-muted-foreground text-center">
          <span className="text-black dark:text-white">
            You don&apos;t want to pay? We totally understand you! That&apos;s why you can earn credits by inviting your friends.&nbsp;
            <Link href={"/invite"} className="text-blue-500 hover:underline hover:text-blue-600">More information</Link></span>
        </CardDescription>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BuyCredits;