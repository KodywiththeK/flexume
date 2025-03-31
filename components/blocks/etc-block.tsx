"use client"

import { useState, useEffect } from "react"
import { useResumeStore } from "@/store/resume-store"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ResumeBlock } from "@/types/resume"

type EtcData = {
  content: string
}

type EtcBlockProps = {
  block: ResumeBlock
}

export default function EtcBlock({ block }: EtcBlockProps) {
  const { updateBlockContent } = useResumeStore()
  const [etc, setEtc] = useState<EtcData>(
    block.content || {
      content: "",
    },
  )

  // Update local state when block content changes
  useEffect(() => {
    if (block.content) {
      setEtc(block.content)
    }
  }, [block.content])

  const handleChange = (value: string) => {
    const updatedEtc = { ...etc, content: value }
    setEtc(updatedEtc)
    updateBlockContent(block.id, updatedEtc)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="etc">기타 정보</Label>
      <Textarea
        id="etc"
        value={etc.content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="추가로 기재하고 싶은 정보를 작성해주세요."
        className="min-h-[120px]"
      />
    </div>
  )
}

