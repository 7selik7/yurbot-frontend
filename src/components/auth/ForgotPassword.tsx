'use client';

import {Formik, Form, Field, ErrorMessage, FormikHelpers} from 'formik';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {forgotPasswordRequest} from '@/lib/auth';
import {useTranslation} from 'react-i18next';
import {ForgotPasswordSchema} from "@/validations/auth.schema";

export default function ForgotPasswordForm() {
    const {t} = useTranslation();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    const resetPassword = async (
        values: { email: string },
        helpers: FormikHelpers<{ email: string }>,
    ) => {
        const {setSubmitting} = helpers;
        setServerError(null);

        const host = window.location.origin;

        await forgotPasswordRequest(
            {...values, host},
            () => {
                setEmailSent(true);
            },
            (err) => {
                const msg = (err as { message: string })?.message || t('auth.resetPasswordFailed');
                setServerError(msg);
                console.error('Reset password error:', msg);
            },
        );

        setSubmitting(false);
    };

    return (
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-8">{t('auth.forgotPasswordTitle')}</h1>

            {emailSent ? (
                <div className="flex flex-col w-full max-w-xs gap-4 text-center">
                    <p className="text-gray-300">{t('auth.checkEmail')}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-purple-600 hover:bg-purple-700 transition p-3 rounded-xl font-semibold"
                    >
                        {t('auth.login')}
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-gray-300 mb-6 text-center max-w-xs">
                        {t('auth.forgotPasswordDescription')}
                    </p>

                    <Formik
                        initialValues={{email: ''}}
                        validationSchema={ForgotPasswordSchema}
                        onSubmit={resetPassword}
                    >
                        {({isSubmitting}) => (
                            <Form className="flex flex-col w-full max-w-xs gap-4">
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder={t('auth.email')}
                                    className="p-3 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none"
                                />
                                <ErrorMessage name="email" component="div" className="text-sm text-red-400"/>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-purple-600 hover:bg-purple-700 transition p-3 rounded-xl font-semibold disabled:opacity-50"
                                >
                                    {isSubmitting ? t('auth.sending') : t('auth.sendResetLink')}
                                </button>

                                {serverError && <div className="text-sm text-red-400 text-center">{serverError}</div>}
                            </Form>
                        )}
                    </Formik>

                    <a href="/login" className="mt-2 text-purple-400 hover:underline">
                        {t('auth.loginTitle')}
                    </a>
                </>
            )}

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