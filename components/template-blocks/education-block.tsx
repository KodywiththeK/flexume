import type { ResumeBlock } from "@/types/resume"
import { formatDate } from "@/lib/utils"

interface EducationBlockProps {
  block: ResumeBlock
  templateType: "classic" | "modern" | "minimal"
}

export default function EducationBlock({ block, templateType }: EducationBlockProps) {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "graduated":
        return "졸업"
      case "attending":
        return "재학중"
      case "leave":
        return "휴학중"
      case "expected":
        return "졸업예정"
      default:
        return ""
    }
  }

  return (
    <div className="education-block mb-[var(--block-spacing)]">
      <h2 className={`text-xl font-bold mb-3 ${getHeaderClass()}`}>학력</h2>

      <div className="education-items space-y-4">
        {content.items.map((item, index) => (
          <div key={index} className="education-item">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
              <h3 className="text-lg font-semibold">{item.school}</h3>
              <div className="text-sm text-gray-600">
                {item.startDate && formatDate(item.startDate)} - {item.endDate && formatDate(item.endDate)}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 mb-1">
              <div className="text-base font-medium">{item.degree}</div>
              {item.field && <div className="text-base">{item.field}</div>}
              <div className="text-base text-gray-600">{getStatusText(item.status)}</div>
            </div>

            {item.gpa && (
              <div className="text-sm">
                <span className="font-medium">학점:</span> {item.gpa}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
