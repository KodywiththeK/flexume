"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X, Check } from "lucide-react";
import type {
  BlockStyle,
  StyledResumeBlock,
  NotionBlockType,
} from "@/types/notion-resume";
import { BLOCK_STYLE_CONFIG } from "@/types/notion-resume";

interface BlockStyleEditorProps {
  block: StyledResumeBlock;
  onStyleChange: (blockId: string, styleDelta: BlockStyle) => void;
  onClose?: () => void;
  mode?: "modal" | "inline";
  blockType?: NotionBlockType;
}

export function BlockStyleEditor({
  block,
  onStyleChange,
  onClose,
  mode = "inline",
  blockType,
}: BlockStyleEditorProps) {
  const [widthValue, setWidthValue] = useState("");
  const [widthUnit, setWidthUnit] = useState<"px" | "%" | "vw" | "fr">("px");
  const [columnRatioInput, setColumnRatioInput] = useState("");
  const [ratioError, setRatioError] = useState("");

  const targetType = blockType || block.type;
  const styleConfig = BLOCK_STYLE_CONFIG[targetType];

  useEffect(() => {
    const width = block.style.width?.toString() || "";
    const match = width.match(/^([\d.]+)(px|%|vw|fr)?$/);

    if (match) {
      setWidthValue(match[1] || "");
      setWidthUnit((match[2] as any) || "px");
    } else {
      setWidthValue("");
      setWidthUnit("px");
    }

    if (targetType === "column_list" && block.children?.length) {
      const ratios = block.children.map((col) => {
        const w = col.style.width?.toString() || "1fr";
        return w.endsWith("fr") ? w.replace("fr", "") : "1";
      });
      setColumnRatioInput(ratios.join(":"));
    } else {
      setColumnRatioInput("");
    }

    setRatioError("");
  }, [block.id, targetType]);

  const getBlockTypeName = (type: NotionBlockType): string => {
    const nameMap: Record<NotionBlockType, string> = {
      paragraph: "문단",
      heading_1: "제목 1",
      heading_2: "제목 2",
      heading_3: "제목 3",
      bulleted_list_item: "글머리 기호 목록",
      numbered_list_item: "번호 매기기 목록",
      quote: "인용구",
      divider: "구분선",
      image: "이미지",
      callout: "콜아웃",
      bookmark: "북마크",
      code: "코드",
      column: "열",
      column_list: "열 목록",
      embed: "임베드",
      equation: "수식",
      file: "파일",
      link_preview: "링크 미리보기",
      link_to_page: "페이지 링크",
      pdf: "PDF",
      synced_block: "동기화된 블록",
      table: "테이블",
      table_of_contents: "목차",
      table_row: "테이블 행",
      template: "템플릿",
      to_do: "할 일",
      toggle: "토글",
      unsupported: "지원되지 않는 블록",
    };
    return nameMap[type] || type;
  };

  const handleStyleChange = (property: keyof BlockStyle, value: any) => {
    onStyleChange(block.id, { [property]: value });
  };

  const handleWidthCommit = () => {
    if (!widthValue) {
      handleStyleChange("width", undefined);
      return;
    }
    handleStyleChange("width", `${widthValue}${widthUnit}`);
  };

  const handleColumnRatioCommit = () => {
    if (targetType !== "column_list" || !block.children?.length) return;

    const ratioPattern = /^(\d+(?:\.\d+)?)(?::(\d+(?:\.\d+)?))*$/;
    if (!ratioPattern.test(columnRatioInput)) {
      setRatioError("올바른 비율 형식이 아닙니다. 예: 1:2:1");
      return;
    }

    const ratios = columnRatioInput.split(":").map((r) => Number.parseFloat(r));
    if (ratios.length !== block.children.length) {
      setRatioError(
        `컬럼 수(${block.children.length})와 비율 수(${ratios.length})가 일치하지 않습니다.`
      );
      return;
    }

    setRatioError("");

    block.children.forEach((column, i) => {
      onStyleChange(column.id, { width: `${ratios[i]}fr` });
    });

    const gridTemplate = ratios.map((r) => `${r}fr`).join(" ");
    handleStyleChange("gridTemplateColumns", gridTemplate);
  };

  const applyRatioPreset = (preset: string) => {
    setColumnRatioInput(preset);
    requestAnimationFrame(() => handleColumnRatioCommit());
  };

  const sizingUnits = useMemo(() => {
    if (targetType === "column" || targetType === "column_list")
      return ["px", "%", "vw", "fr"] as const;
    return ["px", "%", "vw"] as const;
  }, [targetType]);

  const accordionSections = (
    <Accordion type="multiple" className="space-y-2">
      {styleConfig?.typography && (
        <AccordionItem
          value="typography"
          className="rounded-md border bg-white px-2"
        >
          <AccordionTrigger className="px-2 text-sm font-semibold">
            글자 스타일
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-4 pt-2 space-y-4">
            {/* fontSize */}
            <div className="grid gap-2">
              <Label htmlFor="fontSize">글자 크기 (px)</Label>
              <Input
                id="fontSize"
                type="number"
                placeholder="14"
                value={(block.style.fontSize || "").replace(/[^0-9.-]/g, "")}
                onChange={(e) => {
                  const v = e.target.value;
                  handleStyleChange("fontSize", v ? `${v}px` : undefined);
                }}
              />
            </div>

            {/* fontWeight */}
            <div className="grid gap-2">
              <Label htmlFor="fontWeight">글자 굵기</Label>
              <Select
                value={block.style.fontWeight || "400"}
                onValueChange={(v) => handleStyleChange("fontWeight", v)}
              >
                <SelectTrigger id="fontWeight">
                  <SelectValue placeholder="글자 굵기 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400">기본 (400)</SelectItem>
                  <SelectItem value="500">중간 (500)</SelectItem>
                  <SelectItem value="600">약간 굵게 (600)</SelectItem>
                  <SelectItem value="700">굵게 (700)</SelectItem>
                  <SelectItem value="800">더 굵게 (800)</SelectItem>
                  <SelectItem value="900">매우 굵게 (900)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* lineHeight */}
            <div className="grid gap-2">
              <Label htmlFor="lineHeight">줄 높이 (px)</Label>
              <Input
                id="lineHeight"
                type="number"
                placeholder="20"
                value={(block.style.lineHeight || "").replace(/[^0-9.-]/g, "")}
                onChange={(e) => {
                  const v = e.target.value;
                  handleStyleChange("lineHeight", v ? `${v}px` : undefined);
                }}
              />
            </div>

            {/* letterSpacing */}
            <div className="grid gap-2">
              <Label htmlFor="letterSpacing">글자 간격 (px)</Label>
              <Input
                id="letterSpacing"
                type="number"
                placeholder="0"
                value={(block.style.letterSpacing || "").replace(
                  /[^0-9.-]/g,
                  ""
                )}
                onChange={(e) => {
                  const v = e.target.value;
                  handleStyleChange("letterSpacing", v ? `${v}px` : undefined);
                }}
              />
            </div>

            {/* textAlign */}
            <div className="grid gap-2">
              <Label htmlFor="textAlign">텍스트 정렬</Label>
              <Select
                value={block.style.textAlign || "left"}
                onValueChange={(v) => handleStyleChange("textAlign", v)}
              >
                <SelectTrigger id="textAlign">
                  <SelectValue placeholder="정렬 방식 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">왼쪽</SelectItem>
                  <SelectItem value="center">가운데</SelectItem>
                  <SelectItem value="right">오른쪽</SelectItem>
                  <SelectItem value="justify">양쪽</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
      {styleConfig?.sizing && (
        <AccordionItem
          value="sizing"
          className="rounded-md border bg-white px-2"
        >
          <AccordionTrigger className="px-2 text-sm font-semibold">
            레이아웃 / 크기
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-4 pt-2 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="width">너비</Label>
              <div className="flex gap-2">
                <Input
                  id="width"
                  type="number"
                  min="0"
                  placeholder="auto"
                  value={widthValue}
                  onChange={(e) => setWidthValue(e.target.value)}
                  onBlur={handleWidthCommit}
                  className="flex-1"
                />
                <Select
                  value={widthUnit}
                  onValueChange={(v: any) => setWidthUnit(v)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizingUnits.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {styleConfig?.columnRatio && block.children?.length && (
        <AccordionItem
          value="columns"
          className="rounded-md border bg-white px-2"
        >
          <AccordionTrigger className="px-2 text-sm font-semibold">
            열 비율
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-4 pt-2 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="columnRatio">비율 (예: 1:2:1)</Label>
              <div className="flex gap-2">
                <Input
                  id="columnRatio"
                  value={columnRatioInput}
                  placeholder="예: 1:2:1"
                  onChange={(e) => setColumnRatioInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 bg-transparent"
                  onClick={handleColumnRatioCommit}
                >
                  <Check size={16} />
                </Button>
              </div>
              {ratioError && (
                <div className="text-xs text-red-500">{ratioError}</div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["1:1", "1:2", "1:3", "1:4", "1:5"].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent"
                  onClick={() => applyRatioPreset(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {styleConfig?.colors && (
        <AccordionItem
          value="colors"
          className="rounded-md border bg-white px-2"
        >
          <AccordionTrigger className="px-2 text-sm font-semibold">
            색상
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-4 pt-2 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="color">글자 색상</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={block.style.color || "#000000"}
                  className="w-16 h-10 p-1 cursor-pointer"
                  onChange={(e) => handleStyleChange("color", e.target.value)}
                />
                <Input
                  type="text"
                  value={block.style.color || "#000000"}
                  className="flex-1 font-mono text-sm"
                  onChange={(e) => handleStyleChange("color", e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="backgroundColor">배경 색상</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={block.style.backgroundColor || "#ffffff"}
                  className="w-16 h-10 p-1 cursor-pointer"
                  onChange={(e) =>
                    handleStyleChange("backgroundColor", e.target.value)
                  }
                />
                <Input
                  type="text"
                  value={block.style.backgroundColor || "#ffffff"}
                  className="flex-1 font-mono text-sm"
                  onChange={(e) =>
                    handleStyleChange("backgroundColor", e.target.value)
                  }
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );

  const body = <div className="space-y-2 p-4">{accordionSections}</div>;

  if (mode === "modal") {
    return (
      <div
        className="bg-white border rounded-md p-4 shadow-md space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="font-medium text-sm bg-gray-100 px-2 py-1 rounded">
            {getBlockTypeName(targetType)}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {body}

        {onClose && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full bg-transparent"
          >
            완료
          </Button>
        )}
      </div>
    );
  }

  return body;
}
