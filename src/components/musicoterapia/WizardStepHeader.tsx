import React from 'react';

interface WizardStepHeaderProps {
  icon: React.ElementType;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  totalFields: number;
  requiredCount: number;
  filledCount: number;
}

export function WizardStepHeader({
  icon: Icon,
  currentStep,
  totalSteps,
  title,
  description,
  totalFields,
  requiredCount,
  filledCount,
}: WizardStepHeaderProps) {
  const completion = totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 0;

  return (
    <header className="space-y-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold">
        <Icon className="h-3.5 w-3.5" />
        Etapa {String(currentStep + 1).padStart(2, '0')} de {String(totalSteps).padStart(2, '0')}
      </div>

      <h2
        className="text-3xl sm:text-4xl text-[#f0d78c] leading-tight"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        {title}
      </h2>

      <p className="text-sm text-gray-500 font-light">{description}</p>

      {totalFields > 0 && (
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-gray-500 font-medium">
            <span>{totalFields} campos</span>
            <span className="text-white/10">·</span>
            <span>{requiredCount} obrigatórios</span>
            <span className="text-white/10">·</span>
            <span className="text-[#f0d78c]">{filledCount} preenchidos</span>
          </div>
          <div className="flex-1 h-[2px] bg-white/5 overflow-hidden rounded-full max-w-[120px]">
            <div
              className="h-full bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
