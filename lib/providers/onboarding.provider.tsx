"use client";

import { Onborda, OnbordaProvider, Step } from "onborda";
import { PropsWithChildren, ReactElement } from "react";
import { Zap } from "lucide-react";
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
        config("✏️", "What's your tweet about?", "What is the desired position, give us a context we can work with, like for example \"France, World Cup 2018\"", "#onborda-step1"),
        config("🎭", "What's the tone of your tweet?", "Select the tone of your tweet, it can be humoristic, serious, informative or normal.", "#onborda-step2"),
        config("⚡", "How fast do you want the generator to be?", (
          <div className="flex flex-col gap-2">
            <p>Select the speed of the generator, it can be normal or fast.</p>

            <div className="flex flex-wrap gap-2 items-center mt-3">
              <Code className="text-model3"><Zap color="#FFC107" fill="#FFC107" size={18} /></Code>
              <span>Normal mode is powered by <Code className="text-model3">GPT-3.5 Turbo</Code></span>              
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Code className="text-model4"><Zap color="#17c562" fill="#17c562" size={18} /></Code>
              <span>Fast mode is powered by <Code className="text-model4">GPT-4o mini</Code></span>
            </div>
          </div>
        ), "#onborda-step3"),
        config("📏", "How long do you want your tweet to be?", "Select the length of your tweet, it can be 140, 280 or more characters if you have a Twitter Premium account.", "#onborda-step4"),
        config("💳", "How much does a tweet cost?", (
          <div className="flex flex-col gap-2">
            <p>Each tweet generation will cost you 1 credit, and for a length above 280 characters it will cost you 2 credits.</p>
            <p>Each credit costs <Code>$0.99</Code>, but you can buy 10 credits for <Code>$5.99</Code>.</p>

            <div className="flex flex-wrap gap-2 items-center mt-2">
              <Code className="text-model4"><Zap color="#17c562" fill="#17c562" size={18} /></Code>
              <span>Fast mode costs one extra credit.</span>
            </div>
          </div>
        ), "#onborda-step5"), 
        config("🚀", "You're ready to tweet!", "You're ready to tweet, click on the button below to generate your tweet.", "#onborda-step6"),
      ]}>
        {children}
      </Onborda>
    </OnbordaProvider>
  );
}
