"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { X, Check } from "lucide-react";
import type { BlockStyle, StyledResumeBlock } from "@/types/notion-resume";

interface StyleCustomizerProps {
  block: StyledResumeBlock;
  onStyleChange: (blockId: string, style: BlockStyle) => void;
  onClose: () => void;
}

export function StyleCustomizer({
  block,
  onStyleChange,
  onClose,
}: StyleCustomizerProps) {
  const [activeTab, setActiveTab] = useState("typography");
  const [originalStyle, setOriginalStyle] = useState<BlockStyle>({});
  const [widthValue, setWidthValue] = useState<string>("");
  const [widthUnit, setWidthUnit] = useState<string>("%");
  const [columnRatioInput, setColumnRatioInput] = useState<string>("");
  const [ratioError, setRatioError] = useState<string>("");

  // 컴포넌트가 마운트될 때 원래 스타일 저장
  useEffect(() => {
    setOriginalStyle({ ...block.style });

    // 너비 값과 단위 초기화
    if (block.style.width) {
      const width = block.style.width.toString();
      const match = width.match(/^([\d.]+)(.*)$/);
      if (match) {
        setWidthValue(match[1]);
        setWidthUnit(match[2] || "%");
      } else {
        setWidthValue("");
        setWidthUnit("%");
      }
    } else {
      setWidthValue("");
      setWidthUnit("%");
    }

    // 컬럼 리스트의 경우 비율 문자열 초기화
    if (block.type === "column_list" && block.children) {
      // 현재 설정된 비율을 가져와서 문자열로 변환
      const ratios = block.children.map((column) => {
        if (column.style.width) {
          const width = column.style.width.toString();
          if (width.endsWith("fr")) {
            return width.replace("fr", "");
          }
        }
        return "1"; // 기본값
      });
      setColumnRatioInput(ratios.join(":"));
    }
  }, [block.id, block.style, block.type, block.children]);

  // Helper function to get friendly block type name
  const getBlockTypeName = (type: string): string => {
    const nameMap: Record<string, string> = {
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
      column: "열",
      column_list: "열 목록",
      table: "테이블",
      // Add more mappings as needed
    };
    return nameMap[type] || type;
  };

  const handleStyleChange = (property: keyof BlockStyle, value: any) => {
    const updatedStyle = { ...block.style, [property]: value };
    onStyleChange(block.id, updatedStyle);
  };

  // 너비 변경 핸들러
  const handleWidthChange = () => {
    if (widthValue) {
      const width = `${widthValue}${widthUnit}`;
      handleStyleChange("width", width);
    } else {
      // 값이 비어있으면 너비 속성 제거
      const updatedStyle = { ...block.style };
      delete updatedStyle.width;
      onStyleChange(block.id, updatedStyle);
    }
  };

  // 컬럼 비율 변경 핸들러 - 비율 문자열 기반으로 수정
  const handleColumnRatioChange = () => {
    if (block.type === "column_list" && block.children) {
      // 비율 문자열 검증 (예: "1:2:1")
      const ratioPattern = /^(\d+)(?::(\d+))*$/;
      if (!ratioPattern.test(columnRatioInput)) {
        setRatioError("올바른 비율 형식이 아닙니다. 예: 1:2:1");
        return;
      }

      setRatioError("");

      // 비율 문자열을 배열로 변환
      const ratios = columnRatioInput
        .split(":")
        .map((r) => Number.parseInt(r, 10));

      // 비율 배열의 길이가 컬럼 수와 일치하는지 확인
      if (ratios.length !== block.children.length) {
        setRatioError(
          `컬럼 수(${block.children.length})와 비율 수(${ratios.length})가 일치하지 않습니다.`
        );
        return;
      }

      // 각 컬럼의 스타일 업데이트
      block.children.forEach((column, i) => {
        onStyleChange(column.id, {
          ...column.style,
          width: `${ratios[i]}fr`,
        });
      });

      // 부모 컬럼 리스트의 gridTemplateColumns 스타일 업데이트
      const gridTemplate = ratios.map((r) => `${r}fr`).join(" ");
      handleStyleChange("gridTemplateColumns", gridTemplate);
    }
  };

  // 비율 프리셋 적용 핸들러
  const applyRatioPreset = (preset: string) => {
    setColumnRatioInput(preset);
    setTimeout(() => {
      setColumnRatioInput(preset);
      handleColumnRatioChange();
    }, 0);
  };

  // 스타일 초기화 핸들러 수정
  const handleResetStyle = () => {
    onStyleChange(block.id, originalStyle);

    // 너비 값과 단위도 초기화
    if (originalStyle.width) {
      const width = originalStyle.width.toString();
      const match = width.match(/^([\d.]+)(.*)$/);
      if (match) {
        setWidthValue(match[1]);
        setWidthUnit(match[2] || "%");
      } else {
        setWidthValue("");
        setWidthUnit("%");
      }
    } else {
      setWidthValue("");
      setWidthUnit("%");
    }
  };

  return (
    <div
      className="bg-white border rounded-md p-4 mt-2 shadow-md"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="font-medium text-sm bg-gray-100 px-2 py-1 rounded">
          {getBlockTypeName(block.type)}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="typography">타이포그래피</TabsTrigger>
          <TabsTrigger value="spacing">여백 및 크기</TabsTrigger>
          <TabsTrigger value="colors">색상</TabsTrigger>
        </TabsList>

        <TabsContent value="typography" className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fontSize">글자 크기</Label>
            <Select
              value={block.style.fontSize || "base"}
              onValueChange={(value) => handleStyleChange("fontSize", value)}
            >
              <SelectTrigger id="fontSize">
                <SelectValue placeholder="글자 크기 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">아주 작게</SelectItem>
                <SelectItem value="sm">작게</SelectItem>
                <SelectItem value="base">기본</SelectItem>
                <SelectItem value="lg">크게</SelectItem>
                <SelectItem value="xl">더 크게</SelectItem>
                <SelectItem value="2xl">매우 크게</SelectItem>
                <SelectItem value="3xl">특대</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fontWeight">글자 굵기</Label>
            <Select
              value={block.style.fontWeight || "normal"}
              onValueChange={(value) => handleStyleChange("fontWeight", value)}
            >
              <SelectTrigger id="fontWeight">
                <SelectValue placeholder="글자 굵기 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">기본</SelectItem>
                <SelectItem value="medium">중간</SelectItem>
                <SelectItem value="semibold">약간 굵게</SelectItem>
                <SelectItem value="bold">굵게</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="textAlign">텍스트 정렬</Label>
            <Select
              value={block.style.textAlign || "left"}
              onValueChange={(value) => handleStyleChange("textAlign", value)}
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
        </TabsContent>

        <TabsContent value="spacing" className="space-y-4">
          {/* 너비 설정 UI 추가 */}
          <div className="grid gap-2">
            <Label htmlFor="width">블록 너비</Label>
            <div className="flex gap-2">
              <Input
                id="width"
                type="number"
                min="0"
                value={widthValue}
                className="flex-1"
                placeholder="너비 값"
                onChange={(e) => setWidthValue(e.target.value)}
                onBlur={handleWidthChange}
              />
              <Select
                value={widthUnit}
                onValueChange={(value) => {
                  setWidthUnit(value);
                  setTimeout(handleWidthChange, 0);
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="단위" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="%">%</SelectItem>
                  <SelectItem value="px">px</SelectItem>
                  <SelectItem value="rem">rem</SelectItem>
                  <SelectItem value="em">em</SelectItem>
                  <SelectItem value="vw">vw</SelectItem>
                  <SelectItem value="fr">fr</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-gray-500">
              값을 비워두면 기본 너비가 적용됩니다.
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="margin">바깥 여백</Label>
            <Select
              value={block.style.margin || "md"}
              onValueChange={(value) => handleStyleChange("margin", value)}
            >
              <SelectTrigger id="margin">
                <SelectValue placeholder="여백 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="sm">작게</SelectItem>
                <SelectItem value="md">중간</SelectItem>
                <SelectItem value="lg">크게</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="padding">안쪽 여백</Label>
            <Select
              value={block.style.padding || "md"}
              onValueChange={(value) => handleStyleChange("padding", value)}
            >
              <SelectTrigger id="padding">
                <SelectValue placeholder="여백 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="sm">작게</SelectItem>
                <SelectItem value="md">중간</SelectItem>
                <SelectItem value="lg">크게</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="color">글자 색상</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={block.style.color || "#000000"}
                className="w-12 h-10 p-1"
                onChange={(e) => handleStyleChange("color", e.target.value)}
              />
              <Input
                type="text"
                value={block.style.color || "#000000"}
                className="flex-1"
                onChange={(e) => handleStyleChange("color", e.target.value)}
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
                className="w-12 h-10 p-1"
                onChange={(e) =>
                  handleStyleChange("backgroundColor", e.target.value)
                }
              />
              <Input
                type="text"
                value={block.style.backgroundColor || "#ffffff"}
                className="flex-1"
                onChange={(e) =>
                  handleStyleChange("backgroundColor", e.target.value)
                }
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 컬럼 리스트의 경우 컬럼 비율 설정 UI 추가 - 슬라이더 대신 비율 입력 방식으로 변경 */}
      {block.type === "column_list" &&
        block.children &&
        block.children.length > 0 && (
          <div className="pt-4 mt-2 border-t border-gray-200">
            <h3 className="font-medium mb-3">열 비율 설정</h3>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="columnRatio">비율 (예: 1:2:1)</Label>
                <div className="flex gap-2">
                  <Input
                    id="columnRatio"
                    value={columnRatioInput}
                    className="flex-1"
                    placeholder="예: 1:2:1"
                    onChange={(e) => setColumnRatioInput(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={handleColumnRatioChange}
                  >
                    <Check size={16} />
                  </Button>
                </div>
                {ratioError && (
                  <div className="text-xs text-red-500">{ratioError}</div>
                )}
                <div className="text-xs text-gray-500">
                  각 열의 상대적 비율을 콜론(:)으로 구분하여 입력하세요.
                </div>
              </div>

              {/* 비율 프리셋 버튼 */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => applyRatioPreset("1:1")}
                >
                  1:1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => applyRatioPreset("1:2")}
                >
                  1:2
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => applyRatioPreset("2:1")}
                >
                  2:1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => applyRatioPreset("1:1:1")}
                >
                  1:1:1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => applyRatioPreset("1:2:1")}
                >
                  1:2:1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => applyRatioPreset("2:3:2")}
                >
                  2:3:2
                </Button>
              </div>
            </div>
          </div>
        )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleResetStyle}
        className="w-full mt-4"
      >
        스타일 초기화
      </Button>
    </div>
  );
}
