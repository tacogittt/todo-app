"use client"

import { cn } from "@/lib/utils"

interface WizardProgressProps {
  currentStep: number
  steps: { label: string; description: string }[]
}

export function WizardProgress({ currentStep, steps }: WizardProgressProps) {
  return (
    <div className="mb-8" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={steps.length} aria-label="ウィザード進捗">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col items-center flex-1",
              index <= currentStep ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2",
                index < currentStep
                  ? "bg-primary text-primary-foreground border-primary"
                  : index === currentStep
                  ? "border-primary"
                  : "border-muted"
              )}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span className="mt-2 text-sm font-medium">{step.label}</span>
            <span className="mt-1 text-xs text-muted-foreground text-center max-w-[120px]">{step.description}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
