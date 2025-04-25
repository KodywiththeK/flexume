import type { ProfileData, ResumeBlock } from "@/types/resume"
import { Heading1 } from "@/components/ui/heading1"
import { Heading3 } from "@/components/ui/heading3"

interface ProfileBlockProps {
  block: ResumeBlock
  templateType: "classic" | "modern" | "minimal"
}

export default function ProfileBlock({ block, templateType }: ProfileBlockProps) {
  const { content } = block

  if (!content) return null

  const { name, email, phone, links, birth, address, image } = content as ProfileData

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
    <div className="w-full flex flex-col gap-6 mb-8">
      <Heading1>{name}</Heading1>
      <div className="flex gap-8">
        <div className="w-32 aspect-[3/4] rounded overflow-hidden">
          <img src={image} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1.5 text-sm">
            <Heading3 className="text-lime-600">Personal Info.</Heading3>
            <ul className="flex flex-col list-disc list-inside font-normal text-gray-800 gap-1">
              {birth && (
                <li className="birth space-x-2">
                  <span className="font-bold">Birth.</span>
                  <span>{birth.replaceAll("-", ". ")}</span>
                </li>
              )}
              {address && (
                <li className="address space-x-2">
                  <span className="font-bold">Address.</span>
                  <span>{address}</span>
                </li>
              )}
              {(email || phone) && (
                <li className="contact space-x-2">
                  <span className="font-bold">Contact.</span>
                  <span className="space-x-1">
                    {phone && <span>{phone}</span>}
                    {email && phone && <span>{"|"}</span>}
                    {email && <span>{email}</span>}
                  </span>
                </li>
              )}
            </ul>
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <Heading3 className="text-lime-600">Channels.</Heading3>
            <ul className="flex flex-col list-disc list-inside font-normal gap-1">
              {links &&
                links.length > 0 &&
                links.map(
                  ({ label, url }, index) =>
                    label &&
                    url && (
                      <li key={index} className="link space-x-2">
                        <span className="font-bold">{label}.</span>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
                          {url}
                        </a>
                      </li>
                    ),
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
