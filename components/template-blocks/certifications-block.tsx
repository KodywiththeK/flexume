import type { ResumeBlock } from "@/types/resume"
import { formatDate } from "@/lib/utils"

interface CertificationsBlockProps {
  block: ResumeBlock
  templateType: "classic" | "modern" | "minimal"
}

export default function CertificationsBlock({ block, templateType }: CertificationsBlockProps) {
  const { content } = block

  if (!content || !content.items || content.items.length === 0) return null

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
    <div className="certifications-block mb-[var(--block-spacing)]">
      <h2 className={`text-xl font-bold mb-3 ${getHeaderClass()}`}>자격증</h2>

      <div className="certifications-items space-y-3">
        {content.items.map((item, index) => (
          <div key={index} className="certification-item">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <h3 className="text-base font-semibold">{item.name}</h3>
              <div className="text-sm text-gray-600">{item.date && formatDate(item.date)}</div>
            </div>

            {item.issuer && <div className="text-sm">{item.issuer}</div>}

            {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

