import React, { useState, useEffect, createContext, useContext } from 'react';

interface SafeContextType {
  isReady: boolean;
}

const SafeContext = createContext<SafeContextType>({ isReady: false });

export const SafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure React is fully initialized before proceeding
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeContext.Provider value={{ isReady }}>
      {children}
    </SafeContext.Provider>
  );
};

export const useSafeContext = () => useContext(SafeContext);