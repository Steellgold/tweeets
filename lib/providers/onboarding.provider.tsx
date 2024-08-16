"use client";

import { Onborda, OnbordaProvider, Step } from "onborda";
import { PropsWithChildren, ReactElement } from "react";
import { Code } from "@nextui-org/code";

import { OnboardCard } from "@/components/OnboardCard";
import { Component } from "@/components/component";

export const config = (icon: string, title: string, content: ReactElement | string, selector: string): Step => ({
  icon,
  title,
  content,
  selector,
  showControls: true,
  pointerPadding: 10,
  pointerRadius: 16,
  side: "bottom",
});

export const OnboardingProvider: Component<PropsWithChildren> = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <OnbordaProvider>
      <Onborda cardComponent={OnboardCard} shadowOpacity="0.8" shadowRgb="18,18,18" steps={[
        {
          tour: "demo",
          steps: [
            config("✏️", "What's your tweet about?", "What is the desired position, give us a context we can work with, like for example \"France, World Cup 2018\"", "#onborda-step1"),
            config("🎭", "What's the tone of your tweet?", "Select the tone of your tweet, it can be humoristic, serious, informative or normal.", "#onborda-step2"),
            config("🧵", "Do you want to generate a thread?", "You can generate a thread instead of a single tweet, just enable the checkbox below.", "#onborda-step3"),
            config("📏", "How long do you want your tweet to be?", "Select the length of your tweet, it can be 140, 280 or more characters if you have a Twitter Premium account.", "#onborda-step4"),

            config("🌍", "Select the language of your tweet", (
              <div>
                <p className="mb-1">Select the language of your tweet, we will generate a tweet in the selected language.</p>
              </div>
            ), "#onborda-step5"),

            config("⚙️", "Options", (
              <div className="flex flex-col gap-2">
                <p className="mb-0.5">Emojies: We will add emojis to your tweets to make them more engaging.</p>
                <p>Enable indicators: We will add indicators to your tweets to make it clear that it&apos;s a thread (e.g. 1/3).</p>
              </div>
            ), "#onborda-step6"),

            config("💳", "How much does a tweet cost?", (
              <div className="flex flex-col gap-2">
                <p>• Single tweets will cost <Code>1 credit each</Code>.</p>
                <p>• On thread mode, the five first tweets will <Code>cost 1 credit each</Code>, and the following tweets will cost <Code>1 credit less</Code>.</p>
              </div>
            ), "#onborda-step7"),        
            config("🚀", "You're ready to tweet!", "You're ready to tweet, click on the button below to generate your tweet.", "#onborda-step8"),
          ],
        },
      ]}>
        {children}
      </Onborda>
    </OnbordaProvider>
  );
}
