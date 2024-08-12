"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { HandMetal, PiggyBank, Presentation } from "lucide-react";
import { useState } from "react";
import { useOnborda } from "onborda";
import { useSession } from "next-auth/react";

import { TextareaComponent } from "./lib/TextareaComponent";
import { ToneTabsComponent } from "./lib/TabsToneComponent";
import { TONES } from "./type/tabs.type";
import { TypeTabsComponent } from "./lib/TabsTypeComponent";
import { LengthSliderComponent } from "./lib/LengthSliderComponent";
import { ThreadLengthSliderComponent } from "./lib/ThreadLengthSliderComponent";
import { EmojiesSwitchComponent } from "./lib/EmojiesSwitchComponent";
import { IndicatorsSwitchComponent } from "./lib/IndicatorsSwitchComponent";

import { CreditsModal } from "@/components/CreditsModal";

const Page = () => {
  const [tweetLength, setTweetLength] = useState(50);
  const [threadLength, setThreadLength] = useState(2);

  const { startOnborda } = useOnborda();
  const { data } = useSession();
  
  const [content, setContent] = useState<string>("");

  const [tone, setTone] = useState<TONES>("normal");
  const [type, setType] = useState<"singleTweet" | "thread">("singleTweet");

  const [emojies, setEmojies] = useState<boolean>(true);
  const [indicators, setIndicators] = useState<boolean>(true);

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
          <TextareaComponent value={content} onChange={(e) => setContent(e.target.value)} />

          <div className="w-full flex flex-col sm:flex-row gap-2 items-center justify-between">
            <ToneTabsComponent setType={setTone} type={tone} />
            <TypeTabsComponent setType={setType} type={type} onChange={() => {
              if (type == "singleTweet") {
                setThreadLength(0);
                setIndicators(false);
              }
            }} />
          </div>
          
          {/* @ts-ignore */}
          <LengthSliderComponent value={tweetLength} onChange={(value) => setTweetLength(value)} />
          
          {/* @ts-ignore */}
          {type == "thread" && <ThreadLengthSliderComponent value={threadLength} onChange={(value) => setThreadLength(value)} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl" id="onborda-step5">
            <EmojiesSwitchComponent value={emojies} onChange={(value) => setEmojies(value)} />
            <IndicatorsSwitchComponent type={type} value={indicators} onChange={(value) => setIndicators(value)} />
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