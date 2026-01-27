"use client"

import { useState } from "react"
import { WizardProgress } from "@/components/wizard/WizardProgress"
import { ThemeStep } from "@/components/wizard/steps/ThemeStep"
import { OutlineStep } from "@/components/wizard/steps/OutlineStep"
import { WritingStep } from "@/components/wizard/steps/WritingStep"
import { ReviewStep } from "@/components/wizard/steps/ReviewStep"
import { PersonaType, ToneType, OutlineItem } from "@/types/blog"
import { logger } from "@/lib/logger"

const WIZARD_STEPS = [
  { label: "テーマ設定", description: "テーマとペルソナを決める" },
  { label: "構成設計", description: "目次を作成する" },
  { label: "執筆", description: "セクションを執筆する" },
  { label: "プレビュー", description: "確認してエクスポート" },
]

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [outlineItems, setOutlineItems] = useState<OutlineItem[]>([])

  const handleThemeComplete = async (data: {
    theme: string
    persona: PersonaType
    tone: ToneType
  }) => {
    logger.debug("=== Layer 1: handleThemeComplete called ===", data)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      logger.debug("=== Layer 2: API response status ===", res.status)

      if (!res.ok) {
        const errorText = await res.text()
        logger.error("=== API Error ===", errorText)
        alert(`エラー: ${errorText}`)
        return
      }

      const project = await res.json()
      logger.debug("=== Layer 3: Project created ===", project)
      setProjectId(project.id)
      setCurrentStep(1)
    } catch (error) {
      logger.error("=== Fetch Error ===", error)
      alert(`通信エラー: ${error}`)
    }
  }

  const handleOutlineComplete = (items: OutlineItem[]) => {
    setOutlineItems(items)
    setCurrentStep(2)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <WizardProgress currentStep={currentStep} steps={WIZARD_STEPS} />

      <div className="mt-8">
        {currentStep === 0 && <ThemeStep onNext={handleThemeComplete} />}
        {currentStep === 1 && projectId && (
          <OutlineStep
            projectId={projectId}
            onNext={handleOutlineComplete}
            onBack={() => setCurrentStep(0)}
          />
        )}
        {currentStep === 2 && projectId && (
          <WritingStep
            projectId={projectId}
            outlineItems={outlineItems}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && projectId && (
          <ReviewStep projectId={projectId} onBack={() => setCurrentStep(2)} />
        )}
      </div>
    </div>
  )
}
