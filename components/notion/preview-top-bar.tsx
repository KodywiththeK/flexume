"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Props = {
  onBack: () => void;
  onDownload: () => void;
  isGenerating: boolean;
};

export function PreviewTopBar({ onBack, onDownload, isGenerating }: Props) {
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          돌아가기
        </Button>
        <div className="text-sm text-gray-500">인쇄 미리보기</div>
        <Button onClick={onDownload} disabled={isGenerating}>
          <Download size={16} className="mr-2" />
          PDF 저장
        </Button>
      </div>
    </div>
  );
}
