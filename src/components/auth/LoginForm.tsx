'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authLoginRequest } from '@/lib/auth';
import { LoginSchema } from '@/validations/auth.schema';
import { useTranslation } from 'react-i18next';

export default function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const login = async (
    values: { email: string; password: string },
    helpers: FormikHelpers<{ email: string; password: string }>,
  ) => {
    const { setSubmitting } = helpers;
    setServerError(null);

    await authLoginRequest(
      values,
      (res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        router.replace('/profile');
      },
      (err) => {
        const msg = (err as { message: string })?.message || t('auth.loginFailed');
        setServerError(msg);
        console.error('Login error:', msg);
      },
    );

    setSubmitting(false);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">{t('auth.loginTitle')}</h1>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={login}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col w-full max-w-xs gap-4">
            <Field
              type="email"
              name="email"
              placeholder={t('auth.email')}
              className="p-3 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none"
            />
            <ErrorMessage name="email" component="div" className="text-sm text-red-400" />

            <Field
              type="password"
              name="password"
              placeholder={t('auth.password')}
              className="p-3 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none"
            />
            <ErrorMessage name="password" component="div" className="text-sm text-red-400" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 transition p-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
            </button>

            {serverError && <div className="text-sm text-red-400 text-center">{serverError}</div>}
          </Form>
        )}
      </Formik>

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
