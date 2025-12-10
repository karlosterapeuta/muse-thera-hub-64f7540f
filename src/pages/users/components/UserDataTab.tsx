import { useState, useEffect } from "react";
import { Profile } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, RefreshCw, Mail, Key, User, Clock, Link2, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserDataTabProps {
  user: Profile;
}

export function UserDataTab({ user }: UserDataTabProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUserEmail();
  }, [user.id]);

  const fetchUserEmail = async () => {
    try {
      const { data, error } = await supabase
        .from("professionals")
        .select("email")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setEmail(data?.email || null);
    } catch (error) {
      console.error("Erro ao buscar email:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAccessLimit = () => {
    if (!user.expires_at) return "Ilimitado";
    
    const expiresAt = new Date(user.expires_at);
    const now = new Date();
    const diffDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Expirado";
    if (diffDays <= 30) return `${diffDays} dias`;
    if (diffDays <= 180) return `${Math.round(diffDays / 30)} meses`;
    if (diffDays <= 365) return "1 ano";
    return "Ilimitado";
  };

  const getRole = () => {
    return user.user_roles?.[0]?.role === 'admin' ? 'Administrador' : 'Profissional';
  };

  const generateCredentialsMessage = (includePassword?: string) => {
    const lines = [
      "🎵 MuseTera - Sistema de Gestão Musicoterapeutas",
      "",
      `Olá! Suas credenciais de acesso ao MuseTera foram criadas:`,
      "",
      `📧 E-mail: ${email || "Não informado"}`,
    ];

    if (includePassword) {
      lines.push(`🔑 Senha: ${includePassword}`);
    }

    lines.push(
      `👤 Perfil: ${getRole()}`,
      `⏰ Limite de Acesso: ${getAccessLimit()}`,
      `🌐 Link de Acesso: https://portal.musetera.com.br/login`,
      "",
      "Bem-vindo(a) ao MuseTera! 🎼"
    );

    return lines.join("\n");
  };

  const handleCopyMessage = async () => {
    const message = generateCredentialsMessage(newPassword || undefined);
    await navigator.clipboard.writeText(message);
    setCopied(true);
    toast.success("Mensagem copiada para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetPassword = async () => {
    setResetting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("reset-user-password", {
        body: { targetUserId: user.id },
      });

      if (response.error) throw response.error;
      
      const { newPassword: generatedPassword } = response.data;
      setNewPassword(generatedPassword);
      toast.success("Senha redefinida com sucesso!");
      setShowResetDialog(false);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      toast.error(error.message || "Erro ao redefinir senha");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-xl">🎵</span>
            MuseTera - Dados de Acesso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border">
              <Mail className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p className="text-sm font-medium truncate">{email || "Não informado"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border">
              <Key className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Senha</p>
                <div className="flex items-center gap-2">
                  {newPassword ? (
                    <code className="text-sm font-mono bg-primary/10 px-2 py-0.5 rounded">
                      {newPassword}
                    </code>
                  ) : (
                    <span className="text-sm text-muted-foreground">••••••••</span>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {newPassword ? "Nova senha gerada" : "Criptografada"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border">
              <User className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Perfil</p>
                <Badge variant={user.user_roles?.[0]?.role === 'admin' ? 'default' : 'secondary'}>
                  {getRole()}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border">
              <Clock className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Limite de Acesso</p>
                <p className="text-sm font-medium">{getAccessLimit()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border">
              <Link2 className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Link de Acesso</p>
                <a 
                  href="https://portal.musetera.com.br/login" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  https://portal.musetera.com.br/login
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCopyMessage}
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? "Copiado!" : "Copiar Mensagem"}
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => setShowResetDialog(true)}
              disabled={resetting}
            >
              {resetting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Redefinir Senha
            </Button>
          </div>

          {newPassword && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-700 dark:text-green-400">
                ✓ Nova senha gerada! Clique em "Copiar Mensagem" para enviar as credenciais completas ao usuário.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir Senha</AlertDialogTitle>
            <AlertDialogDescription>
              Uma nova senha aleatória será gerada para o usuário <strong>{user.name}</strong>. 
              A senha atual será substituída e o usuário precisará usar a nova senha para fazer login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword} disabled={resetting}>
              {resetting ? "Redefinindo..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
