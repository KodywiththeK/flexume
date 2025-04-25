"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { getAllTemplates } from "@/lib/resume-templates"
import type { ResumeTemplate } from "@/types/notion-resume"

interface TemplateSelectorProps {
  selectedTemplate: string
  onSelectTemplate: (templateId: string) => void
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const templates = getAllTemplates()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">템플릿 선택</h2>
      <p className="text-sm text-gray-500 mb-4">
        이력서에 적용할 템플릿을 선택하세요. 템플릿은 전체 이력서의 스타일을 결정합니다.
      </p>

      <RadioGroup
        value={selectedTemplate}
        onValueChange={onSelectTemplate}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} isSelected={selectedTemplate === template.id} />
        ))}
      </RadioGroup>
    </div>
  )
}

interface TemplateCardProps {
  template: ResumeTemplate
  isSelected: boolean
}

function TemplateCard({ template, isSelected }: TemplateCardProps) {
  return (
    <div>
      <RadioGroupItem value={template.id} id={`template-${template.id}`} className="peer sr-only" />
      <Label
        htmlFor={`template-${template.id}`}
        className={`
          flex flex-col items-center justify-between rounded-md border-2 
          border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground 
          peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary
          h-full cursor-pointer
        `}
      >
        <div className="mb-2 text-center">{template.name}</div>

        {/* 템플릿 미리보기 */}
        <div
          className="w-full h-32 rounded-md mb-2 p-2"
          style={{ backgroundColor: template.globalStyles.backgroundColor }}
        >
          <div
            className="w-full h-6 mb-2 rounded"
            style={{ backgroundColor: template.globalStyles.accentColor, opacity: 0.2 }}
          ></div>
          <div className="flex gap-2">
            <div
              className="w-1/3 h-20 rounded"
              style={{ backgroundColor: template.globalStyles.accentColor, opacity: 0.1 }}
            ></div>
            <div
              className="w-2/3 h-20 rounded"
              style={{ backgroundColor: template.globalStyles.accentColor, opacity: 0.05 }}
            ></div>
          </div>
        </div>

        <div className="text-sm text-center text-muted-foreground">{template.description}</div>
      </Label>
    </div>
  )
}
