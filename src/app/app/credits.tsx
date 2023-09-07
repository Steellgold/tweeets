/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from "@/lib/components/ui/alert-dialog";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import { CardDescription, CardTitle } from "@/lib/components/ui/card";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import { Skeleton } from "@/lib/components/ui/skeleton";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { fetcher } from "@/lib/utils/fetcher";
import type { User } from "@prisma/client";
import { ArrowRight, Coins } from "lucide-react";
import { useState } from "react";
import type { ReactElement } from "react";
import useSwr from "swr";

const BuyCredits = (): ReactElement => {
  const { user } = useUserContext();
  const [credits] = useState(0);

  const { data, isLoading } = useSwr<User>("/api/user", fetcher);

  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={!user || credits > 0}>
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
              <div className="flex flex-col space-y-2">
                <CardTitle className="flex gap-2">50 credits</CardTitle>
                <CardDescription>For <strong>4,99$</strong></CardDescription>
              </div>
              <Button variant={"outline"} className="group mt-2">
                Buy&nbsp;
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-100" />
              </Button>
            </div>
          </CardSpotlight>

          <CardSpotlight special>
            <div className="flex justify-between items-center">
              <div className="flex flex-col space-y-2">
                <CardTitle className="flex gap-2">100 credits <Badge>Best value</Badge></CardTitle>
                <CardDescription>For <strong>9,99$</strong></CardDescription>
              </div>
              <Button variant={"outline"} className="group mt-2">
                Buy&nbsp;
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-100" />
              </Button>
            </div>
          </CardSpotlight>

          <CardSpotlight>
            <div className="flex justify-between items-center">
              <div className="flex flex-col space-y-2">
                <CardTitle className="flex gap-2">250 credits</CardTitle>
                <CardDescription>For <strong>19,99$</strong></CardDescription>
              </div>
              <Button variant={"outline"} className="group mt-2">
                Buy&nbsp;
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-100" />
              </Button>
            </div>
          </CardSpotlight>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BuyCredits;