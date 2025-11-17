import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import { useProfessionalData } from "@/hooks/useProfessionalData";

export function HeaderGreeting() {
  const { t, i18n } = useTranslation('header');
  const { data: professional } = useProfessionalData();

  const localeMap = {
    'pt-BR': ptBR,
    'en': enUS,
    'es': es
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 18) return t('greeting.afternoon');
    return t('greeting.evening');
  };

  const getCurrentDate = () => {
    const locale = localeMap[i18n.language as keyof typeof localeMap] || ptBR;
    return format(new Date(), 'PPPP', { locale });
  };

  return (
    <div className="hidden lg:flex flex-col items-center text-center">
      <span className="text-sm font-semibold text-foreground">
        {getGreeting()}, {professional?.name?.split(' ')[0] || t('defaultName')}
      </span>
      <span className="text-xs text-muted-foreground capitalize">{getCurrentDate()}</span>
    </div>
  );
}
