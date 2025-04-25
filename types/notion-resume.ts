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

// 스타일 속성 정의
export interface BlockStyle {
  textAlign?: "left" | "center" | "right" | "justify";
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  fontStyle?: "normal" | "italic";
  color?: string;
  backgroundColor?: string;
  padding?: "none" | "sm" | "md" | "lg";
  paddingLeft?: "none" | "sm" | "md" | "lg";
  paddingBottom?: "none" | "sm" | "md" | "lg";
  margin?: "none" | "sm" | "md" | "lg";
  borderRadius?: "none" | "sm" | "md" | "lg";
  borderColor?: string;
  borderWidth?: "none" | "thin" | "medium" | "thick";
  borderStyle?: "solid" | "dashed" | "dotted";
  borderLeft?: string;
  borderBottom?: string;
  width?: string;
  maxWidth?: string;
  flexGrow?: number;
  gridTemplateColumns?: string;
}

// 스타일이 적용된 이력서 블록 정의
export interface StyledResumeBlock {
  id: string;
  type: NotionBlockType;
  content: any; // Notion API에서 반환된 원본 콘텐츠
  style: BlockStyle;
  children?: StyledResumeBlock[];
}

// 템플릿 정의
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

// Notion 이력서 정의
export interface NotionResume {
  id: string;
  pageId: string;
  title: string;
  blocks: StyledResumeBlock[];
  selectedTemplate: string;
  customStyles: Record<string, BlockStyle>; // 블록 ID를 키로 사용
  createdAt: string;
  updatedAt: string;
}

// PDF 설정 정의
export interface PDFSettings {
  scale: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  showPageNumbers: boolean;
  pageSize: "a4" | "letter" | "legal";
  orientation: "portrait" | "landscape";
}
