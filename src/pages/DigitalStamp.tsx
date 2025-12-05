import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Camera, Check, Save, Music, FileText, Mail, Phone, CheckCircle2 } from 'lucide-react';
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
  const [isSaving, setIsSaving] = useState(false);

  const defaultTexts = {
    name: 'Nome do Profissional',
    title: 'Título Profissional',
    registration: 'Nº de Registro',
    email: 'email@dominio.com',
    phone: '(00) 12345-6789',
  };

  // Force cache refresh on mount to always load fresh data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["professional-data"] });
  }, []);

  useEffect(() => {
    generateQrCodes();
  }, [formData.qrLink]);

  // Load existing data from professional profile
  useEffect(() => {
    if (professionalData) {
      console.log('🔍 Professional Data carregado:', {
        stamp_photo_url: professionalData.stamp_photo_url,
        avatar_url: professionalData.avatar_url
      });

      setFormData({
        name: professionalData.name || '',
        title: professionalData.specialty || 'Musicoterapeuta',
        registration: professionalData.register || '',
        email: professionalData.email || '',
        phone: professionalData.phone || '',
        qrLink: (professionalData as any).qr_link || '',
      });
      
      // Priorizar foto específica do carimbo, depois avatar como fallback
      if (professionalData.stamp_photo_url) {
        console.log('✅ Usando stamp_photo_url:', professionalData.stamp_photo_url);
        setPhotoUrl(professionalData.stamp_photo_url);
      } else if (professionalData.avatar_url) {
        console.log('⚠️ Usando fallback avatar_url:', professionalData.avatar_url);
        setPhotoUrl(professionalData.avatar_url);
      } else {
        console.log('❌ Nenhuma foto disponível');
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !professionalData?.id) return;

    // Mostrar preview local imediatamente
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Upload para storage
      const fileName = `${professionalData.id}/stamp_photo_${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('digital-signatures')
        .upload(fileName, file, { contentType: file.type, upsert: true });

      if (uploadError) {
        console.error('Erro ao fazer upload da foto:', uploadError);
        toast.error('Erro ao salvar foto do carimbo');
        return;
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('digital-signatures')
        .getPublicUrl(fileName);

      // Salvar URL no banco de dados
      const { error: updateError } = await supabase
        .from('professionals')
        .update({ stamp_photo_url: urlData.publicUrl })
        .eq('id', professionalData.id);

      if (updateError) {
        console.error('Erro ao atualizar banco:', updateError);
        toast.error('Erro ao salvar foto do carimbo');
        return;
      }
      
      setPhotoUrl(urlData.publicUrl);
      toast.success('Foto do carimbo salva com sucesso!');
      
      // Atualizar cache
      queryClient.invalidateQueries({ queryKey: ["professional-data"] });
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro ao processar foto do carimbo');
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

    // Update professional record with URLs AND form data
    const { error: updateError } = await supabase
      .from('professionals')
      .update({
        // Dados do formulário
        name: formData.name,
        specialty: formData.title,
        register: formData.registration,
        email: formData.email,
        phone: formData.phone,
        qr_link: formData.qrLink,
        // Imagens
        digital_signature_url: signatureUrlData.publicUrl,
        digital_stamp_url: stampUrlData.publicUrl,
      } as any)
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
              className="w-full overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 shadow-lg border-0"
            >
              {/* Decorative Top Bar */}
              <div className="h-2 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500" />
              
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  {/* Professional Photo with Gradient Border */}
                  <div className="flex-shrink-0 relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 via-cyan-400 to-teal-600 blur-sm opacity-75" />
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-background shadow-xl overflow-hidden flex items-center justify-center bg-muted">
                      {photoUrl ? (
                        <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Professional Information + QR Code Container */}
                  <div className="flex-grow w-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      {/* Info Section */}
                      <div className="flex-grow text-center sm:text-left space-y-2 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-teal-700 dark:text-teal-400 break-words leading-tight">
                          {formData.name || defaultTexts.name}
                        </h3>
                        
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800">
                          <Music className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                          <span className="text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-400 break-words">
                            {formData.title || defaultTexts.title}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1.5 text-xs sm:text-sm">
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="break-words">{formData.registration || defaultTexts.registration}</span>
                          </div>
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="break-all">{formData.email || defaultTexts.email}</span>
                          </div>
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="break-words">{formData.phone || defaultTexts.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* QR Code - Now inside the info container */}
                      {signatureQrDataUrl && (
                        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 border-teal-200 dark:border-teal-800 rounded-lg shadow-md bg-background p-1">
                          <img src={signatureQrDataUrl} alt="QR Code" className="w-full h-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Footer */}
              <div className="border-t border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 via-cyan-50 to-teal-50 dark:from-teal-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                    Assinatura Digital Verificada
                  </span>
                  <Music className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="text-xs text-muted-foreground">Sistema MuseTera</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Stamp Preview */}
          <div className="w-full max-w-xs mx-auto px-2 sm:px-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 text-center">
              Pré-visualização do Carimbo
            </h2>
            <Card
              id="stampPreview"
              className="w-full aspect-square relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 shadow-2xl border-0"
            >
              {/* Outer Decorative Ring */}
              <div className="absolute inset-0">
                <div className="absolute inset-4 rounded-full border-4 border-dashed border-teal-300 dark:border-teal-700 opacity-30" />
                <div className="absolute inset-6 rounded-full border-2 border-teal-400 dark:border-teal-600 opacity-50" />
              </div>

              {/* Main Stamp Border */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-teal-500 via-cyan-400 to-teal-600 opacity-20 blur-xl" />
              <div className="absolute inset-3 rounded-full border-[6px] border-teal-600 dark:border-teal-500 shadow-lg" />
              
              {/* Content Container */}
              <div className="relative h-full flex flex-col items-center justify-center text-center p-6 sm:p-8">
                {/* Professional Photo */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 via-cyan-400 to-teal-600 blur-md opacity-75" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-background shadow-xl overflow-hidden flex items-center justify-center bg-muted">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Professional Name */}
                <h3 className="text-sm sm:text-base font-bold text-teal-700 dark:text-teal-400 leading-tight break-words px-2 mb-2">
                  {formData.name || defaultTexts.name}
                </h3>

                {/* Decorative Separator */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent mb-2" />

                {/* Specialty Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 border border-teal-300 dark:border-teal-700 mb-2">
                  <Music className="w-3 h-3 text-teal-700 dark:text-teal-400" />
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 break-words uppercase tracking-wide">
                    {formData.title || defaultTexts.title}
                  </span>
                </div>

                {/* Registration */}
                <p className="text-xs font-medium text-muted-foreground mt-1 break-words px-2">
                  {formData.registration || defaultTexts.registration}
                </p>

                {/* QR Code */}
                {stampQrDataUrl && (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mt-3 border-2 border-teal-300 dark:border-teal-700 rounded-md shadow-md bg-background p-1">
                    <img src={stampQrDataUrl} alt="QR Code" className="w-full h-full" />
                  </div>
                )}

                {/* Verification Badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 shadow-md">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    MuseTera Verified
                  </span>
                  <Music className="w-3 h-3 text-white" />
                </div>
              </div>
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
              
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
