import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, User, Camera, Check, Save } from 'lucide-react';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProfessionalData } from '@/hooks/useProfessionalData';
import { useQueryClient } from '@tanstack/react-query';

export default function DigitalStamp() {
  const { data: professionalData } = useProfessionalData();
  const queryClient = useQueryClient();
  
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
  const [isSaving, setIsSaving] = useState(false);

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

  // Load existing data from professional profile
  useEffect(() => {
    if (professionalData) {
      setFormData({
        name: professionalData.name || '',
        title: professionalData.specialty || 'Musicoterapeuta',
        registration: professionalData.register || '',
        email: professionalData.email || '',
        phone: professionalData.phone || '',
        qrLink: '',
      });
      
      // Load existing signature/stamp if available
      if (professionalData.avatar_url) {
        setPhotoUrl(professionalData.avatar_url);
      }
    }
  }, [professionalData]);

  const generateQrCodes = async () => {
    if (formData.qrLink) {
      try {
        const signatureQr = await QRCode.toDataURL(formData.qrLink, {
          width: 300,
          margin: 1,
          errorCorrectionLevel: 'H',
          color: { dark: '#0f766e', light: '#ffffff' }
        });
        const stampQr = await QRCode.toDataURL(formData.qrLink, {
          width: 250,
          margin: 1,
          errorCorrectionLevel: 'H',
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

  const convertElementToBlob = async (elementId: string): Promise<Blob | null> => {
    const element = document.getElementById(elementId);
    if (!element) return null;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 4,
        useCORS: true,
        logging: false,
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: true,
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Erro ao converter elemento para blob:', error);
      return null;
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
        scale: 4,
        useCORS: true,
        logging: false,
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: true,
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
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast.error('Erro ao gerar a imagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async () => {
    if (!professionalData?.id) {
      toast.error('Dados profissionais não encontrados');
      return;
    }

    setIsSaving(true);
    try {
      // Convert signature and stamp to blobs
      const signatureBlob = await convertElementToBlob('signaturePreview');
      const stampBlob = await convertElementToBlob('stampPreview');

      if (!signatureBlob || !stampBlob) {
        toast.error('Erro ao gerar as imagens');
        return;
      }

      // Upload signature to storage
      const signatureFileName = `${professionalData.id}/signature_${Date.now()}.png`;
      const { error: signatureUploadError, data: signatureData } = await supabase.storage
        .from('digital-signatures')
        .upload(signatureFileName, signatureBlob, {
          contentType: 'image/png',
          upsert: true,
        });

      if (signatureUploadError) {
        console.error('Erro ao fazer upload da assinatura:', signatureUploadError);
        toast.error('Erro ao salvar assinatura');
        return;
      }

      // Upload stamp to storage
      const stampFileName = `${professionalData.id}/stamp_${Date.now()}.png`;
      const { error: stampUploadError, data: stampData } = await supabase.storage
        .from('digital-signatures')
        .upload(stampFileName, stampBlob, {
          contentType: 'image/png',
          upsert: true,
        });

      if (stampUploadError) {
        console.error('Erro ao fazer upload do carimbo:', stampUploadError);
        toast.error('Erro ao salvar carimbo');
        return;
      }

      // Get public URLs
      const { data: signatureUrlData } = supabase.storage
        .from('digital-signatures')
        .getPublicUrl(signatureFileName);

      const { data: stampUrlData } = supabase.storage
        .from('digital-signatures')
        .getPublicUrl(stampFileName);

      // Update professional record with URLs
      const { error: updateError } = await supabase
        .from('professionals')
        .update({
          digital_signature_url: signatureUrlData.publicUrl,
          digital_stamp_url: stampUrlData.publicUrl,
        })
        .eq('id', professionalData.id);

      if (updateError) {
        console.error('Erro ao atualizar registro profissional:', updateError);
        toast.error('Erro ao salvar no banco de dados');
        return;
      }

      toast.success('Assinatura e carimbo salvos com sucesso! Agora serão usados automaticamente nos PDFs.');
      
      // Invalidate professional data cache to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["professional-data"] });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro inesperado ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl">
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground px-2">
          Assinatura e Carimbo Digital MuseTera
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base px-2">
          Gerador de Assinatura e Carimbo Digital personalizado do sistema MuseTera.
        </p>
      </header>

      <div className="flex flex-col xl:flex-row items-start justify-center gap-6 sm:gap-8 lg:gap-12">
        {/* Preview Section */}
        <div className="w-full xl:w-auto flex flex-col items-center gap-6 sm:gap-8 xl:sticky xl:top-8">
          {/* Signature Preview */}
          <div className="w-full max-w-md px-2 sm:px-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 text-center">
              Pré-visualização da Assinatura
            </h2>
            <Card
              id="signaturePreview"
              className="w-full bg-card p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
            >
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-border overflow-hidden flex items-center justify-center bg-muted">
                {photoUrl ? (
                  <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-bold text-teal-700 break-words">
                  {formData.name || defaultTexts.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground break-words">
                  {formData.title || defaultTexts.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 break-words">
                  {formData.registration || defaultTexts.registration}
                </p>
                <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                  <p className="break-all">{formData.email || defaultTexts.email}</p>
                  <p className="break-words">{formData.phone || defaultTexts.phone}</p>
                </div>
              </div>
              {signatureQrDataUrl && (
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20">
                  <img src={signatureQrDataUrl} alt="QR Code" className="w-full h-full" />
                </div>
              )}
            </Card>
          </div>

          {/* Stamp Preview */}
          <div className="w-full max-w-xs mx-auto px-2 sm:px-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 text-center">
              Pré-visualização do Carimbo
            </h2>
            <Card
              id="stampPreview"
              className="w-full aspect-square bg-card p-3 sm:p-4 flex flex-col items-center justify-center text-center border-4 border-teal-600"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-border overflow-hidden flex items-center justify-center bg-muted mb-2 sm:mb-3">
                {photoUrl ? (
                  <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-teal-700 leading-tight break-words px-1">
                {formData.name || defaultTexts.name}
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1 break-words px-1">
                {formData.title || defaultTexts.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 break-words px-1">
                {formData.registration || defaultTexts.registration}
              </p>
              {stampQrDataUrl && (
                <div className="w-12 h-12 sm:w-16 sm:h-16 mt-2 sm:mt-3">
                  <img src={stampQrDataUrl} alt="QR Code" className="w-full h-full" />
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-md mx-auto px-2 sm:px-0">
          <Card className="p-4 sm:p-6 lg:p-8">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="therapistEmail" className="text-sm">Email</Label>
                  <Input
                    id="therapistEmail"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="therapistPhone" className="text-sm">Telefone</Label>
                  <Input
                    id="therapistPhone"
                    type="tel"
                    placeholder="(41) 99999-8888"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="text-sm"
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

              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5 text-teal-600" />
                  Adicione sua Foto ou Logo
                </Label>
                
                <Card className="relative overflow-hidden border-2 border-dashed hover:border-solid border-teal-300 dark:border-teal-600 bg-teal-50/30 dark:bg-teal-950/20 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 transition-all cursor-pointer group">
                  <label htmlFor="therapistPhotoUpload" className="cursor-pointer block p-6">
                    
                    {photoUrl ? (
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={photoUrl} 
                            alt="Preview" 
                            className="h-20 w-20 rounded-full object-cover border-4 border-teal-500"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <p className="font-semibold text-teal-900 dark:text-teal-100">
                            Imagem carregada!
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Essa imagem aparecerá no seu carimbo e assinatura
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={(e) => {
                              e.preventDefault();
                              setPhotoUrl('');
                            }}
                          >
                            Alterar imagem
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="bg-teal-100 dark:bg-teal-900/50 rounded-full p-4 group-hover:scale-110 transition-transform">
                          <User className="h-12 w-12 text-teal-600 dark:text-teal-400" />
                        </div>
                        
                        <div>
                          <p className="font-semibold text-base text-teal-900 dark:text-teal-100">
                            Clique para selecionar sua foto ou logo
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Essa imagem aparecerá no seu <strong>carimbo</strong> e <strong>assinatura digital</strong>
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Formatos aceitos: JPG, PNG • Tamanho máximo: 5MB
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <Input
                      id="therapistPhotoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </Card>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
              <Button
                onClick={saveToDatabase}
                disabled={isSaving || !formData.name}
                className="w-full bg-primary hover:bg-primary/90 h-12 sm:h-13 text-sm sm:text-base font-semibold"
              >
                <Save className="mr-2 h-5 w-5" />
                {isSaving ? 'Salvando...' : 'Salvar Assinatura e Carimbo'}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() =>
                    downloadElementAsPng(
                      'signaturePreview',
                      'assinatura-digital.png',
                      setIsGeneratingSignature
                    )
                  }
                  disabled={isGeneratingSignature}
                  variant="outline"
                  className="w-full h-10 sm:h-11 text-sm sm:text-base"
                >
                  <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {isGeneratingSignature ? 'Gerando...' : 'Baixar Assinatura'}
                </Button>
                <Button
                  onClick={() =>
                    downloadElementAsPng('stampPreview', 'carimbo-digital.png', setIsGeneratingStamp)
                  }
                  disabled={isGeneratingStamp}
                  variant="outline"
                  className="w-full h-10 sm:h-11 text-sm sm:text-base"
                >
                  <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {isGeneratingStamp ? 'Gerando...' : 'Baixar Carimbo'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
