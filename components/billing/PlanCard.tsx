'use client';

import { CheckCircle2, Zap, Loader2, Sparkles, Crown } from 'lucide-react';
import { cn } from '@/utils/utils';

interface PlanCardProps {
    plan: any;
    isCurrentPlan: boolean;
    isProcessing: boolean;
    onSubscribe: (plan: any) => void;
    customButtonText?: string;
    isDowngrade?: boolean;
}

export default function PlanCard({ plan, isCurrentPlan, isProcessing, onSubscribe, customButtonText, isDowngrade }: PlanCardProps) {
    const tierLevel = plan.tier_level || 0;
    const isElevated = tierLevel >= 2;
    const isTopup = plan.plan_type ? plan.plan_type === 'topup' : plan.billing_cycle_days === 0 && plan.current_price > 0;

    // Card styling based on tier
    const getCardBorderClasses = () => {
        if (isCurrentPlan) {
            return "border-blue-500/90 ring-4 ring-blue-500/10 md:-translate-y-2 bg-blue-50/20 dark:bg-slate-900";
        }
        if (tierLevel === 3) {
            return "border-amber-400/80 dark:border-amber-500/60 shadow-lg shadow-amber-500/10 md:-translate-y-2 bg-white dark:bg-slate-900";
        }
        if (tierLevel === 2) {
            return "border-blue-500/80 dark:border-blue-500/60 shadow-lg shadow-blue-500/10 md:-translate-y-2 bg-white dark:bg-slate-900";
        }
        if (tierLevel === 1) {
            return "border-sky-200 dark:border-sky-800/60 hover:border-sky-400 dark:hover:border-sky-700 bg-white dark:bg-slate-900";
        }
        return "border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900";
    };

    // Button styling based on tier
    const getButtonClasses = () => {
        if (isCurrentPlan) {
            return "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed";
        }
        if (tierLevel === 3) {
            return "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/25 active:scale-98";
        }
        if (tierLevel === 2) {
            return "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 active:scale-98";
        }
        if (tierLevel === 1) {
            return "bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 active:scale-98";
        }
        return "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 active:scale-98";
    };

    return (
        <div className={cn(
            "relative flex flex-col h-full rounded-3xl p-6 sm:p-7 transition-all duration-300 border font-sans",
            isDowngrade
                ? "opacity-50 hover:opacity-75 border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/40 filter grayscale-20"
                : cn("shadow-xs hover:shadow-xl", getCardBorderClasses())
        )}>
            {/* Top Badges */}
            {isCurrentPlan ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-1.5 shadow-md whitespace-nowrap z-10">
                    <CheckCircle2 className="w-3.5 h-3.5" /> GÓI HIỆN TẠI
                </div>
            ) : isDowngrade ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-200/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-slate-300/80 dark:border-slate-700 shadow-2xs whitespace-nowrap z-10">
                    Không thể hạ cấp
                </div>
            ) : plan.badge ? (
                <div className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap z-10",
                    tierLevel === 3
                        ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
                        : tierLevel === 2
                            ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                            : "bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700"
                )}>
                    {tierLevel === 3 ? <Crown className="w-3 h-3" /> : tierLevel === 2 ? <Sparkles className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                    {plan.badge}
                </div>
            ) : null}

            {/* Plan Header */}
            <div className="flex justify-between items-start mb-4 mt-1">
                <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{plan.name}</h3>
                    {plan.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{plan.description}</p>
                    )}
                </div>
            </div>

            {/* Price Box */}
            <div className="mb-5 min-h-20 flex flex-col justify-end border-b border-slate-100 dark:border-slate-800/80 pb-5">
                {plan.original_price > plan.current_price && (
                    <p className="text-sm text-slate-400 dark:text-slate-500 line-through mb-1 font-medium">
                        {plan.original_price.toLocaleString('vi-VN')} VNĐ
                    </p>
                )}
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                        {plan.current_price === 0 ? 'Miễn phí' : plan.current_price.toLocaleString('vi-VN')}
                    </span>
                    {plan.current_price > 0 && (
                        <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">VNĐ</span>
                    )}
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                    {isTopup ? 'Nạp một lần dùng trọn đời' : plan.billing_cycle_days === 0 ? 'Sử dụng vĩnh viễn' : plan.billing_cycle_days === 365 ? 'Thanh toán theo năm' : 'Thanh toán theo tháng'}
                </p>
            </div>

            {/* Feature List */}
            <ul className="space-y-3 mb-6 flex-1">
                {plan.display_features?.map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                    </li>
                ))}
            </ul>

            {/* Subscribe Action Button */}
            <button
                onClick={() => onSubscribe(plan)}
                disabled={isCurrentPlan || isProcessing}
                className={cn(
                    "w-full py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all duration-200 cursor-pointer",
                    isDowngrade
                        ? "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700/60 cursor-not-allowed"
                        : getButtonClasses()
                )}
            >
                {isCurrentPlan ? 'Đang sử dụng' : isProcessing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</>
                ) : isDowngrade ? (
                    'Không thể hạ cấp'
                ) : customButtonText || 'Chọn gói này'}
            </button>
        </div>
    );
}