"use client"

import { useResumeStore } from "@/store/resume-store"
import type { BlockType } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function ControlPanel() {
  const { addBlock, currentVersion, isEditing } = useResumeStore()

  const blockTypes: { type: BlockType; label: string; description: string }[] = [
    {
      type: "profile",
      label: "프로필",
      description: "이름, 연락처, 이메일, 링크 등",
    },
    {
      type: "summary",
      label: "자기소개",
      description: "간략한 자기소개 또는 한 줄 소개",
    },
    {
      type: "experience",
      label: "경력",
      description: "회사명, 직무, 기간, 성과 중심",
    },
    {
      type: "education",
      label: "학력",
      description: "학교, 전공, 졸업 여부",
    },
    {
      type: "projects",
      label: "프로젝트",
      description: "주요 프로젝트 설명",
    },
    {
      type: "skills",
      label: "기술 스택",
      description: "보유 기술 및 역량",
    },
    {
      type: "certifications",
      label: "자격증",
      description: "취득한 자격증 및 수료증",
    },
    {
      type: "awards",
      label: "수상 내역",
      description: "수상 경력 및 성과",
    },
    {
      type: "etc",
      label: "기타",
      description: "추가 정보 및 기타 항목",
    },
  ]

  // Check if a block type already exists in the current version
  const blockTypeExists = (type: BlockType): boolean => {
    if (!currentVersion) return false
    return currentVersion.blocks.some((block) => block.type === type)
  }

  const handleAddBlock = (type: BlockType) => {
    if (!isEditing) {
      alert("편집 모드에서만 블록을 추가할 수 있습니다. 상단의 '편집' 버튼을 클릭하세요.")
      return
    }
    addBlock(type)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>블록 추가</CardTitle>
        <CardDescription>
          {isEditing ? "이력서에 추가할 블록을 선택하세요" : "편집 모드에서 블록을 추가할 수 있습니다"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {blockTypes.map((blockType) => {
            const exists = blockTypeExists(blockType.type)

            return (
              <Button
                key={blockType.type}
                variant="outline"
                className={`w-full justify-start text-left h-auto py-3 ${!isEditing ? "opacity-70" : ""}`}
                onClick={() => handleAddBlock(blockType.type)}
                disabled={(blockType.type === "profile" && exists) || !isEditing}
              >
                <div className="flex items-center gap-2">
                  <Plus size={16} />
                  <div>
                    <div className="font-medium">{blockType.label}</div>
                    <div className="text-xs text-muted-foreground">{blockType.description}</div>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>

        {!isEditing && (
          <div className="mt-4 p-3 bg-muted rounded-md text-sm text-center">
            <p>편집 모드에서만 블록을 추가할 수 있습니다.</p>
            <p>상단의 '편집' 버튼을 클릭하세요.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

