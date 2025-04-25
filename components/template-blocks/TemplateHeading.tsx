"use client"
import { cn } from "@/lib/utils"
import type React from "react"
import { Heading2 } from "@/components/ui/heading2"

type Props = {
  children: React.ReactNode
  templateType: "classic" | "modern" | "minimal"
}

export default function TemplateHeading({ children, templateType }: Props) {
  const getHeaderClass = () => {
    switch (templateType) {
      case "modern":
        return "text-[var(--accent-color)] border-b border-[var(--accent-color)] pb-1"
      case "minimal":
        return "text-gray-700 pb-1"
      case "classic":
      default:
        return "pb-1 border-b border-gray-200 text-lime-600"
    }
  }
  return <Heading2 className={cn("mb-3", getHeaderClass())}>{children}</Heading2>
}
