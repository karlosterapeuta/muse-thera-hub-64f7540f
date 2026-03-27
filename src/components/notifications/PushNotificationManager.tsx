import { useEffect, useState } from 'react';
import { Bell, BellOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { registerPushSubscription, isPushSupported, getPushPermissionStatus } from '@/utils/pushNotifications';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function PushNotificationManager() {
  const [status, setStatus] = useState<'loading' | 'unsupported' | 'prompt' | 'granted' | 'denied'>('loading');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    if (!isPushSupported()) {
      setStatus('unsupported');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setStatus('loading');
      return;
    }

    const permission = getPushPermissionStatus();
    if (permission === 'granted') {
      // Auto-register if permission already granted
      const result = await registerPushSubscription();
      setStatus(result === 'granted' ? 'granted' : 'prompt');
    } else if (permission === 'denied') {
      setStatus('denied');
    } else {
      setStatus('prompt');
    }
  };

  const handleEnableNotifications = async () => {
    setIsRegistering(true);
    try {
      const result = await registerPushSubscription();
      setStatus(result);
      if (result === 'granted') {
        toast.success('Notificações ativadas com sucesso!');
      } else if (result === 'denied') {
        setStatus('denied');
        toast.error('Permissão de notificações negada.');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Erro ao ativar notificações.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Auto-prompt on first render if not yet decided
  useEffect(() => {
    if (status === 'prompt') {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        handleEnableNotifications();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === 'loading' || status === 'granted') return null;

  if (status === 'unsupported') return null;

  if (status === 'denied') {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-destructive/20 rounded-lg shrink-0">
              <BellOff className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-foreground">Notificações bloqueadas</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                As notificações foram bloqueadas. Para receber lembretes sobre as devolutivas, 
                habilite as notificações nas configurações do seu navegador.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-card border border-border rounded-xl p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/20 rounded-lg shrink-0">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-foreground">Ativar notificações</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Receba lembretes diários para fazer as devolutivas com os pais usando a Escala Musetera.
            </p>
            <Button
              size="sm"
              className="mt-3 w-full"
              onClick={handleEnableNotifications}
              disabled={isRegistering}
            >
              {isRegistering ? 'Ativando...' : 'Ativar notificações'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
