import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Music, Mail, Lock, Globe, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatAccessLimit } from "../utils/formatAccessLimit";

interface UserCredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    accessLimit?: string;
  };
}

export function UserCredentialsModal({ open, onOpenChange, userData }: UserCredentialsModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateMessage = () => {
    return `🎵 MuseTera - Sistema de Gestão Musicoterapeutas

Olá! Suas credenciais de acesso ao MuseTera foram criadas:

📧 E-mail: ${userData.email}
🔑 Senha: ${userData.password}
👤 Perfil: ${userData.role === 'admin' ? 'Administrador' : 'Profissional'}
⏰ Limite de Acesso: ${formatAccessLimit(userData.accessLimit)}
🌐 Link de Acesso: https://portal.musetera.com.br/login

Bem-vindo(a) ao MuseTera! 🎼`;
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(generateMessage());
      setCopied(true);
      toast({
        title: "Mensagem copiada!",
        description: "As credenciais foram copiadas para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a mensagem.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            Credenciais do MuseTera - {userData.name}
          </DialogTitle>
          <DialogDescription>
            Credenciais de acesso geradas para o novo usuário
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Music className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-primary">MuseTera - Sistema de Gestão Musicoterapeutas</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Olá! Suas credenciais de acesso ao MuseTera foram criadas:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                  <Mail className="h-4 w-4 text-primary" />
                  <div>
                    <span className="text-sm font-medium">E-mail:</span>
                    <p className="text-sm text-muted-foreground">{userData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                  <Lock className="h-4 w-4 text-primary" />
                  <div>
                    <span className="text-sm font-medium">Senha:</span>
                    <p className="text-sm text-muted-foreground font-mono">{userData.password}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <span className="text-sm font-medium">Limite de Acesso:</span>
                    <p className="text-sm text-muted-foreground">{formatAccessLimit(userData.accessLimit)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                  <Globe className="h-4 w-4 text-primary" />
                  <div>
                    <span className="text-sm font-medium">Link de Acesso:</span>
                    <p className="text-sm text-muted-foreground">https://portal.musetera.com.br/login</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-center text-primary font-medium mt-4">
                Bem-vindo(a) ao MuseTera! 🎼
              </p>
            </CardContent>
          </Card>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleCopyMessage} 
              className="flex-1 gap-2"
              variant={copied ? "secondary" : "default"}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar Mensagem
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => onOpenChange(false)} 
              variant="outline"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}