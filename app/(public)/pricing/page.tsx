'use client';

import { useState, useEffect } from 'react';
import { CreditCard, HelpCircle, Loader2, Building2, User } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { subscriptionService } from '@/features/subscription/subscription.service';
import { useSubscription } from '@/hooks/useSubscription';
import { ROUTES } from '@/constants/routes';

import PlanCard from '@/components/billing/PlanCard';
import CheckoutModal from '@/components/billing/CheckoutModal';
import DowngradeBlockedModal, { DowngradeBlockedInfo, isDowngradeBlocked } from '@/components/billing/DowngradeBlockedModal';

export default function PricingPage() {
    const { isAuthenticated, user } = useAuthStore();
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

    const handleSubscribe = async (plan: any) => {
        if (!isAuthenticated) {
            router.push(ROUTES.REGISTER);
            return;
        }

        if (plan.current_price === 0) {
            toast.error('Gói miễn phí đã được kích hoạt mặc định.');
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
                toast.error(typeof detail === 'string' ? detail : 'Không thể tạo phiên thanh toán.');
            }
        } finally {
            setProcessingPlanCode(null);
        }
    };

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-5 text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-200 dark:border-primary-800/50">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Bảng giá <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">Dịch vụ</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        Lựa chọn gói cước phù hợp với nhu cầu của bạn.
                    </p>

                    {/* Bộ lọc Đối tượng */}
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <div className="inline-flex items-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setAudience('hr')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${audience === 'hr' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                <Building2 className="w-4 h-4" /> Nhà tuyển dụng
                            </button>
                            <button
                                onClick={() => setAudience('applicant')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${audience === 'applicant' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                <User className="w-4 h-4" /> Ứng viên
                            </button>
                        </div>

                        {/* Bộ lọc Chu kỳ */}
                        <div className="inline-flex items-center p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setCycleFilter('monthly')}
                                className={`px-5 py-2 text-sm rounded-lg font-bold transition-all ${cycleFilter === 'monthly' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Gói Tháng
                            </button>
                            <button
                                onClick={() => setCycleFilter('yearly')}
                                className={`px-5 py-2 text-sm rounded-lg font-bold transition-all ${cycleFilter === 'yearly' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Gói Năm (Tiết kiệm)
                            </button>
                            <button
                                onClick={() => setCycleFilter('topup')}
                                className={`px-5 py-2 text-sm rounded-lg font-bold transition-all ${cycleFilter === 'topup' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Nạp Lẻ Credit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 -mt-16 relative z-5">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Đang tải bảng giá...</p>
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

                            return (
                                <PlanCard
                                    key={plan.id || plan.plan_code}
                                    plan={plan}
                                    isCurrentPlan={isCurrentPlan}
                                    isProcessing={processingPlanCode === plan.plan_code}
                                    onSubscribe={handleSubscribe}
                                    customButtonText={isAuthenticated ? 'Chọn gói này' : 'Bắt đầu ngay'}
                                />
                            );
                        })}
                    </div>
                )}

                <div className="mt-20 text-center">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2">
                        <HelpCircle className="w-5 h-5 text-blue-500" /> Cần hỗ trợ tùy chỉnh?
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 text-sm">
                        Liên hệ với chúng tôi để thiết kế gói dịch vụ linh hoạt theo quy mô của bạn.
                    </p>
                    <Link href={ROUTES.SUPPORT} className="inline-flex px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Liên hệ Đội ngũ tư vấn
                    </Link>
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