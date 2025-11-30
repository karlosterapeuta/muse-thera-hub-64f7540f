import { useState } from "react";
import { Profile } from "../types";
import { useAccessManagement } from "../hooks/useAccessManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, RefreshCw, Plus, Unlock, Lock, Zap, AlertTriangle, Clock, CheckCircle, CalendarCheck, CalendarX, Shield } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExpirationBadge } from "./ExpirationBadge";

interface AccessManagementTabProps {
  user: Profile;
  onClose: () => void;
}

export function AccessManagementTab({ user, onClose }: AccessManagementTabProps) {
  const { isLoading, renewPlan, extendAccess, makeUnlimited, setLimit } = useAccessManagement();
  const [renewDays, setRenewDays] = useState("30");
  const [extendDate, setExtendDate] = useState<Date>();
  const [limitDate, setLimitDate] = useState<Date>();

  // Calculate days remaining
  const now = new Date();
  const expirationDate = user.expires_at ? new Date(user.expires_at) : null;
  const daysRemaining = expirationDate 
    ? Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpired = daysRemaining !== null && daysRemaining < 0;
  const isExpiringSoon = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7;

  const handleQuickRenew = async (days: number) => {
    const success = await renewPlan(user.id, user.name, days);
    if (success) onClose();
  };

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
      {/* Current Status with Visual Feedback */}
      <Card className={cn(
        "border-2 relative overflow-hidden",
        isExpired && "border-destructive/50 bg-destructive/5",
        isExpiringSoon && "border-orange-500/50 bg-orange-500/5",
        !user.expires_at && "border-emerald-500/50 bg-emerald-500/5",
        !isExpired && !isExpiringSoon && user.expires_at && "border-primary/30"
      )}>
        {/* Decorative top bar showing status */}
        <div className={cn(
          "h-2 w-full absolute top-0 left-0",
          isExpired && "bg-destructive",
          isExpiringSoon && "bg-orange-500",
          !user.expires_at && "bg-emerald-500",
          !isExpired && !isExpiringSoon && user.expires_at && "bg-primary"
        )} />
        
        <CardHeader className="pt-6">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              📋 Status do Plano
            </span>
            <ExpirationBadge expiresAt={user.expires_at} />
          </CardTitle>
          <CardDescription>O sistema bloqueia automaticamente quando o plano expira</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Alerts */}
          {isExpired && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Acesso expirado há {Math.abs(daysRemaining!)} dia(s)! Renove o plano para liberar o acesso.
              </AlertDescription>
            </Alert>
          )}
          {isExpiringSoon && (
            <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <Clock className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                Expira em {daysRemaining} dia(s)! Considere renovar.
              </AlertDescription>
            </Alert>
          )}
          {!user.expires_at && (
            <Alert className="border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                Acesso ilimitado - sem data de expiração.
              </AlertDescription>
            </Alert>
          )}

          {/* Info Grid - Cards destacados para datas */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 mb-2">
                <CalendarCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-muted-foreground">Data de Início</span>
              </div>
              <p className="text-lg font-bold">
                {new Date(user.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <div className={cn(
              "p-4 rounded-lg border",
              isExpired && "bg-destructive/10 border-destructive/30",
              isExpiringSoon && "bg-orange-500/10 border-orange-500/30",
              !user.expires_at && "bg-emerald-500/10 border-emerald-500/30",
              !isExpired && !isExpiringSoon && user.expires_at && "bg-blue-500/10 border-blue-500/30"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <CalendarX className={cn(
                  "h-4 w-4",
                  isExpired && "text-destructive",
                  isExpiringSoon && "text-orange-600",
                  !user.expires_at && "text-emerald-600",
                  !isExpired && !isExpiringSoon && user.expires_at && "text-blue-600"
                )} />
                <span className="text-sm font-medium text-muted-foreground">Expira em</span>
              </div>
              <p className="text-lg font-bold">
                {user.expires_at 
                  ? new Date(user.expires_at).toLocaleDateString('pt-BR')
                  : '♾️ Ilimitado'}
              </p>
            </div>
          </div>

          {/* Days Remaining Badge - mais destacado */}
          {daysRemaining !== null && !isExpired && (
            <div className="text-center pt-2">
              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold",
                daysRemaining <= 7 && "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
                daysRemaining > 7 && daysRemaining <= 30 && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                daysRemaining > 30 && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              )}>
                <Clock className="h-4 w-4" />
                {daysRemaining} dias restantes
              </div>
            </div>
          )}

          {/* Aviso de bloqueio automático */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 mt-2 border border-muted">
            <Shield className="h-4 w-4 flex-shrink-0" />
            <span>⚠️ Ao expirar o prazo, o acesso do usuário é bloqueado automaticamente até que seja feita a renovação.</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Renewal Section */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Renovação Rápida
          </CardTitle>
          <CardDescription>
            Use para quando o cliente renovar o pagamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleQuickRenew(30)}
              disabled={isLoading}
              className="flex flex-col h-auto py-4 hover:bg-primary/10 hover:border-primary"
            >
              <CalendarIcon className="h-5 w-5 mb-1 text-muted-foreground" />
              <span className="text-sm font-semibold">30 dias</span>
              <span className="text-xs text-muted-foreground">1 mês</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleQuickRenew(180)}
              disabled={isLoading}
              className="flex flex-col h-auto py-4 hover:bg-primary/10 hover:border-primary"
            >
              <CalendarIcon className="h-5 w-5 mb-1 text-muted-foreground" />
              <span className="text-sm font-semibold">180 dias</span>
              <span className="text-xs text-muted-foreground">6 meses</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleQuickRenew(365)}
              disabled={isLoading}
              className="flex flex-col h-auto py-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <CalendarIcon className="h-5 w-5 mb-1" />
              <span className="text-sm font-semibold">365 dias</span>
              <span className="text-xs">1 ano</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Renew Plan (Custom Days) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Renovar Plano (Personalizado)
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
