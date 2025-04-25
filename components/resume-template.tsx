"use client"

import type React from "react"

import { useResumeStore } from "@/store/resume-store"
import type { ResumeBlock } from "@/types/resume"
import ProfileBlock from "./template-blocks/profile-block"
import SummaryBlock from "./template-blocks/summary-block"
import ExperienceBlock from "./template-blocks/experience-block"
import EducationBlock from "./template-blocks/education-block"
import ProjectsBlock from "./template-blocks/projects-block"
import SkillsBlock from "./template-blocks/skills-block"
import CertificationsBlock from "./template-blocks/certifications-block"
import AwardsBlock from "./template-blocks/awards-block"
import EtcBlock from "./template-blocks/etc-block"

export default function ResumeTemplate() {
  const { getCurrentResume, getCurrentVersion, isEditing, draftVersion } = useResumeStore()
  const currentResume = getCurrentResume()
  const currentVersion = getCurrentVersion()
  const previewVersion = isEditing ? draftVersion : currentVersion

  if (!currentResume || !previewVersion) {
    return <div className="p-8">이력서를 선택해주세요.</div>
  }

  const { templateType, style } = currentResume

  // Apply template styles
  const templateStyles = {
    fontFamily: style?.fontFamily || "noto-sans",
    fontSize: style?.fontSize || "14px",
    lineHeight: style?.lineHeight || 1.5,
    color: "#333",
    "--accent-color": style?.accentColor || "#3b82f6",
    "--block-spacing": style?.blockSpacing || "24px",
  } as React.CSSProperties

  // Get template-specific class names
  const getTemplateClasses = () => {
    switch (templateType) {
      case "modern":
        return "modern-template"
      case "minimal":
        return "minimal-template"
      case "classic":
      default:
        return "classic-template"
    }
  }

  // Render a block based on its type
  const renderBlock = (block: ResumeBlock) => {
    if (block.isHidden) return null

    switch (block.type) {
      case "profile":
        return <ProfileBlock key={block.id} block={block} templateType={templateType} />
      case "summary":
        return <SummaryBlock key={block.id} block={block} templateType={templateType} />
      case "experience":
        return <ExperienceBlock key={block.id} block={block} templateType={templateType} />
      case "education":
        return <EducationBlock key={block.id} block={block} templateType={templateType} />
      case "projects":
        return <ProjectsBlock key={block.id} block={block} templateType={templateType} />
      case "skills":
        return <SkillsBlock key={block.id} block={block} templateType={templateType} />
      case "certifications":
        return <CertificationsBlock key={block.id} block={block} templateType={templateType} />
      case "awards":
        return <AwardsBlock key={block.id} block={block} templateType={templateType} />
      case "etc":
        return <EtcBlock key={block.id} block={block} templateType={templateType} />
      default:
        return null
    }
  }

  return (
    <div className={`resume-template ${getTemplateClasses()}`} style={templateStyles}>
      <div className="p-12 md:p-16">{previewVersion.blocks.map(renderBlock)}</div>
    </div>
  )
}
