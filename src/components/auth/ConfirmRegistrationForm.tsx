'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { confirmRegistrationRequest } from '@/lib/auth';
import { useTranslation } from 'react-i18next';

interface ConfirmRegistrationProps {
  token?: string;
}

export default function ConfirmRegistrationForm({ token = '' }: ConfirmRegistrationProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState(!!token);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      return;
    }

    if (hasRunRef.current) return;
    hasRunRef.current = true;

    confirmRegistration();
  }, [token]);

  const confirmRegistration = async () => {
    if (!token) {
      setServerError(t('auth.invalidToken'));
      return;
    }

    setServerError(null);

    try {
      await confirmRegistrationRequest(
        token,
        () => {},
        (err) => {
          setServerError(t('auth.confirmationFailed'));
          console.error('Confirmation error:', err);
        },
      );
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 min-h-screen text-white">
        <h1 className="text-4xl font-bold mb-8">{t('auth.confirmRegistrationTitle')}</h1>
        <div className="p-4 rounded-xl bg-red-600/20 border border-red-500 max-w-xs text-center">
          <p>{t('auth.invalidToken')}</p>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="bg-purple-600 hover:bg-purple-700 transition p-3 rounded-xl font-semibold mt-4"
        >
          {t('auth.goToLogin')}
        </button>
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 min-h-screen text-white">
        <h1 className="text-4xl font-bold mb-8">{t('auth.confirmRegistrationTitle')}</h1>
        <div className="p-4 rounded-xl bg-red-600/20 border border-red-500 max-w-xs text-center">
          <p>{serverError}</p>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="bg-purple-600 hover:bg-purple-700 transition p-3 rounded-xl font-semibold mt-4"
        >
          {t('auth.goToLogin')}
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">{t('auth.confirmRegistrationTitle')}</h1>

      <div className="flex flex-col w-full max-w-xs gap-4 text-center">
        <div className="p-4 rounded-xl bg-green-600/20 border border-green-500">
          <p>{t('auth.registrationConfirmed')}</p>
        </div>
        <p className="text-gray-300">{t('auth.canLoginNow')}</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-purple-600 hover:bg-purple-700 transition p-3 rounded-xl font-semibold"
        >
          {t('auth.goToLogin')}
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center max-w-xs">
        {t('auth.agree1')}{' '}
        <a href="#" className="text-purple-400 hover:underline">
          {t('auth.privacy')}
        </a>{' '}
        {t('auth.and')}{' '}
        <a href="#" className="text-purple-400 hover:underline">
          {t('auth.terms')}
        </a>
      </p>
    </div>
  );
}
