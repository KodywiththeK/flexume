"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BlockStyleEditor } from "./block-style-editor";
import type { BlockStyle, NotionBlockType } from "@/types/notion-resume";

const getBlockTypeName = (type: NotionBlockType): string => {
  const map: Record<NotionBlockType, string> = {
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
  return map[type] || type;
};

export function BlockTypeStylesDialog({
  open,
  onOpenChange,
  usedBlockTypes,
  blockTypeStyles,
  onChangeBlockTypeStyle,
  onResetBlockTypeStyle,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  usedBlockTypes: NotionBlockType[];
  blockTypeStyles: Record<NotionBlockType, BlockStyle>;
  onChangeBlockTypeStyle: (type: NotionBlockType, style: BlockStyle) => void;
  onResetBlockTypeStyle: (type: NotionBlockType) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent"
          onClick={() => onOpenChange(true)}
        >
          블록 타입별 스타일 설정
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>블록 타입별 스타일 설정</DialogTitle>
        </DialogHeader>

        {usedBlockTypes.length > 0 ? (
          <div className="space-y-4 px-4">
            {usedBlockTypes.map((blockType) => (
              <div key={blockType} className="border rounded-md p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-sm">
                      {getBlockTypeName(blockType)}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{blockType}</p>
                  </div>

                  {blockTypeStyles[blockType] && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResetBlockTypeStyle(blockType)}
                      className="text-xs"
                    >
                      초기화
                    </Button>
                  )}
                </div>

                <BlockStyleEditor
                  block={
                    {
                      id: `type-${blockType}`,
                      type: blockType,
                      content: {},
                      style: blockTypeStyles[blockType] || {},
                    } as any
                  }
                  blockType={blockType}
                  onStyleChange={(_, style) =>
                    onChangeBlockTypeStyle(blockType, style)
                  }
                  mode="inline"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 px-4">
            현재 이력서에 사용되는 블록이 없습니다.
          </p>
        )}

        <div className="mt-4 sticky bottom-0 bg-white w-full px-4 py-2 border-t">
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
