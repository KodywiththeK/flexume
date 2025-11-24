"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, PanelLeft, PanelRight, Settings2 } from "lucide-react";

export function EditorTopBar({
  title,
  showStructurePanel,
  structurePanelPosition,
  onToggleStructurePanel,
  onToggleStructurePanelPosition,
  onRefresh,
  onPreview,
  onOpenPdfSettings,
  isGeneratingPDF,
}: {
  title: string;
  showStructurePanel: boolean;
  structurePanelPosition: "left" | "right";
  onToggleStructurePanel: () => void;
  onToggleStructurePanelPosition: () => void;
  onRefresh?: () => void;
  onPreview: () => void;
  onOpenPdfSettings: () => void;
  isGeneratingPDF: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleStructurePanel}
          title={showStructurePanel ? "구조 패널 숨기기" : "구조 패널 표시"}
        >
          {structurePanelPosition === "left" ? (
            <PanelLeft size={16} />
          ) : (
            <PanelRight size={16} />
          )}
        </Button>

        {showStructurePanel && (
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleStructurePanelPosition}
            title="패널 위치 변경"
          >
            {structurePanelPosition === "left" ? (
              <PanelRight size={16} />
            ) : (
              <PanelLeft size={16} />
            )}
          </Button>
        )}

        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            className="flex items-center gap-1 bg-transparent"
          >
            <RefreshCw size={16} />
            Notion에서 다시 불러오기
          </Button>
        )}

        <Button
          onClick={onPreview}
          className="flex items-center gap-1"
          disabled={isGeneratingPDF}
        >
          <Eye size={16} />
          PDF 미리보기
        </Button>

        <Button
          variant="outline"
          className="bg-transparent"
          onClick={onOpenPdfSettings}
        >
          <Settings2 size={16} className="mr-2" />
          용지 설정
        </Button>
      </div>
    </div>
  );
}
