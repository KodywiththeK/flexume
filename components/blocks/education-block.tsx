"use client"

import { useState, useEffect } from "react"
import { useResumeStore } from "@/store/resume-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeBlock } from "@/types/resume"

type EducationItem = {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  status: "graduated" | "attending" | "leave" | "expected"
  gpa?: string
}

type EducationData = {
  items: EducationItem[]
}

type EducationBlockProps = {
  block: ResumeBlock
}

export default function EducationBlock({ block }: EducationBlockProps) {
  const { updateBlockContent } = useResumeStore()
  const [education, setEducation] = useState<EducationData>(
    block.content || {
      items: [
        {
          id: crypto.randomUUID(),
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          status: "graduated",
        },
      ],
    },
  )

  // Update local state when block content changes
  useEffect(() => {
    if (block.content) {
      setEducation(block.content)
    }
  }, [block.content])

  const handleItemChange = (index: number, field: keyof EducationItem, value: any) => {
    const updatedItems = [...education.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    const updatedEducation = { ...education, items: updatedItems }
    setEducation(updatedEducation)
    updateBlockContent(block.id, updatedEducation)
  }

  const addEducationItem = () => {
    const updatedItems = [
      ...education.items,
      {
        id: crypto.randomUUID(),
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        status: "graduated",
      },
    ]

    const updatedEducation = { ...education, items: updatedItems }
    setEducation(updatedEducation)
    updateBlockContent(block.id, updatedEducation)
  }

  const removeEducationItem = (index: number) => {
    const updatedItems = education.items.filter((_, i) => i !== index)
    const updatedEducation = { ...education, items: updatedItems }
    setEducation(updatedEducation)
    updateBlockContent(block.id, updatedEducation)
  }

  return (
    <div className="space-y-6">
      {education.items.map((item, itemIndex) => (
        <Card key={item.id} className="border border-muted">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">학력 #{itemIndex + 1}</h3>
              {education.items.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEducationItem(itemIndex)}
                  className="text-destructive h-8 w-8"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`school-${itemIndex}`}>학교명</Label>
                <Input
                  id={`school-${itemIndex}`}
                  value={item.school}
                  onChange={(e) => handleItemChange(itemIndex, "school", e.target.value)}
                  placeholder="서울대학교"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`degree-${itemIndex}`}>학위</Label>
                  <Input
                    id={`degree-${itemIndex}`}
                    value={item.degree}
                    onChange={(e) => handleItemChange(itemIndex, "degree", e.target.value)}
                    placeholder="학사"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`field-${itemIndex}`}>전공</Label>
                  <Input
                    id={`field-${itemIndex}`}
                    value={item.field}
                    onChange={(e) => handleItemChange(itemIndex, "field", e.target.value)}
                    placeholder="컴퓨터공학"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${itemIndex}`}>입학일</Label>
                  <Input
                    id={`startDate-${itemIndex}`}
                    type="date"
                    value={item.startDate}
                    onChange={(e) => handleItemChange(itemIndex, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${itemIndex}`}>졸업일</Label>
                  <Input
                    id={`endDate-${itemIndex}`}
                    type="date"
                    value={item.endDate}
                    onChange={(e) => handleItemChange(itemIndex, "endDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`status-${itemIndex}`}>상태</Label>
                  <Select
                    value={item.status}
                    onValueChange={(value) => handleItemChange(itemIndex, "status", value as EducationItem["status"])}
                  >
                    <SelectTrigger id={`status-${itemIndex}`}>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="graduated">졸업</SelectItem>
                      <SelectItem value="attending">재학중</SelectItem>
                      <SelectItem value="leave">휴학중</SelectItem>
                      <SelectItem value="expected">졸업예정</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`gpa-${itemIndex}`}>학점 (선택사항)</Label>
                  <Input
                    id={`gpa-${itemIndex}`}
                    value={item.gpa || ""}
                    onChange={(e) => handleItemChange(itemIndex, "gpa", e.target.value)}
                    placeholder="4.5 / 4.5"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addEducationItem} className="w-full">
        <Plus size={16} className="mr-2" />
        학력 추가
      </Button>
    </div>
  )
}

