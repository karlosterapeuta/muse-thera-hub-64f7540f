import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, Clock, QrCode, AlertCircle, Loader2 } from "lucide-react";
import { CourseWithProgress, formatPrice, CoursePurchase } from "@/types/courses";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import QRCode from "qrcode";

interface CoursePurchaseModalProps {
  course: CourseWithProgress | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CoursePurchaseModal({
  course,
  isOpen,
  onClose,
  onSuccess
}: CoursePurchaseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [purchase, setPurchase] = useState<CoursePurchase | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Generate PIX code when modal opens
  useEffect(() => {
    if (isOpen && course && !purchase) {
      generatePixPayment();
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

  const generatePixPayment = async () => {
    if (!course) return;
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para comprar");
        return;
      }

      // Get user profile for buyer info
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      // Calculate amounts
      const amountCents = course.price_cents || 0;
      const creatorPercentage = 70; // Default commission
      const creatorAmount = Math.floor(amountCents * (creatorPercentage / 100));
      const platformAmount = amountCents - creatorAmount;

      // Generate PIX code (simplified - in production would use a payment gateway)
      const pixCode = generateStaticPixCode(course.title, amountCents);
      const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      // Create purchase record
      const { data: newPurchase, error } = await supabase
        .from('course_purchases')
        .insert({
          course_id: course.id,
          user_id: user.id,
          creator_id: course.creator_id,
          amount_cents: amountCents,
          creator_amount_cents: creatorAmount,
          platform_amount_cents: platformAmount,
          payment_status: 'pending',
          payment_method: 'pix',
          pix_code: pixCode,
          pix_expiration: expirationTime.toISOString(),
          buyer_name: profile?.name || user.email,
          buyer_email: user.email
        })
        .select()
        .single();

      if (error) throw error;

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(pixCode, {
        width: 256,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });

      setPurchase(newPurchase as CoursePurchase);
      setQrCodeDataUrl(qrDataUrl);
      setTimeLeft(30 * 60); // 30 minutes in seconds

    } catch (error) {
      console.error('Error generating PIX:', error);
      toast.error("Erro ao gerar pagamento PIX");
    } finally {
      setIsLoading(false);
    }
  };

  const generateStaticPixCode = (courseName: string, amountCents: number): string => {
    // This is a simplified static PIX code generator
    // In production, you would integrate with a payment gateway (Mercado Pago, Stripe, etc.)
    const amount = (amountCents / 100).toFixed(2);
    const cleanName = courseName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
    return `00020126580014BR.GOV.BCB.PIX0136MUSETERA-CURSO-${cleanName}520400005303986540${amount}5802BR5925MuseTera Cursos6009SAO PAULO62070503***6304`;
  };

  const copyToClipboard = async () => {
    if (!purchase?.pix_code) return;
    
    try {
      await navigator.clipboard.writeText(purchase.pix_code);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Erro ao copiar código");
    }
  };

  const formatTimeLeft = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setPurchase(null);
    setQrCodeDataUrl("");
    onClose();
  };

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Pagamento via PIX
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Gerando código PIX...</p>
          </div>
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
              <Badge variant={timeLeft < 300 ? "destructive" : "secondary"}>
                {formatTimeLeft(timeLeft)}
              </Badge>
            </div>

            <Separator />

            {/* QR Code */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-lg">
                {qrCodeDataUrl && (
                  <img src={qrCodeDataUrl} alt="QR Code PIX" className="w-48 h-48" />
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
                  {purchase.pix_code}
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
            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-600">Pagamento Manual</p>
                <p className="text-muted-foreground">
                  Após realizar o pagamento, aguarde a confirmação do criador do curso para liberar seu acesso.
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
            <Button onClick={generatePixPayment}>Tentar novamente</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
