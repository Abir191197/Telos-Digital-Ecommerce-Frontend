import React from "react";
import { Check, MapPin, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: 1 | 2;
  onStepChange?: (step: 1 | 2) => void;
  canNavigateToStep2?: boolean;
}

export function StepIndicator({
  currentStep,
  onStepChange,
  canNavigateToStep2 = false,
}: StepIndicatorProps) {
  const steps = [
    {
      id: 1,
      label: "Delivery Address",
      desc: "Contact & Location in BD",
      icon: MapPin,
    },
    {
      id: 2,
      label: "Payment Method",
      desc: "COD, bKash, Nagad or Card",
      icon: CreditCard,
    },
  ];

  return (
    <div className="w-full mb-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {steps.map((step) => {
          const isCurrent = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isClickable = step.id === 1 || (step.id === 2 && canNavigateToStep2);
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepChange?.(step.id as 1 | 2)}
              className={cn(
                "relative flex items-center gap-3 p-3 sm:p-4 rounded-2xl border text-left transition-all",
                isCurrent &&
                  "border-amber-500 bg-amber-500/5 shadow-xs ring-1 ring-amber-500/30",
                isCompleted &&
                  "border-emerald-500/40 bg-emerald-500/5 text-foreground cursor-pointer",
                !isCurrent &&
                  !isCompleted &&
                  "border-border/70 bg-card text-muted-foreground opacity-75 cursor-not-allowed",
                isClickable && !isCurrent && "cursor-pointer hover:border-border"
              )}
            >
              {/* Step number / icon badge */}
              <div
                className={cn(
                  "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs sm:text-sm transition-colors",
                  isCompleted && "bg-emerald-500 text-white",
                  isCurrent && "bg-amber-500 text-white shadow-sm shadow-amber-500/20",
                  !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4" />}
              </div>

              {/* Step info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    Step {step.id}
                  </span>
                </div>
                <h4
                  className={cn(
                    "text-xs sm:text-sm font-bold truncate",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </h4>
                <p className="text-[11px] text-muted-foreground hidden sm:block truncate">
                  {step.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
