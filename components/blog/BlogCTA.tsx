'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, FileCheck, Search } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from '@/store/useLanguageStore';

export default function BlogCTA() {
    const { t } = useTranslation();
    return (
        <div className="relative overflow-hidden rounded-3xl border border-blue-200/80 dark:border-blue-800/60 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-7 text-white shadow-xl shadow-blue-500/15 font-sans">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl" />

            <div className="relative z-10 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xs">
                    <Sparkles className="h-6 w-6 text-cyan-300" />
                </div>

                <div>
                    <h4 className="text-lg font-black tracking-tight leading-snug">
                        {t('public_pages.blog.cta.title', undefined, 'Chấm điểm CV cùng AI Verisem')}
                    </h4>
                    <p className="mt-1.5 text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
                        {t('public_pages.blog.cta.desc', undefined, 'Kiểm tra độ tương thích hồ sơ với JD và tối ưu hóa từ khóa chuẩn ATS chỉ trong 10 giây.')}
                    </p>
                </div>

                <div className="space-y-2 pt-1">
                    <Link
                        href={ROUTES.PUBLIC_JOBS}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 hover:shadow-md transition-all shadow-sm"
                    >
                        <Search className="w-3.5 h-3.5" />
                        <span>{t('public_pages.blog.cta.explore_jobs', undefined, 'Khám phá việc làm ngay')}</span>
                    </Link>

                    <Link
                        href={ROUTES.REGISTER}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors"
                    >
                        <span>{t('public_pages.blog.cta.register_free', undefined, 'Đăng ký tài khoản miễn phí')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
