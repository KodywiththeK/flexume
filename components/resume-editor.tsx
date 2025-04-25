"use client"

import { useState } from "react"
import PDFPreview from "./pdf-preview"
import { Plus } from "lucide-react"
import DebugPanel from "./resume/DebugPanel"
import ResumeEditorHeader from "./resume/ResumeEditorHeader"
import ResumeTabs from "./resume/ResumeTabs"
import { useResumeStore } from "@/store/resume-store"
import CreateResumeDialog from "./resume/CreateResumeDialog"
import { redirect, useRouter } from "next/navigation"
import { ROUTES } from "@/constants/route"

export default function ResumeEditor() {
  const router = useRouter()
  const [showPreview, setShowPreview] = useState(false)
  const { getCurrentResume, getCurrentVersion } = useResumeStore()
  const currentResume = getCurrentResume()
  const currentVersion = getCurrentVersion()

  if (currentResume === null) redirect("/")
  if (currentVersion === null) router.push(ROUTES.RESUME_VERSIONS)

  if (showPreview) {
    return <PDFPreview onBack={() => setShowPreview(false)} />
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <ResumeEditorHeader onShowPreview={() => setShowPreview(true)} onDownloadPDF={() => setShowPreview(true)} />

        {currentResume && currentVersion ? (
          <ResumeTabs />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium mb-4">이력서를 만들어 시작하세요</h2>
            <p className="text-muted-foreground mb-6">
              블록 기반 이력서 편집기로 쉽게 이력서를 만들고 관리할 수 있습니다.
            </p>
            <CreateResumeDialog>
              <button className="flex items-center gap-2">
                <Plus size={16} className="mr-2" />새 이력서 만들기
              </button>
            </CreateResumeDialog>
          </div>
        )}

        {process.env.NODE_ENV === "development" && <DebugPanel />}
      </div>
    </div>
  )
}
