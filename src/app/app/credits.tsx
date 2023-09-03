"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from "@/lib/components/ui/alert-dialog";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import { CardDescription, CardTitle } from "@/lib/components/ui/card";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import { ArrowRight, Coins } from "lucide-react";
import type { ReactElement } from "react";

const BuyCredits = (): ReactElement => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant={"link"} size={"sm"}>
          <Coins size={20} />
          <span className="ml-2">Buy more credits</span>
        </Button>
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

          <CardSpotlight>
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