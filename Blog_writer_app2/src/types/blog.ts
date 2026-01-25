// src/types/blog.ts
export type PersonaType = "teacher" | "expert" | "journalist"
export type ToneType = "casual" | "professional" | "academic"
export type ProjectStatus = "outline" | "writing" | "reviewing" | "published"
export type HeadingType = "H2" | "H3"

export interface BlogProject {
  id: string
  title: string
  theme: string
  persona: PersonaType
  tone: ToneType
  status: ProjectStatus
  outlineItems: OutlineItem[]
  sections: BlogSection[]
  createdAt: Date
  updatedAt: Date
}

export interface OutlineItem {
  id: string
  projectId: string
  heading: HeadingType
  title: string
  order: number
}

export interface BlogSection {
  id: string
  projectId: string
  outlineItemId?: string
  sectionTitle: string
  content: string
  wordCount: number
}

export interface PersonaOption {
  id: PersonaType
  label: string
  description: string
  icon: string
}

export interface StreamMessage {
  type: "start" | "content" | "done" | "error"
  projectId?: string
  delta?: string
  error?: string
}
