'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@/features/auth/auth.service';
import AuthLogo from '@/components/ui/AuthLogo';
import AuthPageBackground from '@/components/auth/AuthPageBackground';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from '@/store/useLanguageStore';

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            setIsSent(true);
            toast.success(t('auth.forgot_password.toast_sent', undefined, 'Link khôi phục đã được gửi!'));
        } catch (error) {
            toast.error(t('auth.forgot_password.toast_error', undefined, 'Có lỗi xảy ra. Vui lòng thử lại sau.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 p-4 pt-24 sm:pt-28 pb-16 transition-colors duration-300 font-sans">
            {/* Background hình ảnh mờ giống ngoài trang chủ */}
            <AuthPageBackground />

            <AuthLogo />

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-xs transition-colors duration-300">
                {!isSent ? (
                    <>
                        <div className="mb-8 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-button-primary-bg shadow-card">
                                <KeyRound className="h-6 w-6 text-button-primary-text" />
                            </div>

                            <h1 className="text-2xl font-bold text-text">
                                {t('auth.forgot_password.title', undefined, 'Quên mật khẩu?')}
                            </h1>

                            <p className="mt-2 text-sm text-text-muted">
                                {t('auth.forgot_password.subtitle', undefined, 'Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-text">
                                    {t('auth.forgot_password.email_label', undefined, 'Email công việc')}
                                </label>

                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-text-subtle" />

                                    <input
                                        type="email"
                                        required
                                        className="w-full rounded-xl border border-input-border bg-input-bg py-3 pr-4 pl-12 text-sm font-medium text-text outline-none transition-all placeholder:font-medium placeholder:text-text-subtle focus:border-input-focus focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-button-primary-bg py-3.5 font-bold text-button-primary-text shadow-card transition-all hover:bg-button-primary-hover disabled:opacity-60"
                            >
                                {isLoading ? t('auth.forgot_password.submitting', undefined, 'Đang gửi...') : t('auth.forgot_password.submit', undefined, 'Gửi link khôi phục')}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center py-4 text-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-100 text-success-600 shadow-card">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>

                        <h1 className="text-2xl font-bold text-text">
                            {t('auth.forgot_password.check_email_title', undefined, 'Kiểm tra Email')}
                        </h1>

                        <p className="mt-2 text-text-muted">
                            {t('auth.forgot_password.check_email_desc', { email }, `Chúng tôi đã gửi một liên kết khôi phục mật khẩu đến ${email}. Vui lòng kiểm tra hộp thư đến hoặc thư mục Spam.`)}
                        </p>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link
                        href={ROUTES.LOGIN}
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-text"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180" />
                        {t('auth.forgot_password.back_to_login', undefined, 'Quay lại Đăng nhập')}
                    </Link>
                </div>
            </div>
        </div>
    );
}