"use client";

import { usePathname } from "next/navigation";
import { Check, ShoppingCart, Truck, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "cart",
    name: "سبد خرید",
    description: "بررسی محصولات",
    path: "/checkout/cart",
    icon: ShoppingCart,
  },
  {
    id: "shipping",
    name: "حمل و نقل",
    description: "اطلاعات ارسال",
    path: "/checkout/shipping",
    icon: Truck,
  },
  {
    id: "payment",
    name: "پرداخت",
    description: "تکمیل خرید",
    path: "/checkout/payment",
    icon: CreditCard,
  },
];

export default function Steps() {
  const pathname = usePathname();

  const getCurrentStepIndex = () => {
    const currentStep = steps.findIndex((step) => step.path === pathname);
    return currentStep !== -1 ? currentStep : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="w-full py-8 max-w-5xl mx-auto">
      <div className="relative">
        {/* Background Progress Bar */}
        <div className="bg-muted/50 absolute top-8 right-0 left-0 mx-8 h-2 rounded-full shadow-inner">
          <div
            className="from-brand-primary via-brand-primary/80 to-brand-primary relative h-full overflow-hidden rounded-full bg-gradient-to-r transition-all duration-1000 ease-out"
            style={{
              width: `${currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%`,
            }}
          ></div>
        </div>

        {/* Steps */}
        <nav aria-label="Progress" className="relative">
          <ul className="flex items-center justify-between">
            {steps.map((step, stepIndex) => {
              const isComplete = stepIndex < currentStepIndex;
              const isCurrent = stepIndex === currentStepIndex;
              const isUpcoming = stepIndex > currentStepIndex;
              const Icon = step.icon;

              return (
                <li
                  key={step.id}
                  className="relative flex cursor-pointer flex-col items-center"
                >
                  {/* Step Circle with Glow Effect */}
                  <div className="relative">
                    {/* Glow Effect for Current Step */}
                    {isCurrent && (
                      <div className="bg-brand-primary/30 absolute inset-0 scale-150 animate-pulse rounded-full blur-lg" />
                    )}

                    {/* Main Circle */}
                    <div
                      className={cn(
                        "border-brand-primary-focus bg-secondary text-brand-primary relative flex size-16 transform items-center justify-center rounded-full border-2 shadow-lg transition-all duration-500 ease-in-out hover:scale-105",
                        {
                          // Completed State
                          "bg-brand-primary text-white": isComplete,
                          // Current State
                          "": isCurrent,
                          // Upcoming State
                          "": isUpcoming,
                        },
                      )}
                    >
                      {/* Icon or Check */}
                      <div className="relative">
                        {isComplete ? (
                          <Check className="animate-in zoom-in-50 h-6 w-6 duration-300" />
                        ) : (
                          <Icon
                            className={cn(
                              "h-6 w-6 transition-transform duration-300",
                              isCurrent && "animate-pulse",
                            )}
                          />
                        )}
                      </div>

                      {/* Ripple Effect for Current Step */}
                      {isCurrent && (
                        <div className="border-brand-primary absolute inset-0 animate-ping rounded-full border-2 opacity-75" />
                      )}
                      {/* Step Number Badge */}
                      <div
                        className={cn(
                          "absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                          {
                            "bg-brand-primary-focus text-primary-foreground scale-100":
                              isComplete || isCurrent,
                            "bg-muted text-muted-foreground scale-90":
                              isUpcoming,
                          },
                        )}
                      >
                        {stepIndex + 1}
                      </div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="mt-4 max-w-24 text-center transition-all duration-300">
                    <h3
                      className={cn(
                        "text-sm font-semibold transition-colors duration-300",
                        {
                          "text-primary": isComplete || isCurrent,
                          "text-muted-foreground": isUpcoming,
                        },
                      )}
                    >
                      {step.name}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 text-xs transition-all duration-300",
                        {
                          "text-primary/70 opacity-100":
                            isComplete || isCurrent,
                          "text-muted-foreground/60 opacity-70": isUpcoming,
                        },
                      )}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  {isCurrent && (
                    <div className="absolute -bottom-2">
                      <div className="from-brand-primary/50 via-brand-primary to-brand-primary/50 h-1 w-12 animate-pulse rounded-full bg-gradient-to-r" />
                    </div>
                  )}

                  {/* Success Confetti Effect */}
                  {isComplete && (
                    <div className="pointer-events-none absolute inset-0">
                      {/* Sparkle Effect */}
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "to-brand-primary/70 from-brand-primary-focus/70 absolute size-1 animate-ping rounded-full bg-gradient-to-r",
                            i === 0 && "animation-delay-100 top-0 left-2",
                            i === 1 && "animation-delay-200 top-2 right-1",
                            i === 2 && "animation-delay-300 bottom-3 left-1",
                            i === 3 && "animation-delay-100 top-1 left-0",
                            i === 4 && "animation-delay-200 right-2 bottom-2",
                            i === 5 && "animation-delay-300 top-3 right-0",
                          )}
                          style={{
                            animationDelay: `${i * 150}ms`,
                            animationDuration: "2s",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Progress Percentage */}
        <div className="mt-6 flex justify-center">
          <div className="bg-muted/50 rounded-full border px-4 py-2 backdrop-blur-sm">
            <span className="text-muted-foreground text-sm font-medium">
              پیشرفت:{" "}
              {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
