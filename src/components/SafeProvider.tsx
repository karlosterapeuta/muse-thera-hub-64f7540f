import React, { createContext, useContext } from 'react';

interface SafeContextType {
  isReady: boolean;
}

const SafeContext = createContext<SafeContextType>({ isReady: false });

// Simple provider that doesn't use hooks during initialization
export const SafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always consider ready since we're handling initialization in main.tsx
  const contextValue = { isReady: true };
  
  return (
    <SafeContext.Provider value={contextValue}>
      {children}
    </SafeContext.Provider>
  );
};

export const useSafeContext = () => {
  const context = useContext(SafeContext);
  return context || { isReady: true };
};