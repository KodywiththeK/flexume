export type BlockType =
  | "profile"
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "awards"
  | "etc"

export type BlockStyle = {
  fontSize?: string
  fontColor?: string
  highlight?: boolean
  marginBottom?: string
}

export type ResumeBlock = {
  id: string
  type: BlockType
  isHidden: boolean
  content: any
  style?: BlockStyle
}

export type ResumeVersion = {
  versionId: string
  name: string
  memo?: string
  tags?: string[]
  blocks: ResumeBlock[]
  lastEditedAt: string
}

export type Resume = {
  id: string
  title: string
  templateType: "classic" | "modern" | "minimal"
  createdAt: string
  updatedAt: string
  versions: ResumeVersion[]
  style?: {
    fontFamily?: string
    fontSize?: string
    lineHeight?: number
    accentColor?: string
    blockSpacing?: string
  }
}

