"use client";

import "highlight.js/styles/github-dark.css";

import type { Component } from "@/lib/utils/component";
import type { MDCodeProps } from "./md-code.type";
import { useEffect } from "react";
import hljs from "highlight.js";
import { cn } from "@/lib/utils";

export const MDCode: Component<MDCodeProps> = ({ lang, value }) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    hljs.highlightAll();
  }, []);

  // Styles :
  const styles = cn("rounded", {
    [`language-${lang ?? ""}`]: lang
  });

  return (
    <pre>
      <code className={cn(styles, "whitespace-pre-wrap")}>{value}</code>
    </pre>
  );
};