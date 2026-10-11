'use client';

import { CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { getTierBadgeConfig } from '@/utils/tier-colors';
import { cn } from '@/utils/utils';

interface PlanCardProps {
    plan: any;
    isCurrentPlan: boolean;
    isProcessing: boolean;
    onSubscribe: (plan: any) => void;
    customButtonText?: string;
}

export default function PlanCard({ plan, isCurrentPlan, isProcessing, onSubscribe, customButtonText }: PlanCardProps) {
    const tierColors = getTierBadgeConfig(plan.tier_level || 0);
    const isElevated = plan.tier_level >= 2;
    const isTopup = plan.plan_type ? plan.plan_type === 'topup' : plan.billing_cycle_days === 0 && plan.current_price > 0;

    return (
        <div className={cn(
            "relative flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-3xl p-6 shadow-sm transition-all duration-300 border",
            isCurrentPlan ? "border-primary-500 ring-4 ring-primary-500/10 md:-translate-y-2 bg-slate-50/50 dark:bg-slate-800/50"
                : isElevated ? `${tierColors.border} ${tierColors.glow} md:-translate-y-2` : tierColors.border
        )}>
            {isCurrentPlan ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-1.5 shadow-md whitespace-nowrap z-5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> GÓI HIỆN TẠI
                </div>
            ) : plan.badge && (
                <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap z-5 border", tierColors.bg, tierColors.text, tierColors.border)}>
                    <Zap className="w-3 h-3" /> {plan.badge}
                </div>
            )}

            <div className="flex justify-between items-start mb-4 mt-2">
                <h3 className="text-lg font-black text-slate-800 dark:text-white">{plan.name}</h3>
            </div>

            <div className="mb-4 min-h-19 flex flex-col justify-end">
                {plan.original_price > plan.current_price && (
                    <p className="text-sm text-slate-400 line-through mb-1">
                        {plan.original_price.toLocaleString('vi-VN')} VNĐ
                    </p>
                )}
                <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">
                    {plan.current_price === 0 ? 'Miễn phí' : plan.current_price.toLocaleString('vi-VN')}
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">{plan.current_price > 0 && 'VNĐ'}</span>
                </p>
                <p className="text-sm text-slate-500 mt-2">
                    {isTopup ? 'Nạp một lần' : plan.billing_cycle_days === 0 ? 'Vĩnh viễn' : plan.billing_cycle_days === 365 ? '/ Năm' : '/ Tháng'}
                </p>
            </div>

            <ul className="space-y-3 mb-6 flex-1">
                {plan.display_features?.map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" /> {feat}
                    </li>
                ))}
            </ul>

            <button
                onClick={() => onSubscribe(plan)}
                disabled={isCurrentPlan || isProcessing}
                className={cn(
                    "w-full py-2.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all disabled:opacity-50",
                    isCurrentPlan ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 cursor-not-allowed"
                        : isElevated ? `${tierColors.bg} ${tierColors.text} hover:opacity-90 shadow-md ${tierColors.glow}`
                            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                )}
            >
                {isCurrentPlan ? 'Đang sử dụng' : isProcessing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</>
                ) : customButtonText || 'Chọn gói này'}
            </button>
        </div>
    );
}