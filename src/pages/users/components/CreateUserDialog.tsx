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
import { useCreateUser } from "../hooks/useCreateUser";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const { createUser, isLoading } = useCreateUser();

  const handleCreateUser = async (userData: any) => {
    await createUser(userData);
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
        
        <CreateUserForm 
          onSubmit={handleCreateUser}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}