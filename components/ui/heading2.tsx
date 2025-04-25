import { cn } from "@/lib/utils"
import type React from "react"

export function Heading2({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h2 className={cn("text-xl font-bold text-gray-800", className)}>{children}</h2>
}
