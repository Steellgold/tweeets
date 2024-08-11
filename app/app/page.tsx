"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { BadgeCheck, HandMetal, PiggyBank, Presentation, Zap } from "lucide-react";
import { Textarea } from "@nextui-org/input";
import { Tabs, Tab } from "@nextui-org/tabs"; 
import { Slider } from "@nextui-org/slider";
import { useState } from "react";
import { useOnborda } from "onborda";
import { useSession } from "next-auth/react";

import { CreditsModal } from "@/components/CreditsModal";

const Page = () => {
  const [tweetLength, setTweetLength] = useState(50);
  const { startOnborda } = useOnborda();
  const { data } = useSession();

  const [mode, setMode] = useState<"normal" | "fast">("normal");

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Card className="max-w-[610px] w-full border-2 border-[#393941]">
        <CardHeader className="border-b border-[#393941] flex flex-col items-start p-4">
          Post like a pro
          <span className="text-[#9CA3AF] text-sm">
            Tweeets is a tool for analyzing and creating tweets to make your life easier as a regular Twitter user.
          </span>
        </CardHeader>

        <CardBody className="flex flex-col gap-2">
          <div id="onborda-step1">
            <Textarea required className="w-full" label="What is your tweet about?" placeholder="Type a context for your tweet" />
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-2 items-center justify-between">
            <div id="onborda-step2">
              <Tabs aria-label="Generator type" color={mode === "fast" ? "success" : "primary"} defaultSelectedKey={"normal"}>
                <Tab key="humorisitc" title="Humoristic" />
                <Tab key="serious" title="Serious" />
                <Tab key="informative" title="Informative" />
                <Tab key="normal" title="Normal" />
              </Tabs>
            </div>

            <div id="onborda-step3"> 
              <Tabs
                aria-label="Generator speed"
                color={mode === "fast" ? "success" : "primary"}
                defaultSelectedKey={"normal"}
                onSelectionChange={(key) => setMode(key as "normal" | "fast")}
              >
                <Tab key="slow" title={
                  <div className="flex items-center gap-1">
                    <Zap color="#FFC107" fill="#FFC107" size={16} />
                    Normal
                  </div>
                } />

                <Tab key="fast" title={
                  <div className="flex items-center gap-1">
                    <Zap
                      color={mode === "fast" ? "#063c1c" : "#17c562"}
                      fill={mode === "fast" ? "#063c1c" : "#17c562"}
                      size={16}
                    />
                    Fast
                  </div>
                } />
              </Tabs>
            </div>
          </div>

          <div id="onborda-step4">
            <Card className="w-full border-2 border-[#262629]">
              <CardHeader className="flex flex-col items-start">
                Tweet length
                <span className="text-[#9CA3AF] text-sm">
                  The amount of characters that your tweet will have.
                </span>
              </CardHeader>

              <CardBody className="flex flex-col gap-2">
                <Slider 
                  className="w-full" 
                  color={mode === "fast" ? "success" : "primary"}
                  defaultValue={50}  
                  formatOptions={{ style: "decimal" }}
                  maxValue={500}
                  minValue={15}
                  showTooltip={true}
                  step={1}
                  tooltipProps={{
                    placement: "top",
                    color: mode === "fast" ? "success" : "primary",
                    content: (
                      <div className="flex items-center gap-1">
                        {tweetLength > 280 && <BadgeCheck size={12} />}
                        <span>
                          {tweetLength} characters
                        </span>
                      </div>
                    )
                  }}
                  value={tweetLength}
                  // @ts-ignore
                  onChange={(value: number) => setTweetLength(value)}
                />
              </CardBody>
            </Card>
          </div>
        </CardBody>

        <CardFooter className="flex justify-between flex gap-2">
          <div className="flex gap-2">
            <Button color="default" size="sm" onClick={startOnborda}>
              <Presentation size={16} />
              Onboarding
            </Button>

            <div id="onborda-step5">
              <CreditsModal button={
                <Button color="default" size="sm">
                  <PiggyBank size={16} />
                  {data?.user?.credits || 0} credits
                </Button>
              } />
            </div>

            {/* <form action={logout}>
              <Button color="danger" size="sm" type="submit">
                Sign out
              </Button>
            </form> */}
          </div>

          <div id="onborda-step6">
            <Button color={mode === "fast" ? "success" : "primary"} size="sm">
              <HandMetal size={16} />
              Generate Tweet
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}

export default Page;
