"use client"

import { useState, useEffect } from "react"
import { useResumeStore } from "@/store/resume-store"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ResumeBlock } from "@/types/resume"

type SummaryData = {
  content: string
}

type SummaryBlockProps = {
  block: ResumeBlock
}

export default function SummaryBlock({ block }: SummaryBlockProps) {
  const { updateBlockContent } = useResumeStore()
  const [summary, setSummary] = useState<SummaryData>(
    block.content || {
      content: "",
    },
  )

  // Update local state when block content changes
  useEffect(() => {
    if (block.content) {
      setSummary(block.content)
    }
  }, [block.content])

  const handleChange = (value: string) => {
    const updatedSummary = { ...summary, content: value }
    setSummary(updatedSummary)
    updateBlockContent(block.id, updatedSummary)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="summary">자기소개</Label>
      <Textarea
        id="summary"
        value={summary.content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="간략한 자기소개를 작성해주세요."
        className="min-h-[120px]"
      />
    </div>
  )
}

