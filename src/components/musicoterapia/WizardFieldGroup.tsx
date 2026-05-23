import React from 'react';

interface WizardFieldGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function WizardFieldGroup({ title, description, children }: WizardFieldGroupProps) {
  return (
    <section className="space-y-4">
      {title && (
        <header className="space-y-1 border-b border-white/5 pb-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold">
            {title}
          </div>
          {description && (
            <p className="text-xs text-gray-500 font-light">{description}</p>
          )}
        </header>
      )}
      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
}
