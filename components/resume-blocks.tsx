"use client"

import { useResumeStore } from "@/store/resume-store"
import ResumeBlockItem from "./resume/ResumeBlockItem"

export default function ResumeBlocks() {
  const { getCurrentVersion, moveBlock, isEditing, draftVersion } = useResumeStore()
  const currentVersion = getCurrentVersion()

  const blocks = isEditing ? draftVersion?.blocks : currentVersion?.blocks

  if (!currentVersion) {
    return <div className="text-center py-10">No resume version selected</div>
  }

  const handleMoveBlock = (dragIndex: number, hoverIndex: number) => {
    if (!isEditing) return
    moveBlock(dragIndex, hoverIndex)
  }

  return (
    <div className="space-y-4">
      {blocks?.map((block, index) => (
        <ResumeBlockItem key={block.id} block={block} index={index} moveBlock={handleMoveBlock} />
      ))}
      {currentVersion.blocks.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          {isEditing ? "왼쪽 패널에서 블록을 추가해주세요" : "편집 모드에서 왼쪽 패널의 블록을 추가할 수 있습니다"}
        </div>
      )}
      {!isEditing && currentVersion.blocks.length > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-md text-sm text-center">
          <p>편집 모드에서 블록을 추가하거나 수정할 수 있습니다.</p>
          <p>상단의 '편집' 버튼을 클릭하여 편집 모드로 전환하세요.</p>
        </div>
      )}
    </div>
  )
}
