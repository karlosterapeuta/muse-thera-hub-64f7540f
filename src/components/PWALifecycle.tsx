import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Smartphone, 
  Wifi, 
  WifiOff,
  Shield,
  Zap,
  Star,
  Settings,
  X
} from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Componente de ciclo de vida completo do PWA
 * Gerencia todas as fases: detecção, instalação, atualização e operação
 */
export function PWALifecycle() {
  const { 
    isInstalled, 
    isInstallable, 
    isOnline, 
    updateAvailable, 
    browserInfo,
    installApp, 
    updateApp,
    dismissInstallPrompt 
  } = usePWA();

  const [lifecycleStage, setLifecycleStage] = useState<
    'detecting' | 'installable' | 'installing' | 'installed' | 'updating' | 'operational'
  >('detecting');
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [capabilities, setCapabilities] = useState({
    offline: false,
    notifications: false,
    background: false,
    caching: false
  });

  // Detectar capacidades do PWA
  useEffect(() => {
    const detectCapabilities = () => {
      setCapabilities({
        offline: 'serviceWorker' in navigator,
        notifications: 'Notification' in window,
        background: 'serviceWorker' in navigator && 'BackgroundSync' in window,
        caching: 'caches' in window
      });
    };

    detectCapabilities();
  }, []);

  // Gerenciar estágios do ciclo de vida
  useEffect(() => {
    if (updateAvailable) {
      setLifecycleStage('updating');
    } else if (isInstalled) {
      setLifecycleStage('operational');
    } else if (isInstallable) {
      setLifecycleStage('installable');
    } else {
      setLifecycleStage('detecting');
    }
  }, [isInstalled, isInstallable, updateAvailable]);

  const handleInstallWithProgress = async () => {
    setLifecycleStage('installing');
    setInstallProgress(0);

    // Simular progresso de instalação
    const progressInterval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const success = await installApp();
      clearInterval(progressInterval);
      
      if (success) {
        setInstallProgress(100);
        setLifecycleStage('installed');
        toast.success('MuseTera instalado!', {
          description: '🎉 Aplicativo pronto para uso offline'
        });
        setTimeout(() => setLifecycleStage('operational'), 2000);
      } else {
        setInstallProgress(0);
        setLifecycleStage('installable');
        toast.error('Instalação cancelada');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setInstallProgress(0);
      setLifecycleStage('installable');
      toast.error('Erro na instalação');
    }
  };

  const handleUpdate = () => {
    setLifecycleStage('updating');
    toast.promise(
      new Promise(resolve => {
        setTimeout(() => {
          updateApp();
          resolve(true);
        }, 1000);
      }),
      {
        loading: 'Preparando atualização...',
        success: 'Aplicativo será atualizado!',
        error: 'Erro na atualização'
      }
    );
  };

  const getStageInfo = () => {
    switch (lifecycleStage) {
      case 'detecting':
        return {
          title: 'Detectando Capacidades PWA',
          description: 'Verificando compatibilidade do dispositivo...',
          icon: Settings,
          color: 'blue',
          action: null
        };
      case 'installable':
        return {
          title: 'Pronto para Instalação',
          description: 'Transforme em aplicativo nativo',
          icon: Download,
          color: 'blue',
          action: (
            <Button 
              onClick={handleInstallWithProgress}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Instalar MuseTera
            </Button>
          )
        };
      case 'installing':
        return {
          title: 'Instalando Aplicativo',
          description: `Progresso: ${installProgress}%`,
          icon: RefreshCw,
          color: 'blue',
          action: (
            <div className="space-y-2">
              <Progress value={installProgress} className="w-full" />
              <p className="text-xs text-center text-muted-foreground">
                Configurando recursos offline...
              </p>
            </div>
          )
        };
      case 'installed':
        return {
          title: 'Instalado com Sucesso!',
          description: 'Aplicativo disponível na tela inicial',
          icon: CheckCircle,
          color: 'green',
          action: null
        };
      case 'updating':
        return {
          title: 'Atualização Disponível',
          description: 'Nova versão com melhorias',
          icon: RefreshCw,
          color: 'orange',
          action: (
            <Button 
              onClick={handleUpdate}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar Agora
            </Button>
          )
        };
      case 'operational':
        return {
          title: 'PWA Operacional',
          description: 'Funcionando perfeitamente',
          icon: CheckCircle,
          color: 'green',
          action: null
        };
      default:
        return {
          title: 'PWA Status',
          description: 'Verificando...',
          icon: Settings,
          color: 'gray',
          action: null
        };
    }
  };

  const stageInfo = getStageInfo();
  const StageIcon = stageInfo.icon;

  // Só mostrar se houver ação necessária ou informação relevante
  if (lifecycleStage === 'operational' && !showAdvancedInfo && !updateAvailable) {
    return null;
  }

  return (
    <Card className={cn(
      "fixed bottom-4 left-4 w-80 shadow-xl border-2 transition-all duration-300 z-40",
      stageInfo.color === 'blue' && "border-blue-300 bg-blue-50 dark:bg-blue-950/20",
      stageInfo.color === 'blue' && "border-blue-300 bg-blue-50 dark:bg-blue-950/20",
      stageInfo.color === 'green' && "border-green-300 bg-green-50 dark:bg-green-950/20",
      stageInfo.color === 'orange' && "border-orange-300 bg-orange-50 dark:bg-orange-950/20",
      stageInfo.color === 'gray' && "border-gray-300 bg-gray-50 dark:bg-gray-950/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              stageInfo.color === 'blue' && "bg-blue-500",
              stageInfo.color === 'blue' && "bg-blue-500",
              stageInfo.color === 'green' && "bg-green-500",
              stageInfo.color === 'orange' && "bg-orange-500",
              stageInfo.color === 'gray' && "bg-gray-500",
              lifecycleStage === 'installing' && "animate-pulse"
            )}>
              <StageIcon className={cn(
                "w-5 h-5 text-white",
                lifecycleStage === 'installing' && "animate-spin"
              )} />
            </div>
            <div>
              <CardTitle className="text-sm">{stageInfo.title}</CardTitle>
              <p className="text-xs text-muted-foreground">{stageInfo.description}</p>
            </div>
          </div>
          
          {(lifecycleStage === 'installable' || lifecycleStage === 'operational') && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (lifecycleStage === 'installable') {
                  dismissInstallPrompt();
                } else {
                  setShowAdvancedInfo(false);
                }
              }}
              className="h-6 w-6"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status indicators */}
        <div className="flex gap-2 flex-wrap">
          <Badge 
            variant={isOnline ? "default" : "destructive"}
            className="text-xs"
          >
            {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          
          {isInstalled && (
            <Badge className="text-xs bg-blue-500 text-white">
              <Smartphone className="w-3 h-3 mr-1" />
              Instalado
            </Badge>
          )}
          
          <Badge 
            variant="outline" 
            className="text-xs capitalize"
          >
            {browserInfo.name} {browserInfo.isMobile ? 'Mobile' : 'Desktop'}
          </Badge>
        </div>

        {/* Action area */}
        {stageInfo.action && (
          <div>{stageInfo.action}</div>
        )}

        {/* PWA Capabilities */}
        {(showAdvancedInfo || lifecycleStage === 'operational') && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Capacidades PWA:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(capabilities).map(([key, enabled]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    enabled ? "bg-green-500" : "bg-gray-300"
                  )} />
                  <span className="text-xs capitalize">
                    {key === 'offline' && 'Modo Offline'}
                    {key === 'notifications' && 'Notificações'}
                    {key === 'background' && 'Background'}
                    {key === 'caching' && 'Cache'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits for installable stage */}
        {lifecycleStage === 'installable' && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Benefícios da instalação:
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>Acesso instantâneo</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Shield className="w-3 h-3 text-blue-500" />
                <span>Funciona offline</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Star className="w-3 h-3 text-blue-500" />
                <span>Ícone na tela inicial</span>
              </div>
            </div>
          </div>
        )}

        {/* Advanced info toggle */}
        {lifecycleStage === 'operational' && !showAdvancedInfo && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedInfo(true)}
            className="w-full text-xs"
          >
            Ver Detalhes Técnicos
          </Button>
        )}
      </CardContent>
    </Card>
  );
}