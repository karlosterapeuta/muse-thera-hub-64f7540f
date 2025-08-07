import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';

export const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully');
          
          // Check for updates every 5 minutes
          setInterval(() => {
            registration.update();
          }, 5 * 60 * 1000);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  setShowUpdate(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setShowUpdate(true);
        }
      });

      // Check if there's a waiting service worker
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setShowUpdate(true);
        }
      });
    }

    // Check for cache issues by comparing timestamps
    const lastUpdate = localStorage.getItem('app_last_update');
    const currentTime = Date.now();
    
    if (!lastUpdate || (currentTime - parseInt(lastUpdate)) > 24 * 60 * 60 * 1000) {
      // Force refresh if more than 24 hours since last update
      localStorage.setItem('app_last_update', currentTime.toString());
      if (lastUpdate) {
        window.location.reload();
      }
    }
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        if (registration.waiting) {
          // Tell the waiting service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Wait a bit before reloading to allow service worker to take control
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          // No waiting worker, just reload after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      } else {
        // Fallback: hard reload with delay
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error('Error updating app:', error);
      // Fallback to simple reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    // Show again in 1 hour
    setTimeout(() => {
      setShowUpdate(true);
    }, 60 * 60 * 1000);
  };

  if (!showUpdate) {
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