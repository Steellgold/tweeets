import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { PropsWithChildren } from "react";


import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Component } from "@/components/component";
import { cn } from "@/lib/utils";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const RootLayout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html suppressHydrationWarning lang="en">
      <head />

      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <main className="p-5 sm:p-10 md:p-20 lg:p-30">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;