'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => prev === 'ar' ? 'en' : 'ar');
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
