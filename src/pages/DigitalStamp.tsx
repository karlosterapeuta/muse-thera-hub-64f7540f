import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, User } from 'lucide-react';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function DigitalStamp() {
  const { t } = useTranslation('digitalStamp');
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
    name: t('defaultTexts.name'),
    title: t('defaultTexts.title'),
    registration: t('defaultTexts.registration'),
    email: t('defaultTexts.email'),
    phone: t('defaultTexts.phone'),
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
        console.error(t('messages.qrCodeError'), error);
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
          toast.success(t('messages.downloadSuccess'));
        }
      }, 'image/png');
    } catch (error) {
      console.error(t('messages.qrCodeError'), error);
      toast.error(t('messages.downloadError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl">
      <header className="text-center mb-6 sm:mb-8 relative">
        <div className="absolute top-0 right-0">
          <LanguageSelector />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground px-2">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base px-2">
          {t('subtitle')}
        </p>
      </header>

      <div className="flex flex-col xl:flex-row items-start justify-center gap-6 sm:gap-8 lg:gap-12">
        {/* Preview Section */}
        <div className="w-full xl:w-auto flex flex-col items-center gap-6 sm:gap-8 xl:sticky xl:top-8">
          {/* Signature Preview */}
          <div className="w-full max-w-md px-2 sm:px-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 text-center">
              {t('signaturePreview')}
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
              {t('stampPreview')}
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
                <Label htmlFor="therapistName">{t('form.fullName')}</Label>
                <Input
                  id="therapistName"
                  type="text"
                  placeholder={t('form.placeholders.fullName')}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="therapistTitle">{t('form.professionalTitle')}</Label>
                <Input
                  id="therapistTitle"
                  type="text"
                  placeholder={t('form.placeholders.professionalTitle')}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="registrationNumber">
                  {t('form.registration')}
                </Label>
                <Input
                  id="registrationNumber"
                  type="text"
                  placeholder={t('form.placeholders.registration')}
                  value={formData.registration}
                  onChange={(e) => handleInputChange('registration', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="therapistEmail" className="text-sm">{t('form.email')}</Label>
                  <Input
                    id="therapistEmail"
                    type="email"
                    placeholder={t('form.placeholders.email')}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="therapistPhone" className="text-sm">{t('form.phone')}</Label>
                  <Input
                    id="therapistPhone"
                    type="tel"
                    placeholder={t('form.placeholders.phone')}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="qrLink">{t('form.qrLink')}</Label>
                <Input
                  id="qrLink"
                  type="url"
                  placeholder={t('form.placeholders.qrLink')}
                  value={formData.qrLink}
                  onChange={(e) => handleInputChange('qrLink', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="therapistPhotoUpload">{t('form.uploadPhoto')}</Label>
                <Input
                  id="therapistPhotoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
              <Button
                onClick={() =>
                  downloadElementAsPng(
                    'signaturePreview',
                    'assinatura-digital.png',
                    setIsGeneratingSignature
                  )
                }
                disabled={isGeneratingSignature}
                className="w-full bg-teal-600 hover:bg-teal-700 h-10 sm:h-11 text-sm sm:text-base"
              >
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {isGeneratingSignature ? t('buttons.downloading') : t('buttons.downloadSignature')}
              </Button>
              <Button
                onClick={() =>
                  downloadElementAsPng('stampPreview', 'carimbo-digital.png', setIsGeneratingStamp)
                }
                disabled={isGeneratingStamp}
                variant="secondary"
                className="w-full h-10 sm:h-11 text-sm sm:text-base"
              >
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {isGeneratingStamp ? t('buttons.downloading') : t('buttons.downloadStamp')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
