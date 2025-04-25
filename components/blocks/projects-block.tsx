"use client"

import { useState, useEffect } from "react"
import { useResumeStore } from "@/store/resume-store"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeBlock } from "@/types/resume"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type ProjectItem = {
  id: string
  title: string
  role: string
  startDate: string
  endDate: string
  description: string
  skills: string[]
  link?: string
}

type ProjectsData = {
  items: ProjectItem[]
}

type ProjectsBlockProps = {
  block: ResumeBlock
}

export default function ProjectsBlock({ block }: ProjectsBlockProps) {
  const { updateBlockContent } = useResumeStore()
  const [projects, setProjects] = useState<ProjectsData>(
    block.content || {
      items: [
        {
          id: crypto.randomUUID(),
          title: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
          skills: [],
        },
      ],
    },
  )

  // Update local state when block content changes
  useEffect(() => {
    if (block.content) {
      setProjects(block.content)
    }
  }, [block.content])

  const handleItemChange = (index: number, field: keyof ProjectItem, value: any) => {
    const updatedItems = [...projects.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    const updatedProjects = { ...projects, items: updatedItems }
    setProjects(updatedProjects)
    updateBlockContent(block.id, updatedProjects)
  }

  const handleSkillsChange = (index: number, value: string) => {
    const skills = value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
    handleItemChange(index, "skills", skills)
  }

  const addProjectItem = () => {
    const updatedItems = [
      ...projects.items,
      {
        id: crypto.randomUUID(),
        title: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
        skills: [],
      },
    ]

    const updatedProjects = { ...projects, items: updatedItems }
    setProjects(updatedProjects)
    updateBlockContent(block.id, updatedProjects)
  }

  const removeProjectItem = (index: number) => {
    const updatedItems = projects.items.filter((_, i) => i !== index)
    const updatedProjects = { ...projects, items: updatedItems }
    setProjects(updatedProjects)
    updateBlockContent(block.id, updatedProjects)
  }

  return (
    <div className="space-y-6">
      {projects.items.map((item, itemIndex) => (
        <Card key={item.id} className="border border-muted">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">프로젝트 #{itemIndex + 1}</h3>
              {projects.items.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProjectItem(itemIndex)}
                  className="text-destructive h-8 w-8"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${itemIndex}`}>프로젝트명</Label>
                  <Input
                    id={`title-${itemIndex}`}
                    value={item.title}
                    onChange={(e) => handleItemChange(itemIndex, "title", e.target.value)}
                    placeholder="프로젝트명"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`role-${itemIndex}`}>역할</Label>
                  <Input
                    id={`role-${itemIndex}`}
                    value={item.role}
                    onChange={(e) => handleItemChange(itemIndex, "role", e.target.value)}
                    placeholder="프론트엔드 개발"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${itemIndex}`}>시작일</Label>
                  <Input
                    id={`startDate-${itemIndex}`}
                    type="date"
                    value={item.startDate}
                    onChange={(e) => handleItemChange(itemIndex, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${itemIndex}`}>종료일</Label>
                  <Input
                    id={`endDate-${itemIndex}`}
                    type="date"
                    value={item.endDate}
                    onChange={(e) => handleItemChange(itemIndex, "endDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${itemIndex}`}>프로젝트 설명</Label>
                <Textarea
                  id={`description-${itemIndex}`}
                  value={item.description}
                  onChange={(e) => handleItemChange(itemIndex, "description", e.target.value)}
                  placeholder="프로젝트에 대한 설명을 작성해주세요."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`skills-${itemIndex}`}>사용 기술 (쉼표로 구분)</Label>
                <Input
                  id={`skills-${itemIndex}`}
                  value={item.skills.join(", ")}
                  onChange={(e) => handleSkillsChange(itemIndex, e.target.value)}
                  placeholder="React, TypeScript, Next.js"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`link-${itemIndex}`}>링크 (선택사항)</Label>
                <Input
                  id={`link-${itemIndex}`}
                  value={item.link || ""}
                  onChange={(e) => handleItemChange(itemIndex, "link", e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addProjectItem} className="w-full">
        <Plus size={16} className="mr-2" />
        프로젝트 추가
      </Button>
    </div>
  )
}
