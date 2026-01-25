"use client"

import { useState } from "react"
import { WizardProgress } from "@/components/wizard/WizardProgress"

const WIZARD_STEPS = [
  { label: "テーマ設定", description: "テーマとペルソナを決める" },
  { label: "構成設計", description: "目次を作成する" },
  { label: "執筆", description: "セクションを執筆する" },
  { label: "公開", description: "校正して公開する" },
]

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="max-w-4xl mx-auto">
      <WizardProgress currentStep={currentStep} steps={WIZARD_STEPS} />

      <div className="mt-8">
        {currentStep === 0 && <div>Step 1: テーマ設定</div>}
        {currentStep === 1 && <div>Step 2: 構成設計</div>}
        {currentStep === 2 && <div>Step 3: 執筆</div>}
        {currentStep === 3 && <div>Step 4: 公開</div>}
      </div>
    </div>
  )
}
