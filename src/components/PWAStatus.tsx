
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

export function PWAStatus() {
  const { isOnline, updateAvailable, updateApp } = usePWA();
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 z-40 space-y-2">
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
    </div>
  );
}
