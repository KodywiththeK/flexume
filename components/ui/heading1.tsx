import { cn } from "@/lib/utils"
import type React from "react"

export function Heading1({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h1 className={cn("text-3xl font-bold text-gray-800", className)}>{children}</h1>
}
