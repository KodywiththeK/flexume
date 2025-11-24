"use client";

import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";

interface PDFPreviewHeaderProps {
  onBack: () => void;
  onDownload: () => void; // ✅ settings 안 넘김
  pageCount: number;
}

export function PDFPreviewHeader({
  onBack,
  onDownload,
  pageCount,
}: PDFPreviewHeaderProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          돌아가기
        </Button>

        <div className="text-center">
          <h2 className="text-xl font-bold">PDF 미리보기</h2>
          <p className="text-sm text-gray-500">총 {pageCount}페이지</p>
        </div>

        <Button onClick={onDownload} className="flex items-center gap-2">
          <Download size={16} />
          PDF 다운로드
        </Button>
      </div>
    </div>
  );
}
