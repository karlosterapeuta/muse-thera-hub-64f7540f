import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InviteCodeDisplayProps {
  inviteCode: string;
  onClose: () => void;
}

export function InviteCodeDisplay({ inviteCode, onClose }: InviteCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const inviteUrl = `${window.location.origin}/register?invite=${inviteCode}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copiado!",
        description: "Link de convite copiado para a área de transferência.",
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Código de Convite Gerado!</CardTitle>
          <CardDescription className="text-green-600">
            Compartilhe o código ou link abaixo com o novo usuário
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código de Convite</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                value={inviteCode}
                readOnly
                className="font-mono text-lg font-bold text-center bg-white"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(inviteCode)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Link de Cadastro</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                value={inviteUrl}
                readOnly
                className="text-sm bg-white"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(inviteUrl)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(inviteUrl, '_blank')}
              className="flex-1 gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Testar Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Instruções para o usuário:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Acesse o link de cadastro fornecido</li>
          <li>• O código é válido por 7 dias</li>
          <li>• Após o cadastro, o usuário poderá fazer login normalmente</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}