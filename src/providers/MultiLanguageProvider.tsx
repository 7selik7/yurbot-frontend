'use client';

import React, { useState, useEffect } from 'react';
import '@/lib/i18n';
import i18n from 'i18next';

export default function MultiLanguageProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem('lang') || 'ua';
    i18n.changeLanguage(lang);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}
