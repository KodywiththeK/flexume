import type {
  StyledResumeBlock,
  NotionBlockType,
  ResumeTemplate,
} from "@/types/notion-resume";

// Notion 블록을 스타일이 적용된 이력서 블록으로 변환
export function convertNotionToStyledBlocks(
  notionBlocks: any[],
  template: ResumeTemplate
): StyledResumeBlock[] {
  return notionBlocks.map((block) => convertNotionBlock(block, template));
}

// 단일 Notion 블록 변환
function convertNotionBlock(
  block: any,
  template: ResumeTemplate
): StyledResumeBlock {
  const blockType = getBlockType(block);

  // 기본 스타일 가져오기
  const defaultStyle = template.blockStyles[blockType] || {};

  // 블록 콘텐츠 추출 (컬럼 너비 정보 포함)
  const content = extractBlockContent(block);

  const styledBlock: StyledResumeBlock = {
    id: block.id,
    type: blockType,
    content,
    style: { ...defaultStyle },
  };

  // 자식 블록이 있는 경우 재귀적으로 처리
  if (block.children && block.children.length > 0) {
    styledBlock.children = block.children.map((child: any) =>
      convertNotionBlock(child, template)
    );
  }

  return styledBlock;
}

// Notion 블록 타입 추출
function getBlockType(block: any): NotionBlockType {
  if (!block.type || typeof block.type !== "string") {
    return "unsupported";
  }

  // Notion API에서 반환하는 블록 타입을 NotionBlockType으로 변환
  switch (block.type) {
    case "paragraph":
    case "heading_1":
    case "heading_2":
    case "heading_3":
    case "bulleted_list_item":
    case "numbered_list_item":
    case "quote":
    case "divider":
    case "image":
    case "callout":
    case "bookmark":
    case "code":
    case "column":
    case "column_list":
    case "embed":
    case "equation":
    case "file":
    case "link_preview":
    case "link_to_page":
    case "pdf":
    case "synced_block":
    case "table":
    case "table_of_contents":
    case "table_row":
    case "template":
    case "to_do":
    case "toggle":
      return block.type as NotionBlockType;
    default:
      return "unsupported";
  }
}

// 블록 콘텐츠 추출
function extractBlockContent(block: any): any {
  // 블록 타입에 따라 콘텐츠 추출 로직 구현
  if (!block.type) return null;

  // 원본 콘텐츠 유지
  const content = block[block.type];

  // 컬럼 블록인 경우 너비 정보 추출 및 저장
  if (block.type === "column" && block.format) {
    // Notion API 응답 구조에 따라 너비 정보 추출
    const columnFormat = block.format;

    // 너비 정보가 있는 경우 콘텐츠에 추가
    if (columnFormat.width || columnFormat.ratio) {
      return {
        ...content,
        width: columnFormat.width,
        ratio: columnFormat.ratio,
        _rawData: { format: columnFormat }, // 원본 포맷 데이터도 보존
      };
    }
  }

  return content;
}
