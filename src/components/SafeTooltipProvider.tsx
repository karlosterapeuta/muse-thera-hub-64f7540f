import React, { Suspense } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSafeContext } from './SafeProvider';

interface SafeTooltipProviderProps {
  children: React.ReactNode;
}

export const SafeTooltipProvider: React.FC<SafeTooltipProviderProps> = ({ children }) => {
  const { isReady } = useSafeContext();

  if (!isReady) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <TooltipProvider delayDuration={300}>
        {children}
      </TooltipProvider>
    </Suspense>
  );
};