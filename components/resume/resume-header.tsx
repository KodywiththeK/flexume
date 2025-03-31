"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Save, X } from "lucide-react";
import { useResumeStore } from "@/store/resume-store";
import ResumeSelector from "./ResumeSelector";

interface ResumeHeaderProps {
  onPreview: () => void;
  onDownload: () => void;
}

export default function ResumeHeader({
  onPreview,
  onDownload,
}: ResumeHeaderProps) {
  const {
    currentResume,
    currentVersion,
    isEditing,
    startEditing,
    saveChanges,
    cancelEditing,
  } = useResumeStore();

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <ResumeSelector />
        {currentResume && currentVersion && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-1">
              {currentResume.title}
            </Badge>
            <span className="text-muted-foreground">/</span>
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
      </div>

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
          onClick={onPreview}
          className="flex items-center gap-2"
          disabled={!currentResume || !currentVersion}
        >
          <Eye size={16} />
          미리보기
        </Button>
        <Button
          className="flex items-center gap-2"
          onClick={onDownload}
          disabled={!currentResume || !currentVersion}
        >
          <Download size={16} />
          PDF 다운로드
        </Button>
      </div>
    </header>
  );
}
