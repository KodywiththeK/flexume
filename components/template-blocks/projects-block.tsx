import type { ResumeBlock } from "@/types/resume"
import { formatDate } from "@/lib/utils"

interface ProjectsBlockProps {
  block: ResumeBlock
  templateType: "classic" | "modern" | "minimal"
}

export default function ProjectsBlock({ block, templateType }: ProjectsBlockProps) {
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
    <div className="projects-block mb-[var(--block-spacing)]">
      <h2 className={`text-xl font-bold mb-3 ${getHeaderClass()}`}>프로젝트</h2>

      <div className="projects-items space-y-4">
        {content.items.map((item, index) => (
          <div key={index} className="project-item">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <div className="text-sm text-gray-600">
                {item.startDate && formatDate(item.startDate)} - {item.endDate && formatDate(item.endDate)}
              </div>
            </div>

            {item.role && <div className="text-base font-medium mb-2">{item.role}</div>}

            {item.description && <p className="text-sm mb-2">{item.description}</p>}

            {item.skills && item.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {item.skills.map((skill, i) => (
                  <span key={i} className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {item.link && (
              <div className="text-sm">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-color)] hover:underline"
                >
                  {item.link}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
