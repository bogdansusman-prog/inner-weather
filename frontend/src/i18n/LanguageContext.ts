import { createContext, useContext } from 'react';
import type { TextKey } from './en';

export type Lang = 'en' | 'ro';

type LanguageValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TextKey) => string; // t('nav.home') -> textul in limba curenta
};

export const LanguageContext = createContext<LanguageValue | null>(null);

// hook-ul pe care il folosesc componentele: const { t } = useLanguage();
export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider');
  return value;
}