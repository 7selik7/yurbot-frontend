'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import AnimatedParticlesBackground from '@/components/ui/AnimatedParticlesBackground';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    i18n.changeLanguage(localStorage.getItem('lang') || 'en');
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div className="relative min-h-screen bg-screen text-screen overflow-hidden">
      <AnimatedParticlesBackground />

      <div className="absolute top-4 right-4 z-20 flex items-center gap-4 text-sm">
        <div className="flex gap-2">
          <button onClick={() => changeLanguage('en')} className="hover:underline">
            🇺🇸 English
          </button>
          <button onClick={() => changeLanguage('ua')} className="hover:underline">
            🇺🇦 Українська
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="text-xs border px-3 py-1 rounded-md transition font-medium
            bg-white/80 text-black hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center min-h-screen">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">{t('title')}</h1>

        <p className="text-lg md:text-xl max-w-2xl mb-8">{t('description')}</p>

        <div className="flex gap-4 mb-6">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:opacity-90 transition"
          >
            {t('login')}
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 border border-primary text-primary rounded-md font-medium bg-white/70 hover:bg-primary hover:text-white dark:bg-transparent transition"
          >
            {t('signup')}
          </Link>
        </div>
      </div>
    </div>
  );
}
