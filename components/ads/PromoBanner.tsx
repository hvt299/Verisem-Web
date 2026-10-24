'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/store/useLanguageStore';
import { Sparkles, X, ArrowRight, ExternalLink, ShieldCheck, Award } from 'lucide-react';

interface PromoBannerProps {
    variant?: 'ribbon' | 'native-card' | 'sidebar' | 'right-rail';
    title?: string;
    description?: string;
    badge?: string;
    ctaText?: string;
    ctaLink?: string;
    onDismiss?: () => void;
    className?: string;
}

export default function PromoBanner({
    variant = 'ribbon',
    title,
    description,
    badge,
    ctaText,
    ctaLink = '/pricing',
    onDismiss,
    className = ''
}: PromoBannerProps) {
    const { t } = useTranslation();
    const [dismissed, setDismissed] = useState(false);

    const displayTitle = title || t('common.promo.pro_title', undefined, 'Nâng cấp Verisem Pro – Trải nghiệm AI Mentor Chấm điểm CV Không Giới Hạn');
    const displayDescription = description || t('common.promo.pro_desc', undefined, 'Tối ưu hồ sơ năng lực theo tiêu chuẩn ATS quốc tế và nhận diện lỗ hổng kỹ năng trong 3 giây.');
    const displayBadge = badge || t('common.promo.sponsored', undefined, 'Được tài trợ');
    const displayCtaText = ctaText || t('common.promo.explore_now', undefined, 'Khám phá ngay');

    if (dismissed) return null;

    const handleClose = () => {
        setDismissed(true);
        if (onDismiss) onDismiss();
    };

    // 1. Hero Slim Ribbon Banner (Nằm trên đầu trang Jobs hoặc dưới thanh tìm kiếm)
    if (variant === 'ribbon') {
        return (
            <div className={`relative overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 p-4 sm:p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-blue-900/50 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 backdrop-blur-md ${className}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
                            <Sparkles className="h-5 w-5 animate-pulse" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 dark:border dark:border-blue-800/60">
                                    {displayBadge}
                                </span>
                                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                                    {displayTitle}
                                </h4>
                            </div>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-1 sm:line-clamp-none">
                                {displayDescription}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                        <Link
                            href={ctaLink}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
                        >
                            {displayCtaText} <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                            aria-label={t('common.promo.close_banner', undefined, 'Đóng banner')}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Native In-Feed Ad Card (Hiển thị sau mỗi 5-7 Job cards)
    if (variant === 'native-card') {
        return (
            <div className={`relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/40 p-5 sm:p-6 transition-all hover:border-blue-400 hover:shadow-md dark:border-blue-900/50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30 shadow-sm ${className}`}>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
                            <Award className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                                    {displayBadge}
                                </span>
                                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{t('common.promo.strategic_partner', undefined, 'Đối tác chiến lược')}</span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                {displayTitle}
                            </h3>
                            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
                                {displayDescription}
                            </p>
                        </div>
                    </div>

                    <Link
                        href={ctaLink}
                        className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-sm shadow-blue-600/20"
                    >
                        {displayCtaText} <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        );
    }

    // 3. Sticky Sidebar Promo Badge (Dưới chân bộ lọc)
    if (variant === 'sidebar') {
        return (
            <div className={`relative overflow-hidden rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50/60 via-white to-slate-50/40 p-4.5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all dark:border-blue-900/40 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30 ${className}`}>
                <div className="flex items-center gap-2 mb-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                        {displayBadge}
                    </span>
                </div>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {displayTitle}
                </h5>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {displayDescription}
                </p>
                <Link
                    href={ctaLink}
                    className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
                >
                    {displayCtaText} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        );
    }

    // 4. Right-Rail Detail Banner (Trang chi tiết Job)
    return (
        <div className={`relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-slate-50/40 p-5 dark:border-blue-900/50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30 shadow-sm ${className}`}>
            <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 mb-2">
                {displayBadge}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {displayTitle}
            </h4>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {displayDescription}
            </p>
            <Link
                href={ctaLink}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
            >
                {displayCtaText} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
        </div>
    );
}
