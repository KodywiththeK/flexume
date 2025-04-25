"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Columns,
  Type,
  ListOrdered,
  ListChecks,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StyledResumeBlock } from "@/types/notion-resume";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { JSX } from "react/jsx-runtime";

interface BlockStructurePanelProps {
  blocks: StyledResumeBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
}

export function BlockStructurePanel({
  blocks,
  selectedBlockId,
  onSelectBlock,
}: BlockStructurePanelProps) {
  // 블록 타입에 따른 아이콘 매핑
  const getBlockIcon = (type: string) => {
    switch (type) {
      case "paragraph":
        return <Type size={14} />;
      case "heading_1":
      case "heading_2":
      case "heading_3":
        return <Type size={14} className="font-bold" />;
      case "bulleted_list_item":
        return <ListChecks size={14} />;
      case "numbered_list_item":
        return <ListOrdered size={14} />;
      case "image":
        return <ImageIcon size={14} />;
      case "column_list":
        return <Columns size={14} />;
      case "column":
        return <FileText size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  // 블록 타입에 따른 이름 매핑
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

  // 블록 내용 미리보기 텍스트 가져오기
  const getBlockPreview = (block: StyledResumeBlock): string => {
    const { type, content } = block;

    if (!content) return "";

    switch (type) {
      case "paragraph":
      case "heading_1":
      case "heading_2":
      case "heading_3":
      case "bulleted_list_item":
      case "numbered_list_item":
      case "quote":
        if (content.rich_text && content.rich_text.length > 0) {
          return (
            content.rich_text
              .map((text: any) => text.plain_text)
              .join("")
              .substring(0, 20) +
            (content.rich_text.join("").length > 20 ? "..." : "")
          );
        }
        return "";
      case "image":
        return "이미지";
      case "column_list":
        return `${block.children?.length || 0}개의 열`;
      case "column":
        return `열 (${block.children?.length || 0}개 항목)`;
      default:
        return getBlockTypeName(type);
    }
  };

  // Replace the renderBlockTree function with this fixed version
  // that properly handles React hooks by using a separate component
  const renderBlockTree = (blocks: StyledResumeBlock[], level = 0) => {
    return blocks.map((block) => (
      <BlockTreeItem
        key={block.id}
        block={block}
        level={level}
        selectedBlockId={selectedBlockId}
        onSelectBlock={onSelectBlock}
        getBlockIcon={getBlockIcon}
        getBlockTypeName={getBlockTypeName}
        getBlockPreview={getBlockPreview}
      />
    ));
  };

  // Add this new component outside of the renderBlockTree function
  interface BlockTreeItemProps {
    block: StyledResumeBlock;
    level: number;
    selectedBlockId: string | null;
    onSelectBlock: (blockId: string) => void;
    getBlockIcon: (type: string) => JSX.Element;
    getBlockTypeName: (type: string) => string;
    getBlockPreview: (block: StyledResumeBlock) => string;
  }

  // This is a separate component that safely uses React hooks
  function BlockTreeItem({
    block,
    level,
    selectedBlockId,
    onSelectBlock,
    getBlockIcon,
    getBlockTypeName,
    getBlockPreview,
  }: BlockTreeItemProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = block.children && block.children.length > 0;
    const isSelected = selectedBlockId === block.id;
    const blockRef = useRef<HTMLDivElement>(null);

    // useEffect for scrolling to selected block
    useEffect(() => {
      if (isSelected && blockRef.current) {
        blockRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, [isSelected]);

    return (
      <div className="block-tree-item" ref={blockRef}>
        <div
          className={cn(
            "flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-gray-100",
            isSelected && "bg-blue-100 hover:bg-blue-100"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onSelectBlock(block.id)}
        >
          {hasChildren && (
            <button
              className="mr-1 p-0.5 hover:bg-gray-200 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          <span className="mr-2">{getBlockIcon(block.type)}</span>
          <span className="text-sm truncate flex-1">
            {getBlockPreview(block) || getBlockTypeName(block.type)}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {block.children!.map((childBlock, index) => (
              <BlockTreeItem
                key={childBlock.id}
                block={childBlock}
                level={level + 1}
                selectedBlockId={selectedBlockId}
                onSelectBlock={onSelectBlock}
                getBlockIcon={getBlockIcon}
                getBlockTypeName={getBlockTypeName}
                getBlockPreview={getBlockPreview}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-md shadow-sm">
      <div className="p-3 border-b bg-gray-50">
        <h3 className="font-medium text-sm">문서 구조</h3>
      </div>
      <ScrollArea className="h-[calc(100vh-300px)] p-2">
        {renderBlockTree(blocks)}
      </ScrollArea>
    </div>
  );
}
