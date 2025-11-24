"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw } from "lucide-react"
import type { BlockStyle, NotionBlockType } from "@/types/notion-resume"

interface BlockTypeStyleEditorProps {
  blockTypes: NotionBlockType[]
  blockTypeStyles: Record<NotionBlockType, BlockStyle>
  onUpdateBlockTypeStyle: (blockType: NotionBlockType, style: BlockStyle) => void
  onResetBlockTypeStyle: (blockType: NotionBlockType) => void
}

export function BlockTypeStyleEditor({
  blockTypes,
  blockTypeStyles,
  onUpdateBlockTypeStyle,
  onResetBlockTypeStyle,
}: BlockTypeStyleEditorProps) {
  const [activeTab, setActiveTab] = useState("typography")

  const usedBlockTypes = blockTypes && blockTypes.length > 0 ? blockTypes : []

  console.log("[v0] usedBlockTypes:", usedBlockTypes)

  // 블록 타입 그룹화
  const blockTypeGroups: Record<string, NotionBlockType[]> = {
    headings: ["heading_1", "heading_2", "heading_3"].filter((type) =>
      usedBlockTypes.includes(type as NotionBlockType),
    ) as NotionBlockType[],
    text: ["paragraph", "quote", "callout"].filter((type) =>
      usedBlockTypes.includes(type as NotionBlockType),
    ) as NotionBlockType[],
    lists: ["bulleted_list_item", "numbered_list_item", "to_do"].filter((type) =>
      usedBlockTypes.includes(type as NotionBlockType),
    ) as NotionBlockType[],
    media: ["image", "file", "pdf", "embed", "bookmark"].filter((type) =>
      usedBlockTypes.includes(type as NotionBlockType),
    ) as NotionBlockType[],
    tables: ["table", "table_row"].filter((type) =>
      usedBlockTypes.includes(type as NotionBlockType),
    ) as NotionBlockType[],
    columns: ["column_list", "column"].filter((type) =>
      usedBlockTypes.includes(type as NotionBlockType),
    ) as NotionBlockType[],
    other: [
      "divider",
      "code",
      "equation",
      "link_preview",
      "link_to_page",
      "synced_block",
      "table_of_contents",
      "toggle",
      "template",
      "unsupported",
    ].filter((type) => usedBlockTypes.includes(type as NotionBlockType)) as NotionBlockType[],
  }

  // 블록 타입 이름 변환
  const getBlockTypeName = (blockType: NotionBlockType): string => {
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
    }
    return nameMap[blockType] || blockType
  }

  // 스타일 변경 핸들러
  const handleStyleChange = (blockType: NotionBlockType, property: keyof BlockStyle, value: any) => {
    const currentStyle = blockTypeStyles[blockType] || {}
    const updatedStyle = { ...currentStyle, [property]: value }
    onUpdateBlockTypeStyle(blockType, updatedStyle)
  }

  const renderSizeInput = (blockType: NotionBlockType, label: string, property: keyof BlockStyle) => {
    return (
      <div className="grid gap-2">
        <Label htmlFor={`${property}-${blockType}`}>{label}</Label>
        <div className="flex gap-2">
          <Input
            id={`${property}-${blockType}`}
            type="number"
            placeholder="0"
            value={blockTypeStyles[blockType]?.[property]?.toString().replace(/[^0-9.-]/g, "") || ""}
            onChange={(e) => {
              const value = e.target.value ? `${e.target.value}px` : ""
              handleStyleChange(blockType, property, value)
            }}
            className="flex-1"
          />
          <Select defaultValue="px" disabled>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="px">px</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500">픽셀 단위로만 입력 가능합니다</p>
      </div>
    )
  }

  // 블록 타입 그룹 렌더링
  const renderBlockTypeGroup = (title: string, types: NotionBlockType[]) => {
    if (types.length === 0) return null

    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">{title}</h3>
        <Accordion type="multiple" className="space-y-2">
          {types.map((blockType) => (
            <AccordionItem key={blockType} value={blockType} className="border rounded-md">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">{getBlockTypeName(blockType)}</AccordionTrigger>
              <AccordionContent className="px-4 py-3 border-t">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="typography">타이포그래피</TabsTrigger>
                    <TabsTrigger value="colors">색상</TabsTrigger>
                  </TabsList>

                  <TabsContent value="typography" className="space-y-4">
                    {renderSizeInput(blockType, "글자 크기 (px)", "fontSize")}

                    <div className="grid gap-2">
                      <Label htmlFor={`fontWeight-${blockType}`}>글자 굵기</Label>
                      <Select
                        value={blockTypeStyles[blockType]?.fontWeight || "normal"}
                        onValueChange={(value) => handleStyleChange(blockType, "fontWeight", value)}
                      >
                        <SelectTrigger id={`fontWeight-${blockType}`}>
                          <SelectValue placeholder="글자 굵기 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">기본 (400)</SelectItem>
                          <SelectItem value="500">중간 (500)</SelectItem>
                          <SelectItem value="600">약간 굵게 (600)</SelectItem>
                          <SelectItem value="bold">굵게 (700)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`lineHeight-${blockType}`}>줄 높이 (px)</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`lineHeight-${blockType}`}
                          type="number"
                          placeholder="0"
                          value={blockTypeStyles[blockType]?.lineHeight?.toString().replace(/[^0-9.-]/g, "") || ""}
                          onChange={(e) => {
                            const value = e.target.value ? `${e.target.value}px` : ""
                            handleStyleChange(blockType, "lineHeight", value)
                          }}
                          className="flex-1"
                        />
                        <Select defaultValue="px" disabled>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="px">px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-gray-500">픽셀 단위로만 입력 가능합니다</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`letterSpacing-${blockType}`}>글자 간격 (px)</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`letterSpacing-${blockType}`}
                          type="number"
                          placeholder="0"
                          value={blockTypeStyles[blockType]?.letterSpacing?.toString().replace(/[^0-9.-]/g, "") || ""}
                          onChange={(e) => {
                            const value = e.target.value ? `${e.target.value}px` : ""
                            handleStyleChange(blockType, "letterSpacing", value)
                          }}
                          className="flex-1"
                        />
                        <Select defaultValue="px" disabled>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="px">px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-gray-500">픽셀 단위로만 입력 가능합니다</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`textAlign-${blockType}`}>텍스트 정렬</Label>
                      <Select
                        value={blockTypeStyles[blockType]?.textAlign || "left"}
                        onValueChange={(value) => handleStyleChange(blockType, "textAlign", value)}
                      >
                        <SelectTrigger id={`textAlign-${blockType}`}>
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

                  <TabsContent value="colors" className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`color-${blockType}`}>글자 색상</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`color-${blockType}`}
                          type="color"
                          value={blockTypeStyles[blockType]?.color || "#000000"}
                          className="w-12 h-10 p-1 cursor-pointer"
                          onChange={(e) => handleStyleChange(blockType, "color", e.target.value)}
                        />
                        <Input
                          type="text"
                          value={blockTypeStyles[blockType]?.color || "#000000"}
                          className="flex-1 font-mono text-sm"
                          onChange={(e) => handleStyleChange(blockType, "color", e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`backgroundColor-${blockType}`}>배경 색상</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`backgroundColor-${blockType}`}
                          type="color"
                          value={blockTypeStyles[blockType]?.backgroundColor || "#ffffff"}
                          className="w-12 h-10 p-1 cursor-pointer"
                          onChange={(e) => handleStyleChange(blockType, "backgroundColor", e.target.value)}
                        />
                        <Input
                          type="text"
                          value={blockTypeStyles[blockType]?.backgroundColor || "#ffffff"}
                          className="flex-1 font-mono text-sm"
                          onChange={(e) => handleStyleChange(blockType, "backgroundColor", e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResetBlockTypeStyle(blockType)}
                    className="flex items-center gap-1"
                  >
                    <RotateCcw size={14} />
                    스타일 초기화
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  }

  // 사용되는 블록이 없으면 메시지 표시
  if (usedBlockTypes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500">현재 이력서에 사용되는 블록이 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-4">블록 타입별 스타일 설정</h2>
        <p className="text-sm text-gray-500 mb-6">
          현재 이력서에서 사용 중인 블록 타입만 표시됩니다. 각 블록 타입별로 공통 스타일을 설정하면 해당 타입의 모든
          블록에 일괄 적용됩니다.
        </p>

        {renderBlockTypeGroup("제목", blockTypeGroups.headings)}
        {renderBlockTypeGroup("텍스트", blockTypeGroups.text)}
        {renderBlockTypeGroup("목록", blockTypeGroups.lists)}
        {renderBlockTypeGroup("미디어", blockTypeGroups.media)}
        {renderBlockTypeGroup("테이블", blockTypeGroups.tables)}
        {renderBlockTypeGroup("열 레이아웃", blockTypeGroups.columns)}
        {renderBlockTypeGroup("기타", blockTypeGroups.other)}
      </CardContent>
    </Card>
  )
}
