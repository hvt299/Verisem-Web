'use client';

import { useState } from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { subscriptionService } from '@/features/subscription/subscription.service';
import CheckoutModal from '@/components/billing/CheckoutModal';
import DowngradeBlockedModal, { DowngradeBlockedInfo, isDowngradeBlocked } from '@/components/billing/DowngradeBlockedModal';
import BillingLedger from '@/components/billing/BillingLedger';
import OrderHistory from '@/components/billing/OrderHistory';
import PlanCard from '@/components/billing/PlanCard';

const CREDIT_SOURCE_LABELS: Record<string, string> = {
    subscription: 'credit theo gói',
    topup: 'credit mua lẻ',
    admin: 'credit được tặng',
    free: 'credit miễn phí',
    legacy: 'credit cũ',
};

export default function ApplicantBillingPage() {
    const queryClient = useQueryClient();
    const { data: myPlanRes, isLoading: isMyPlanLoading } = useSubscription();
    const { data: plansRes, isLoading: isPlansLoading } = useSubscriptionPlans('applicant');
    const { data: txRes, isLoading: isTxLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => subscriptionService.getTransactions(),
    });

    const { data: ordersRes, isLoading: isOrdersLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: () => subscriptionService.getOrders(),
    });

    const planInfo = myPlanRes?.data;
    const plans = plansRes?.data || [];
    const transactions = txRes?.data || [];
    const orders = ordersRes?.data || [];
    const creditBreakdown: any[] = planInfo?.credits?.breakdown || [];

    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [processingPlanCode, setProcessingPlanCode] = useState<string | null>(null);
    const [downgradeBlocked, setDowngradeBlocked] = useState<DowngradeBlockedInfo | null>(null);

    if (isMyPlanLoading || isPlansLoading) {
        return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" /></div>;
    }

    const handleSubscribe = async (plan: any) => {
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Nâng cấp Hồ sơ</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sử dụng sức mạnh AI để làm nổi bật CV, gia tăng 300% cơ hội trúng tuyển.</p>
                </div>
            </div>

            {/* TRẠNG THÁI */}
            <div className="bg-primary-50/50 dark:bg-primary-900/10 border-2 border-primary-200 dark:border-primary-800/50 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="relative z-5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Gói Tài khoản hiện tại</p>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                            {planInfo?.current_plan || 'Đang tải...'}
                            {planInfo?.current_plan_code !== 'app_free' && (
                                <ShieldCheck className="w-6 h-6 text-primary-500" />
                            )}
                        </h2>
                        {planInfo && (
                            <p className="text-sm font-medium text-slate-500 mt-2">
                                Thời hạn: <span className="font-bold text-slate-700 dark:text-slate-300">
                                    {planInfo.period_end ? new Date(planInfo.period_end).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                                </span>
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Credit AI (Sửa CV, Phân tích)</p>
                        <div className="flex items-center gap-2">
                            <Zap className="w-8 h-8 text-amber-500" fill="currentColor" />
                            <h2 className="text-3xl font-black text-slate-800 dark:text-white">{planInfo?.credits_remaining || 0}</h2>
                        </div>
                        {creditBreakdown.length > 0 && (
                            <ul className="mt-3 space-y-1">
                                {creditBreakdown.map((item: any) => (
                                    <li key={item.grant_id} className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.remaining}</span>{' '}
                                        {CREDIT_SOURCE_LABELS[item.source] || item.source}
                                        {' · '}
                                        {item.expires_at ? `hết hạn ${new Date(item.expires_at).toLocaleDateString('vi-VN')}` : 'không hết hạn'}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* LƯỚI GÓI CƯỚC */}
            <div id="pricing-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {plans.map((plan: any) => {
                    const isTopup = plan.plan_type === 'topup';
                    const isCurrentPlan = !isTopup && planInfo?.current_plan_code === plan.plan_code;

                    return (
                        <PlanCard
                            key={plan.plan_code}
                            plan={plan}
                            isCurrentPlan={isCurrentPlan}
                            isProcessing={processingPlanCode === plan.plan_code}
                            onSubscribe={handleSubscribe}
                            customButtonText="Nâng cấp ngay"
                        />
                    );
                })}
            </div>

            {/* LỊCH SỬ ĐƠN HÀNG */}
            <OrderHistory orders={orders} isLoading={isOrdersLoading} />

            {/* SỔ CÁI GIAO DỊCH */}
            <BillingLedger transactions={transactions} isLoading={isTxLoading} />

            <DowngradeBlockedModal info={downgradeBlocked} onClose={() => setDowngradeBlocked(null)} />

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                checkoutData={checkoutData}
                onSuccess={() => {
                    setIsCheckoutModalOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
                    queryClient.invalidateQueries({ queryKey: ['transactions'] });
                    queryClient.invalidateQueries({ queryKey: ['orders'] });
                }}
            />
        </div>
    );
}