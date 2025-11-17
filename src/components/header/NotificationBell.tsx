import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full hover:bg-muted/50 transition-all duration-300"
      >
        <Bell className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
        
        {/* Badge de notificações (exemplo) */}
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-[11px] font-bold text-white flex items-center justify-center shadow-lg ring-2 ring-background">
          3
        </span>
      </Button>
    </div>
  );
}
