"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { BadgeCheck, HandMetal, LifeBuoy, Zap } from "lucide-react";
import { Textarea } from "@nextui-org/input";
import { Tabs, Tab } from "@nextui-org/tabs"; 
import { Slider } from "@nextui-org/slider";
import { useState } from "react";
import { useOnborda } from "onborda";

const Page = () => {
  const [tweetLength, setTweetLength] = useState(50);
  const { startOnborda } = useOnborda();

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
              <Tabs aria-label="Generator type" color="primary" defaultSelectedKey={"normal"}>
                <Tab key="humorisitc" title="Humoristic" />
                <Tab key="serious" title="Serious" />
                <Tab key="informative" title="Informative" />
                <Tab key="normal" title="Normal" />
              </Tabs>
            </div>

            <div id="onborda-step3"> 
              <Tabs aria-label="Generator speed" color="primary" defaultSelectedKey={"normal"}>
                <Tab key="slow" title={
                  <div className="flex items-center gap-1">
                    <Zap color="#FFC107" fill="#FFC107" size={16} />
                    Normal
                  </div>
                } />

                <Tab key="fast" title={
                  <div className="flex items-center gap-1">
                    <Zap color="#a3f7ab" fill="#a3f7ab" size={16} />
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
                  defaultValue={50}
                  formatOptions={{ style: "decimal" }}  
                  maxValue={500}
                  minValue={0}
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
          </div>
        </CardBody>

        <CardFooter className="flex justify-end flex gap-2">
          <Button color="primary" size="sm">
            <HandMetal size={16} />
            Generate Tweet
          </Button>

          <Button color="primary" size="sm" onClick={startOnborda}>
            <LifeBuoy size={16} />
            Help me
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

export default Page;
