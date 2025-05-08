'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authSignUpRequest } from '@/lib/auth';
import { SignupSchema } from '@/validations/auth.schema';
import { useTranslation } from 'react-i18next';

interface SignupValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSignup = async (
    values: SignupValues,
    { setSubmitting }: FormikHelpers<SignupValues>,
  ) => {
    setServerError(null);

    await authSignUpRequest(
      values,
      () => {},
      () => {},
    );

    setSubmitting(false);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">{t('auth.signupTitle')}</h1>

      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSignup}
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

            <Field
              type="password"
              name="confirmPassword"
              placeholder={t('auth.confirmPassword')}
              className="p-3 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none"
            />
            <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-400" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 transition p-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {isSubmitting ? t('auth.signingUp') : t('auth.signUp')}
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
