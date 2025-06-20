
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Smartphone, Monitor, X, Wifi, WifiOff, Star, Zap, Shield } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

export function PWAInstallPrompt() {
  const { 
    isInstallable, 
    isInstalled, 
    isOnline, 
    showInstallPrompt,
    isMobile, 
    isDesktop,
    installApp, 
    dismissInstallPrompt 
  } = usePWA();

  if (isInstalled || !isInstallable || !showInstallPrompt) return null;

  const deviceType = isMobile ? 'celular' : 'computador';
  const DeviceIcon = isMobile ? Smartphone : Monitor;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in" />
      
      {/* Popup */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl animate-scale-in border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
          <CardContent className="p-0">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <DeviceIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Instale o MuseTera</h2>
                      <p className="text-purple-100 text-sm">no seu {deviceType}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={dismissInstallPrompt}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-purple-100 text-sm leading-relaxed">
                  Acesse rapidamente suas ferramentas de musicoterapia direto da área de trabalho
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-center">
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
                      Conectado
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 mr-1" />
                      Offline
                    </>
                  )}
                </Badge>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-green-800 dark:text-green-200">Acesso instantâneo</p>
                    <p className="text-xs text-green-600 dark:text-green-400">Sem necessidade de abrir navegador</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-blue-800 dark:text-blue-200">Funciona offline</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Continue trabalhando sem internet</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-purple-800 dark:text-purple-200">Ícone na área de trabalho</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">Como um aplicativo nativo</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={installApp}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Instalar no {deviceType}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={dismissInstallPrompt}
                  className="w-full border-2 border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Agora não
                </Button>
              </div>

              {/* Footer note */}
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Este popup aparecerá novamente em 24 horas se não for instalado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
