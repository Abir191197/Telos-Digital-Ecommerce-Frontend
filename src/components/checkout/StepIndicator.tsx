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
      label: "Shipping & Contact",
      sub: "Address in Bangladesh",
    },
    {
      id: 2,
      label: "Payment & Confirmation",
      sub: "COD, bKash or Card",
    },
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between max-w-xl mx-auto px-2">
        {steps.map((step, idx) => {
          const isCurrent = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isClickable = step.id === 1 || (step.id === 2 && canNavigateToStep2);

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepChange?.(step.id as 1 | 2)}
                className={cn(
                  "flex items-center gap-3 text-left transition-all",
                  isClickable ? "cursor-pointer group" : "cursor-not-allowed opacity-60"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all duration-300",
                    isCompleted && "bg-emerald-500 text-white shadow-xs",
                    isCurrent && "bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/20 ring-4 ring-amber-500/15",
                    !isCurrent && !isCompleted && "bg-muted text-muted-foreground border border-border/80"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : step.id}
                </div>

                <div>
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-bold tracking-tight transition-colors",
                      isCurrent ? "text-foreground" : "text-muted-foreground",
                      isClickable && "group-hover:text-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground/80 hidden sm:block">
                    {step.sub}
                  </p>
                </div>
              </button>

              {/* Connecting Divider */}
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-4 sm:mx-6 h-0.5 bg-border/80 relative overflow-hidden rounded-full">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-500",
                      currentStep > 1 ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
