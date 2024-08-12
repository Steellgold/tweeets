"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { ArrowRight, BadgeCheck, HandMetal, MessageSquare, MessagesSquare, PiggyBank, Presentation } from "lucide-react";
import { Textarea } from "@nextui-org/input";
import { Tabs, Tab } from "@nextui-org/tabs"; 
import { Slider } from "@nextui-org/slider";
import { Chip } from "@nextui-org/chip";
import { useState } from "react";
import { useOnborda } from "onborda";
import { useSession } from "next-auth/react";
import { Switch } from "@nextui-org/switch";

import { CreditsModal } from "@/components/CreditsModal";
import { cn } from "@/lib/utils";

const Page = () => {
  const [tweetLength, setTweetLength] = useState(50);
  const [threadLength, setThreadLength] = useState(2);

  const { startOnborda } = useOnborda();
  const { data } = useSession();

  // const [tone, setTone] = useState<"humoristic" | "serious" | "informative" | "normal">("normal");
  const [type, setType] = useState<"singleTweet" | "thread">("singleTweet");

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
              <Tabs aria-label="Generator type" color={"primary"} defaultSelectedKey={"normal"}>
                <Tab key="humorisitc" title="Humoristic" />
                <Tab key="serious" title="Serious" />
                <Tab key="informative" title="Informative" />
                <Tab key="normal" title="Normal" />
              </Tabs>
            </div>

            <div id="onborda-step3"> 
              <Tabs
                aria-label="Generator type"
                color={"primary"}
                defaultSelectedKey={type}
                onSelectionChange={(key) => {
                  setType(key as "singleTweet" | "thread");
                  // TODO: Reset "Indicators" switch
                }}
              >
                <Tab key="singleTweet" title={
                  <div className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    Single
                  </div>
                } />

                <Tab key="thread" title={
                  <div className="flex items-center gap-1">
                    <MessagesSquare size={16} />
                    Thread
                  </div>
                } />
              </Tabs>
            </div>
          </div>

          <div id="onborda-step4">
            <Card className="w-full border-2 border-[#262629]">
              <CardHeader className="flex flex-col items-start border-b border-[#262629]">
                Tweet length
                <span className="text-[#9CA3AF] text-sm">
                  The amount of characters that your tweet will have.
                </span>
              </CardHeader>

              <CardBody className="flex flex-col gap-2">
                <Slider 
                  className="w-full" 
                  color={"primary"}
                  defaultValue={50}  
                  formatOptions={{ style: "decimal" }}
                  maxValue={500}
                  minValue={15}
                  showTooltip={true}
                  step={1}
                  tooltipProps={{
                    placement: "top",
                    color: "primary",
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

            {type == "thread" && (
              <Card className="w-full border-2 border-[#262629] mt-2">
                <CardHeader className="flex flex-col items-start border-b border-[#262629]">
                  Thread length
                  <span className="text-[#9CA3AF] text-sm">
                    The amount of sub-tweets that your thread will have.
                  </span>
                </CardHeader>

                <CardBody className="flex flex-col gap-2">
                  <Slider 
                    className="w-full" 
                    color={"primary"}
                    defaultValue={50}  
                    formatOptions={{ style: "decimal" }}
                    maxValue={12}
                    minValue={2}
                    showTooltip={true}
                    step={1}
                    tooltipProps={{
                      placement: "top",
                      color: "primary",
                      content: (
                        <span className="flex items-center gap-1">
                          {threadLength} tweets <ArrowRight size={16} /> {calculateCredits(threadLength)} credits
                        </span>
                      )
                    }}
                    value={threadLength}
                    // @ts-ignore
                    onChange={(value: number) => setThreadLength(value)}
                  />
                </CardBody>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl" id="onborda-step5">
            <Switch
              classNames={{
                base: cn(
                  "inline-flex flex-row-reverse w-full max-w-xl bg-content1 hover:bg-content2 items-center",
                  "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary",
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn("w-6 h-6 border-2 shadow-lg",
                  "group-data-[hover=true]:border-primary",
                  //selected
                  "group-data-[selected=true]:ml-6",
                  // pressed
                  "group-data-[pressed=true]:w-7",
                  "group-data-[selected]:group-data-[pressed]:ml-4",
                ),
              }}
            >
              <div className="flex flex-col gap-1">
                <p className="text-medium">Emojies</p>
                <p className="text-tiny text-default-400">
                  Do you want to add emojies to your tweet?
                </p>
              </div>
            </Switch>

            <Switch
              classNames={{
                base: cn(
                  "inline-flex flex-row-reverse w-full max-w-xl bg-content1 hover:bg-content2 items-center",
                  "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary",
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn("w-6 h-6 border-2 shadow-lg",
                  "group-data-[hover=true]:border-primary",
                  //selected
                  "group-data-[selected=true]:ml-6",
                  // pressed
                  "group-data-[pressed=true]:w-7",
                  "group-data-[selected]:group-data-[pressed]:ml-4",
                ),
              }}
              isDisabled={type == "singleTweet"}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-medium">Indicators</p>
                  {type == "singleTweet" && <Chip color="primary" size="sm" variant="flat">Threads only</Chip>}
                </div>
                <p className="text-tiny text-default-400">
                  Do you want to add indicators to your tweet?
                </p>
              </div>
            </Switch>
          </div>
        </CardBody>

        <CardFooter className="flex justify-between flex gap-2">
          <div className="flex gap-2">
            <Button color="default" size="sm" onClick={startOnborda}>
              <Presentation size={16} />
              Onboarding
            </Button>

            <div id="onborda-step6">
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

          <div id="onborda-step7">
            <Button color={"primary"} size="sm">
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


const calculateCredits = (threadLength: number): number => {
  if (threadLength <= 5) {
    return threadLength;
  } else {
    return threadLength - 1;
  }

  return 0;
}