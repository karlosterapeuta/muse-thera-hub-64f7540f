import React, { Suspense } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

interface SafeTooltipProviderProps {
  children: React.ReactNode;
}

export const SafeTooltipProvider: React.FC<SafeTooltipProviderProps> = ({ children }) => {
  try {
    return (
      <Suspense fallback={<>{children}</>}>
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
      </Suspense>
    );
  } catch (error) {
    console.warn('TooltipProvider failed, using fallback:', error);
    return <>{children}</>;
  }
};