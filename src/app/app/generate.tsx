/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from "@/lib/components/ui/alert-dialog";
import { Button } from "@/lib/components/ui/button";
import { Textarea } from "@/lib/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/lib/components/ui/tooltip";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { fetcher } from "@/lib/utils/fetcher";
import type { User } from "@prisma/client";
import { Copy, RefreshCcw, Twitter } from "lucide-react";
import type { ReactElement } from "react";
import useSwr from "swr";

const Generate = (): ReactElement => {
  const { user } = useUserContext();
  const { data, isLoading } = useSwr<User>("/api/user", fetcher);

  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={!user || isLoading}>
        {!isLoading ? (
          <Button size={"sm"} variant={
            user && data && data.credits > 0 ? "default" : "destructive"
          } disabled={!user || data?.credits == 0}>
            {user && data && data.credits > 0 ? "Generate" : "Out of credits"}
          </Button>
        ) : (
          <Button size={"sm"} disabled>Generate</Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Your tweet has been generated!</AlertDialogTitle>
        </AlertDialogHeader>

        <Textarea disabled className="h-32" placeholder="Your tweet" />

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>

          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button variant={"outline"}>
                  <Twitter size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Share on Twitter
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button variant={"outline"}>
                  <Copy size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Copy to clipboard
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button variant={"outline"}>
                  <RefreshCcw size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Regenerate
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Generate;