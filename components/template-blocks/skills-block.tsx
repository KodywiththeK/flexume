import type { ResumeBlock } from "@/types/resume"

interface SkillsBlockProps {
  block: ResumeBlock
  templateType: "classic" | "modern" | "minimal"
}

export default function SkillsBlock({ block, templateType }: SkillsBlockProps) {
  const { content } = block

  if (!content || !content.categories || content.categories.length === 0) return null

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

  const getSkillClass = () => {
    switch (templateType) {
      case "modern":
        return "bg-[var(--accent-color)] bg-opacity-10 text-[var(--accent-color)]"
      case "minimal":
        return "bg-gray-100 text-gray-800"
      case "classic":
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  return (
    <div className="skills-block mb-[var(--block-spacing)]">
      <h2 className={`text-xl font-bold mb-3 ${getHeaderClass()}`}>기술 스택</h2>

      <div className="skills-categories space-y-4">
        {content.categories.map((category, index) => (
          <div key={index} className="skill-category">
            <h3 className="text-base font-semibold mb-2">{category.name}</h3>

            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, i) => (
                <span key={i} className={`inline-block px-3 py-1 text-sm rounded-full ${getSkillClass()}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

