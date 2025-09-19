import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Mail } from "lucide-react";
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
    method: 'direct',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    await onSubmit(formData);
  };

  const isFormValid = formData.name.trim() && formData.email.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite o nome completo"
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
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Profissional</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Método de Cadastro</Label>
        <RadioGroup
          value={formData.method}
          onValueChange={(value: 'direct' | 'invite') => 
            setFormData({ ...formData, method: value, password: value === 'direct' ? formData.password : '' })
          }
        >
          <div className="space-y-3">
            <Card className={formData.method === 'direct' ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="direct" id="direct" />
                  <Label htmlFor="direct" className="font-medium cursor-pointer">
                    <UserPlus className="w-4 h-4 inline mr-2" />
                    Cadastro Direto
                  </Label>
                </div>
                <CardDescription className="ml-6">
                  Cria o usuário imediatamente no sistema com senha personalizada ou temporária
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className={formData.method === 'invite' ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="invite" id="invite" />
                  <Label htmlFor="invite" className="font-medium cursor-pointer">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Gerar Código de Convite
                  </Label>
                </div>
                <CardDescription className="ml-6">
                  Gera um código de convite para o usuário se cadastrar
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </RadioGroup>

        {formData.method === 'direct' && (
          <div className="space-y-2">
            <Label htmlFor="password">Senha (opcional)</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Deixe em branco para gerar automaticamente"
            />
            <p className="text-xs text-muted-foreground">
              Se não informada, será gerada uma senha temporária automaticamente
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : formData.method === 'direct' ? (
            <UserPlus className="h-4 w-4" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {formData.method === 'direct' ? 'Criar Usuário' : 'Gerar Convite'}
        </Button>
      </div>
    </form>
  );
}