import type { ResumeBlock } from "@/types/resume"

interface ProfileBlockProps {
  block: ResumeBlock
  templateType: "classic" | "modern" | "minimal"
}

export default function ProfileBlock({ block, templateType }: ProfileBlockProps) {
  const { content } = block

  if (!content) return null

  const { name, email, phone, links } = content

  // Template-specific styles
  const getHeaderClass = () => {
    switch (templateType) {
      case "modern":
        return "border-b-2 border-[var(--accent-color)] pb-2 mb-4"
      case "minimal":
        return "border-b border-gray-200 pb-2 mb-4"
      case "classic":
      default:
        return "border-b-2 border-gray-800 pb-2 mb-4"
    }
  }

  return (
    <div className="profile-block mb-[var(--block-spacing)]">
      <div className="profile-header">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>

        <div className="contact-info flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {email && (
            <div className="email">
              <span className="font-medium">이메일:</span> {email}
            </div>
          )}

          {phone && (
            <div className="phone">
              <span className="font-medium">연락처:</span> {phone}
            </div>
          )}

          {links &&
            links.length > 0 &&
            links.map(
              (link, index) =>
                link.label &&
                link.url && (
                  <div key={index} className="link">
                    <span className="font-medium">{link.label}:</span>{" "}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-color)] hover:underline"
                    >
                      {link.url}
                    </a>
                  </div>
                ),
            )}
        </div>
      </div>
    </div>
  )
}

