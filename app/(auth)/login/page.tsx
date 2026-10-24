'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useLinkedInAuth } from '@/hooks/useLinkedInAuth';
import toast from 'react-hot-toast';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuthFlow } from '@/features/auth/useAuthFlow';
import AuthSocialButtons from '@/components/auth/AuthSocialButtons';
import SocialRoleModal from '@/components/auth/SocialRoleModal';
import { UserRole } from '@/types';
import { HrInfoState } from '@/components/auth/HrEnterpriseForm';
import { ROUTES } from '@/constants/routes';
import AuthShell from '@/components/auth/AuthShell';
import { useTranslation } from '@/store/useLanguageStore';

export default function LoginPage() {
    const { t } = useTranslation();
    const { login: handleLogin, isLoading, socialLoginFlow } = useAuthFlow();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string>('');

    const [error, setError] = useState('');

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [tempSocialToken, setTempSocialToken] = useState('');
    const [socialProvider, setSocialProvider] = useState<'google' | 'linkedin'>('google');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        await handleLogin({ email, password, cf_turnstile_response: turnstileToken });
    };

    const handleSocialAuth = async (
        accessToken: string,
        provider: 'google' | 'linkedin',
        roleToSubmit?: UserRole.HR_OWNER | UserRole.HR_MEMBER | UserRole.APPLICANT,
        companyData?: HrInfoState
    ) => {
        const payload: any = provider === 'google'
            ? { access_token: accessToken }
            : { code: accessToken, redirect_uri: `${window.location.origin}/linkedin` };

        if (roleToSubmit) payload.role = roleToSubmit;
        if (companyData && roleToSubmit === UserRole.HR_OWNER) {
            payload.company_name = companyData.companyName;
            payload.tax_code = companyData.taxCode;
            payload.industries = companyData.industries;
            payload.size = companyData.size;
            payload.website = companyData.website;
            payload.description = companyData.description;
            payload.license_file_url = companyData.license_file_url;
            payload.location = companyData.location;
        }

        const result = await socialLoginFlow(provider, payload, 'login');

        if (result?.requireRole) {
            setTempSocialToken(accessToken);
            setSocialProvider(provider);
            setShowRoleModal(true);
        } else if (result?.success) {
            setShowRoleModal(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (tokenResponse) => handleSocialAuth(tokenResponse.access_token, 'google'),
        onError: () => toast.error(t('auth.login.google_failed', undefined, 'Đăng nhập Google thất bại'))
    });

    const { linkedInLogin } = useLinkedInAuth({
        onSuccess: (code) => handleSocialAuth(code, 'linkedin'),
        onError: (message) => toast.error(message),
    });

    return (
        <AuthShell variant="login">
            <div className="flex flex-col items-center mb-8 text-center transition-all">
                <h1 className="text-2xl font-bold text-text">{t('auth.login.title', undefined, 'Chào mừng trở lại')}</h1>
                <p className="text-text-muted text-sm mt-1.5">{t('auth.login.subtitle', undefined, 'Đăng nhập để tiếp tục quản lý tuyển dụng')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.login.email_label', undefined, 'Email')}</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle w-5 h-5" />
                        <input 
                            type="email" required value={email} onChange={e => setEmail(e.target.value)} 
                            className="w-full pl-11 pr-4 py-2.5 bg-input-bg border border-input-border rounded-button outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus transition-all text-text placeholder-text-subtle" 
                            placeholder="name@company.com" 
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="text-sm font-semibold text-text">{t('auth.login.password_label', undefined, 'Mật khẩu')}</label>
                        <Link href={ROUTES.FORGOT_PASSWORD} className="text-sm text-primary-600 font-medium hover:underline transition-colors">{t('auth.login.forgot_password', undefined, 'Quên mật khẩu?')}</Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle w-5 h-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full pl-11 pr-11 py-2.5 bg-input-bg border border-input-border rounded-button outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus transition-all text-text placeholder-text-subtle"
                            placeholder="••••••••"
                        />
                        <button
                            type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="mt-4 w-full flex justify-center pt-2 [&>div]:!w-full [&_iframe]:!w-full">
                    <Turnstile 
                        siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || '1x00000000000000000000AA'} 
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() => setTurnstileToken('')}
                        onExpire={() => setTurnstileToken('')}
                        options={{ theme: 'auto', size: 'flexible' }}
                        className="w-full"
                    />
                </div>

                {error && <p className="text-error-700 text-sm font-medium bg-error-50 dark:bg-error-500/10 p-3 rounded-button border border-error-100 dark:border-error-500/20">{error}</p>}

                <button type="submit" disabled={isLoading} className="w-full bg-button-primary-bg hover:bg-button-primary-hover disabled:opacity-70 text-button-primary-text font-bold py-3 rounded-button flex items-center justify-center gap-2 group mt-2 transition-colors">
                    {isLoading ? t('auth.login.submitting', undefined, 'Đang xử lý...') : t('auth.login.submit', undefined, 'Đăng nhập')}
                    {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>

            <div className="mt-6 flex items-center gap-4">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-xs font-semibold text-text-subtle uppercase tracking-wider">{t('auth.login.or_continue_with', undefined, 'Hoặc tiếp tục với')}</span>
                <div className="h-px bg-border flex-1"></div>
            </div>

            <div className="mt-6">
                <AuthSocialButtons onGoogleClick={loginWithGoogle} onLinkedInClick={linkedInLogin} mode="login" />
            </div>

            <p className="text-center mt-8 text-text-muted text-sm font-medium">
                {t('auth.login.no_account', undefined, 'Chưa có tài khoản?')} <Link href={ROUTES.REGISTER} className="text-primary-600 font-bold hover:underline transition-colors">{t('auth.login.create_account', undefined, 'Tạo tài khoản')}</Link>
            </p>

            <SocialRoleModal
                isOpen={showRoleModal}
                isLoading={isLoading}
                onSubmit={(role, companyData) => handleSocialAuth(tempSocialToken, socialProvider, role, companyData)}
            />
        </AuthShell>
    );
}