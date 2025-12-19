import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Clock, QrCode, AlertCircle, Loader2, CheckCircle, User } from "lucide-react";
import { CourseWithProgress, formatPrice, CoursePurchase } from "@/types/courses";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CoursePurchaseModalProps {
  course: CourseWithProgress | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Função para formatar CPF
function formatCpf(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
}

// Função para validar CPF
function isValidCpf(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length !== 11) return false;
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(10))) return false;
  
  return true;
}

export function CoursePurchaseModal({
  course,
  isOpen,
  onClose,
  onSuccess
}: CoursePurchaseModalProps) {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [cpf, setCpf] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [purchase, setPurchase] = useState<CoursePurchase | null>(null);
  const [pixQrCode, setPixQrCode] = useState<string>("");
  const [pixCode, setPixCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && course) {
      // Check if free
      if (!course.price_cents || course.price_cents === 0) {
        handleFreeCourse();
      } else {
        // Load saved name from profile
        loadUserProfile();
      }
    }
  }, [isOpen, course]);

  // Countdown timer
  useEffect(() => {
    if (!purchase?.pix_expiration) return;
    
    const interval = setInterval(() => {
      const expiration = new Date(purchase.pix_expiration!).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiration - now) / 1000));
      setTimeLeft(diff);
      
      if (diff === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [purchase?.pix_expiration]);

  // Poll for payment status
  useEffect(() => {
    if (!purchase?.id || purchase.payment_status === 'paid') return;

    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from('course_purchases')
        .select('payment_status')
        .eq('id', purchase.id)
        .single();

      if (!error && data?.payment_status === 'paid') {
        toast.success("Pagamento confirmado! Acesso liberado.");
        onSuccess();
        handleClose();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [purchase?.id, purchase?.payment_status]);

  const loadUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();
      
      if (profile?.name) {
        setBuyerName(profile.name);
      }
    }
  };

  const handleFreeCourse = async () => {
    if (!course) return;
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado");
        return;
      }

      const { error: accessError } = await supabase
        .from('course_access')
        .insert({
          course_id: course.id,
          user_id: user.id,
          is_active: true,
        });

      if (accessError && !accessError.message.includes('duplicate')) {
        throw accessError;
      }

      toast.success("Acesso liberado! Aproveite o curso.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao liberar acesso");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buyerName.trim()) {
      toast.error("Por favor, informe seu nome completo");
      return;
    }
    
    if (!isValidCpf(cpf)) {
      toast.error("CPF inválido. Por favor, verifique o número informado.");
      return;
    }
    
    await generatePixPayment();
  };

  const generatePixPayment = async () => {
    if (!course) return;
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para comprar");
        return;
      }

      // Call Asaas edge function to generate PIX
      const { data, error } = await supabase.functions.invoke('asaas-create-pix-payment', {
        body: {
          courseId: course.id,
          userId: user.id,
          buyerName: buyerName.trim(),
          buyerEmail: user.email,
          buyerCpfCnpj: cpf.replace(/\D/g, ''),
        },
      });

      if (error) throw error;

      if (data.isFree) {
        toast.success("Acesso liberado! Aproveite o curso.");
        onSuccess();
        handleClose();
        return;
      }

      if (!data.success) {
        throw new Error(data.error || 'Erro ao gerar pagamento');
      }

      setPurchase(data.purchase as CoursePurchase);
      setPixQrCode(data.pixQrCode);
      setPixCode(data.pixCode);
      setStep('payment');
      
      // Calculate time left from expiration
      const expiration = new Date(data.expiresAt).getTime();
      const now = Date.now();
      setTimeLeft(Math.max(0, Math.floor((expiration - now) / 1000)));

    } catch (error: any) {
      console.error('Error generating PIX:', error);
      toast.error(error.message || "Erro ao gerar pagamento PIX");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!pixCode) return;
    
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Erro ao copiar código");
    }
  };

  const formatTimeLeft = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins.toString().padStart(2, '0')}m`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setPurchase(null);
    setPixQrCode("");
    setPixCode("");
    setStep('form');
    setCpf("");
    onClose();
  };

  if (!course) return null;

  const isFree = !course.price_cents || course.price_cents === 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isFree ? (
              <>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Curso Gratuito
              </>
            ) : step === 'form' ? (
              <>
                <User className="h-5 w-5 text-primary" />
                Dados para Pagamento
              </>
            ) : (
              <>
                <QrCode className="h-5 w-5 text-primary" />
                Pagamento via PIX
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              {isFree ? "Liberando acesso..." : "Gerando código PIX..."}
            </p>
          </div>
        ) : step === 'form' && !isFree ? (
          <form onSubmit={handleSubmitForm} className="space-y-4">
            {/* Course info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold line-clamp-1">{course.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-muted-foreground">Valor</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(course.price_cents || 0)}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Nome Completo *</Label>
                <Input
                  id="buyerName"
                  placeholder="Seu nome completo"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  maxLength={14}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Necessário para emissão do comprovante fiscal
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-primary/10 border border-primary/30 rounded-lg p-3">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-primary">Pagamento Seguro</p>
                <p className="text-muted-foreground">
                  Seus dados são protegidos e utilizados apenas para processamento do pagamento.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Continuar
              </Button>
            </div>
          </form>
        ) : purchase ? (
          <div className="space-y-4">
            {/* Course info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold line-clamp-1">{course.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-muted-foreground">Valor</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(course.price_cents || 0)}
                </span>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Expira em:</span>
              <Badge variant={timeLeft < 3600 ? "destructive" : "secondary"}>
                {formatTimeLeft(timeLeft)}
              </Badge>
            </div>

            <Separator />

            {/* QR Code from Asaas (base64 image) */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-lg">
                {pixQrCode && (
                  <img 
                    src={`data:image/png;base64,${pixQrCode}`} 
                    alt="QR Code PIX" 
                    className="w-48 h-48" 
                  />
                )}
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                Escaneie o QR Code com o app do seu banco
              </p>
            </div>

            <Separator />

            {/* Copy code */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Ou copie o código PIX:</p>
              <div className="flex gap-2">
                <code className="flex-1 bg-muted p-2 rounded text-xs break-all max-h-20 overflow-y-auto">
                  {pixCode}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-emerald-600">Confirmação Automática</p>
                <p className="text-muted-foreground">
                  Após realizar o pagamento, seu acesso será liberado automaticamente em poucos segundos.
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleClose}>
              Fechar
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-muted-foreground">Erro ao gerar pagamento</p>
            <Button onClick={() => setStep('form')}>Tentar novamente</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
