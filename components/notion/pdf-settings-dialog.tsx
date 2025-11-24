"use client";

import React from "react";
import type { PDFSettings } from "@/types/notion-resume";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { safeNumber } from "@/lib/helpers";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  settings: PDFSettings;
  onChange: (next: PDFSettings) => void;
};

export function PDFSettingsDialog({
  open,
  onOpenChange,
  settings,
  onChange,
}: Props) {
  const handleMarginChange = (
    side: keyof PDFSettings["margins"],
    value: number
  ) => {
    onChange({
      ...settings,
      margins: {
        ...settings.margins,
        [side]: safeNumber(value, 0),
      },
    });
  };

  const handleScaleChange = (value: number[]) => {
    onChange({
      ...settings,
      scale: safeNumber(value?.[0], 1),
    });
  };

  const handlePageSizeChange = (value: "a4" | "letter" | "legal") => {
    onChange({ ...settings, pageSize: value });
  };

  const handleOrientationChange = (value: "portrait" | "landscape") => {
    onChange({ ...settings, orientation: value });
  };

  const footerEnabled = settings.footer?.enabled ?? false;
  const footerText = settings.footer?.text ?? "";
  const footerAlign = settings.footer?.align ?? "center";
  const showPageNumbers = settings.showPageNumbers ?? true;

  const updateFooter = (patch: Partial<NonNullable<PDFSettings["footer"]>>) => {
    onChange({
      ...settings,
      footer: {
        enabled: footerEnabled,
        text: footerText,
        align: footerAlign,
        ...patch,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>용지 설정</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
          <div>
            <h3 className="text-base font-semibold mb-3">페이지 설정</h3>
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

              <div className="flex items-center gap-2">
                <Switch
                  id="showPageNumbers"
                  checked={showPageNumbers}
                  onCheckedChange={(checked) =>
                    onChange({ ...settings, showPageNumbers: checked })
                  }
                />
                <Label htmlFor="showPageNumbers">페이지 번호 표시</Label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">여백 설정 (mm)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="marginTop">
                  상단 여백 ({settings.margins.top}mm)
                </Label>
                <Input
                  id="marginTop"
                  type="number"
                  min={0}
                  max={60}
                  value={settings.margins.top}
                  onChange={(e) =>
                    handleMarginChange("top", Number(e.target.value))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="marginLeft">
                    좌측 여백 ({settings.margins.left}mm)
                  </Label>
                  <Input
                    id="marginLeft"
                    type="number"
                    min={0}
                    max={60}
                    value={settings.margins.left}
                    onChange={(e) =>
                      handleMarginChange("left", Number(e.target.value))
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
                    max={60}
                    value={settings.margins.right}
                    onChange={(e) =>
                      handleMarginChange("right", Number(e.target.value))
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
                  max={60}
                  value={settings.margins.bottom}
                  onChange={(e) =>
                    handleMarginChange("bottom", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 px-1">
          <h3 className="text-base font-semibold mb-3">페이지 하단(꼬리말)</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Switch
                id="footerEnabled"
                checked={footerEnabled}
                onCheckedChange={(checked) =>
                  updateFooter({ enabled: checked })
                }
              />
              <Label htmlFor="footerEnabled">하단 꼬리말 사용</Label>
            </div>

            {footerEnabled && (
              <div className="space-y-2">
                <Label htmlFor="footerText">꼬리말 텍스트</Label>
                <Input
                  id="footerText"
                  placeholder="예: Copyright © 2025"
                  value={footerText}
                  onChange={(e) => updateFooter({ text: e.target.value })}
                />
              </div>
            )}

            {footerEnabled && (
              <div className="space-y-2">
                <Label>정렬</Label>
                <Select
                  value={footerAlign}
                  onValueChange={(v: any) => updateFooter({ align: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="정렬 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">왼쪽</SelectItem>
                    <SelectItem value="center">가운데</SelectItem>
                    <SelectItem value="right">오른쪽</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 px-1">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
