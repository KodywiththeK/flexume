"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, ArrowLeft, Printer } from "lucide-react";
import type { PDFSettings } from "@/types/notion-resume";

interface PDFPreviewSettingsProps {
  onBack: () => void;
  onDownload: (settings: PDFSettings) => void;
  pageCount: number;
}

export function PDFPreviewSettings({
  onBack,
  onDownload,
  pageCount,
}: PDFPreviewSettingsProps) {
  const [settings, setSettings] = useState<PDFSettings>({
    scale: 1,
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    showPageNumbers: true,
    pageSize: "a4",
    orientation: "portrait",
  });

  const handleMarginChange = (
    side: keyof PDFSettings["margins"],
    value: number
  ) => {
    setSettings({
      ...settings,
      margins: {
        ...settings.margins,
        [side]: value,
      },
    });
  };

  const handleScaleChange = (value: number[]) => {
    setSettings({
      ...settings,
      scale: value[0],
    });
  };

  const handlePageSizeChange = (value: "a4" | "letter" | "legal") => {
    setSettings({
      ...settings,
      pageSize: value,
    });
  };

  const handleOrientationChange = (value: "portrait" | "landscape") => {
    setSettings({
      ...settings,
      orientation: value,
    });
  };

  const handleShowPageNumbersChange = (checked: boolean) => {
    setSettings({
      ...settings,
      showPageNumbers: checked,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          돌아가기
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-bold">PDF 미리보기 및 설정</h2>
          <p className="text-sm text-gray-500">총 {pageCount}페이지</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            인쇄
          </Button>
          <Button
            onClick={() => onDownload(settings)}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            PDF 다운로드
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">페이지 설정</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pageSize">용지 크기</Label>
              <Select
                value={settings.pageSize}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger id="pageSize">
                  <SelectValue placeholder="용지 크기 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orientation">방향</Label>
              <Select
                value={settings.orientation}
                onValueChange={handleOrientationChange}
              >
                <SelectTrigger id="orientation">
                  <SelectValue placeholder="방향 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">세로</SelectItem>
                  <SelectItem value="landscape">가로</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scale">
                크기 조정 ({Math.round(settings.scale * 100)}%)
              </Label>
              <Slider
                id="scale"
                min={0.5}
                max={1.5}
                step={0.05}
                value={[settings.scale]}
                onValueChange={handleScaleChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="showPageNumbers"
                checked={settings.showPageNumbers}
                onCheckedChange={handleShowPageNumbersChange}
              />
              <Label htmlFor="showPageNumbers">페이지 번호 표시</Label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">여백 설정 (mm)</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marginTop">
                상단 여백 ({settings.margins.top}mm)
              </Label>
              <Input
                id="marginTop"
                type="number"
                min={0}
                max={50}
                value={settings.margins.top}
                onChange={(e) =>
                  handleMarginChange("top", Number.parseInt(e.target.value))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marginLeft">
                  좌측 여백 ({settings.margins.left}mm)
                </Label>
                <Input
                  id="marginLeft"
                  type="number"
                  min={0}
                  max={50}
                  value={settings.margins.left}
                  onChange={(e) =>
                    handleMarginChange("left", Number.parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marginRight">
                  우측 여백 ({settings.margins.right}mm)
                </Label>
                <Input
                  id="marginRight"
                  type="number"
                  min={0}
                  max={50}
                  value={settings.margins.right}
                  onChange={(e) =>
                    handleMarginChange("right", Number.parseInt(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marginBottom">
                하단 여백 ({settings.margins.bottom}mm)
              </Label>
              <Input
                id="marginBottom"
                type="number"
                min={0}
                max={50}
                value={settings.margins.bottom}
                onChange={(e) =>
                  handleMarginChange("bottom", Number.parseInt(e.target.value))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
