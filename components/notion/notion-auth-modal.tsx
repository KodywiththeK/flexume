"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NotionLogo } from "./notion-logo"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface NotionAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function NotionAuthModal({ isOpen, onClose, onConfirm }: NotionAuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error("Notion 인증 중 오류가 발생했습니다:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <NotionLogo className="w-5 h-5" />
            Notion 계정 연동이 필요해요
          </DialogTitle>
          <DialogDescription>
            이 기능은 Notion 계정과 연결 후 사용할 수 있습니다. 연동 시 Notion의 페이지 목록을 조회하고 내용을 가져올 수
            있습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "연동 중..." : "Notion 연동하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
