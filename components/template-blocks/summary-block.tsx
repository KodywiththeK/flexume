import type { ResumeBlock } from "@/types/resume";
import MarkdownViewer from "../utils/MarkdownViewer";
import TemplateHeading from "./TemplateHeading";

interface SummaryBlockProps {
  block: ResumeBlock;
  templateType: "classic" | "modern" | "minimal";
}

export default function SummaryBlock({
  block,
  templateType,
}: SummaryBlockProps) {
  const { content } = block;

  if (!content || !content.content) return null;

  return (
    <div className="summary-block mb-[var(--block-spacing)]">
      <TemplateHeading templateType={templateType}>
        Introduction.
      </TemplateHeading>

      <MarkdownViewer
        markdown={content.content}
        className="text-sm text-gray-800 space-y-2"
      />
    </div>
  );
}
