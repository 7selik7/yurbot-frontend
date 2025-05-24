'use client';

import {Formik, Form, Field, ErrorMessage, FormikHelpers} from 'formik';
import {useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import {confirmPasswordRequest} from '@/lib/auth';
import {ResetPasswordSchema} from '@/validations/auth.schema';
import {useTranslation} from 'react-i18next';

interface ResetPasswordFormProps {
    token?: string;
}

export default function ResetPasswordForm({token = ''}: ResetPasswordFormProps) {
    const {t} = useTranslation();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [passwordUpdated, setPasswordUpdated] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(!!token);

    useEffect(() => {
        setIsTokenValid(!!token);
    }, [token]);

    const resetPassword = async (
        values: { newPassword: string; confirmPassword: string },
        helpers: FormikHelpers<{ newPassword: string; confirmPassword: string }>,
    ) => {
        const {setSubmitting} = helpers;
        setServerError(null);

        if (!token) {
            setServerError(t('auth.invalidToken'));
            setSubmitting(false);
            return;
        }

        await confirmPasswordRequest(
            token,
            {new_password: values.newPassword},
            () => {
                setPasswordUpdated(true);
            },
            (err) => {
                setServerError(t('auth.resetPasswordFailed'));
                console.error('Reset password error:', err);
            },
        );

        setSubmitting(false);
    };

    if (!isTokenValid) {
        return (
            <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 min-h-screen text-white">
                <h1 className="text-4xl font-bold mb-8">{t('auth.resetPasswordTitle')}</h1>
                <div className="p-4 rounded-xl bg-red-600/20 border border-red-500 max-w-xs text-center">
                    <p>{t('auth.invalidToken')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-8">{t('auth.resetPasswordTitle')}</h1>

            {passwordUpdated ? (
                <div className="flex flex-col w-full max-w-xs gap-4 text-center">
                    <div className="p-4 rounded-xl bg-green-600/20 border border-green-500">
                        <p>{t('auth.passwordUpdated')}</p>
                    </div>
                    <p className="text-gray-300">{t('auth.canLoginNow')}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-purple-600 hover:bg-purple-700 transition p-3 rounded-xl font-semibold"
                    >
                        {t('auth.goToLogin')}
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-gray-300 mb-6 text-center max-w-xs">
                        {t('auth.resetPasswordDescription')}
                    </p>

                    <Formik
                        initialValues={{newPassword: '', confirmPassword: ''}}
                        validationSchema={ResetPasswordSchema}
                        onSubmit={resetPassword}
                    >
                        {({isSubmitting}) => (
                            <Form className="flex flex-col w-full max-w-xs gap-4">
                                <Field
                                    type="password"
                                    name="newPassword"
                                    placeholder={t('auth.newPassword')}
                                    className="p-3 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none"
                                />
                                <ErrorMessage name="newPassword" component="div" className="text-sm text-red-400"/>

                                <Field
                                    type="password"
                                    name="confirmPassword"
                                    placeholder={t('auth.confirmPassword')}
                                    className="p-3 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-400"/>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-purple-600 hover:bg-purple-700 transition p-3 rounded-xl font-semibold disabled:opacity-50"
                                >
                                    {isSubmitting ? t('auth.updating') : t('auth.updatePassword')}
                                </button>

                                {serverError && <div className="text-sm text-red-400 text-center">{serverError}</div>}
                            </Form>
                        )}
                    </Formik>
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