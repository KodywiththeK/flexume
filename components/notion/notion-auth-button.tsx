"use client"

import { useState } from "react"
import { NotionAuthModal } from "./notion-auth-modal"
import { useNotionAuthStore } from "@/store/notion-auth-store"
import { NotionLogo } from "./notion-logo"
import { Button } from "@/components/ui/button"

interface NotionAuthButtonProps {
  onSuccess?: () => void
  className?: string
}

export function NotionAuthButton({ onSuccess, className }: NotionAuthButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isAuthenticatedWithNotion } = useNotionAuthStore()

  const handleButtonClick = () => {
    if (isAuthenticatedWithNotion) {
      // 이미 인증된 경우 바로 다음 단계로 진행
      onSuccess?.()
    } else {
      // 인증되지 않은 경우 모달 표시
      setIsModalOpen(true)
    }
  }

  const handleAuthConfirm = async () => {
    // Notion OAuth 인증 시작
    window.location.href = "/api/auth/notion/authorize"
  }

  return (
    <>
      <Button onClick={handleButtonClick} variant="outline" className={`flex items-center gap-2 ${className}`}>
        <NotionLogo className="w-4 h-4" />
        노션에서 불러오기
      </Button>

      <NotionAuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleAuthConfirm} />
    </>
  )
}
