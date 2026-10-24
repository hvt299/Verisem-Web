'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Briefcase } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useLinkedInAuth } from '@/hooks/useLinkedInAuth';
import toast from 'react-hot-toast';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuthFlow } from '@/features/auth/useAuthFlow';
import AuthSocialButtons from '@/components/auth/AuthSocialButtons';
import SocialRoleModal from '@/components/auth/SocialRoleModal';
import { UserRole } from '@/types';
import HrEnterpriseForm, { HrInfoState, DEFAULT_HR_INFO } from '@/components/auth/HrEnterpriseForm';
import { ROUTES } from '@/constants/routes';
import AuthShell from '@/components/auth/AuthShell';
import { useTranslation } from '@/store/useLanguageStore';
import { getPasswordStrength } from '@/utils/format';

export default function RegisterPage() {
    const { t } = useTranslation();
    const { register: handleRegister, isLoading, socialLoginFlow } = useAuthFlow();
    
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string>('');

    const [role, setRole] = useState<UserRole.HR_OWNER | UserRole.HR_MEMBER | UserRole.APPLICANT>(UserRole.APPLICANT);
    const [hrInfo, setHrInfo] = useState<HrInfoState>(DEFAULT_HR_INFO);

    const [error, setError] = useState('');
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeConsulting, setAgreeConsulting] = useState(false);

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [tempSocialToken, setTempSocialToken] = useState('');
    const [socialProvider, setSocialProvider] = useState<'google' | 'linkedin'>('google');

    const passStrength = getPasswordStrength(password);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('invite');
        if (token) {
            setInviteToken(token);
            setRole(UserRole.HR_MEMBER);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!agreeTerms) return setError(t('auth.register.err_agree_terms', undefined, 'Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư!'));
        if (password !== confirmPassword) return setError(t('auth.register.err_password_mismatch', undefined, 'Mật khẩu xác nhận không khớp!'));
        if (passStrength.score < 2) return setError(t('auth.register.err_password_weak', undefined, 'Mật khẩu quá yếu! Yêu cầu chữ hoa, số và ký tự đặc biệt.'));
        
        if (role === UserRole.HR_OWNER && !inviteToken && (!hrInfo.companyName.trim() || !hrInfo.taxCode.trim() || hrInfo.industries.length === 0 || !hrInfo.size)) {
            return setError(t('auth.register.err_hr_missing', undefined, 'Vui lòng điền đầy đủ Tên công ty, MST, Ngành nghề và Quy mô!'));
        }

        const payload = {
            full_name: fullName, email, password, role,
            cf_turnstile_response: turnstileToken,
            invite_token: inviteToken,
            ...(role === UserRole.HR_OWNER && !inviteToken && {
                company_name: hrInfo.companyName,
                tax_code: hrInfo.taxCode,
                industries: hrInfo.industries,
                size: hrInfo.size,
                website: hrInfo.website,
                description: hrInfo.description,
                license_file_url: hrInfo.license_file_url,
                location: hrInfo.location
            })
        };

        await handleRegister(payload, !!inviteToken);
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

        const result = await socialLoginFlow(provider, payload, 'register');

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
        <AuthShell variant="register">
            <div className="flex flex-col items-center mb-8 text-center transition-all">
                <h1 className="text-2xl font-bold text-text">{t('auth.register.title', undefined, 'Tạo tài khoản mới')}</h1>
                <p className="text-text-muted text-sm mt-1.5">{t('auth.register.subtitle', undefined, 'Hoàn tất hồ sơ để bắt đầu hành trình của bạn')}</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* ROLE SELECTOR */}
                {!inviteToken && (
                    <div className="mb-5">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button" onClick={() => setRole(UserRole.APPLICANT)}
                                className={`flex items-center justify-center gap-2 p-3 rounded-button border-2 transition-all ${role === UserRole.APPLICANT ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 shadow-sm' : 'border-border bg-input-bg text-text-muted hover:border-primary-300'}`}
                            >
                                <User className={`w-5 h-5 ${role === UserRole.APPLICANT ? 'text-primary-600 dark:text-primary-400' : 'text-text-subtle'}`} />
                                <span className="font-bold text-sm">{t('auth.register.role_applicant', undefined, 'Ứng viên')}</span>
                            </button>
                            <button
                                type="button" onClick={() => setRole(UserRole.HR_OWNER)}
                                className={`flex items-center justify-center gap-2 p-3 rounded-button border-2 transition-all ${role === UserRole.HR_OWNER ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 shadow-sm' : 'border-border bg-input-bg text-text-muted hover:border-primary-300'}`}
                            >
                                <Briefcase className={`w-5 h-5 ${role === UserRole.HR_OWNER ? 'text-primary-600 dark:text-primary-400' : 'text-text-subtle'}`} />
                                <span className="font-bold text-sm">{t('auth.register.role_hr', undefined, 'Nhà tuyển dụng')}</span>
                            </button>
                        </div>
                    </div>
                )}

                {inviteToken && (
                    <div className="mb-5 bg-info-50 dark:bg-info-900/20 border border-info-100 dark:border-info-800 p-4 rounded-card flex items-center gap-4">
                        <div className="p-3 bg-info-100 dark:bg-info-500/20 text-info-600 rounded-full shrink-0">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-info-700 dark:text-info-400">{t('auth.register.invite_title', undefined, 'Thư mời gia nhập')}</h4>
                            <p className="text-xs text-info-600 dark:text-info-400/80 mt-1">{t('auth.register.invite_desc', undefined, 'Bạn đang tạo tài khoản thành viên HR theo thư mời của công ty.')}</p>
                        </div>
                    </div>
                )}

                {/* ACCOUNT INFO */}
                <div className="mb-5">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">{t('auth.register.account_info_heading', undefined, 'THÔNG TIN TÀI KHOẢN')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.register.fullname_label', undefined, 'Họ và tên')}</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle w-5 h-5" />
                                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all placeholder-text-subtle"
                                    placeholder={t('auth.register.fullname_placeholder', undefined, 'Nguyễn Văn A')} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.register.email_label', undefined, 'Email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle w-5 h-5" />
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!inviteToken}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all placeholder-text-subtle disabled:opacity-60"
                                    placeholder="name@company.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.register.password_label', undefined, 'Mật khẩu')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle w-5 h-5" />
                                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-11 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all placeholder-text-subtle"
                                    placeholder={t('auth.register.password_placeholder', undefined, 'Tạo mật khẩu')} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.register.confirm_password_label', undefined, 'Xác nhận mật khẩu')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle w-5 h-5" />
                                <input type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-11 pr-11 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all placeholder-text-subtle"
                                    placeholder={t('auth.register.confirm_password_placeholder', undefined, 'Nhập lại mật khẩu')} />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text transition-colors">
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {password && (
                        <div className="mt-3">
                            <div className="flex gap-1.5 h-1.5 w-full max-w-sm">
                                {[1, 2, 3, 4].map((index) => (
                                    <div key={index} className={`h-full flex-1 rounded-full transition-colors ${passStrength.score >= index ? passStrength.color : 'bg-border'}`} />
                                ))}
                            </div>
                            <p className={`text-xs mt-1.5 font-medium ${passStrength.score < 2 ? 'text-error-500' : 'text-text-subtle'}`}>{passStrength.label}</p>
                        </div>
                    )}
                </div>

                {/* KHU VỰC THÔNG TIN DOANH NGHIỆP (Chỉ HR OWNER) */}
                {role === UserRole.HR_OWNER && !inviteToken && (
                    <div className="mb-5">
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">{t('auth.register.enterprise_info_heading', undefined, 'HỒ SƠ DOANH NGHIỆP')}</h3>
                        <HrEnterpriseForm hrInfo={hrInfo} setHrInfo={setHrInfo} />
                    </div>
                )}

                {/* TERMS & OPTIONAL CONSULTING */}
                <div className="mb-5 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group w-full">
                        <div className="relative flex items-start mt-0.5">
                            <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="peer w-4 h-4 rounded border-border-hover text-primary-600 focus:ring-primary-500 cursor-pointer transition-all" />
                        </div>
                        <div className="text-sm text-text leading-relaxed">
                            {t('auth.register.agree_terms_prefix', undefined, 'Tôi đã đọc và đồng ý với')} <Link href="/terms" className="text-primary-600 font-semibold hover:underline">{t('auth.register.terms_link', undefined, 'Điều khoản dịch vụ')}</Link> {t('auth.register.and', undefined, 'và')} <Link href="/privacy" className="text-primary-600 font-semibold hover:underline">{t('auth.register.privacy_link', undefined, 'Chính sách Quyền riêng tư')}</Link> {t('auth.register.agree_terms_suffix', undefined, 'của hệ thống.')}
                        </div>
                    </label>

                    {role === UserRole.HR_OWNER && (
                        <label className="flex items-start gap-3 cursor-pointer group w-full">
                            <div className="relative flex items-start mt-0.5">
                                <input type="checkbox" checked={agreeConsulting} onChange={e => setAgreeConsulting(e.target.checked)} className="peer w-4 h-4 rounded border-border-hover text-primary-600 focus:ring-primary-500 cursor-pointer transition-all" />
                            </div>
                            <div className="text-sm text-text leading-relaxed">
                                {t('auth.register.agree_consulting', undefined, 'Tôi đồng ý nhận thông tin tư vấn để được hỗ trợ đăng tin nhanh và tối ưu hiệu quả tin đăng (Tùy chọn).')}
                            </div>
                        </label>
                    )}
                </div>

                {/* TURNSTILE */}
                <div className="mb-5 w-full flex justify-center [&>div]:!w-full [&_iframe]:!w-full">
                    <Turnstile 
                        siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || '1x00000000000000000000AA'} 
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() => setTurnstileToken('')}
                        onExpire={() => setTurnstileToken('')}
                        options={{ theme: 'auto', size: 'flexible' }}
                        className="w-full"
                    />
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="mb-5 animate-fade-in-scale">
                        <p className="text-error-700 text-sm font-medium bg-error-50 dark:bg-error-500/10 p-3 rounded-button border border-error-100 dark:border-error-500/20 w-full">{error}</p>
                    </div>
                )}

                {/* SUBMIT BUTTON */}
                <div className="mb-6 md:mb-8 w-full">
                    <button type="submit" disabled={isLoading} className="w-full bg-button-primary-bg hover:bg-button-primary-hover disabled:opacity-70 text-button-primary-text font-bold py-3.5 rounded-button flex items-center justify-center gap-2 transition-colors shadow-sm">
                        {isLoading ? t('auth.register.submitting', undefined, 'Đang xử lý...') : t('auth.register.submit', undefined, 'Đăng ký ngay')}
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </form>

            <div className="flex items-center gap-4 w-full mb-6 md:mb-8">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-xs font-semibold text-text-subtle uppercase tracking-wider">{t('auth.register.or_continue_with', undefined, 'Hoặc tiếp tục với')}</span>
                <div className="h-px bg-border flex-1"></div>
            </div>

            <div className="w-full mb-6 md:mb-8">
                <AuthSocialButtons onGoogleClick={loginWithGoogle} onLinkedInClick={linkedInLogin} mode="register" />
            </div>

            <p className="text-center text-text-muted text-sm font-medium">
                {t('auth.register.has_account', undefined, 'Đã có tài khoản?')} <Link href={ROUTES.LOGIN} className="text-primary-600 font-bold hover:underline transition-colors">{t('auth.register.login_link', undefined, 'Đăng nhập')}</Link>
            </p>

            <SocialRoleModal
                isOpen={showRoleModal}
                isLoading={isLoading}
                onSubmit={(role, companyData) => handleSocialAuth(tempSocialToken, socialProvider, role, companyData)}
            />
        </AuthShell>
    );
}