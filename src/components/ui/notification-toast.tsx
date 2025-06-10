
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  title: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

const variantMap = {
  success: 'default' as const,
  error: 'destructive' as const,
  info: 'default' as const,
  warning: 'default' as const,
};

export function useNotification() {
  const { toast } = useToast();

  const showNotification = ({ 
    title, 
    description, 
    type = 'info', 
    duration = 5000 
  }: NotificationOptions) => {
    const Icon = iconMap[type];
    
    toast({
      title,
      description,
      variant: variantMap[type],
      duration,
      action: (
        <div className="flex items-center">
          <Icon className="h-4 w-4" />
        </div>
      ),
    });
  };

  const showSuccess = (title: string, description?: string) => {
    showNotification({ title, description, type: 'success' });
  };

  const showError = (title: string, description?: string) => {
    showNotification({ title, description, type: 'error' });
  };

  const showInfo = (title: string, description?: string) => {
    showNotification({ title, description, type: 'info' });
  };

  const showWarning = (title: string, description?: string) => {
    showNotification({ title, description, type: 'warning' });
  };

  return {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}
