import type { ResumeBlock } from "@/types/resume"

interface SummaryBlockProps {
  block: ResumeBlock
  templateType: "classic" | "modern" | "minimal"
}

export default function SummaryBlock({ block, templateType }: SummaryBlockProps) {
  const { content } = block

  if (!content || !content.content) return null

  // Template-specific styles
  const getHeaderClass = () => {
    switch (templateType) {
      case "modern":
        return "text-[var(--accent-color)] border-b border-[var(--accent-color)] pb-1"
      case "minimal":
        return "text-gray-700 pb-1"
      case "classic":
      default:
        return "border-b border-gray-400 pb-1"
    }
  }

  return (
    <div className="summary-block mb-[var(--block-spacing)]">
      <h2 className={`text-xl font-bold mb-3 ${getHeaderClass()}`}>자기소개</h2>

      <div className="summary-content">
        {content.content.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-2">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

