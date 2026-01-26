"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArticlePreview } from "@/components/wizard/ArticlePreview"
import { BlogProject } from "@/types/blog"
import { Download, Loader2 } from "lucide-react"

interface ReviewStepProps {
  projectId: string
  onBack: () => void
}

export function ReviewStep({ projectId, onBack }: ReviewStepProps) {
  const [project, setProject] = useState<BlogProject | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`)
        if (!res.ok) {
          throw new Error("Failed to fetch project")
        }
        const data = await res.json()
        setProject(data)
      } catch (error) {
        console.error("Failed to load project:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProject()
  }, [projectId])

  const handleExport = () => {
    if (!project) return

    const markdown = project.sections
      .map((s) => `## ${s.sectionTitle}\n\n${s.content}`)
      .join("\n\n")

    const fullMarkdown = `# ${project.title}\n\n${markdown}`

    const blob = new Blob([fullMarkdown], {
      type: "text/markdown;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.title}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">プロジェクトが見つかりませんでした</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">プレビュー</h2>
        <div className="text-sm text-muted-foreground">
          合計文字数: {project.sections.reduce((sum, s) => sum + s.wordCount, 0)}文字
        </div>
      </div>

      <ArticlePreview title={project.title} sections={project.sections} />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          戻る
        </Button>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          マークダウンでエクスポート
        </Button>
      </div>
    </div>
  )
}
