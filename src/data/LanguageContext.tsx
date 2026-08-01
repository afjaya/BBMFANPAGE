// src/data/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKeys } from './lang';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Deteksi bahasa browser pengunjung otomatis
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.startsWith('id')) {
      setLanguageState('id');
    } else {
      setLanguageState('en'); // Default untuk Amerika, Polandia, Nigeria, dll.
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Fungsi translasi mini 't' untuk dipanggil di komponen
  const t = (key: TranslationKeys): string => {
    return translations[language][key] || translations['en'][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook kustom agar komponen tinggal pakai dengan mudah
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage harus digunakan di dalam LanguageProvider');
  }
  return context;
};