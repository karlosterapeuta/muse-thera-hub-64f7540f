import { useEffect } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUpdateChecker } from '@/hooks/useUpdateChecker';

export const UpdateNotification = () => {
  const { toast } = useToast();
  const { 
    isUpdateAvailable, 
    isChecking, 
    currentVersion, 
    latestVersion,
    applyUpdate, 
    remindLater, 
    dismissUpdate 
  } = useUpdateChecker();

  useEffect(() => {
    if (isUpdateAvailable) {
      toast({
        title: "Nova atualização disponível! 🚀",
        description: `Versão ${latestVersion} está pronta. Clique para atualizar agora.`,
        duration: 0, // Don't auto-dismiss
        action: (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={remindLater}
              className="text-xs h-8 px-3 border-muted-foreground/20 hover:bg-muted/50"
            >
              <Clock className="h-3 w-3 mr-1" />
              Depois
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={applyUpdate}
              className="text-xs h-8 px-3 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Atualizar
            </Button>
          </div>
        )
      });
    }
  }, [isUpdateAvailable, latestVersion, toast, applyUpdate, remindLater, dismissUpdate]);

  // Show checking status in development
  useEffect(() => {
    if (isChecking && process.env.NODE_ENV === 'development') {
      toast({
        title: "Verificando atualizações...",
        description: `Versão atual: ${currentVersion}`,
        duration: 2000,
      });
    }
  }, [isChecking, currentVersion, toast]);

  return null; // This component only manages toasts
};

export default UpdateNotification;