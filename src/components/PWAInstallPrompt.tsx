
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Smartphone, Monitor, X, Wifi, WifiOff, Star, Zap, Shield, Share, Plus, Info, Chrome, MoreVertical } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

export function PWAInstallPrompt() {
  const { 
    isInstallable, 
    isInstalled, 
    isOnline, 
    showInstallPrompt,
    browserInfo,
    installApp, 
    dismissInstallPrompt 
  } = usePWA();

  const [showManualInstructions, setShowManualInstructions] = useState(false);

  console.log('🎨 PWAInstallPrompt render:', {
    isInstalled,
    isInstallable,
    showInstallPrompt,
    browserInfo,
    shouldShow: !isInstalled && isInstallable && showInstallPrompt
  });

  if (isInstalled || !isInstallable || !showInstallPrompt) {
    return null;
  }

  const deviceType = browserInfo.isMobile ? 'celular' : 'computador';
  const DeviceIcon = browserInfo.isMobile ? Smartphone : Monitor;

  const handleInstall = async () => {
    console.log('🎯 Install button clicked');
    const success = await installApp();
    
    if (!success) {
      console.log('🔧 Showing manual instructions');
      setShowManualInstructions(true);
    }
  };

  const getManualInstructions = () => {
    switch (browserInfo.name) {
      case 'chrome':
        if (browserInfo.isDesktop) {
          return {
            title: 'Como instalar no Chrome Desktop',
            steps: [
              '1. Procure o ícone de instalação (⊕) na barra de endereços (lado direito)',
              '2. OU clique nos 3 pontos (⋮) no canto superior direito',
              '3. Selecione "Instalar MuseTera..." no menu',
              '4. Clique em "Instalar" na janela que aparecer',
              '5. O MuseTera será adicionado à sua área de trabalho'
            ],
            icon: Chrome,
            tips: 'Dica: Após instalar, você pode acessar o MuseTera diretamente pela área de trabalho, sem abrir o navegador!'
          };
        } else {
          return {
            title: 'Como instalar no Chrome Mobile',
            steps: [
              '1. Toque nos 3 pontos (⋮) no canto superior direito',
              '2. Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"',
              '3. Toque em "Instalar" para confirmar',
              '4. O ícone do MuseTera aparecerá na sua tela inicial'
            ],
            icon: Smartphone,
            tips: 'Dica: O aplicativo funcionará mesmo sem internet após a instalação!'
          };
        }
      case 'edge':
        if (browserInfo.isDesktop) {
          return {
            title: 'Como instalar no Microsoft Edge',
            steps: [
              '1. Procure o ícone de instalação na barra de endereços',
              '2. OU clique nos 3 pontos (⋯) no canto superior direito',
              '3. Selecione "Aplicativos" > "Instalar este site como aplicativo"',
              '4. Digite um nome (pode manter "MuseTera") e clique em "Instalar"',
              '5. O aplicativo será adicionado ao menu Iniciar e área de trabalho'
            ],
            icon: Monitor,
            tips: 'Dica: No Edge, você pode fixar o aplicativo na barra de tarefas para acesso ainda mais rápido!'
          };
        }
        break;
      case 'safari':
        if (browserInfo.isMobile) {
          return {
            title: 'Adicionar à Tela Inicial (Safari iOS)',
            steps: [
              '1. Toque no botão de compartilhar (⬆) na parte inferior da tela',
              '2. Role para baixo e toque em "Adicionar à Tela Inicial"',
              '3. Edite o nome se desejar e toque em "Adicionar"',
              '4. O ícone do MuseTera aparecerá na sua tela inicial'
            ],
            icon: Share,
            tips: 'Dica: No iOS, o aplicativo funcionará em tela cheia, como um app nativo!'
          };
        }
        return {
          title: 'Adicionar aos Favoritos (Safari Desktop)',
          steps: [
            '1. Pressione Cmd+D ou vá em Favoritos > Adicionar Favorito',
            '2. Escolha "Barra de Favoritos" como localização',
            '3. Clique em "Adicionar"',
            '4. Acesse rapidamente pela barra de favoritos'
          ],
          icon: Star,
          tips: 'Dica: Você pode arrastar o ícone do MuseTera para a Dock para acesso rápido!'
        };
      case 'firefox':
        return {
          title: 'Criar Atalho (Firefox)',
          steps: [
            '1. Clique no menu (☰) no canto superior direito',
            '2. Selecione "Mais ferramentas" > "Adicionar à área de trabalho"',
            '3. OU arraste a URL para a área de trabalho',
            '4. Confirme a criação do atalho'
          ],
          icon: Plus,
          tips: 'Dica: No Firefox, você pode fixar a aba para acesso rápido!'
        };
      default:
        return {
          title: 'Criar Atalho',
          steps: [
            '1. Adicione esta página aos favoritos',
            '2. Ou crie um atalho na área de trabalho',
            '3. Para melhor experiência, use Chrome ou Edge'
          ],
          icon: Star,
          tips: 'Para a melhor experiência PWA, recomendamos usar Chrome ou Microsoft Edge.'
        };
    }
  };

  const manualInstructions = getManualInstructions();

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
              {/* Browser Info */}
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {browserInfo.name} {browserInfo.isMobile ? 'Mobile' : 'Desktop'}
                </Badge>
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
                  onClick={handleInstall}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Instalar no {deviceType}
                </Button>

                {/* Show manual instructions button if needed */}
                {!showManualInstructions && (
                  <Button
                    variant="outline"
                    onClick={() => setShowManualInstructions(true)}
                    className="w-full border-2 border-purple-200 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-800"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Ver instruções manuais
                  </Button>
                )}

                {/* Manual Instructions */}
                {(showManualInstructions || !browserInfo.supportsInstall) && manualInstructions && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-3">
                      <manualInstructions.icon className="w-5 h-5 text-amber-600" />
                      <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                        {manualInstructions.title}
                      </h3>
                    </div>
                    <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
                      {manualInstructions.steps.map((step, index) => (
                        <p key={index} className="leading-relaxed">{step}</p>
                      ))}
                      {manualInstructions.tips && (
                        <div className="mt-3 p-2 bg-amber-100 dark:bg-amber-900/30 rounded border border-amber-300 dark:border-amber-700">
                          <p className="text-xs font-medium">{manualInstructions.tips}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
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
