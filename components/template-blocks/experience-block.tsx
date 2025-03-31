import type { ResumeBlock } from "@/types/resume"
import { formatDate } from "@/lib/utils"

interface ExperienceBlockProps {
  block: ResumeBlock
  templateType: "classic" | "modern" | "minimal"
}

export default function ExperienceBlock({ block, templateType }: ExperienceBlockProps) {
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

  const getItemClass = () => {
    switch (templateType) {
      case "modern":
        return "border-l-2 border-[var(--accent-color)] pl-4 py-1"
      case "minimal":
        return "pl-0 py-2"
      case "classic":
      default:
        return "pl-0 py-2"
    }
  }

  return (
    <div className="experience-block mb-[var(--block-spacing)]">
      <h2 className={`text-xl font-bold mb-3 ${getHeaderClass()}`}>경력</h2>

      <div className="experience-items space-y-4">
        {content.items.map((item, index) => (
          <div key={index} className={`experience-item ${getItemClass()}`}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
              <h3 className="text-lg font-semibold">{item.company}</h3>
              <div className="text-sm text-gray-600">
                {item.startDate && formatDate(item.startDate)} -{" "}
                {item.isCurrentPosition ? "현재" : item.endDate && formatDate(item.endDate)}
              </div>
            </div>

            <div className="text-base font-medium mb-2">{item.position}</div>

            {item.description && <p className="text-sm mb-2">{item.description}</p>}

            {item.achievements && item.achievements.length > 0 && (
              <ul className="list-disc list-inside text-sm space-y-1 ml-1">
                {item.achievements.map((achievement, i) => achievement && <li key={i}>{achievement}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

