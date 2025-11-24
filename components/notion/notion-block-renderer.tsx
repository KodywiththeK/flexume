"use client";

import type React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import type { BlockStyle, StyledResumeBlock } from "@/types/notion-resume";
import { BlockStyleEditor } from "./block-style-editor";
import { cn } from "@/lib/utils";
import { FileText, ExternalLink, AlertTriangle, Edit2 } from "lucide-react";
import { SelectedBlockContext } from "./selected-block-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface NotionBlockRendererProps {
  block: StyledResumeBlock;
  onStyleChange?: (blockId: string, styleDelta: BlockStyle) => void;
  isEditing?: boolean;
  nestingLevel?: number;
}

export function NotionBlockRenderer({
  block,
  onStyleChange,
  isEditing = false,
  nestingLevel = 0,
}: NotionBlockRendererProps) {
  const { selectedBlockId, setSelectedBlockId } =
    useContext(SelectedBlockContext);
  const isSelected = selectedBlockId === block.id;
  const [isHovering, setIsHovering] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const prevSelectedRef = useRef(false);

  /**
   * ✅ 개선 1) 스타일 객체 단순화
   * - A버전 편집기에서 px / 숫자 문자열 그대로 저장하므로
   * - 여기서 불필요한 후처리/매핑 없이 그대로 CSS로 적용
   */
  const getStyleObject = (): React.CSSProperties => {
    const s = block.style;
    const styleObj: React.CSSProperties = {};

    if (s.fontSize) styleObj.fontSize = s.fontSize as any;
    if (s.fontWeight) styleObj.fontWeight = s.fontWeight as any;
    if (s.lineHeight) styleObj.lineHeight = s.lineHeight as any;
    if (s.letterSpacing) styleObj.letterSpacing = s.letterSpacing as any;
    if (s.textAlign) styleObj.textAlign = s.textAlign;
    if (s.color) styleObj.color = s.color;
    if (s.backgroundColor) styleObj.backgroundColor = s.backgroundColor;
    if (s.width) styleObj.width = s.width;
    if (s.maxWidth) styleObj.maxWidth = s.maxWidth;
    if (typeof s.flexGrow === "number") styleObj.flexGrow = s.flexGrow;
    if (s.gridTemplateColumns)
      styleObj.gridTemplateColumns = s.gridTemplateColumns;

    return styleObj;
  };

  /**
   * ✅ 개선 2) 선택하면 Popover 자동 오픈 (단, 사용자가 닫으면 유지)
   * - "선택됨으로 전환" 순간에만 자동 open
   * - 선택 해제되면 강제 close
   */
  useEffect(() => {
    if (isSelected && !prevSelectedRef.current) {
      setIsPopoverOpen(true);
    }
    if (!isSelected) {
      setIsPopoverOpen(false);
    }
    prevSelectedRef.current = isSelected;
  }, [isSelected]);

  const handleBlockClick = (e: React.MouseEvent) => {
    if (!isEditing || !onStyleChange) return;
    e.stopPropagation();

    if (isSelected) {
      setSelectedBlockId(null);
    } else {
      setSelectedBlockId(block.id);
    }
  };

  // 블록 타입에 따른 렌더링
  const renderBlockContent = () => {
    const { type, content } = block;

    switch (type) {
      case "paragraph":
        return renderParagraph(content);
      case "heading_1":
        return renderHeading1(content);
      case "heading_2":
        return renderHeading2(content);
      case "heading_3":
        return renderHeading3(content);
      case "bulleted_list_item":
        return renderBulletedListItem(content);
      case "numbered_list_item":
        return renderNumberedListItem(content);
      case "image":
        return renderImage(content);
      case "divider":
        return renderDivider();
      case "quote":
        return renderQuote(content);
      case "code":
        return renderCode(content);
      case "callout":
        return renderCallout(content);
      case "bookmark":
        return renderBookmark(content);
      case "column_list":
        return renderColumnList();
      case "column":
        return renderColumn();
      case "table":
        return renderTable(content);
      case "table_row":
        return renderTableRow(content);
      case "embed":
        return renderEmbed(content);
      case "equation":
        return renderEquation(content);
      case "file":
        return renderFile(content);
      case "link_preview":
        return renderLinkPreview(content);
      case "link_to_page":
        return renderLinkToPage(content);
      case "pdf":
        return renderPDF(content);
      case "synced_block":
        return renderSyncedBlock(content);
      case "table_of_contents":
        return renderTableOfContents(content);
      case "to_do":
        return renderToDo(content);
      case "toggle":
        return renderToggle(content);
      default:
        return renderUnsupported();
    }
  };

  // 각 블록 타입별 렌더링 함수
  const renderParagraph = (content: any) => {
    if (!content.rich_text || content.rich_text.length === 0) {
      return <p>&nbsp;</p>;
    }

    return (
      <p>
        {content.rich_text.map((text: any, index: number) => (
          <span key={index} style={getRichTextStyle(text)}>
            {text.plain_text}
          </span>
        ))}
      </p>
    );
  };

  const renderHeading1 = (content: any) => {
    if (!content.rich_text || content.rich_text.length === 0) {
      return <h1>&nbsp;</h1>;
    }

    return (
      <h1>
        {content.rich_text.map((text: any, index: number) => (
          <span key={index} style={getRichTextStyle(text)}>
            {text.plain_text}
          </span>
        ))}
      </h1>
    );
  };

  const renderHeading2 = (content: any) => {
    if (!content.rich_text || content.rich_text.length === 0) {
      return <h2>&nbsp;</h2>;
    }

    return (
      <h2>
        {content.rich_text.map((text: any, index: number) => (
          <span key={index} style={getRichTextStyle(text)}>
            {text.plain_text}
          </span>
        ))}
      </h2>
    );
  };

  const renderHeading3 = (content: any) => {
    if (!content.rich_text || content.rich_text.length === 0) {
      return <h3>&nbsp;</h3>;
    }

    return (
      <h3>
        {content.rich_text.map((text: any, index: number) => (
          <span key={index} style={getRichTextStyle(text)}>
            {text.plain_text}
          </span>
        ))}
      </h3>
    );
  };

  const renderBulletedListItem = (content: any) => {
    if (!content.rich_text || content.rich_text.length === 0) {
      return (
        <ul>
          <li>&nbsp;</li>
        </ul>
      );
    }

    return (
      <ul className="list-disc list-inside">
        <li>
          {content.rich_text.map((text: any, index: number) => (
            <span key={index} style={getRichTextStyle(text)}>
              {text.plain_text}
            </span>
          ))}
        </li>
      </ul>
    );
  };

  const renderNumberedListItem = (content: any) => {
    if (!content.rich_text || content.rich_text.length === 0) {
      return (
        <ol>
          <li>&nbsp;</li>
        </ol>
      );
    }

    return (
      <ol className="list-decimal list-inside">
        <li>
          {content.rich_text.map((text: any, index: number) => (
            <span key={index} style={getRichTextStyle(text)}>
              {text.plain_text}
            </span>
          ))}
        </li>
      </ol>
    );
  };

  const renderImage = (content: any) => {
    if (!content.external?.url && !content.file?.url) {
      return <div className="text-gray-400">이미지를 불러올 수 없습니다</div>;
    }

    const imageUrl = content.external?.url || content.file?.url;
    const caption =
      content.caption?.length > 0
        ? content.caption.map((c: any) => c.plain_text).join("")
        : "";

    return (
      <figure>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={caption || "Notion image"}
          className="max-w-full h-auto"
        />
        {caption && (
          <figcaption className="text-sm text-gray-500 mt-1 text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  };

  const renderDivider = () => {
    return <hr className="my-4" />;
  };

  const renderQuote = (content: any) => {
    if (!content.rich_text || content.rich_text.length === 0) {
      return <blockquote className="border-l-4 pl-4 italic">&nbsp;</blockquote>;
    }

    return (
      <blockquote className="border-l-4 pl-4 italic">
        {content.rich_text.map((text: any, index: number) => (
          <span key={index} style={getRichTextStyle(text)}>
            {text.plain_text}
          </span>
        ))}
      </blockquote>
    );
  };

  const renderCode = (content: any) => {
    if (!content.rich_text || content.rich_text.length === 0) {
      return (
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          <code>&nbsp;</code>
        </pre>
      );
    }

    const code = content.rich_text.map((text: any) => text.plain_text).join("");
    const language = content.language || "plain text";

    return (
      <div>
        <div className="text-xs text-gray-500 mb-1">{language}</div>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  const renderCallout = (content: any) => {
    if (!content.rich_text || content.rich_text.length === 0) {
      return (
        <div className="flex gap-2 bg-gray-100 p-4 rounded">
          <div>{content.icon?.emoji || "💡"}</div>
          <div>&nbsp;</div>
        </div>
      );
    }

    const icon = content.icon?.emoji || "💡";

    return (
      <div className="flex gap-2 bg-gray-100 p-4 rounded">
        <div>{icon}</div>
        <div>
          {content.rich_text.map((text: any, index: number) => (
            <span key={index} style={getRichTextStyle(text)}>
              {text.plain_text}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderBookmark = (content: any) => {
    const url = content.url || "";
    const caption =
      content.caption?.length > 0
        ? content.caption.map((c: any) => c.plain_text).join("")
        : "";

    return (
      <div className="border rounded p-4 hover:bg-gray-50">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600"
        >
          <ExternalLink size={16} />
          {url}
        </a>
        {caption && <div className="text-sm text-gray-500 mt-2">{caption}</div>}
      </div>
    );
  };

  const renderColumnList = () => {
    const gridTemplateColumns =
      block.style.gridTemplateColumns ||
      block.children
        ?.map((child) => {
          if (
            child.style.width &&
            typeof child.style.width === "string" &&
            child.style.width.endsWith("fr")
          ) {
            return child.style.width;
          }
          return "1fr";
        })
        .join(" ") ||
      "repeat(auto-fit, minmax(0, 1fr))";

    return (
      <div
        className="grid gap-4 w-full"
        style={{ gridTemplateColumns }}
        onClick={(e) => e.stopPropagation()}
      >
        {block.children?.map((child) => (
          <NotionBlockRenderer
            key={child.id}
            block={child}
            onStyleChange={onStyleChange}
            isEditing={isEditing}
            nestingLevel={nestingLevel + 1}
          />
        ))}
      </div>
    );
  };

  const renderColumn = () => {
    const columnRatio = getColumnRatio();
    let columnStyle: React.CSSProperties = { flex: 1 };

    if (columnRatio) {
      if (columnRatio > 0 && columnRatio <= 1) {
        columnStyle = {
          flexGrow: columnRatio,
          flexBasis: 0,
          minWidth: `${columnRatio * 100}%`,
        };
      } else if (columnRatio > 1) {
        columnStyle = {
          width: `${columnRatio}px`,
          flexShrink: 0,
        };
      }
    }

    return (
      <div style={columnStyle} onClick={(e) => e.stopPropagation()}>
        {renderChildren()}
      </div>
    );
  };

  const getColumnRatio = (): number | null => {
    if (block.type === "column" && block.content) {
      if (block.content.ratio) return Number.parseFloat(block.content.ratio);

      if (block.content.width) {
        if (
          typeof block.content.width === "string" &&
          block.content.width.endsWith("%")
        ) {
          return Number.parseFloat(block.content.width) / 100;
        }
        return Number.parseFloat(block.content.width);
      }

      if (block.content._rawData && block.content._rawData.format) {
        const format = block.content._rawData.format;
        if (format.ratio) return Number.parseFloat(format.ratio);
        if (format.width) {
          if (typeof format.width === "string" && format.width.endsWith("%")) {
            return Number.parseFloat(format.width) / 100;
          }
          return Number.parseFloat(format.width);
        }
      }
    }
    return null;
  };

  const renderTable = (_content: any) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <tbody>{renderChildren()}</tbody>
        </table>
      </div>
    );
  };

  const renderTableRow = (content: any) => {
    const cells = content.cells || [];
    return (
      <tr className="border-b border-gray-200">
        {cells.map((cell: any[], cellIndex: number) => (
          <td key={cellIndex} className="border border-gray-200 px-4 py-2">
            {cell.map((text: any, textIndex: number) => (
              <span key={textIndex} style={getRichTextStyle(text)}>
                {text.plain_text}
              </span>
            ))}
          </td>
        ))}
      </tr>
    );
  };

  const renderEmbed = (content: any) => {
    const url = content.url || "";
    const caption =
      content.caption?.length > 0
        ? content.caption.map((c: any) => c.plain_text).join("")
        : "";

    return (
      <div className="border rounded p-4">
        <div className="text-sm text-gray-500 mb-2">
          임베드 콘텐츠 (PDF에서는 표시되지 않을 수 있음)
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 flex items-center gap-2"
        >
          <ExternalLink size={16} />
          {url}
        </a>
        {caption && <div className="text-sm text-gray-500 mt-2">{caption}</div>}
      </div>
    );
  };

  const renderEquation = (content: any) => {
    const expression = content.expression || "";
    return (
      <div className="py-2 text-center">
        <div className="inline-block bg-gray-50 px-4 py-2 rounded">
          {expression}
        </div>
      </div>
    );
  };

  const renderFile = (content: any) => {
    const url = content.external?.url || content.file?.url || "";
    const caption =
      content.caption?.length > 0
        ? content.caption.map((c: any) => c.plain_text).join("")
        : "";
    const fileName = url.split("/").pop() || "파일";

    return (
      <div className="border rounded p-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600"
        >
          <FileText size={16} />
          {fileName}
        </a>
        {caption && <div className="text-sm text-gray-500 mt-2">{caption}</div>}
      </div>
    );
  };

  const renderLinkPreview = (content: any) => {
    const url = content.url || "";
    return (
      <div className="border rounded p-4 hover:bg-gray-50">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600"
        >
          <ExternalLink size={16} />
          {url}
        </a>
      </div>
    );
  };

  const renderLinkToPage = (_content: any) => {
    return (
      <div className="text-blue-600">
        <span>→ 페이지 링크 (PDF에서는 작동하지 않음)</span>
      </div>
    );
  };

  const renderPDF = (content: any) => {
    const url = content.external?.url || content.file?.url || "";
    const caption =
      content.caption?.length > 0
        ? content.caption.map((c: any) => c.plain_text).join("")
        : "";

    return (
      <div className="border rounded p-4">
        <div className="text-sm text-gray-500 mb-2">
          PDF 파일 (PDF에서는 링크로 표시됨)
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600"
        >
          <FileText size={16} />
          PDF 문서 보기
        </a>
        {caption && <div className="text-sm text-gray-500 mt-2">{caption}</div>}
      </div>
    );
  };

  const renderSyncedBlock = (_content: any) => {
    return (
      <div className="border-l-2 border-blue-300 pl-4">{renderChildren()}</div>
    );
  };

  const renderTableOfContents = (_content: any) => {
    return (
      <div className="border rounded p-4 bg-gray-50">
        <div className="text-sm text-gray-500">
          목차 (PDF에서는 정적으로 표시됨)
        </div>
      </div>
    );
  };

  const renderToDo = (content: any) => {
    if (!content.rich_text || content.rich_text.length === 0) {
      return (
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={content.checked} readOnly />
          <span>&nbsp;</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={content.checked} readOnly />
        <span>
          {content.rich_text.map((text: any, index: number) => (
            <span key={index} style={getRichTextStyle(text)}>
              {text.plain_text}
            </span>
          ))}
        </span>
      </div>
    );
  };

  const renderToggle = (content: any) => {
    if (!content.rich_text || content.rich_text.length === 0) {
      return (
        <details>
          <summary>&nbsp;</summary>
          {renderChildren()}
        </details>
      );
    }

    return (
      <details>
        <summary>
          {content.rich_text.map((text: any, index: number) => (
            <span key={index} style={getRichTextStyle(text)}>
              {text.plain_text}
            </span>
          ))}
        </summary>
        {renderChildren()}
      </details>
    );
  };

  const renderUnsupported = () => {
    return (
      <div className="text-gray-400 italic text-sm p-2 border border-dashed border-gray-300 rounded flex items-center gap-2">
        <AlertTriangle size={16} />
        지원되지 않는 블록 타입입니다
      </div>
    );
  };

  const getRichTextStyle = (text: any) => {
    const style: any = {};

    if (text.annotations) {
      if (text.annotations.bold) style.fontWeight = "bold";
      if (text.annotations.italic) style.fontStyle = "italic";
      if (text.annotations.underline) style.textDecoration = "underline";
      if (text.annotations.strikethrough) style.textDecoration = "line-through";
      if (text.annotations.code) {
        style.fontFamily = "monospace";
        style.backgroundColor = "rgba(135, 131, 120, 0.15)";
        style.padding = "0.2em 0.4em";
        style.borderRadius = "3px";
      }
      if (text.annotations.color !== "default") {
        style.color = text.annotations.color;
      }
    }

    return style;
  };

  /**
   * ✅ 개선 3) renderChildren() 정리
   * - column_list / column 분기 제거 (죽은 코드)
   * - 일반 중첩만 담당
   */
  const renderChildren = () => {
    if (!block.children?.length) return null;

    return (
      <div
        className={nestingLevel > 0 ? "" : "pl-4 border-l border-gray-200"}
        onClick={(e) => e.stopPropagation()}
      >
        {block.children.map((child) => (
          <NotionBlockRenderer
            key={child.id}
            block={child}
            onStyleChange={onStyleChange}
            isEditing={isEditing}
            nestingLevel={nestingLevel + 1}
          />
        ))}
      </div>
    );
  };

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
    };
    return nameMap[type] || type;
  };

  return (
    <div
      data-resume-block
      data-block-id={block.id}
      className="notion-block mb-4 relative"
    >
      <div
        className={cn(
          "notion-block-content relative",
          isEditing && "hover:bg-blue-50/30",
          isSelected && "outline outline-2 outline-blue-500 bg-blue-50"
        )}
        style={getStyleObject()}
        onClick={(e) => {
          e.stopPropagation();
          handleBlockClick(e);
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* 블록 선택 핸들 */}
        {isEditing && (
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center",
              isHovering || isSelected ? "opacity-100" : "opacity-0",
              "transition-opacity duration-200"
            )}
            style={{ transform: "translateX(-100%)" }}
          >
            <div
              className={cn(
                "w-3 h-3 rounded-full border",
                isSelected
                  ? "bg-blue-500 border-blue-600"
                  : "bg-gray-200 border-gray-300",
                isHovering && !isSelected && "bg-gray-300 border-gray-400"
              )}
            />
          </div>
        )}

        {/* 블록 타입 레이블 */}
        {isEditing && (isHovering || isSelected) && (
          <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-bl z-10">
            {getBlockTypeName(block.type)}
          </div>
        )}

        {renderBlockContent()}
      </div>

      {/* ✅ Popover 유지 + 선택 시 자동 오픈 */}
      {isSelected && isEditing && onStyleChange && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              className={cn(
                "absolute bottom-0 right-0 z-10",
                isHovering || isPopoverOpen ? "opacity-100" : "opacity-0",
                "transition-opacity duration-200"
              )}
            >
              <Edit2 size={16} className="mr-2" />
              Edit Style
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <BlockStyleEditor
              block={block}
              onStyleChange={onStyleChange}
              onClose={() => setSelectedBlockId(null)}
            />
          </PopoverContent>
        </Popover>
      )}

      {block.type !== "column_list" &&
        block.type !== "column" &&
        renderChildren()}
    </div>
  );
}
