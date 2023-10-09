// @ts-ignore
import type { Content } from "mdast-util-from-markdown/lib";

export type MarkdownElementProps = {
  parent?: Content | null;
  element: Content;
};