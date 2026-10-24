'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '@/features/auth/auth.service';
import confetti from 'canvas-confetti';
import AuthLogo from '@/components/ui/AuthLogo';
import AuthPageBackground from '@/components/auth/AuthPageBackground';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from '@/store/useLanguageStore';

function VerifyContent() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState(t('auth.verify.loading_desc', undefined, 'Đang xác thực tài khoản của bạn...'));

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage(t('auth.verify.invalid_link', undefined, 'Link xác thực không hợp lệ hoặc bị thiếu.'));
            return;
        }

        const verifyAccount = async () => {
            try {
                const res = await authService.verifyAccount(token);

                setStatus('success');
                setMessage(
                    res.data.message ||
                    t('auth.verify.success_default', undefined, 'Tài khoản của bạn đã được kích hoạt thành công!')
                );

                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899']
                });
            } catch (error: any) {
                setStatus('error');
                setMessage(
                    error.response?.data?.detail ||
                    t('auth.verify.error_default', undefined, 'Xác thực thất bại. Link có thể đã hết hạn.')
                );
            }
        };

        verifyAccount();
    }, [token]);

    return (
        <div className="flex flex-col items-center text-center">
            {status === 'loading' && (
                <>
                    <Loader2 className="mb-6 h-16 w-16 animate-spin text-primary-500" />

                    <h1 className="text-2xl font-bold text-text">
                        {t('auth.verify.loading_title', undefined, 'Đang xử lý...')}
                    </h1>

                    <p className="mt-2 text-text-muted">{message}</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-100 text-success-600 shadow-card">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>

                    <h1 className="text-2xl font-bold text-text">
                        {t('auth.verify.success_title', undefined, 'Tuyệt vời!')}
                    </h1>

                    <p className="mt-2 text-text-muted">{message}</p>

                    <Link
                        href={ROUTES.LOGIN}
                        className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-button-primary-bg py-3.5 font-bold text-button-primary-text shadow-card transition-all hover:bg-button-primary-hover"
                    >
                        {t('auth.verify.go_to_login', undefined, 'Đến trang Đăng nhập')}

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error-100 text-error-600 shadow-card">
                        <XCircle className="h-10 w-10" />
                    </div>

                    <h1 className="text-2xl font-bold text-text">
                        {t('auth.verify.error_title', undefined, 'Rất tiếc!')}
                    </h1>

                    <p className="mt-2 text-text-muted">{message}</p>

                    <div className="mt-8 flex w-full gap-4">
                        <Link
                            href={ROUTES.LOGIN}
                            className="flex-1 rounded-xl border border-border bg-surface-hover py-3.5 text-center font-bold text-text transition-all hover:border-border-hover"
                        >
                            {t('common.auth.login', undefined, 'Đăng nhập')}
                        </Link>

                        <Link
                            href={ROUTES.REGISTER}
                            className="flex-1 rounded-xl bg-button-primary-bg py-3.5 text-center font-bold text-button-primary-text shadow-card transition-all hover:bg-button-primary-hover"
                        >
                            {t('auth.register.title', undefined, 'Đăng ký')}
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default function VerifyPage() {
    const { t } = useTranslation();
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 p-4 pt-24 sm:pt-28 pb-16 transition-colors duration-300 font-sans">
            {/* Background hình ảnh mờ giống ngoài trang chủ */}
            <AuthPageBackground />

            <AuthLogo />

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-xs transition-colors duration-300">
                <Suspense
                    fallback={
                        <div className="text-center text-text-muted">
                            {t('auth.verify.loading_desc', undefined, 'Đang xác thực...')}
                        </div>
                    }
                >
                    <VerifyContent />
                </Suspense>
            </div>
        </div>
    );
}