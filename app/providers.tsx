"use client";

import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider } from "next-auth/react";
import { ReactElement } from "react";

import { OnboardingProvider } from "@/lib/providers/onboarding.provider";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Component } from "@/components/component";


export type ProvidersProps = {
  children: ReactElement;
  themeProps?: ThemeProviderProps;
}

export const Providers: Component<ProvidersProps> = ({ children, themeProps }) => {
  const router = useRouter();

  return (
    <OnboardingProvider>
      <QueryProvider>
        <SessionProvider>
          <NextUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
          </NextUIProvider>
        </SessionProvider>
      </QueryProvider>
    </OnboardingProvider>
  );
}
