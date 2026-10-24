'use client';

import { useState, useEffect } from 'react';
import { CreditCard, HelpCircle, Loader2, Building2, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/store/useLanguageStore';
import { subscriptionService } from '@/features/subscription/subscription.service';
import { useSubscription } from '@/hooks/useSubscription';
import { ROUTES } from '@/constants/routes';

import PlanCard from '@/components/billing/PlanCard';
import CheckoutModal from '@/components/billing/CheckoutModal';
import DowngradeBlockedModal, { DowngradeBlockedInfo, isDowngradeBlocked } from '@/components/billing/DowngradeBlockedModal';

export default function PricingPage() {
    const { isAuthenticated, user } = useAuthStore();
    const { t } = useTranslation();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isScrolled, setIsScrolled] = useState(false);
    const [audience, setAudience] = useState<'hr' | 'applicant'>('hr');
    const [cycleFilter, setCycleFilter] = useState<'monthly' | 'yearly' | 'topup'>('monthly');
    const { data: myPlan } = useSubscription();

    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [processingPlanCode, setProcessingPlanCode] = useState<string | null>(null);
    const [downgradeBlocked, setDowngradeBlocked] = useState<DowngradeBlockedInfo | null>(null);

    const { data: plansRes, isLoading } = useQuery({
        queryKey: ['subscription-plans', audience],
        queryFn: () => subscriptionService.getPlans(audience),
    });

    const plans = plansRes?.data || [];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currentPlanTier = plans.find((p: any) => p.plan_code === myPlan?.data?.current_plan_code)?.tier_level ?? (myPlan?.data?.tier_level || 0);

    const handleSubscribe = async (plan: any) => {
        if (!isAuthenticated) {
            router.push(ROUTES.REGISTER);
            return;
        }

        if (plan.current_price === 0) {
            if (currentPlanTier > 0) {
                setDowngradeBlocked({
                    code: 'PLAN_DOWNGRADE_BLOCKED',
                    message: t('public_pages.pricing.downgrade_blocked', undefined, 'Không thể hạ cấp về gói Miễn phí do gói hiện tại vẫn còn hạn sử dụng.'),
                    current_plan: myPlan?.data?.current_plan,
                    current_period_end: myPlan?.data?.period_end,
                    target_plan: plan.name,
                });
                return;
            }
            toast.error(t('public_pages.pricing.free_active_default', undefined, 'Gói miễn phí đã được kích hoạt mặc định.'));
            return;
        }

        try {
            setProcessingPlanCode(plan.plan_code);
            const res = await subscriptionService.createCheckoutSession(plan.plan_code);
            setCheckoutData(res.data);
            setIsCheckoutModalOpen(true);
        } catch (error: any) {
            const detail = error.response?.data?.detail;
            if (isDowngradeBlocked(detail)) {
                setDowngradeBlocked(detail);
            } else {
                toast.error(typeof detail === 'string' ? detail : t('public_pages.pricing.checkout_error', undefined, 'Không thể tạo phiên thanh toán.'));
            }
        } finally {
            setProcessingPlanCode(null);
        }
    };

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner Tích hợp Background Image & Glows */}
            <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
                {/* Background image - đồng bộ với HeroSection, jobs public, companies public */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/pricing-bg.jpg"
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center opacity-[0.22] dark:opacity-[0.22]"
                    />

                    {/* Light mode overlay */}
                    <div className="absolute inset-0 bg-linear-to-b from-background/45 via-background/70 to-background/95 dark:hidden" />

                    {/* Dark mode overlay */}
                    <div className="absolute inset-0 hidden bg-linear-to-b from-[#020617]/55 dark:block" />

                    {/* Dark mode color tint */}
                    <div className="absolute inset-0 hidden bg-blue-950/20 mix-blend-multiply dark:block" />
                </div>

                {/* Primary glow */}
                <div className="absolute left-1/2 top-[-12%] h-130 w-205 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px] dark:bg-blue-500/10 pointer-events-none" />

                {/* Soft side glows */}
                <div className="absolute left-[-15%] top-[20%] h-105 w-105 rounded-full bg-blue-400/4.5 blur-[120px] dark:bg-blue-500/6 pointer-events-none" />
                <div className="absolute right-[-15%] top-[30%] h-105 w-105 rounded-full bg-cyan-300/4 blur-[120px] dark:bg-cyan-500/5 pointer-events-none" />

                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background via-background/65 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xs border border-blue-100 dark:border-blue-900/50">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        {t('public_pages.pricing.hero.title_prefix', undefined, 'Bảng giá')}{' '}<span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">{t('public_pages.pricing.hero.title_highlight', undefined, 'Dịch vụ')}</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg max-w-2xl mx-auto">
                        {t('public_pages.pricing.hero.desc', undefined, 'Đầu tư thông minh, tối ưu chi phí tuyển dụng và phát triển sự nghiệp cùng hệ thống AI Verisem.')}
                    </p>

                    {/* Bộ lọc sắp xếp lại: 1. Theo đối tượng người dùng, 2. Theo loại gói & chu kỳ */}
                    <div className="mt-10 flex flex-col items-center gap-4">
                        {/* 1. Bộ lọc theo đối tượng người dùng */}
                        <div className="inline-flex p-1.5 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs backdrop-blur-md">
                            <button
                                onClick={() => setAudience('hr')}
                                className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                                    audience === 'hr'
                                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <Building2 className="w-4 h-4" />
                                <span>{t('public_pages.pricing.audience.hr', undefined, 'Nhà tuyển dụng')}</span>
                            </button>
                            <button
                                onClick={() => setAudience('applicant')}
                                className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                                    audience === 'applicant'
                                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <User className="w-4 h-4" />
                                <span>{t('public_pages.pricing.audience.applicant', undefined, 'Ứng viên')}</span>
                            </button>
                        </div>

                        {/* 2. Bộ lọc theo chu kỳ / loại gói */}
                        <div className="inline-flex items-center p-1 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs backdrop-blur-md">
                            <button
                                onClick={() => setCycleFilter('monthly')}
                                className={`px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg font-bold transition-all cursor-pointer ${
                                    cycleFilter === 'monthly'
                                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/70'
                                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                                }`}
                            >{t('public_pages.pricing.cycles.monthly', undefined, 'Gói Tháng')}</button>
                            <button
                                onClick={() => setCycleFilter('yearly')}
                                className={`px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                    cycleFilter === 'yearly'
                                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/70'
                                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                                }`}
                            >
                                <span>{t('public_pages.pricing.cycles.yearly', undefined, 'Gói Năm')}</span>
                                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                                    {t('public_pages.pricing.cycles.save_20', undefined, 'Tiết kiệm 20%')}
                                </span>
                            </button>
                            <button
                                onClick={() => setCycleFilter('topup')}
                                className={`px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg font-bold transition-all cursor-pointer ${
                                    cycleFilter === 'topup'
                                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/70'
                                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                                }`}
                            >{t('public_pages.pricing.cycles.topup', undefined, 'Nạp Lẻ Credit AI')}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách Gói cước */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 -mt-14 relative z-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{t('public_pages.pricing.loading', undefined, 'Đang tải bảng giá dịch vụ...')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch justify-center">
                        {plans.filter((plan: any) => {
                            const isTopup = plan.plan_type === 'topup';
                            if (cycleFilter === 'topup') return isTopup;
                            if (isTopup) return false;
                            if (plan.billing_cycle_days === 0 && plan.current_price === 0) return true;
                            if (cycleFilter === 'monthly') return plan.billing_cycle_days === 30;
                            if (cycleFilter === 'yearly') return plan.billing_cycle_days === 365;
                            return true;
                        }).map((plan: any) => {
                            const isTopup = plan.plan_type === 'topup';
                            const isCurrentPlan = !isTopup && myPlan?.data?.current_plan_code === plan.plan_code;
                            const isDowngrade = Boolean(isAuthenticated && !isTopup && !isCurrentPlan && currentPlanTier > 0 && (plan.tier_level || 0) < currentPlanTier);

                            return (
                                <PlanCard
                                    key={plan.id || plan.plan_code}
                                    plan={plan}
                                    isCurrentPlan={isCurrentPlan}
                                    isProcessing={processingPlanCode === plan.plan_code}
                                    onSubscribe={handleSubscribe}
                                    customButtonText={isAuthenticated ? t('public_pages.pricing.btn_select', undefined, 'Chọn gói này') : t('public_pages.pricing.btn_start', undefined, 'Bắt đầu ngay')}
                                    isDowngrade={isDowngrade}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Hỗ trợ tùy chỉnh */}
                <div className="mt-20 text-center">
                    <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            {t('public_pages.pricing.custom.title', undefined, 'Cần giải pháp hoặc gói tùy chỉnh?')}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 text-sm leading-relaxed">
                            {t('public_pages.pricing.custom.desc', undefined, 'Doanh nghiệp quy mô lớn hoặc cần cấu hình hạn mức riêng biệt? Đội ngũ chuyên gia của Verisem luôn sẵn sàng tư vấn.')}
                        </p>
                        <Link
                            href={ROUTES.SUPPORT}
                            className="inline-flex px-6 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-300 text-sm font-bold rounded-xl transition-all shadow-xs"
                        >{t('public_pages.pricing.custom.btn', undefined, 'Liên hệ Đội ngũ tư vấn')}</Link>
                    </div>
                </div>
            </main>

            <PublicFooter />

            <DowngradeBlockedModal info={downgradeBlocked} onClose={() => setDowngradeBlocked(null)} />

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                checkoutData={checkoutData}
                onSuccess={() => {
                    setIsCheckoutModalOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
                }}
            />
        </div>
    );
}