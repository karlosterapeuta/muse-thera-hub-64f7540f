import React from 'react';
import { Check } from 'lucide-react';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  fields: string[];
}

interface WizardStepperProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export function WizardStepper({ steps, currentStep, onStepClick }: WizardStepperProps) {
  return (
    <>
      {/* Desktop: vertical sidebar */}
      <nav className="hidden lg:block lg:sticky lg:top-6 self-start">
        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4 pl-1">
          Etapas
        </div>
        <ol className="relative space-y-1 border-l border-white/5 pl-0">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const Icon = step.icon;
            const cleanTitle = step.title.replace(/^\d+\.\s*/, '');
            return (
              <li key={step.id} className="relative">
                <button
                  type="button"
                  onClick={() => onStepClick(index)}
                  className={`group w-full text-left flex items-start gap-3 pl-4 pr-3 py-2.5 rounded-xl transition-all
                    ${isCurrent
                      ? 'bg-[#c9a84c]/10 border border-[#c9a84c]/30'
                      : 'border border-transparent hover:bg-white/[0.03]'
                    }`}
                >
                  <span
                    className={`mt-0.5 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all
                      ${isCurrent
                        ? 'bg-[#c9a84c] text-[#0d0d0d] shadow-[0_0_16px_rgba(201,168,76,0.4)]'
                        : isCompleted
                          ? 'bg-[#1a1a1a] border border-[#c9a84c]/60 text-[#f0d78c]'
                          : 'bg-[#1a1a1a] border border-white/15 text-white/50 group-hover:border-[#c9a84c]/40'
                      }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3" /> : String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-[11px] font-bold uppercase tracking-wider truncate
                        ${isCurrent ? 'text-[#c9a84c]' : isCompleted ? 'text-[#f0d78c]/70' : 'text-gray-400'}`}
                    >
                      {cleanTitle}
                    </div>
                    {isCurrent && (
                      <div className="text-[10px] text-gray-500 mt-0.5 font-light line-clamp-1">
                        {step.description}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile / tablet: minimal horizontal dots */}
      <nav className="lg:hidden">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onStepClick(index)}
                aria-label={step.title}
                className={`flex-shrink-0 transition-all rounded-full
                  ${isCurrent
                    ? 'h-2 w-8 bg-[#c9a84c] shadow-[0_0_12px_rgba(201,168,76,0.5)]'
                    : isCompleted
                      ? 'h-2 w-2 bg-[#c9a84c]/60'
                      : 'h-2 w-2 bg-white/15 hover:bg-white/30'
                  }`}
              />
            );
          })}
        </div>
        <div className="mt-3 text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold">
            Etapa {String(currentStep + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </div>
        </div>
      </nav>
    </>
  );
}
