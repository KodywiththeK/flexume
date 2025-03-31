// components/resume/ResumeEditorHeader.tsx
"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Save, X, Eye, Download } from "lucide-react";
import CreateResumeDialog from "./CreateResumeDialog";
import ResumeSelector from "./ResumeSelector";
import { useSearchParams } from "next/navigation";

export default function ResumeEditorHeader({
  onShowPreview,
  onDownloadPDF,
}: {
  onShowPreview: () => void;
  onDownloadPDF: () => void;
}) {
  // store에서 필요한 데이터 직접 사용
  const {
    resumes,
    getCurrentResume,
    getCurrentVersion,
    isEditing,
    startEditing,
    cancelEditing,
    saveChanges,
  } = useResumeStore();
  const currentResume = getCurrentResume();
  const currentVersion = getCurrentVersion();
  const isTabEdit = useSearchParams().get("tab") === "edit";
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">이력서 편집기</h1>

        {resumes.length > 0 && <ResumeSelector />}

        {currentResume && currentVersion && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-1">
              {currentVersion.name}
            </Badge>
            {isEditing && (
              <Badge variant="secondary" className="px-2 py-1">
                편집 중
              </Badge>
            )}
          </div>
        )}

        <CreateResumeDialog>
          <Button variant="outline" size="sm">
            <Plus size={16} className="mr-1" />새 이력서 추가
          </Button>
        </CreateResumeDialog>
      </div>

      {isTabEdit && (
        <div className="flex items-center gap-2">
          {currentResume && currentVersion && (
            <>
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={cancelEditing}
                    className="flex items-center gap-2"
                  >
                    <X size={16} />
                    취소
                  </Button>
                  <Button
                    onClick={saveChanges}
                    className="flex items-center gap-2"
                  >
                    <Save size={16} />
                    저장
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={startEditing}
                  className="flex items-center gap-2"
                >
                  편집
                </Button>
              )}
            </>
          )}

          <Button
            variant="outline"
            onClick={onShowPreview}
            className="flex items-center gap-2"
            disabled={!currentResume || !currentVersion}
          >
            <Eye size={16} />
            미리보기
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={onDownloadPDF}
            disabled={!currentResume || !currentVersion}
          >
            <Download size={16} />
            PDF 다운로드
          </Button>
        </div>
      )}
    </header>
  );
}
