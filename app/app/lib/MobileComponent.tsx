"use client";

import { Card, CardHeader } from "@nextui-org/card";

import { useDetectDevice } from "@/lib/hooks/useDetectDevice";

export const MobileComponent = () => {
  const { isMobile } = useDetectDevice();

  return isMobile ? (
    <Card className="sm:max-w-[610px] w-full border-2 border-[#f31260] bg-[#f3126010]">
      <CardHeader className="flex flex-col items-start">
        <p>For the best experience, please use a desktop device (or use {"\""}Desktop mode{"\""} on your mobile browser).</p>
      </CardHeader>
    </Card>
  ) : null;
}