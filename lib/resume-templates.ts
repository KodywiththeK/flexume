import type { ResumeTemplate } from "@/types/notion-resume";

// 기본 템플릿 정의
const templates: Record<string, ResumeTemplate> = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "깔끔하고 현대적인 디자인",
    globalStyles: {
      fontFamily: "Inter, sans-serif",
      headingColor: "#1a202c",
      textColor: "#4a5568",
      backgroundColor: "#ffffff",
      accentColor: "#3182ce",
    },
    blockStyles: {
      paragraph: {
        fontSize: "base",
        color: "#4a5568",
        margin: "md",
      },
      heading_1: {
        fontSize: "3xl",
        fontWeight: "bold",
        color: "#1a202c",
        margin: "lg",
      },
      heading_2: {
        fontSize: "2xl",
        fontWeight: "semibold",
        color: "#2d3748",
        margin: "md",
      },
      heading_3: {
        fontSize: "xl",
        fontWeight: "medium",
        color: "#4a5568",
        margin: "sm",
      },
      bulleted_list_item: {
        fontSize: "base",
        color: "#4a5568",
        margin: "sm",
      },
      numbered_list_item: {
        fontSize: "base",
        color: "#4a5568",
        margin: "sm",
      },
      to_do: {
        fontSize: "base",
        color: "#4a5568",
        margin: "sm",
      },
      toggle: {
        fontSize: "base",
        color: "#4a5568",
        margin: "sm",
      },
      image: {
        margin: "md",
        borderRadius: "md",
      },
      code: {
        fontSize: "sm",
        backgroundColor: "#f7fafc",
        padding: "md",
        margin: "md",
        borderRadius: "md",
      },
      quote: {
        fontSize: "base",
        fontStyle: "italic",
        color: "#718096",
        backgroundColor: "#f7fafc",
        padding: "md",
        margin: "md",
        borderRadius: "sm",
        borderColor: "#e2e8f0",
        borderWidth: "thin",
        borderStyle: "solid",
      },
      divider: {
        margin: "md",
      },
      table: {
        margin: "md",
        borderColor: "#e2e8f0",
        borderWidth: "thin",
      },
      table_row: {
        borderColor: "#e2e8f0",
        borderWidth: "thin",
      },
      column: {
        padding: "sm",
      },
      column_list: {
        margin: "md",
      },
      callout: {
        backgroundColor: "#ebf8ff",
        padding: "md",
        margin: "md",
        borderRadius: "md",
      },
      bookmark: {
        margin: "md",
        borderRadius: "md",
        borderColor: "#e2e8f0",
        borderWidth: "thin",
      },
      embed: {
        margin: "md",
        borderRadius: "md",
      },
      equation: {
        margin: "md",
        fontSize: "base",
      },
      file: {
        margin: "md",
        borderRadius: "md",
      },
      link_preview: {
        margin: "md",
        borderRadius: "md",
        borderColor: "#e2e8f0",
        borderWidth: "thin",
      },
      link_to_page: {
        fontSize: "base",
        color: "#3182ce",
        margin: "sm",
      },
      pdf: {
        margin: "md",
        borderRadius: "md",
      },
      synced_block: {
        margin: "md",
      },
      table_of_contents: {
        margin: "md",
        fontSize: "sm",
      },
      template: {
        margin: "md",
      },
      unsupported: {
        fontSize: "sm",
        color: "#a0aec0",
        margin: "sm",
      },
    },
  },

  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "심플하고 미니멀한 디자인",
    globalStyles: {
      fontFamily: "system-ui, sans-serif",
      headingColor: "#000000",
      textColor: "#333333",
      backgroundColor: "#ffffff",
      accentColor: "#666666",
    },
    blockStyles: {
      paragraph: {
        fontSize: "base",
        color: "#333333",
        margin: "md",
      },
      heading_1: {
        fontSize: "2xl",
        fontWeight: "bold",
        color: "#000000",
        margin: "md",
      },
      heading_2: {
        fontSize: "xl",
        fontWeight: "semibold",
        color: "#000000",
        margin: "sm",
      },
      heading_3: {
        fontSize: "lg",
        fontWeight: "medium",
        color: "#000000",
        margin: "sm",
      },
      bulleted_list_item: {
        fontSize: "base",
        color: "#333333",
        margin: "sm",
      },
      numbered_list_item: {
        fontSize: "base",
        color: "#333333",
        margin: "sm",
      },
      to_do: {
        fontSize: "base",
        color: "#333333",
        margin: "sm",
      },
      toggle: {
        fontSize: "base",
        color: "#333333",
        margin: "sm",
      },
      image: {
        margin: "md",
        borderRadius: "sm",
      },
      code: {
        fontSize: "sm",
        backgroundColor: "#f5f5f5",
        padding: "md",
        margin: "md",
        borderRadius: "sm",
      },
      quote: {
        fontSize: "base",
        fontStyle: "italic",
        color: "#666666",
        backgroundColor: "#f5f5f5",
        padding: "md",
        margin: "md",
        borderRadius: "sm",
        borderColor: "#e5e5e5",
        borderWidth: "thin",
        borderStyle: "solid",
      },
      divider: {
        margin: "md",
      },
      table: {
        margin: "md",
        borderColor: "#e5e5e5",
        borderWidth: "thin",
      },
      table_row: {
        borderColor: "#e5e5e5",
        borderWidth: "thin",
      },
      column: {
        padding: "sm",
      },
      column_list: {
        margin: "md",
      },
      callout: {
        backgroundColor: "#f5f5f5",
        padding: "md",
        margin: "md",
        borderRadius: "sm",
      },
      bookmark: {
        margin: "md",
        borderRadius: "sm",
        borderColor: "#e5e5e5",
        borderWidth: "thin",
      },
      embed: {
        margin: "md",
        borderRadius: "sm",
      },
      equation: {
        margin: "md",
        fontSize: "base",
      },
      file: {
        margin: "md",
        borderRadius: "sm",
      },
      link_preview: {
        margin: "md",
        borderRadius: "sm",
        borderColor: "#e5e5e5",
        borderWidth: "thin",
      },
      link_to_page: {
        fontSize: "base",
        color: "#666666",
        margin: "sm",
      },
      pdf: {
        margin: "md",
        borderRadius: "sm",
      },
      synced_block: {
        margin: "md",
      },
      table_of_contents: {
        margin: "md",
        fontSize: "sm",
      },
      template: {
        margin: "md",
      },
      unsupported: {
        fontSize: "sm",
        color: "#999999",
        margin: "sm",
      },
    },
  },

  accent: {
    id: "accent",
    name: "Accent",
    description: "강조색이 있는 세련된 디자인",
    globalStyles: {
      fontFamily: "Poppins, sans-serif",
      headingColor: "#2c5282",
      textColor: "#2d3748",
      backgroundColor: "#ffffff",
      accentColor: "#4299e1",
    },
    blockStyles: {
      paragraph: {
        fontSize: "base",
        color: "#2d3748",
        margin: "md",
      },
      heading_1: {
        fontSize: "3xl",
        fontWeight: "bold",
        color: "#2c5282",
        margin: "lg",
        borderBottom: "2px solid #4299e1",
        paddingBottom: "sm",
      },
      heading_2: {
        fontSize: "2xl",
        fontWeight: "semibold",
        color: "#2c5282",
        margin: "md",
        borderLeft: "3px solid #4299e1",
        paddingLeft: "sm",
      },
      heading_3: {
        fontSize: "xl",
        fontWeight: "medium",
        color: "#2c5282",
        margin: "sm",
      },
      bulleted_list_item: {
        fontSize: "base",
        color: "#2d3748",
        margin: "sm",
      },
      numbered_list_item: {
        fontSize: "base",
        color: "#2d3748",
        margin: "sm",
      },
      to_do: {
        fontSize: "base",
        color: "#2d3748",
        margin: "sm",
      },
      toggle: {
        fontSize: "base",
        color: "#2d3748",
        margin: "sm",
      },
      image: {
        margin: "md",
        borderRadius: "md",
        borderColor: "#bee3f8",
        borderWidth: "thin",
      },
      code: {
        fontSize: "sm",
        backgroundColor: "#ebf8ff",
        padding: "md",
        margin: "md",
        borderRadius: "md",
        borderLeft: "3px solid #4299e1",
      },
      quote: {
        fontSize: "base",
        fontStyle: "italic",
        color: "#2c5282",
        backgroundColor: "#ebf8ff",
        padding: "md",
        margin: "md",
        borderRadius: "md",
        borderLeft: "3px solid #4299e1",
        borderColor: "#bee3f8",
        borderWidth: "thin",
        borderStyle: "solid",
      },
      divider: {
        margin: "md",
      },
      table: {
        margin: "md",
        borderColor: "#bee3f8",
        borderWidth: "thin",
      },
      table_row: {
        borderColor: "#bee3f8",
        borderWidth: "thin",
      },
      column: {
        padding: "sm",
      },
      column_list: {
        margin: "md",
      },
      callout: {
        backgroundColor: "#ebf8ff",
        padding: "md",
        margin: "md",
        borderRadius: "md",
        borderLeft: "3px solid #4299e1",
      },
      bookmark: {
        margin: "md",
        borderRadius: "md",
        borderColor: "#bee3f8",
        borderWidth: "thin",
      },
      embed: {
        margin: "md",
        borderRadius: "md",
        borderColor: "#bee3f8",
        borderWidth: "thin",
      },
      equation: {
        margin: "md",
        fontSize: "base",
      },
      file: {
        margin: "md",
        borderRadius: "md",
        borderColor: "#bee3f8",
        borderWidth: "thin",
      },
      link_preview: {
        margin: "md",
        borderRadius: "md",
        borderColor: "#bee3f8",
        borderWidth: "thin",
      },
      link_to_page: {
        fontSize: "base",
        color: "#4299e1",
        margin: "sm",
      },
      pdf: {
        margin: "md",
        borderRadius: "md",
        borderColor: "#bee3f8",
        borderWidth: "thin",
      },
      synced_block: {
        margin: "md",
      },
      table_of_contents: {
        margin: "md",
        fontSize: "sm",
      },
      template: {
        margin: "md",
      },
      unsupported: {
        fontSize: "sm",
        color: "#a0aec0",
        margin: "sm",
      },
    },
  },
};

// 템플릿 가져오기
export function getTemplate(templateId = "modern"): ResumeTemplate {
  return templates[templateId] || templates.modern;
}

// 모든 템플릿 가져오기
export function getAllTemplates(): ResumeTemplate[] {
  return Object.values(templates);
}
