"use client";

import type React from "react";

import { useContext, useState } from "react";
import type { StyledResumeBlock } from "@/types/notion-resume";
import { StyleCustomizer } from "./style-customizer";
import { cn } from "@/lib/utils";
import { FileText, ExternalLink, AlertTriangle } from "lucide-react";
import { SelectedBlockContext } from "./selected-block-context";

interface NotionBlockRendererProps {
  block: StyledResumeBlock;
  onStyleChange?: (blockId: string, style: any) => void;
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

  // 스타일 객체를 CSS 스타일로 변환
  const getStyleObject = () => {
    const { style } = block;
    const styleObj: any = {};

    // 폰트 크기
    if (style.fontSize) {
      const fontSizeMap: Record<string, string> = {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      };
      styleObj.fontSize = fontSizeMap[style.fontSize] || "1rem";
    }

    // 폰트 굵기
    if (style.fontWeight) {
      const fontWeightMap: Record<string, string> = {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      };
      styleObj.fontWeight = fontWeightMap[style.fontWeight] || "400";
    }

    // 텍스트 정렬
    if (style.textAlign) {
      styleObj.textAlign = style.textAlign;
    }

    // 색상
    if (style.color) {
      styleObj.color = style.color;
    }

    // 배경색
    if (style.backgroundColor) {
      styleObj.backgroundColor = style.backgroundColor;
    }

    // 여백
    if (style.margin) {
      const marginMap: Record<string, string> = {
        none: "0",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
      };
      styleObj.margin = marginMap[style.margin] || "1rem";
    }

    // 패딩
    if (style.padding) {
      const paddingMap: Record<string, string> = {
        none: "0",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
      };
      styleObj.padding = paddingMap[style.padding] || "1rem";
    }

    // 테두리 반경
    if (style.borderRadius) {
      const borderRadiusMap: Record<string, string> = {
        none: "0",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "1rem",
      };
      styleObj.borderRadius = borderRadiusMap[style.borderRadius] || "0";
    }

    // 테두리 색상
    if (style.borderColor) {
      styleObj.borderColor = style.borderColor;
    }

    // 테두리 두께
    if (style.borderWidth) {
      const borderWidthMap: Record<string, string> = {
        none: "0",
        thin: "1px",
        medium: "2px",
        thick: "4px",
      };
      styleObj.borderWidth = borderWidthMap[style.borderWidth] || "0";
    }

    // 테두리 스타일
    if (style.borderStyle) {
      styleObj.borderStyle = style.borderStyle;
    }

    // 너비
    if (style.width) {
      styleObj.width = style.width;
    }

    // 최대 너비
    if (style.maxWidth) {
      styleObj.maxWidth = style.maxWidth;
    }

    return styleObj;
  };

  // 블록 클릭 핸들러
  const handleBlockClick = (e: React.MouseEvent) => {
    if (isEditing && onStyleChange) {
      // 이벤트 버블링 방지
      e.stopPropagation();

      if (isSelected) {
        setSelectedBlockId(null); // Close if already selected
      } else {
        setSelectedBlockId(block.id); // Open this block's customizer
      }
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

  // renderColumnList 함수를 더 정확하게 수정
  const renderColumnList = () => {
    // gridTemplateColumns 스타일이 있으면 사용, 없으면 자식 컬럼의 width 속성으로 구성
    const gridTemplateColumns =
      block.style.gridTemplateColumns ||
      block.children
        ?.map((child) => {
          // width가 fr 단위로 지정되어 있으면 그대로 사용
          if (
            child.style.width &&
            typeof child.style.width === "string" &&
            child.style.width.endsWith("fr")
          ) {
            return child.style.width;
          }
          // 그 외의 경우 기본값 1fr 사용
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
    // 컬럼 너비 정보 추출
    const columnRatio = getColumnRatio();

    // 컬럼 스타일 설정
    let columnStyle: React.CSSProperties = { flex: 1 };

    if (columnRatio) {
      // 비율이 0과 1 사이의 값이면 flex-basis와 함께 사용
      if (columnRatio > 0 && columnRatio <= 1) {
        columnStyle = {
          flexGrow: columnRatio,
          flexBasis: 0,
          minWidth: `${columnRatio * 100}%`,
        };
      }
      // 비율이 1보다 크면 직접적인 너비 값으로 간주
      else if (columnRatio > 1) {
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

  // 컬럼 너비 비율 추출 함수
  const getColumnRatio = (): number | null => {
    // Notion API에서 제공하는 컬럼 너비 정보 추출
    if (block.type === "column" && block.content) {
      // 너비 정보가 ratio 속성으로 제공되는 경우
      if (block.content.ratio) {
        return Number.parseFloat(block.content.ratio);
      }

      // 너비 정보가 width 속성으로 제공되는 경우 (백분율로 제공됨)
      if (block.content.width) {
        // width가 문자열이고 백분율로 표시된 경우 (예: "50%")
        if (
          typeof block.content.width === "string" &&
          block.content.width.endsWith("%")
        ) {
          return Number.parseFloat(block.content.width) / 100;
        }
        return Number.parseFloat(block.content.width);
      }

      // 원본 Notion 블록 데이터에서 너비 정보 추출 시도
      if (block.content._rawData && block.content._rawData.format) {
        const format = block.content._rawData.format;
        if (format.ratio) {
          return Number.parseFloat(format.ratio);
        }
        if (format.width) {
          // width가 문자열이고 백분율로 표시된 경우 (예: "50%")
          if (typeof format.width === "string" && format.width.endsWith("%")) {
            return Number.parseFloat(format.width) / 100;
          }
          return Number.parseFloat(format.width);
        }
      }
    }
    return null;
  };

  const renderTable = (content: any) => {
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

  const renderLinkToPage = (content: any) => {
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

  const renderSyncedBlock = (content: any) => {
    return (
      <div className="border-l-2 border-blue-300 pl-4">{renderChildren()}</div>
    );
  };

  const renderTableOfContents = (content: any) => {
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

  // 리치 텍스트 스타일 적용
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

  // 자식 블록 렌더링
  const renderChildren = () => {
    if (!block.children || block.children.length === 0) {
      return null;
    }

    // 특별한 중첩 처리가 필요한 블록 타입에 따라 다르게 렌더링
    if (block.type === "column_list") {
      return (
        <div
          className="flex flex-col md:flex-row gap-4 w-full"
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
    } else if (block.type === "column") {
      return (
        <div onClick={(e) => e.stopPropagation()}>
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
    }

    // 일반적인 중첩 처리
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

  // 블록 타입 이름 가져오기
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

  return (
    <div className="notion-block mb-4 relative">
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
            ></div>
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

      {isSelected && isEditing && onStyleChange && (
        <StyleCustomizer
          block={block}
          onStyleChange={onStyleChange}
          onClose={() => setSelectedBlockId(null)}
        />
      )}

      {/* Special nested blocks handling remains the same */}
      {block.type !== "column_list" &&
        block.type !== "column" &&
        renderChildren()}
    </div>
  );
}
