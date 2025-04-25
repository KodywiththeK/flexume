"use client"

import { useState, useEffect } from "react"
import { useResumeStore } from "@/store/resume-store"
import { Plus, X } from "lucide-react"
import type { ResumeBlock } from "@/types/resume"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type SkillCategory = {
  id: string
  name: string
  skills: string[]
}

type SkillsData = {
  categories: SkillCategory[]
}

type SkillsBlockProps = {
  block: ResumeBlock
}

export default function SkillsBlock({ block }: SkillsBlockProps) {
  const { updateBlockContent } = useResumeStore()
  const [skills, setSkills] = useState<SkillsData>(
    block.content || {
      categories: [
        {
          id: crypto.randomUUID(),
          name: "프론트엔드",
          skills: [],
        },
      ],
    },
  )
  const [newSkill, setNewSkill] = useState<{ [key: string]: string }>({})

  // Update local state when block content changes
  useEffect(() => {
    if (block.content) {
      setSkills(block.content)
    }
  }, [block.content])

  const handleCategoryNameChange = (index: number, name: string) => {
    const updatedCategories = [...skills.categories]
    updatedCategories[index] = { ...updatedCategories[index], name }

    const updatedSkills = { ...skills, categories: updatedCategories }
    setSkills(updatedSkills)
    updateBlockContent(block.id, updatedSkills)
  }

  const addSkill = (categoryIndex: number) => {
    if (!newSkill[categoryIndex] || newSkill[categoryIndex].trim() === "") return

    const updatedCategories = [...skills.categories]
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      skills: [...updatedCategories[categoryIndex].skills, newSkill[categoryIndex]],
    }

    const updatedSkills = { ...skills, categories: updatedCategories }
    setSkills(updatedSkills)
    updateBlockContent(block.id, updatedSkills)

    // Clear the input
    setNewSkill({ ...newSkill, [categoryIndex]: "" })
  }

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updatedCategories = [...skills.categories]
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      skills: updatedCategories[categoryIndex].skills.filter((_, i) => i !== skillIndex),
    }

    const updatedSkills = { ...skills, categories: updatedCategories }
    setSkills(updatedSkills)
    updateBlockContent(block.id, updatedSkills)
  }

  const addCategory = () => {
    const updatedCategories = [
      ...skills.categories,
      {
        id: crypto.randomUUID(),
        name: "새 카테고리",
        skills: [],
      },
    ]

    const updatedSkills = { ...skills, categories: updatedCategories }
    setSkills(updatedSkills)
    updateBlockContent(block.id, updatedSkills)
  }

  const removeCategory = (index: number) => {
    const updatedCategories = skills.categories.filter((_, i) => i !== index)
    const updatedSkills = { ...skills, categories: updatedCategories }
    setSkills(updatedSkills)
    updateBlockContent(block.id, updatedSkills)
  }

  return (
    <div className="space-y-6">
      {skills.categories.map((category, categoryIndex) => (
        <Card key={category.id} className="border border-muted">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor={`category-${categoryIndex}`}>카테고리명</Label>
                <Input
                  id={`category-${categoryIndex}`}
                  value={category.name}
                  onChange={(e) => handleCategoryNameChange(categoryIndex, e.target.value)}
                  placeholder="카테고리명"
                />
              </div>
              {skills.categories.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCategory(categoryIndex)}
                  className="text-destructive h-8 w-8 ml-2"
                >
                  <X size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="secondary" className="px-3 py-1 text-sm">
                    {skill}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(categoryIndex, skillIndex)}
                      className="h-4 w-4 ml-1 -mr-1 text-muted-foreground hover:text-destructive"
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newSkill[categoryIndex] || ""}
                  onChange={(e) =>
                    setNewSkill({
                      ...newSkill,
                      [categoryIndex]: e.target.value,
                    })
                  }
                  placeholder="새 기술 추가"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill(categoryIndex)
                    }
                  }}
                />
                <Button type="button" onClick={() => addSkill(categoryIndex)} className="shrink-0">
                  추가
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addCategory} className="w-full">
        <Plus size={16} className="mr-2" />
        카테고리 추가
      </Button>
    </div>
  )
}
