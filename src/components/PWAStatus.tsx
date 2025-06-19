
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Wifi, WifiOff, RefreshCw, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

export function PWAStatus() {
  const { isInstallable, isInstalled, isOnline, updateAvailable, installApp, updateApp } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(true);

  if (isInstalled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* Connectivity Status */}
      <div className="flex justify-end">
        <Badge 
          variant={isOnline ? "default" : "destructive"}
          className={cn(
            "transition-all duration-300",
            isOnline ? "bg-green-500 hover:bg-green-600" : "bg-red-500"
          )}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 mr-1" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 mr-1" />
              Offline
            </>
          )}
        </Badge>
      </div>

      {/* Update Available */}
      {updateAvailable && showUpdatePrompt && (
        <Card className="w-80 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Atualização Disponível</h3>
                <p className="text-xs text-muted-foreground">
                  Uma nova versão do MuseTera está disponível.
                </p>
                <Button 
                  size="sm" 
                  onClick={updateApp}
                  className="w-full"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Atualizar Agora
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1"
                onClick={() => setShowUpdatePrompt(false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Install Prompt */}
      {isInstallable && showInstallPrompt && (
        <Card className="w-80 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Instalar MuseTera</h3>
                <p className="text-xs text-muted-foreground">
                  Instale o MuseTera para acesso rápido e uso offline.
                </p>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">✓ Acesso mais rápido</div>
                  <div className="text-xs text-muted-foreground">✓ Funciona offline</div>
                  <div className="text-xs text-muted-foreground">✓ Notificações push</div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={installApp}
                    className="flex-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Instalar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInstallPrompt(false)}
                  >
                    Agora não
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1"
                onClick={() => setShowInstallPrompt(false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
