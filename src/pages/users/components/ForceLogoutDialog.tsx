
import { LogOut, Loader2 } from "lucide-react";
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
  isLoading?: boolean;
}

export function ForceLogoutDialog({ onForceLogout, isLoading = false }: ForceLogoutDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          title="Forçar logout"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 text-orange-500" />
          )}
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
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onForceLogout}
            disabled={isLoading}
            className="bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              "Forçar Logout"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
