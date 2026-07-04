'use client';

import React, { createContext, useContext, useState, useCallback, useSyncExternalStore } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: (ar: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  toggleLanguage: () => {},
  isRTL: true,
  t: (ar: string, en: string) => ar,
});

function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'ar';
  const saved = localStorage.getItem('lang');
  if (saved === 'ar' || saved === 'en') return saved;
  return 'ar';
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const storedLang = useSyncExternalStore(
    subscribeToStorage,
    () => getInitialLang(),
    () => 'ar' as Language
  );

  const [lang, setLang] = useState<Language>(storedLang);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('lang', next);
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      return next;
    });
  }, []);

  const t = useCallback(
    (ar: string, en: string) => (lang === 'ar' ? ar : en),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, isRTL: lang === 'ar', t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
