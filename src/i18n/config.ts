import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traduções PT-BR
import commonPT from './locales/pt-BR/common.json';
import authPT from './locales/pt-BR/auth.json';
import sidebarPT from './locales/pt-BR/sidebar.json';
import headerPT from './locales/pt-BR/header.json';
import patientsPT from './locales/pt-BR/patients.json';
import clinicalPT from './locales/pt-BR/clinical.json';
import phrasesPT from './locales/pt-BR/phrases.json';
import anamnesisPT from './locales/pt-BR/anamnesis.json';
import reportsPT from './locales/pt-BR/reports.json';
import gamesPT from './locales/pt-BR/games.json';
import financialPT from './locales/pt-BR/financial.json';
import navigationPT from './locales/pt-BR/navigation.json';
import pwaPT from './locales/pt-BR/pwa.json';
import profilePT from './locales/pt-BR/profile.json';
import digitalStampPT from './locales/pt-BR/digitalStamp.json';
import processesPT from './locales/pt-BR/processes.json';

// Importar traduções EN
import commonEN from './locales/en/common.json';
import authEN from './locales/en/auth.json';
import sidebarEN from './locales/en/sidebar.json';
import headerEN from './locales/en/header.json';
import patientsEN from './locales/en/patients.json';
import clinicalEN from './locales/en/clinical.json';
import phrasesEN from './locales/en/phrases.json';
import anamnesisEN from './locales/en/anamnesis.json';
import reportsEN from './locales/en/reports.json';
import gamesEN from './locales/en/games.json';
import financialEN from './locales/en/financial.json';
import navigationEN from './locales/en/navigation.json';
import pwaEN from './locales/en/pwa.json';
import profileEN from './locales/en/profile.json';
import digitalStampEN from './locales/en/digitalStamp.json';
import processesEN from './locales/en/processes.json';

// Importar traduções ES
import commonES from './locales/es/common.json';
import authES from './locales/es/auth.json';
import sidebarES from './locales/es/sidebar.json';
import headerES from './locales/es/header.json';
import patientsES from './locales/es/patients.json';
import clinicalES from './locales/es/clinical.json';
import phrasesES from './locales/es/phrases.json';
import anamnesisES from './locales/es/anamnesis.json';
import reportsES from './locales/es/reports.json';
import gamesES from './locales/es/games.json';
import financialES from './locales/es/financial.json';
import navigationES from './locales/es/navigation.json';
import pwaES from './locales/es/pwa.json';
import profileES from './locales/es/profile.json';
import digitalStampES from './locales/es/digitalStamp.json';
import processesES from './locales/es/processes.json';

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
        patients: patientsPT,
        clinical: clinicalPT,
        phrases: phrasesPT,
        anamnesis: anamnesisPT,
        reports: reportsPT,
        games: gamesPT,
        financial: financialPT,
        navigation: navigationPT,
        pwa: pwaPT,
        profile: profilePT,
        digitalStamp: digitalStampPT,
        processes: processesPT,
      },
      'en': {
        common: commonEN,
        auth: authEN,
        sidebar: sidebarEN,
        header: headerEN,
        patients: patientsEN,
        clinical: clinicalEN,
        phrases: phrasesEN,
        anamnesis: anamnesisEN,
        reports: reportsEN,
        games: gamesEN,
        financial: financialEN,
        navigation: navigationEN,
        pwa: pwaEN,
        profile: profileEN,
        digitalStamp: digitalStampEN,
        processes: processesEN,
      },
      'es': {
        common: commonES,
        auth: authES,
        sidebar: sidebarES,
        header: headerES,
        patients: patientsES,
        clinical: clinicalES,
        phrases: phrasesES,
        anamnesis: anamnesisES,
        reports: reportsES,
        games: gamesES,
        financial: financialES,
        navigation: navigationES,
        pwa: pwaES,
        profile: profileES,
        digitalStamp: digitalStampES,
        processes: processesES,
      }
    },
    fallbackLng: 'pt-BR',
    defaultNS: 'common',
    ns: ['common', 'auth', 'sidebar', 'header', 'patients', 'clinical', 'phrases', 'anamnesis', 'reports', 'games', 'financial', 'navigation', 'pwa', 'profile', 'digitalStamp', 'processes'],
    
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
