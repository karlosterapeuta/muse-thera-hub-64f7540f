import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, User } from 'lucide-react';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { toast } from 'sonner';

export default function DigitalStamp() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    registration: '',
    email: '',
    phone: '',
    qrLink: '',
  });

  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [signatureQrDataUrl, setSignatureQrDataUrl] = useState<string>('');
  const [stampQrDataUrl, setStampQrDataUrl] = useState<string>('');
  const [isGeneratingSignature, setIsGeneratingSignature] = useState(false);
  const [isGeneratingStamp, setIsGeneratingStamp] = useState(false);

  const defaultTexts = {
    name: 'Nome do Profissional',
    title: 'Título Profissional',
    registration: 'Nº de Registro',
    email: 'email@dominio.com',
    phone: '(00) 12345-6789',
  };

  useEffect(() => {
    generateQrCodes();
  }, [formData.qrLink]);

  const generateQrCodes = async () => {
    if (formData.qrLink) {
      try {
        const signatureQr = await QRCode.toDataURL(formData.qrLink, {
          width: 80,
          margin: 1,
          color: { dark: '#0f766e', light: '#ffffff' }
        });
        const stampQr = await QRCode.toDataURL(formData.qrLink, {
          width: 64,
          margin: 1,
          color: { dark: '#0f766e', light: '#ffffff' }
        });
        setSignatureQrDataUrl(signatureQr);
        setStampQrDataUrl(stampQr);
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
      }
    } else {
      setSignatureQrDataUrl('');
      setStampQrDataUrl('');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadElementAsPng = async (
    elementId: string,
    filename: string,
    setLoading: (loading: boolean) => void
  ) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setLoading(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = filename;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          toast.success('Download realizado com sucesso!');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast.error('Erro ao gerar a imagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Assinatura e Carimbo Digital MuseTera
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerador de Assinatura e Carimbo Digital personalizado do sistema MuseTera.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
        {/* Preview Section */}
        <div className="w-full lg:w-auto flex flex-col items-center gap-8 lg:sticky lg:top-8">
          {/* Signature Preview */}
          <div className="w-full max-w-md">
            <h2 className="text-lg font-semibold text-foreground mb-2 text-center">
              Pré-visualização da Assinatura
            </h2>
            <Card
              id="signaturePreview"
              className="w-full bg-card p-4 flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-24 h-24 rounded-full border-4 border-border overflow-hidden flex items-center justify-center bg-muted">
                {photoUrl ? (
                  <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-teal-700">
                  {formData.name || defaultTexts.name}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {formData.title || defaultTexts.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.registration || defaultTexts.registration}
                </p>
                <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                  <p>{formData.email || defaultTexts.email}</p>
                  <p>{formData.phone || defaultTexts.phone}</p>
                </div>
              </div>
              {signatureQrDataUrl && (
                <div className="flex-shrink-0 w-20 h-20">
                  <img src={signatureQrDataUrl} alt="QR Code" className="w-full h-full" />
                </div>
              )}
            </Card>
          </div>

          {/* Stamp Preview */}
          <div className="w-full max-w-xs">
            <h2 className="text-lg font-semibold text-foreground mb-2 text-center">
              Pré-visualização do Carimbo
            </h2>
            <Card
              id="stampPreview"
              className="w-full aspect-square bg-card p-4 flex flex-col items-center justify-center text-center border-4 border-teal-600"
            >
              <div className="w-20 h-20 rounded-full border-2 border-border overflow-hidden flex items-center justify-center bg-muted mb-3">
                {photoUrl ? (
                  <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-base font-bold text-teal-700 leading-tight">
                {formData.name || defaultTexts.name}
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                {formData.title || defaultTexts.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formData.registration || defaultTexts.registration}
              </p>
              {stampQrDataUrl && (
                <div className="w-16 h-16 mt-3">
                  <img src={stampQrDataUrl} alt="QR Code" className="w-full h-full" />
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-md">
          <Card className="p-6 lg:p-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="therapistName">Nome Completo</Label>
                <Input
                  id="therapistName"
                  type="text"
                  placeholder="Ex: Ana de Souza"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="therapistTitle">Título Profissional</Label>
                <Input
                  id="therapistTitle"
                  type="text"
                  placeholder="Ex: Musicoterapeuta"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="registrationNumber">
                  Nº de Registro (Associação/Conselho)
                </Label>
                <Input
                  id="registrationNumber"
                  type="text"
                  placeholder="Ex: AMT-PR 1234"
                  value={formData.registration}
                  onChange={(e) => handleInputChange('registration', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="therapistEmail">Email</Label>
                  <Input
                    id="therapistEmail"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="therapistPhone">Telefone</Label>
                  <Input
                    id="therapistPhone"
                    type="tel"
                    placeholder="(41) 99999-8888"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="qrLink">Link para QR Code (opcional)</Label>
                <Input
                  id="qrLink"
                  type="url"
                  placeholder="https://seusite.com ou perfil"
                  value={formData.qrLink}
                  onChange={(e) => handleInputChange('qrLink', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="therapistPhotoUpload">Sua Foto ou Logo</Label>
                <Input
                  id="therapistPhotoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button
                onClick={() =>
                  downloadElementAsPng(
                    'signaturePreview',
                    'assinatura-digital.png',
                    setIsGeneratingSignature
                  )
                }
                disabled={isGeneratingSignature}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                <Download className="mr-2 h-5 w-5" />
                {isGeneratingSignature ? 'Gerando...' : 'Baixar Assinatura (PNG)'}
              </Button>
              <Button
                onClick={() =>
                  downloadElementAsPng('stampPreview', 'carimbo-digital.png', setIsGeneratingStamp)
                }
                disabled={isGeneratingStamp}
                variant="secondary"
                className="w-full"
              >
                <Download className="mr-2 h-5 w-5" />
                {isGeneratingStamp ? 'Gerando...' : 'Baixar Carimbo (PNG)'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
