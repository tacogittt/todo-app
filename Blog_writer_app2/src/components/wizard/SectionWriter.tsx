"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Sparkles } from "lucide-react"

interface SectionWriterProps {
  projectId: string
  sectionTitle: string
  outlineItemId: string
  onComplete: (content: string) => void
}

export function SectionWriter({
  projectId,
  sectionTitle,
  outlineItemId,
  onComplete,
}: SectionWriterProps) {
  const [content, setContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setContent("")

    try {
      const response = await fetch(`/api/projects/${projectId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionTitle, outlineItemId }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) return

      let accumulatedContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6))
            if (data.type === "content") {
              accumulatedContent += data.delta
              setContent(accumulatedContent)
            } else if (data.type === "done") {
              onComplete(accumulatedContent)
            }
          }
        }
      }
    } catch (error) {
      console.error("Generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{sectionTitle}</CardTitle>
        <Button onClick={handleGenerate} disabled={isGenerating} size="sm">
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          {content ? "再生成" : "生成"}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] border rounded-md p-4">
          {content || (
            <p className="text-muted-foreground">
              「生成」ボタンをクリックしてセクションを執筆します
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
