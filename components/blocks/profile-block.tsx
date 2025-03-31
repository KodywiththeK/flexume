"use client"

import { useState, useEffect } from "react"
import { useResumeStore } from "@/store/resume-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeBlock } from "@/types/resume"

type ProfileData = {
  name: string
  email: string
  phone: string
  links: { label: string; url: string }[]
}

type ProfileBlockProps = {
  block: ResumeBlock
}

export default function ProfileBlock({ block }: ProfileBlockProps) {
  const { updateBlockContent } = useResumeStore()
  const [profile, setProfile] = useState<ProfileData>(
    block.content || {
      name: "",
      email: "",
      phone: "",
      links: [{ label: "GitHub", url: "" }],
    },
  )

  // Update local state when block content changes
  useEffect(() => {
    if (block.content) {
      setProfile(block.content)
    }
  }, [block.content])

  const handleChange = (field: keyof ProfileData, value: string) => {
    const updatedProfile = { ...profile, [field]: value }
    setProfile(updatedProfile)
    updateBlockContent(block.id, updatedProfile)
  }

  const handleLinkChange = (index: number, field: "label" | "url", value: string) => {
    const updatedLinks = [...profile.links]
    updatedLinks[index] = { ...updatedLinks[index], [field]: value }

    const updatedProfile = { ...profile, links: updatedLinks }
    setProfile(updatedProfile)
    updateBlockContent(block.id, updatedProfile)
  }

  const addLink = () => {
    const updatedLinks = [...profile.links, { label: "", url: "" }]
    const updatedProfile = { ...profile, links: updatedLinks }
    setProfile(updatedProfile)
    updateBlockContent(block.id, updatedProfile)
  }

  const removeLink = (index: number) => {
    const updatedLinks = profile.links.filter((_, i) => i !== index)
    const updatedProfile = { ...profile, links: updatedLinks }
    setProfile(updatedProfile)
    updateBlockContent(block.id, updatedProfile)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="홍길동"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="example@email.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">연락처</Label>
        <Input
          id="phone"
          value={profile.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="010-1234-5678"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>링크</Label>
          <Button type="button" variant="outline" size="sm" onClick={addLink} className="h-8">
            <Plus size={16} className="mr-1" />
            링크 추가
          </Button>
        </div>

        {profile.links.map((link, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="grid grid-cols-2 gap-2 flex-1">
              <Input
                value={link.label}
                onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                placeholder="GitHub"
              />
              <Input
                value={link.url}
                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeLink(index)}
              className="text-destructive h-10 w-10"
              disabled={profile.links.length <= 1}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

