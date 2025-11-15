import { useState } from "react";
import { Profile } from "../types";
import { useAccessManagement } from "../hooks/useAccessManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, RefreshCw, Plus, Unlock, Lock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AccessManagementTabProps {
  user: Profile;
  onClose: () => void;
}

export function AccessManagementTab({ user, onClose }: AccessManagementTabProps) {
  const { isLoading, renewPlan, extendAccess, makeUnlimited, setLimit } = useAccessManagement();
  const [renewDays, setRenewDays] = useState("30");
  const [extendDate, setExtendDate] = useState<Date>();
  const [limitDate, setLimitDate] = useState<Date>();

  const handleRenewPlan = async () => {
    const days = parseInt(renewDays);
    if (isNaN(days) || days <= 0) {
      return;
    }
    const success = await renewPlan(user.id, user.name, days);
    if (success) onClose();
  };

  const handleExtendAccess = async () => {
    if (!extendDate) return;
    const success = await extendAccess(user.id, user.name, extendDate);
    if (success) onClose();
  };

  const handleMakeUnlimited = async () => {
    const success = await makeUnlimited(user.id, user.name);
    if (success) onClose();
  };

  const handleSetLimit = async () => {
    if (!limitDate) return;
    const success = await setLimit(user.id, user.name, limitDate);
    if (success) onClose();
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status Atual do Plano</CardTitle>
          <CardDescription>Informações do plano de acesso do usuário</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Data de Início:</span>
            <span className="text-sm text-muted-foreground">
              {new Date(user.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Expiração:</span>
            <span className="text-sm text-muted-foreground">
              {user.expires_at 
                ? new Date(user.expires_at).toLocaleDateString('pt-BR')
                : 'Ilimitado'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Renew Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Renovar Plano
          </CardTitle>
          <CardDescription>
            Adiciona dias ao plano atual. Se expirado, começa a contar da data atual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="renewDays">Número de dias</Label>
            <Input
              id="renewDays"
              type="number"
              min="1"
              value={renewDays}
              onChange={(e) => setRenewDays(e.target.value)}
              placeholder="30"
            />
          </div>
          <Button 
            onClick={handleRenewPlan} 
            disabled={isLoading}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Renovar por {renewDays} dias
          </Button>
        </CardContent>
      </Card>

      {/* Extend Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Estender Acesso
          </CardTitle>
          <CardDescription>
            Define uma nova data de expiração específica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nova data de expiração</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !extendDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {extendDate ? format(extendDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={extendDate}
                  onSelect={setExtendDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button 
            onClick={handleExtendAccess} 
            disabled={isLoading || !extendDate}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Estender até {extendDate ? format(extendDate, "dd/MM/yyyy") : "..."}
          </Button>
        </CardContent>
      </Card>

      {/* Make Unlimited / Set Limit */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Unlock className="h-5 w-5" />
              Tornar Ilimitado
            </CardTitle>
            <CardDescription>
              Remove a data de expiração
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleMakeUnlimited} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Unlock className="mr-2 h-4 w-4" />
              Tornar Ilimitado
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Definir Limite
            </CardTitle>
            <CardDescription>
              Define uma data de expiração
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !limitDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {limitDate ? format(limitDate, "PPP", { locale: ptBR }) : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={limitDate}
                  onSelect={setLimitDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button 
              onClick={handleSetLimit} 
              disabled={isLoading || !limitDate}
              className="w-full"
            >
              <Lock className="mr-2 h-4 w-4" />
              Definir Limite
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
