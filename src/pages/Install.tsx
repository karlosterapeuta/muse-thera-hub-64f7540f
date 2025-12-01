import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Monitor, 
  Apple, 
  Download, 
  Share, 
  MoreVertical,
  PlusSquare,
  CheckCircle2,
  ArrowRight,
  Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePWAInstall } from "@/contexts/PWAInstallContext";

export default function Install() {
  const { deferredPrompt, isStandalone, triggerInstall } = usePWAInstall();
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");
  const navigate = useNavigate();

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) setPlatform("ios");
    else if (isAndroid) setPlatform("android");
    else setPlatform("desktop");
  }, []);

  const handleNativeInstall = async () => {
    const success = await triggerInstall();
    if (success) {
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  };

  if (isStandalone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">App Instalado!</CardTitle>
            <CardDescription>
              O MuseTera já está instalado no seu dispositivo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Ir para o Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-4">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Instale o <span className="text-primary">MuseTera</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Tenha acesso rápido ao sistema direto da tela inicial do seu dispositivo.
          </p>
        </div>

        {/* Native Install Button (if available) */}
        {deferredPrompt && (
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-lg mb-1">Instalação Rápida</h3>
                <p className="text-muted-foreground text-sm">
                  Clique no botão para instalar instantaneamente
                </p>
              </div>
              <Button onClick={handleNativeInstall} size="lg" className="w-full sm:w-auto">
                <Download className="w-5 h-5 mr-2" />
                Instalar Agora
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Platform Instructions */}
        <Tabs defaultValue={platform} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="ios" className="gap-2">
              <Apple className="w-4 h-4" />
              <span className="hidden sm:inline">iPhone/iPad</span>
              <span className="sm:hidden">iOS</span>
            </TabsTrigger>
            <TabsTrigger value="android" className="gap-2">
              <Smartphone className="w-4 h-4" />
              Android
            </TabsTrigger>
            <TabsTrigger value="desktop" className="gap-2">
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Computador</span>
              <span className="sm:hidden">PC</span>
            </TabsTrigger>
          </TabsList>

          {/* iOS Instructions */}
          <TabsContent value="ios">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  Instalação no iPhone/iPad
                </CardTitle>
                <CardDescription>
                  Siga os passos abaixo usando o Safari
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <InstallStep 
                  number={1}
                  icon={<Share className="w-5 h-5" />}
                  title="Toque no botão Compartilhar"
                  description="Na barra inferior do Safari, toque no ícone de compartilhar (quadrado com seta para cima)"
                />
                <InstallStep 
                  number={2}
                  icon={<PlusSquare className="w-5 h-5" />}
                  title='Selecione "Adicionar à Tela de Início"'
                  description="Role as opções e toque em 'Adicionar à Tela de Início'"
                />
                <InstallStep 
                  number={3}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  title="Confirme a instalação"
                  description="Toque em 'Adicionar' no canto superior direito"
                />
                
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Importante:</strong> Use o navegador <strong>Safari</strong> para instalar. 
                    O Chrome e outros navegadores no iOS não suportam a instalação de apps web.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Android Instructions */}
          <TabsContent value="android">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Instalação no Android
                </CardTitle>
                <CardDescription>
                  Siga os passos abaixo usando o Chrome
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <InstallStep 
                  number={1}
                  icon={<MoreVertical className="w-5 h-5" />}
                  title="Abra o menu do Chrome"
                  description="Toque nos três pontos no canto superior direito"
                />
                <InstallStep 
                  number={2}
                  icon={<Download className="w-5 h-5" />}
                  title='Toque em "Instalar app" ou "Adicionar à tela inicial"'
                  description="A opção pode variar dependendo da versão do Chrome"
                />
                <InstallStep 
                  number={3}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  title="Confirme a instalação"
                  description="Toque em 'Instalar' na janela de confirmação"
                />
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Dica:</strong> Se aparecer um banner de instalação na parte inferior da tela, 
                    você pode tocar nele para instalar mais rapidamente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Desktop Instructions */}
          <TabsContent value="desktop">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Instalação no Computador
                </CardTitle>
                <CardDescription>
                  Siga os passos abaixo usando Chrome, Edge ou Brave
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <InstallStep 
                  number={1}
                  icon={<Download className="w-5 h-5" />}
                  title="Procure o ícone de instalação"
                  description="Na barra de endereços, clique no ícone de instalação (computador com seta) ou no ícone de três pontos"
                />
                <InstallStep 
                  number={2}
                  icon={<PlusSquare className="w-5 h-5" />}
                  title='Clique em "Instalar MuseTera"'
                  description="Pode aparecer como 'Instalar app' ou 'Criar atalho'"
                />
                <InstallStep 
                  number={3}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  title="Confirme a instalação"
                  description="Clique em 'Instalar' na janela de confirmação"
                />
                
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    <strong>Navegadores compatíveis:</strong> Google Chrome, Microsoft Edge, Brave e Opera. 
                    O Firefox e Safari no desktop não suportam instalação de PWAs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Benefits Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Benefícios de Instalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <BenefitCard 
                icon="⚡"
                title="Acesso Rápido"
                description="Abra direto da tela inicial"
              />
              <BenefitCard 
                icon="📴"
                title="Funciona Offline"
                description="Acesse mesmo sem internet"
              />
              <BenefitCard 
                icon="🔔"
                title="Notificações"
                description="Receba alertas importantes"
              />
              <BenefitCard 
                icon="💾"
                title="Menos Memória"
                description="Ocupa menos espaço que apps"
              />
              <BenefitCard 
                icon="🔄"
                title="Sempre Atualizado"
                description="Atualizações automáticas"
              />
              <BenefitCard 
                icon="🎯"
                title="Tela Cheia"
                description="Sem barras do navegador"
              />
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar ao Sistema
          </Button>
        </div>
      </div>
    </div>
  );
}

function InstallStep({ 
  number, 
  icon, 
  title, 
  description 
}: { 
  number: number; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
          {number}
        </div>
        {number < 3 && <div className="w-0.5 h-full bg-border mt-2" />}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-muted rounded-md">
            {icon}
          </div>
          <h4 className="font-semibold">{title}</h4>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
