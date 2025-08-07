import React from 'react';

interface SafeTooltipProviderProps {
  children: React.ReactNode;
}

export const SafeTooltipProvider: React.FC<SafeTooltipProviderProps> = ({ children }) => {
  // Temporarily disable TooltipProvider to prevent React initialization issues
  return <>{children}</>;
};