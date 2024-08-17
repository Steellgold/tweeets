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
      <head>
        <link as="image" href="/credits/10.png" rel="preload"/>
        <link as="image" href="/credits/50.png" rel="preload"/>
        <link as="image" href="/credits/100.png" rel="preload"/>
        <link as="image" href="/credits/500.png" rel="preload"/>
      </head>

      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;