"use client"

import { useState, useEffect } from "react"
import { useResumeStore } from "@/store/resume-store"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeBlock } from "@/types/resume"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type CertificationItem = {
  id: string
  name: string
  issuer: string
  date: string
  description: string
}

type CertificationsData = {
  items: CertificationItem[]
}

type CertificationsBlockProps = {
  block: ResumeBlock
}

export default function CertificationsBlock({ block }: CertificationsBlockProps) {
  const { updateBlockContent } = useResumeStore()
  const [certifications, setCertifications] = useState<CertificationsData>(
    block.content || {
      items: [
        {
          id: crypto.randomUUID(),
          name: "",
          issuer: "",
          date: "",
          description: "",
        },
      ],
    },
  )

  // Update local state when block content changes
  useEffect(() => {
    if (block.content) {
      setCertifications(block.content)
    }
  }, [block.content])

  const handleItemChange = (index: number, field: keyof CertificationItem, value: string) => {
    const updatedItems = [...certifications.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    const updatedCertifications = { ...certifications, items: updatedItems }
    setCertifications(updatedCertifications)
    updateBlockContent(block.id, updatedCertifications)
  }

  const addCertificationItem = () => {
    const updatedItems = [
      ...certifications.items,
      {
        id: crypto.randomUUID(),
        name: "",
        issuer: "",
        date: "",
        description: "",
      },
    ]

    const updatedCertifications = { ...certifications, items: updatedItems }
    setCertifications(updatedCertifications)
    updateBlockContent(block.id, updatedCertifications)
  }

  const removeCertificationItem = (index: number) => {
    const updatedItems = certifications.items.filter((_, i) => i !== index)
    const updatedCertifications = { ...certifications, items: updatedItems }
    setCertifications(updatedCertifications)
    updateBlockContent(block.id, updatedCertifications)
  }

  return (
    <div className="space-y-6">
      {certifications.items.map((item, itemIndex) => (
        <Card key={item.id} className="border border-muted">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">자격증 #{itemIndex + 1}</h3>
              {certifications.items.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCertificationItem(itemIndex)}
                  className="text-destructive h-8 w-8"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${itemIndex}`}>자격증명</Label>
                <Input
                  id={`name-${itemIndex}`}
                  value={item.name}
                  onChange={(e) => handleItemChange(itemIndex, "name", e.target.value)}
                  placeholder="정보처리기사"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`issuer-${itemIndex}`}>발급 기관</Label>
                  <Input
                    id={`issuer-${itemIndex}`}
                    value={item.issuer}
                    onChange={(e) => handleItemChange(itemIndex, "issuer", e.target.value)}
                    placeholder="한국산업인력공단"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`date-${itemIndex}`}>취득일</Label>
                  <Input
                    id={`date-${itemIndex}`}
                    type="date"
                    value={item.date}
                    onChange={(e) => handleItemChange(itemIndex, "date", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${itemIndex}`}>설명 (선택사항)</Label>
                <Textarea
                  id={`description-${itemIndex}`}
                  value={item.description}
                  onChange={(e) => handleItemChange(itemIndex, "description", e.target.value)}
                  placeholder="자격증에 대한 추가 설명을 입력하세요."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addCertificationItem} className="w-full">
        <Plus size={16} className="mr-2" />
        자격증 추가
      </Button>
    </div>
  )
}
