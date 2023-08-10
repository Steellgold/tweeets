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
import Link from "next/link";

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

          <footer className="flex flex-wrap gap-4 items-center justify-center w-full h-24 dark:border-zinc-850">
            <Link href={"/privacy"} className="text-muted hover:text-muted-foreground">
              Privacy Policy
            </Link>
            <Link href={"/tos"} className="text-muted hover:text-muted-foreground">
              Terms of Service
            </Link>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;