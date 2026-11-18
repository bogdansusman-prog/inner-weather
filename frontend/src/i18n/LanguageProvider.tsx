import { useState, type ReactNode } from 'react';
import { en, type TextKey } from './en';
import { ro } from './ro';
import { LanguageContext, type Lang } from './LanguageContext';

const LANG_KEY = 'inner-weather:lang';
const TEXTS = { en, ro };

// limba salvata din vizita trecuta; engleza daca nu exista
function savedLang(): Lang {
  try {
    return localStorage.getItem(LANG_KEY) === 'ro' ? 'ro' : 'en';
  } catch {
    return 'en';
  }
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(savedLang);

  function setLang(next: Lang) {
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      // fara localStorage: limba tine doar pana la refresh
    }
  }

  function t(key: TextKey) {
    return TEXTS[lang][key];
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}