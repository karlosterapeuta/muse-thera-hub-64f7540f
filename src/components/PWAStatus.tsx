
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, X, Download } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

export function PWAStatus() {
  const { 
    isOnline, 
    updateAvailable, 
    updateApp, 
    isInstallable, 
    isInstalled, 
    installApp,
    browserInfo 
  } = usePWA();
  
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(true);
  const [showQuickInstall, setShowQuickInstall] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Controlar visibilidade com fade-in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-40 space-y-2 transition-all duration-500",
      isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    )}>
      {/* Connectivity Status */}
      <div className="flex justify-end">
        <Badge 
          variant={isOnline ? "default" : "destructive"}
          className={cn(
            "transition-all duration-300 shadow-lg",
            isOnline 
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
              : "bg-gradient-to-r from-red-500 to-rose-600 animate-pulse"
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

      {/* Quick Install (only show on mobile) */}
      {!isInstalled && isInstallable && showQuickInstall && browserInfo.isMobile && (
        <Card className="w-72 shadow-xl border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Instalar MuseTera</h4>
                    <p className="text-xs text-muted-foreground">
                      Acesso instantâneo no celular
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={installApp}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-3 h-3 mr-2" />
                  Instalar Agora
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1 hover:bg-white/20 rounded-full"
                onClick={() => setShowQuickInstall(false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Update Available */}
      {updateAvailable && showUpdatePrompt && (
        <Card className="w-80 shadow-xl border-0 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/50 dark:to-cyan-950/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Nova Atualização! ✨</h3>
                    <p className="text-xs text-muted-foreground">
                      Recursos novos e melhorias disponíveis
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={updateApp}
                  className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Atualizar Agora
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1 hover:bg-white/20 rounded-full"
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
