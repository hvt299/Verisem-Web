'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@/features/auth/auth.service';
import AuthLogo from '@/components/ui/AuthLogo';
import AuthPageBackground from '@/components/auth/AuthPageBackground';
import { getPasswordStrength } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from '@/store/useLanguageStore';

function ResetPasswordContent() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const passStrength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error(t('auth.reset_password.toast_invalid', undefined, 'Liên kết không hợp lệ hoặc đã hết hạn.'));
            return;
        }

        if (password !== confirmPassword) {
            toast.error(t('auth.register.err_password_mismatch', undefined, 'Mật khẩu xác nhận không khớp!'));
            return;
        }

        if (passStrength.score < 2) {
            toast.error(t('auth.register.err_password_weak', undefined, 'Mật khẩu quá yếu! Yêu cầu chữ hoa, số và ký tự đặc biệt.'));
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword({
                token: token,
                new_password: password
            });
            toast.success(t('auth.reset_password.toast_success', undefined, 'Đổi mật khẩu thành công! Vui lòng đăng nhập.'));
            router.push(ROUTES.LOGIN);
        } catch (error: any) {
            const detail = error.response?.data?.detail;

            if (typeof detail === 'string') {
                toast.error(detail);
            } else if (Array.isArray(detail)) {
                const errorMessage = detail[0].msg.replace('Value error, ', '');
                toast.error(errorMessage);
            } else {
                toast.error(t('auth.reset_password.toast_invalid', undefined, 'Liên kết không hợp lệ hoặc đã hết hạn.'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold text-error-600 dark:text-error-500">
                    {t('auth.reset_password.invalid_token_title', undefined, 'Lỗi xác thực')}
                </h1>

                <p className="mb-6 text-text-muted">
                    {t('auth.reset_password.invalid_token_desc', undefined, 'Liên kết đặt lại mật khẩu của bạn không hợp lệ hoặc bị thiếu.')}
                </p>

                <Link
                    href={ROUTES.FORGOT_PASSWORD}
                    className="font-bold text-primary-600 hover:underline"
                >
                    {t('auth.reset_password.request_new_link', undefined, 'Yêu cầu liên kết mới')}
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-button-primary-bg shadow-card">
                    <ShieldCheck className="h-6 w-6 text-button-primary-text" />
                </div>

                <h1 className="text-2xl font-bold text-text">
                    {t('auth.reset_password.title', undefined, 'Tạo mật khẩu mới')}
                </h1>

                <p className="mt-2 text-sm text-text-muted">
                    {t('auth.reset_password.subtitle', undefined, 'Vui lòng nhập mật khẩu mới cho tài khoản của bạn.')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-text">
                        {t('auth.reset_password.new_password_label', undefined, 'Mật khẩu mới')}
                    </label>

                    <div className="relative">
                        <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-text-subtle" />

                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={8}
                            className="w-full rounded-xl border border-input-border bg-input-bg py-3 pr-12 pl-12 text-sm font-medium text-text outline-none transition-all placeholder:font-medium placeholder:text-text-subtle focus:border-input-focus focus:ring-2 focus:ring-primary-500/20"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-text-subtle hover:text-text"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <div className="mt-2">
                        <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full">
                            <div
                                className={`flex-1 ${passStrength.score >= 1
                                    ? passStrength.color
                                    : 'bg-border'
                                    } transition-colors`}
                            />

                            <div
                                className={`flex-1 ${passStrength.score >= 2
                                    ? passStrength.color
                                    : 'bg-border'
                                    } transition-colors`}
                            />

                            <div
                                className={`flex-1 ${passStrength.score >= 3
                                    ? passStrength.color
                                    : 'bg-border'
                                    } transition-colors`}
                            />
                        </div>

                        <div className="mt-1 flex items-center justify-between">
                            <span className="text-[10px] font-medium text-text-muted">
                                {t('auth.register.password_hint', undefined, 'Ít nhất 8 ký tự, 1 chữ hoa, 1 số & 1 ký tự đặc biệt')}
                            </span>

                            <span
                                className={`text-[10px] font-bold ${passStrength.color.replace(
                                    'bg-',
                                    'text-'
                                )}`}
                            >
                                {passStrength.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-text">
                        {t('auth.reset_password.confirm_password_label', undefined, 'Xác nhận Mật khẩu mới')}
                    </label>

                    <div className="relative">
                        <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-text-subtle" />

                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            className="w-full rounded-xl border border-input-border bg-input-bg py-3 pr-12 pl-12 text-sm font-medium text-text outline-none transition-all placeholder:font-medium placeholder:text-text-subtle focus:border-input-focus focus:ring-2 focus:ring-primary-500/20"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-text-subtle hover:text-text"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-button-primary-bg py-3.5 font-bold text-button-primary-text shadow-card transition-all hover:bg-button-primary-hover disabled:opacity-60"
                >
                    {isLoading ? t('auth.reset_password.submitting', undefined, 'Đang lưu...') : t('auth.reset_password.submit', undefined, 'Lưu mật khẩu mới')}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
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
                            {t('common.status.loading', undefined, 'Đang tải dữ liệu...')}
                        </div>
                    }
                >
                    <ResetPasswordContent />
                </Suspense>
            </div>
        </div>
    );
}