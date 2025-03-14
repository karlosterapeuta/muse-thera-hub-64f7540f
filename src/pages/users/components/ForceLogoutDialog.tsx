
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ForceLogoutDialogProps {
  onForceLogout: () => Promise<void>;
}

export function ForceLogoutDialog({ onForceLogout }: ForceLogoutDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Forçar logout">
          <LogOut className="h-4 w-4 text-orange-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Forçar logout</AlertDialogTitle>
          <AlertDialogDescription>
            Isso invalidará todas as sessões ativas deste usuário, forçando seu logout imediato. Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onForceLogout}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Forçar Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
