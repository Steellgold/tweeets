"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider } from "next-auth/react";
import { Onborda, OnbordaProvider } from "onborda";

import CustomCard from "@/components/CustomCardOnBoard";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <OnbordaProvider>
      {/* rgb(0, 111, 238) */}
      <Onborda cardComponent={CustomCard} shadowOpacity="0.8" shadowRgb="18,18,18" steps={[
        {
          icon: "🔤",
          title: "What's your tweet about?",
          content: "What is the desired position, give us a context we can work with, like for example \"France, World Cup 2018\"",
          selector: "#onborda-step1",
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 12,
          side: "bottom",
        },
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
