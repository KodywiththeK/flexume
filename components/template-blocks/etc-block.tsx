import type { ResumeBlock } from "@/types/resume"

interface EtcBlockProps {
  block: ResumeBlock
  templateType: "classic" | "modern" | "minimal"
}

export default function EtcBlock({ block, templateType }: EtcBlockProps) {
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
    <div className="etc-block mb-[var(--block-spacing)]">
      <h2 className={`text-xl font-bold mb-3 ${getHeaderClass()}`}>기타</h2>

      <div className="etc-content">
        {content.content.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-2 text-sm">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

