'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function Home() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(i18n.language || 'en');
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">{t('title')}</h1>

      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">{t('description')}</p>

      <div className="flex gap-4 mb-6">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
        >
          {t('login')}
        </Link>
        <Link
          href="/signup"
          className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-md font-medium hover:bg-blue-50 transition"
        >
          {t('signup')}
        </Link>
      </div>

      <div className="text-sm text-gray-500 flex gap-2">
        <button onClick={() => changeLanguage('en')} className="hover:underline">
          🇺🇸 English
        </button>
        <span>·</span>
        <button onClick={() => changeLanguage('ua')} className="hover:underline">
          🇺🇦 Українська
        </button>
      </div>
    </div>
  );
}
