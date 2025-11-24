// Notion 블록 타입 정의
export type NotionBlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list_item"
  | "numbered_list_item"
  | "quote"
  | "divider"
  | "image"
  | "callout"
  | "bookmark"
  | "code"
  | "column"
  | "column_list"
  | "embed"
  | "equation"
  | "file"
  | "link_preview"
  | "link_to_page"
  | "pdf"
  | "synced_block"
  | "table"
  | "table_of_contents"
  | "table_row"
  | "template"
  | "to_do"
  | "toggle"
  | "unsupported";

// CSS 문자열 기반 스타일 속성 정의
export interface BlockStyle {
  textAlign?: "left" | "center" | "right" | "justify";

  // typography
  fontSize?: string; // e.g. "14px", "1rem"
  fontWeight?: string; // e.g. "400", "600", "bold"
  fontStyle?: "normal" | "italic";
  lineHeight?: string; // e.g. "20px", "1.6"
  letterSpacing?: string; // e.g. "0px", "0.02em"
  color?: string;
  backgroundColor?: string;

  // spacing
  padding?: string; // e.g. "0px", "8px 12px"
  paddingLeft?: string;
  paddingBottom?: string;
  margin?: string;
  marginBottom?: string;
  marginTop?: string;

  // border
  borderRadius?: string; // e.g. "0px", "6px"
  borderColor?: string;
  borderWidth?: string; // e.g. "1px"
  borderStyle?: "solid" | "dashed" | "dotted";
  borderLeft?: string;
  borderBottom?: string;

  // sizing / layout
  width?: string; // e.g. "320px", "100%", "2fr"
  maxWidth?: string;
  flexGrow?: number;
  gridTemplateColumns?: string; // e.g. "1fr 2fr 1fr"
}

export type BlockStyleConfig = {
  typography?: boolean;
  sizing?: boolean;
  columnRatio?: boolean;
  colors?: boolean;
};

// 블록 타입별 편집 가능한 스타일 정의
export const BLOCK_STYLE_CONFIG: Record<NotionBlockType, BlockStyleConfig> = {
  paragraph: { typography: true, sizing: true, colors: true },
  heading_1: { typography: true, sizing: true, colors: true },
  heading_2: { typography: true, sizing: true, colors: true },
  heading_3: { typography: true, sizing: true, colors: true },
  bulleted_list_item: { typography: true, sizing: true, colors: true },
  numbered_list_item: { typography: true, sizing: true, colors: true },
  quote: { typography: true, sizing: true, colors: true },
  divider: { sizing: true, colors: true },
  image: { sizing: true },
  callout: { typography: true, sizing: true, colors: true },
  bookmark: { typography: true, sizing: true, colors: true },
  code: { typography: true, sizing: true, colors: true },
  column: { sizing: true },
  column_list: { columnRatio: true, sizing: true },
  embed: { sizing: true },
  equation: { sizing: true },
  file: { sizing: true },
  link_preview: { sizing: true, colors: true },
  link_to_page: { typography: true, sizing: true, colors: true },
  pdf: { sizing: true },
  synced_block: { typography: true, sizing: true, colors: true },
  table: { typography: true, sizing: true, colors: true },
  table_of_contents: { typography: true, colors: true },
  table_row: { typography: true, sizing: true, colors: true },
  template: { typography: true, sizing: true, colors: true },
  to_do: { typography: true, sizing: true, colors: true },
  toggle: { typography: true, sizing: true, colors: true },
  unsupported: { typography: true, sizing: true, colors: true },
};

// 스타일이 적용된 이력서 블록 정의
export interface StyledResumeBlock {
  id: string;
  type: NotionBlockType;
  content: any;
  style: BlockStyle;
  children?: StyledResumeBlock[];
}

// 템플릿 정의 (blockStyles도 CSS 기반)
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  globalStyles: {
    fontFamily: string;
    headingColor: string;
    textColor: string;
    backgroundColor: string;
    accentColor: string;
  };
  blockStyles: Record<NotionBlockType, BlockStyle>;
}

export type ManualPageBreakOverrides = Record<number, number> | null;

// Notion 이력서 정의
export interface NotionResume {
  id: string;
  pageId: string;
  title: string;
  blocks: StyledResumeBlock[];
  selectedTemplate: string;
  customStyles: Record<string, BlockStyle>;
  createdAt: string;
  updatedAt: string;
}

// PDF 설정 정의
// types/notion-resume.ts (PDFSettings 부분)

export type PDFSettings = {
  scale: number;
  margins: { top: number; right: number; bottom: number; left: number };
  showPageNumbers: boolean;
  pageSize: "a4" | "letter" | "legal";
  orientation: "portrait" | "landscape";

  // ✅ 추가
  footer: {
    enabled: boolean;
    text: string; // 예: "© 2025 Kody Kim"
    fontSize?: number; // mm 기준이 아니라 px에서 쓰기 편하게 pt 느낌으로
    align: "left" | "center" | "right";
    showDivider?: boolean; // footer 위 가는 라인
  };
};
