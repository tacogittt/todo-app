"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SectionWriter } from "@/components/wizard/SectionWriter"
import { OutlineItem } from "@/types/blog"

interface WritingStepProps {
  projectId: string
  outlineItems: OutlineItem[]
  onNext: () => void
  onBack: () => void
}

export function WritingStep({
  projectId,
  outlineItems,
  onNext,
  onBack,
}: WritingStepProps) {
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  )

  const handleSectionComplete = (itemId: string) => {
    setCompletedSections((prev) => new Set([...prev, itemId]))
  }

  const allCompleted = completedSections.size === outlineItems.length

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {outlineItems.map((item) => (
          <SectionWriter
            key={item.id}
            projectId={projectId}
            sectionTitle={item.title}
            outlineItemId={item.id}
            onComplete={() => handleSectionComplete(item.id)}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          戻る
        </Button>
        <Button onClick={onNext} disabled={!allCompleted}>
          次へ: 校正する
        </Button>
      </div>
    </div>
  )
}
