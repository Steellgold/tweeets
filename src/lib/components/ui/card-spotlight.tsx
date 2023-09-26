// https://github.com/br4adam/bookmarks/blob/main/src/components/CardSpotlight.tsx

"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, ReactNode, CSSProperties } from "react"

type Props = {
  className?: string
  style?: CSSProperties
  children: ReactNode
  hoverEffect?: boolean
  special?: boolean
}

const CardSpotlight = ({ className = "", style = {}, children, special = false, hoverEffect = true }: Props) => {
  const [ opacity, setOpacity ] = useState<number>(0)
  const [ position, setPosition ] = useState<{x: number, y: number}>({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseEnter = () => setOpacity(1)
  const handleMouseLeave = () => setOpacity(0)

  return (
    <div className={cn({
      "rounded-lg relative p-3 flex flex-col gap-4 shadow-lg bg-zinc-950 border border-zinc-900 bg-cover": true,
      "bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-700": special,
    }, className)} style={style} ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="absolute inset-0 transition-all duration-200 rounded-lg opacity-0 pointer-events-none" style={{
        opacity,
        background: hoverEffect ? `radial-gradient(350px circle at ${position.x}px ${position.y}px, #ffffff10, transparent)` : "transparent"
      }}>
      </div>
      { children }
    </div>
  )
}

export default CardSpotlight