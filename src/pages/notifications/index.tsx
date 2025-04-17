
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle2, Clock, Info } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "appointment";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: "1",
      title: "Sessão agendada",
      message: "Nova sessão agendada com o paciente João Silva",
      timestamp: "2025-04-15 14:30",
      read: false,
      type: "appointment"
    },
    {
      id: "2",
      title: "Progresso salvo",
      message: "Relatório de progresso do paciente Maria Oliveira foi salvo com sucesso",
      timestamp: "2025-04-14 10:15",
      read: false,
      type: "success"
    },
    {
      id: "3",
      title: "Atualização do sistema",
      message: "Nova atualização disponível para o módulo de atividades",
      timestamp: "2025-04-12 08:45",
      read: true,
      type: "info"
    }
  ]);
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case "info": return <Info className="h-5 w-5 text-blue-500" />;
      case "success": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning": return <Info className="h-5 w-5 text-amber-500" />;
      case "appointment": return <Clock className="h-5 w-5 text-purple-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notificações</h1>
        <Button variant="outline" onClick={markAllAsRead}>
          Marcar todas como lidas
        </Button>
      </div>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-lg">Nenhuma notificação</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map(notification => (
            <Card 
              key={notification.id} 
              className={notification.read ? "bg-background" : "bg-primary/5"}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{notification.title}</h3>
                  <p className="text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                </div>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => markAsRead(notification.id)}
                  >
                    Marcar como lida
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
