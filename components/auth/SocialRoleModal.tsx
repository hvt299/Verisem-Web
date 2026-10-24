'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Briefcase, Users } from 'lucide-react';
import { UserRole } from '@/types';
import HrEnterpriseForm, {
    HrInfoState,
    DEFAULT_HR_INFO,
} from './HrEnterpriseForm';
import toast from 'react-hot-toast';
import { useTranslation } from '@/store/useLanguageStore';

interface SocialRoleModalProps {
    isOpen: boolean;
    isLoading: boolean;
    initialRole?: UserRole.HR_OWNER | UserRole.HR_MEMBER | UserRole.APPLICANT;
    allowedRoles?: (UserRole.HR_OWNER | UserRole.HR_MEMBER | UserRole.APPLICANT)[];
    onSubmit: (
        role: UserRole.HR_OWNER | UserRole.HR_MEMBER | UserRole.APPLICANT,
        hrInfo: HrInfoState
    ) => void;
}

export default function SocialRoleModal({
    isOpen,
    isLoading,
    initialRole = UserRole.APPLICANT,
    allowedRoles = [UserRole.APPLICANT, UserRole.HR_OWNER],
    onSubmit,
}: SocialRoleModalProps) {
    const { t } = useTranslation();
    const [selectedRole, setSelectedRole] = useState<UserRole.HR_OWNER | UserRole.HR_MEMBER | UserRole.APPLICANT>(initialRole);
    const [hrInfo, setHrInfo] = useState<HrInfoState>(DEFAULT_HR_INFO);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeConsulting, setAgreeConsulting] = useState(false);

    useEffect(() => {
        if (isOpen) setSelectedRole(initialRole);
    }, [isOpen, initialRole]);

    if (!isOpen) return null;

    const canSelectApplicant = allowedRoles.includes(UserRole.APPLICANT);
    const canSelectHrOwner = allowedRoles.includes(UserRole.HR_OWNER);
    const isHrMember = selectedRole === UserRole.HR_MEMBER;

    const handleSubmit = () => {
        if (!agreeTerms) return toast.error('Vui lòng đồng ý với Điều khoản dịch vụ!');
        
        if (selectedRole === UserRole.HR_OWNER && (
            !hrInfo.companyName.trim() || !hrInfo.taxCode.trim() || hrInfo.industries.length === 0 || !hrInfo.size
        )) {
            return toast.error('Vui lòng điền đầy đủ Tên công ty, MST, Ngành nghề và Quy mô!');
        }

        onSubmit(selectedRole, hrInfo);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card-bg p-6 md:p-8 rounded-card w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] border border-card-border custom-scrollbar">

                <h3 className="text-2xl font-bold text-text text-center mb-2">{t('auth.social_role.welcome', undefined, 'Chào mừng người mới!')}</h3>
                <p className="text-text-muted text-sm text-center font-medium mb-6">{t('auth.social_role.select_role_desc', undefined, 'Vui lòng chọn vai trò để hoàn tất hồ sơ.')}</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    {canSelectApplicant && (
                        <button
                            type="button" onClick={() => setSelectedRole(UserRole.APPLICANT)}
                            className={`flex items-center justify-center gap-2 p-3 rounded-button border-2 transition-all ${selectedRole === UserRole.APPLICANT ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 shadow-sm' : 'border-border bg-input-bg text-text-muted hover:border-primary-300'}`}
                        >
                            <User className={`w-5 h-5 ${selectedRole === UserRole.APPLICANT ? 'text-primary-600 dark:text-primary-400' : 'text-text-subtle'}`} />
                            <span className="font-bold text-sm">{t('auth.social_role.role_applicant', undefined, 'Ứng viên')}</span>
                        </button>
                    )}

                    {canSelectHrOwner && (
                        <button
                            type="button" onClick={() => setSelectedRole(UserRole.HR_OWNER)}
                            className={`flex items-center justify-center gap-2 p-3 rounded-button border-2 transition-all ${selectedRole === UserRole.HR_OWNER ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 shadow-sm' : 'border-border bg-input-bg text-text-muted hover:border-primary-300'}`}
                        >
                            <Briefcase className={`w-5 h-5 ${selectedRole === UserRole.HR_OWNER ? 'text-primary-600 dark:text-primary-400' : 'text-text-subtle'}`} />
                            <span className="font-bold text-sm">{t('auth.social_role.role_hr', undefined, 'Nhà tuyển dụng')}</span>
                        </button>
                    )}

                    {isHrMember && (
                        <div className="col-span-2 bg-info-50 dark:bg-info-900/20 border border-info-100 dark:border-info-800 p-4 rounded-card flex items-center gap-3">
                            <div className="p-2 bg-info-100 dark:bg-info-500/20 text-info-600 rounded-full shrink-0">
                                <Users className="w-5 h-5" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-info-700 dark:text-info-400">{t('auth.social_role.member_title', undefined, 'Thành viên doanh nghiệp')}</p>
                                <p className="text-xs text-info-600/80 dark:text-info-400/80 mt-0.5">{t('auth.social_role.member_desc', undefined, 'Bạn sẽ gia nhập doanh nghiệp thông qua thư mời.')}</p>
                            </div>
                        </div>
                    )}
                </div>

                {selectedRole === UserRole.HR_OWNER && (
                    <div className="mb-6 p-5 bg-background rounded-card border border-border">
                        <HrEnterpriseForm hrInfo={hrInfo} setHrInfo={setHrInfo} />
                    </div>
                )}

                <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group bg-background p-4 rounded-card border border-border">
                        <div className="relative flex items-start mt-0.5">
                            <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="peer w-4 h-4 rounded border-border-hover text-primary-600 focus:ring-primary-500 cursor-pointer transition-all" />
                        </div>
                        <div className="text-sm text-text leading-relaxed font-medium">
                            {t('auth.register.agree_terms_prefix', undefined, 'Tôi đã đọc và đồng ý với')} <Link href="/terms" className="text-primary-600 font-semibold hover:underline">{t('auth.register.terms_link', undefined, 'Điều khoản dịch vụ')}</Link> {t('auth.register.and', undefined, 'và')} <Link href="/privacy" className="text-primary-600 font-semibold hover:underline">{t('auth.register.privacy_link', undefined, 'Chính sách Quyền riêng tư')}</Link> {t('auth.register.agree_terms_suffix', undefined, 'của hệ thống.')}
                            <p className="text-xs text-error-600 dark:text-error-400 mt-1.5 italic font-medium">
                                * Chúng tôi không thể cung cấp dịch vụ nếu không nhận được sự đồng ý ở mục này.
                            </p>
                        </div>
                    </label>

                    {selectedRole === UserRole.HR_OWNER && (
                        <label className="flex items-start gap-3 cursor-pointer group bg-background p-4 rounded-card border border-border">
                            <div className="relative flex items-start mt-0.5">
                                <input type="checkbox" checked={agreeConsulting} onChange={e => setAgreeConsulting(e.target.checked)} className="peer w-4 h-4 rounded border-border-hover text-primary-600 focus:ring-primary-500 cursor-pointer transition-all" />
                            </div>
                            <div className="text-sm text-text leading-relaxed font-medium">
                                Tôi đồng ý nhận thông tin tư vấn để được hỗ trợ đăng tin nhanh, cách tối ưu hiệu quả tin đăng và các giải pháp tuyển dụng phù hợp (Tùy chọn).
                            </div>
                        </label>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-button-primary-bg hover:bg-button-primary-hover disabled:bg-primary-400 dark:disabled:bg-primary-800 text-button-primary-text py-3.5 rounded-button mt-6 font-bold shadow-sm transition-all"
                >
                    {isLoading ? 'Đang xử lý...' : 'Hoàn tất & Gia nhập'}
                </button>
            </div>
        </div>
    );
}