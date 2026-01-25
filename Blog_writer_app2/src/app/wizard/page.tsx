"use client"

import { useState } from "react"
import { WizardProgress } from "@/components/wizard/WizardProgress"
import { ThemeStep } from "@/components/wizard/steps/ThemeStep"
import { OutlineStep } from "@/components/wizard/steps/OutlineStep"
import { WritingStep } from "@/components/wizard/steps/WritingStep"
import { PersonaType, ToneType, OutlineItem } from "@/types/blog"

const WIZARD_STEPS = [
  { label: "テーマ設定", description: "テーマとペルソナを決める" },
  { label: "構成設計", description: "目次を作成する" },
  { label: "執筆", description: "セクションを執筆する" },
  { label: "公開", description: "校正して公開する" },
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
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const project = await res.json()
    setProjectId(project.id)
    setCurrentStep(1)
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
        {currentStep === 3 && <div>Step 4: 公開</div>}
      </div>
    </div>
  )
}
