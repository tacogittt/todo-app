import { Check } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export default function StepProgress({
  currentStep,
  totalSteps,
  stepLabels = [],
}: StepProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full space-y-4">
      {/* Progress bar */}
      <div className="relative h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div key={step} className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step < currentStep
                  ? "bg-primary text-primary-foreground"
                  : step === currentStep
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{step}</span>
              )}
            </div>
            {stepLabels[step - 1] && (
              <span
                className={`text-xs font-medium text-center transition-colors ${
                  step <= currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {stepLabels[step - 1]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
