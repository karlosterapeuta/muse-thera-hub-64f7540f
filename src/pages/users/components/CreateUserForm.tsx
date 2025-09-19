import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { CreateUserData } from "../hooks/useCreateUser";

interface CreateUserFormProps {
  onSubmit: (data: CreateUserData) => Promise<void>;
  isLoading: boolean;
}

export function CreateUserForm({ onSubmit, isLoading }: CreateUserFormProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    role: 'professional',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    await onSubmit(formData);
  };

  const isFormValid = formData.name.trim() && formData.email.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto px-1">
      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite o nome completo"
            className="text-sm sm:text-base"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Digite o e-mail"
            className="text-sm sm:text-base"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Função</Label>
          <Select 
            value={formData.role} 
            onValueChange={(value: 'admin' | 'professional') => 
              setFormData({ ...formData, role: value })
            }
          >
            <SelectTrigger className="text-sm sm:text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Profissional</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha (opcional)</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Deixe em branco para gerar automaticamente"
            className="text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-muted-foreground">
            Se não informada, será gerada uma senha temporária automaticamente
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-background border-t mt-4 py-3 -mx-1">
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="gap-2 text-sm sm:text-base"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Criar Usuário
        </Button>
      </div>
    </form>
  );
}