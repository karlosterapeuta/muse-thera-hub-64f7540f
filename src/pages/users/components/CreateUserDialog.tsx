import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { CreateUserForm } from "./CreateUserForm";
import { UserCredentialsModal } from "./UserCredentialsModal";
import { useCreateUser } from "../hooks/useCreateUser";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [createdUserData, setCreatedUserData] = useState<any>(null);
  const { createUser, isLoading } = useCreateUser();

  const handleCreateUser = async (userData: any) => {
    console.log('CreateUserDialog - handleCreateUser called with:', userData);
    try {
      console.log('About to call createUser mutation');
      const result = await createUser(userData);
      console.log('CreateUser result:', result);
      setCreatedUserData({
        name: result.userData.name,
        email: result.userData.email,
        password: result.password,
        role: result.userData.role
      });
      setCredentialsOpen(true);
      console.log('Credentials modal should now open');
    } catch (error) {
      console.error('Error in handleCreateUser:', error);
    }
  };

  const handleCredentialsClose = () => {
    setCredentialsOpen(false);
    setCreatedUserData(null);
    setOpen(false);
  };

  return (
    <>
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
          <DialogDescription>
            Preencha os dados para criar um novo usuário no sistema
          </DialogDescription>
        </DialogHeader>
          
          <CreateUserForm 
            onSubmit={handleCreateUser}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {createdUserData && (
        <UserCredentialsModal
          open={credentialsOpen}
          onOpenChange={handleCredentialsClose}
          userData={createdUserData}
        />
      )}
    </>
  );
}