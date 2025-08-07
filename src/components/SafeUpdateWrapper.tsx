import React, { Suspense, lazy } from 'react';

// Lazy load the update notification to prevent blocking the main app
const LazyUpdateNotification = lazy(() => 
  import('./SafeUpdateNotification').then(module => ({
    default: module.UpdateNotification
  }))
);

export const SafeUpdateWrapper = () => {
  return (
    <Suspense fallback={null}>
      <LazyUpdateNotification />
    </Suspense>
  );
};