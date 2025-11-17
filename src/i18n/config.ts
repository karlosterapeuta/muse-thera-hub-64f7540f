import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traduções PT-BR
import commonPT from './locales/pt-BR/common.json';
import authPT from './locales/pt-BR/auth.json';
import sidebarPT from './locales/pt-BR/sidebar.json';
import headerPT from './locales/pt-BR/header.json';

// Importar traduções EN
import commonEN from './locales/en/common.json';
import authEN from './locales/en/auth.json';
import sidebarEN from './locales/en/sidebar.json';
import headerEN from './locales/en/header.json';

// Importar traduções ES
import commonES from './locales/es/common.json';
import authES from './locales/es/auth.json';
import sidebarES from './locales/es/sidebar.json';
import headerES from './locales/es/header.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        common: commonPT,
        auth: authPT,
        sidebar: sidebarPT,
        header: headerPT,
      },
      'en': {
        common: commonEN,
        auth: authEN,
        sidebar: sidebarEN,
        header: headerEN,
      },
      'es': {
        common: commonES,
        auth: authES,
        sidebar: sidebarES,
        header: headerES,
      }
    },
    fallbackLng: 'pt-BR',
    defaultNS: 'common',
    ns: ['common', 'auth', 'sidebar', 'header'],
    
    interpolation: {
      escapeValue: false, // React já faz escape
    },
    
    detection: {
      // Ordem de detecção: localStorage > navegador
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    }
  });

export default i18n;
