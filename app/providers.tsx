"use client";

import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider } from "next-auth/react";
import { Onborda, OnbordaProvider, Step } from "onborda";
import { ReactElement } from "react";
import { Zap } from "lucide-react";
import { Code } from "@nextui-org/code";

import { OnboardCard } from "@/components/OnboardCard";

export interface ProvidersProps {
  children: ReactElement;
  themeProps?: ThemeProviderProps;
}

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

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

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
              <Code className="text-model4"><Zap color="#a3f7ab" fill="#a3f7ab" size={18} /></Code>
              <span>Fast mode is powered by <Code className="text-model4">GPT-4o mini</Code></span>
            </div>
          </div>
        ), "#onborda-step3"),
        config("📏", "How long do you want your tweet to be?", "Select the length of your tweet, it can be 140, 280 or more characters if you have a Twitter Premium account.", "#onborda-step4"),
      ]}>
        <SessionProvider>
          <NextUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
          </NextUIProvider>
        </SessionProvider>
      </Onborda>
    </OnbordaProvider>
  );
}
