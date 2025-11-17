import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';

const languages = [
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷', nativeName: 'Português (Brasil)' },
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English (US)' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
];

export function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const currentLanguage = languages.find(
    (lang) => lang.code === i18n.language
  ) || languages[0];

  const changeLanguage = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    
    // Atualizar atributo lang do HTML
    document.documentElement.lang = langCode;
    
    // Toast de confirmação
    const langName = languages.find(l => l.code === langCode)?.name;
    toast.success(t('common:messages.languageChanged'), {
      description: `${t('common:messages.nowUsing')} ${langName}`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9"
          title={t('common:selectLanguage')}
        >
          <Globe className="h-5 w-5" />
          <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">
            {currentLanguage.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={
              i18n.language === lang.code
                ? 'bg-accent font-medium'
                : ''
            }
          >
            <span className="mr-3 text-lg">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm">{lang.nativeName}</span>
              {i18n.language === lang.code && (
                <span className="text-xs text-muted-foreground">
                  {t('common:active')}
                </span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
