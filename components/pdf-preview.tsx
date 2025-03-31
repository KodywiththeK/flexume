"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ResumeTemplate from "./resume-template";
import { Badge } from "@/components/ui/badge";

interface PDFPreviewProps {
  onBack: () => void;
}

export default function PDFPreview({ onBack }: PDFPreviewProps) {
  const { getCurrentResume, getCurrentVersion, isEditing, draftVersion } =
    useResumeStore();
  const currentResume = getCurrentResume();
  const currentVersion = getCurrentVersion();
  const previewVersion = isEditing ? draftVersion : currentVersion;
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!currentResume || !previewVersion) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <p className="text-lg text-muted-foreground">
          이력서를 먼저 선택해주세요.
        </p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft size={16} className="mr-2" />
          돌아가기
        </Button>
      </div>
    );
  }

  const generatePDF = async () => {
    if (!resumeRef.current) return;

    setIsGenerating(true);

    try {
      // A4 size in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const resumeElement = resumeRef.current;
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // Calculate the proper scaling to fit A4
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // If the resume is longer than one page, add more pages
      if (imgHeight > 297) {
        let heightLeft = imgHeight - 297;
        let position = -297;

        while (heightLeft > 0) {
          position -= 297;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= 297;
        }
      }

      // Save the PDF
      const fileName = `${currentResume.title}_${previewVersion.name.replace(
        /\s+/g,
        "_"
      )}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF 생성 중 오류가 발생했습니다:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="container mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            편집으로 돌아가기
          </Button>

          {/* 미리보기 상태 표시 */}
          <div className="flex items-center gap-2 ml-4">
            <Badge variant="outline" className="px-2 py-1">
              {currentResume.title}
            </Badge>
            <span className="text-muted-foreground">/</span>
            <Badge variant="outline" className="px-2 py-1">
              {previewVersion.name}
            </Badge>
            {isEditing && (
              <Badge variant="secondary" className="px-2 py-1 ml-2">
                미리보기 (저장되지 않은 변경사항)
              </Badge>
            )}
          </div>
        </div>

        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          {isGenerating ? "PDF 생성 중..." : "PDF 다운로드"}
        </Button>
      </div>

      <div className="p-6 rounded-lg flex justify-center min-h-[800px]">
        <div
          className="bg-white shadow-lg w-[210mm] min-h-[297mm]"
          ref={resumeRef}
        >
          <ResumeTemplate />
        </div>
      </div>
    </div>
  );
}
