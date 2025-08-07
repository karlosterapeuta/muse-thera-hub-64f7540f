import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';

export const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    let mounted = true;

    const initServiceWorker = async () => {
      if (!('serviceWorker' in navigator) || !mounted) {
        return;
      }

      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        if (!mounted) return;

        console.log('Service Worker registered successfully');
        
        // Check for updates every 5 minutes
        const updateInterval = setInterval(() => {
          if (mounted && registration) {
            registration.update();
          }
        }, 5 * 60 * 1000);

        // Listen for updates
        const handleUpdateFound = () => {
          const newWorker = registration.installing;
          if (newWorker && mounted) {
            const handleStateChange = () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller && mounted) {
                setShowUpdate(true);
              }
            };
            newWorker.addEventListener('statechange', handleStateChange);
            
            return () => {
              newWorker.removeEventListener('statechange', handleStateChange);
            };
          }
        };

        registration.addEventListener('updatefound', handleUpdateFound);

        // Check if there's a waiting service worker
        if (registration.waiting && mounted) {
          setShowUpdate(true);
        }

        return () => {
          clearInterval(updateInterval);
          registration.removeEventListener('updatefound', handleUpdateFound);
        };
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    // Delay initialization to ensure React is fully mounted
    const timeout = setTimeout(initServiceWorker, 1000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    
    // Simple reload with cache clearing
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).finally(() => {
        (window as any).location.reload();
      });
    } else {
      (window as any).location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    // Show again in 1 hour
    setTimeout(() => {
      setShowUpdate(true);
    }, 60 * 60 * 1000);
  };

  // Only show in production
  if (process.env.NODE_ENV !== 'production' || !showUpdate) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-sm">
      <Card className="border-primary/20 bg-background/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              Nova versão disponível
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleDismiss}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Uma nova versão do MuseTera está disponível com melhorias e correções.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full h-8 text-xs"
            size="sm"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              'Atualizar Agora'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};