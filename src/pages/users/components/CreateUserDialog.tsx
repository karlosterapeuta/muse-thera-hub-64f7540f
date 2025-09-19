import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { CreateUserForm } from "./CreateUserForm";
import { InviteCodeDisplay } from "./InviteCodeDisplay";
import { useCreateUser } from "../hooks/useCreateUser";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const { 
    createUser, 
    isLoading, 
    inviteCode, 
    showInviteCode, 
    closeInviteCode 
  } = useCreateUser();

  const handleCreateUser = async (userData: any) => {
    await createUser(userData);
    if (userData.method === 'direct') {
      setOpen(false);
    }
  };

  const handleCloseInviteCode = () => {
    closeInviteCode();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Cadastrar Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
        </DialogHeader>
        
        {showInviteCode ? (
          <InviteCodeDisplay 
            inviteCode={inviteCode!} 
            onClose={handleCloseInviteCode}
          />
        ) : (
          <CreateUserForm 
            onSubmit={handleCreateUser}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}