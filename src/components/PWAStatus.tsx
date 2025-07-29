
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Download, RefreshCw, Smartphone, Wifi, WifiOff, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Componente que exibe o status do PWA e gerencia atualizações
 * - Mostra se o app está instalado ou disponível para instalação
 * - Gerencia atualizações do service worker
 * - Indica status de conectividade
 * - Ciclo de vida completo do PWA
 */
export function PWAStatus() {
  const { 
    isInstalled, 
    isInstallable, 
    isOnline, 
    updateAvailable, 
    browserInfo,
    installApp, 
    updateApp 
  } = usePWA();

  const [showStatus, setShowStatus] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(true);
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const [installationStep, setInstallationStep] = useState<'idle' | 'installing' | 'success' | 'failed'>('idle');
  const [isVisible, setIsVisible] = useState(false);

  // Controlar visibilidade com fade-in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide status after 5 seconds unless there's an update or installation available
  useEffect(() => {
    if (updateAvailable || isInstallable) {
      setShowStatus(true);
    } else {
      const timer = setTimeout(() => setShowStatus(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [updateAvailable, isInstallable]);

  const handleInstall = async () => {
    setInstallationStep('installing');
    
    try {
      const success = await installApp();
      
      if (success) {
        setInstallationStep('success');
        toast.success('MuseTera instalado com sucesso!', {
          description: 'O aplicativo agora está disponível na sua tela inicial.'
        });
        setTimeout(() => {
          setShowInstallPrompt(false);
          setInstallationStep('idle');
        }, 3000);
      } else {
        setInstallationStep('failed');
        toast.error('Falha na instalação', {
          description: 'Tente novamente ou use as instruções manuais.'
        });
        setTimeout(() => setInstallationStep('idle'), 3000);
      }
    } catch (error) {
      setInstallationStep('failed');
      console.error('Installation error:', error);
      toast.error('Erro durante a instalação');
      setTimeout(() => setInstallationStep('idle'), 3000);
    }
  };

  const handleUpdate = () => {
    toast.info('Atualizando aplicativo...', {
      description: 'O app será recarregado para aplicar as atualizações.'
    });
    updateApp();
  };

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

      {/* Installation Status */}
      {isInstalled && (
        <div className="flex justify-end">
          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
            <Smartphone className="w-3 h-3 mr-1" />
            PWA Instalado
          </Badge>
        </div>
      )}

      {/* Quick Install (only show on mobile) */}
      {!isInstalled && isInstallable && showInstallPrompt && browserInfo.isMobile && (
        <Card className="w-72 shadow-xl border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    installationStep === 'installing' ? "bg-blue-500 animate-pulse" :
                    installationStep === 'success' ? "bg-green-500" :
                    installationStep === 'failed' ? "bg-red-500" :
                    "bg-gradient-to-br from-purple-500 to-indigo-600"
                  )}>
                    {installationStep === 'installing' ? (
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    ) : installationStep === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : installationStep === 'failed' ? (
                      <AlertTriangle className="w-4 h-4 text-white" />
                    ) : (
                      <Download className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">
                      {installationStep === 'installing' ? 'Instalando...' :
                       installationStep === 'success' ? 'Instalado!' :
                       installationStep === 'failed' ? 'Erro na Instalação' :
                       'Instalar MuseTera'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {installationStep === 'installing' ? 'Aguarde um momento...' :
                       installationStep === 'success' ? 'Disponível na tela inicial' :
                       installationStep === 'failed' ? 'Tente novamente' :
                       'Acesso instantâneo no celular'}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleInstall}
                  disabled={installationStep === 'installing'}
                  className={cn(
                    "w-full shadow-lg transform transition-all duration-200 hover:scale-105",
                    installationStep === 'success' ? "bg-green-600 hover:bg-green-700" :
                    installationStep === 'failed' ? "bg-red-600 hover:bg-red-700" :
                    "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  )}
                >
                  {installationStep === 'installing' ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                      Instalando...
                    </>
                  ) : installationStep === 'success' ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Instalado!
                    </>
                  ) : installationStep === 'failed' ? (
                    <>
                      <AlertTriangle className="w-3 h-3 mr-2" />
                      Tentar Novamente
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 mr-2" />
                      Instalar Agora
                    </>
                  )}
                </Button>
                
                {/* Browser compatibility info */}
                <div className="text-xs text-center text-muted-foreground">
                  {browserInfo.name} Mobile • {browserInfo.supportsInstall ? 'Compatível' : 'Limitado'}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1 hover:bg-white/20 rounded-full"
                onClick={() => setShowInstallPrompt(false)}
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
                  onClick={handleUpdate}
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
