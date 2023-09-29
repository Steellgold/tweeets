import type { ComponentPropsWithoutRef } from "react";

export type MarkdownProps = ComponentPropsWithoutRef<"div"> & {
  source: string;
};