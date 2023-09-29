/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Component } from "@/lib/utils/component";
import Link from "next/link";
import type { MarkdownElementProps } from "./markdown-element.type";
import { MDHeading } from "../elements/md-heading";
import { MDCode } from "../elements/md-code";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export const MarkdownElement: Component<MarkdownElementProps> = ({ element, parent = null }) => {
  if (parent) {
    if (parent.type === "heading" && element.type === "text") {
      return <MDHeading depth={parent.depth} text={element.value} />;
    }

    if (parent.type === "blockquote" && element.type === "paragraph" && element.children[0].type === "text") {
      return <p className={cn(
        "relative pl-4 italic my-4",
        "before:content-[''] before:absolute before:h-full before:w-1 before:bg-purple before:left-0"
      )}>{element.children[0].value}</p>;
    }

    if (parent.type === "paragraph") {
      if (element.type === "strong" && element.children[0].type === "text") {
        return <strong className="font-bold text-white"
        >{element.children[0].value}</strong>;
      }

      if (element.type === "emphasis" && element.children[0].type === "text") {
        return <em>{element.children[0].value}</em>;
      }

      if (element.type === "link" && element.children[0].type === "text") {
        return (
          <Link href={element.url} target="_blank" className="text-white no-underline hover:underline inline-block">
            <span>{element.children[0].value}</span>
            <ExternalLink className="text-white inline-block ml-1" size={16} />
          </Link>
        );
      }

      if (element.type === "image") {
        return <img src={element.url} alt={element.alt ?? ""} className="lg:max-w-3xl mx-auto my-10 rounded" />;
      }

      if (element.type === "text") {
        return <>{element.value}</>;
      }

      if (element.type === "inlineCode") {
        return <code className="bg-gray-800 text-white py-1 rounded">{element.value}</code>;
      }

      return (
        <>
          <p className="text-red-500">ERROR: Unsupported element</p>
          <pre>
            {JSON.stringify(element, null, 2)}
          </pre>
        </>
      );
    }

    if (element.type === "listItem") {
      return (
        <>
          {/* @ts-ignore */}
          {element.children.map((child, i) => {
            if (child.type === "paragraph") {
              return (
                <li key={i} className="text-muted-foreground">
                  <MarkdownElement element={child} />
                </li>
              );
            }

            if (child.type === "list") {
              return <MarkdownElement key={i} element={child} />;
            }
          })}
        </>
      );
    }

    return (
      <>
        <p className="text-red-500">ERROR: Unsupported element</p>
        <pre>
          {JSON.stringify(element, null, 2)}
        </pre>
      </>
    );
  }

  if (element.type === "thematicBreak") {
    return <hr className="border-gray-700 my-2" />;
  }

  if (element.type === "heading" || element.type === "blockquote") {
    return <MarkdownElement parent={element} element={element.children[0]} />;
  }

  if (element.type === "paragraph") {
    return (
      <p className="text-muted-foreground">
        {/* @ts-ignore */}
        {element.children.map((child, i) => (
          <MarkdownElement key={i} parent={element} element={child} />
        ))}
      </p>
    );
  }

  if (element.type === "list") {
    const listStyle = cn("ml-6 text-muted-foreground", {
      "list-descimal": element.ordered,
      "list-disc": !element.ordered
    });
    return (
      <ul className={listStyle}>
        {/* @ts-ignore */}
        {element.children.map((child, i) => (
          <MarkdownElement key={i} parent={element} element={child} />
        ))}
      </ul>
    );
  }

  if (element.type === "code") {
    return <MDCode lang={element.lang} value={element.value} />;
  }

  return (
    <>
      <p className="text-red-500">ERROR: Unsupported element</p>
      <pre>
        {JSON.stringify(element, null, 2)}
      </pre>
    </>
  );
};