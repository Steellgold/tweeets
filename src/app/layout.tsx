/* eslint-disable camelcase */
import type { Component } from "@/lib/utils/component";
import { Analytics } from "@vercel/analytics/react";
import "./tailwind.css";
import { Open_Sans } from "next/font/google";
import type { PropsWithChildren } from "react";
import { Navbar } from "@/lib/components/navbar/navbar";
import { UserProvider } from "@/lib/contexts/UserProvider";
import { ThemeProvider } from "@/lib/components/ui/theme-provider";
import { cn } from "@/lib/utils";

export { metadata } from "@/lib/configs/metadata";

const os = Open_Sans({ subsets: ["latin"] });

const RootLayout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-white dark:bg-zinc-950", os)}>
        <Analytics />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <UserProvider>
            <Navbar />
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;