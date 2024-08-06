import { ReactElement } from "react"

import { Component } from "./component"

import { cn } from "@/lib/utils"

type Props = {
  badge?: {
    text?: string
    color?: string
    icon?: ReactElement
  }
  size?: "sm" | "md" | string
  color?: string
  text: string
  link?: {
    href?: string
    isExternal?: boolean
  }
}


export const HighlightBadge: Component<Props> = ({ size = "sm", text, badge, color = "#111111", link }) => {
  return (
    <div className={cn("inline-flex items-center rounded-full shadow-lg border-2")}
      style={{
        backgroundColor: color,
        borderColor: lightenColor(color, 20),
        padding: size === "sm" ? "0.25rem 0.5rem" : size === "md" ? "0.5rem 1rem" : "0.75rem 1.5rem",
      }}
    >
      {badge && (
        <span
          className="text-xs flex text-white rounded-full mr-2"
          style={{
            backgroundColor: badge?.color ?? badge?.text ? lightenColor(color, 20) : lightenColor(color, 40),
            padding: size === "sm" ? "0.25rem 0.5rem" : size === "md" ? "0.5rem 1rem" : "0.75rem 1.5rem",
          }}>
          
          {badge.icon &&
            <span style={{ marginRight: badge.text ? 6 : 0 }}>
              {badge.icon}
            </span>
          }
          
          {badge.text ??
            <span className="text-xs">
              {badge.text}
            </span>
          }
        </span>
      )}
      <span className="text-sm text-white mr-1">{text}</span>
    </div>
  )
}

const lightenColor = (hex: string, amount: number): string => {
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }

  let num = parseInt(hex, 16);

  let r = (num >> 16);
  let g = (num >> 8) & 0x00FF;
  let b = num & 0x0000FF;

  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));

  const newHex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');

  return `#${newHex}`;
}