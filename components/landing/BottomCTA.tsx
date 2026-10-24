'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from '@/store/useLanguageStore';

export default function BottomCTA() {
    const { t } = useTranslation();
    return (
        <section
            id="cta"
            className="relative overflow-hidden border-t border-slate-200 bg-background px-4 py-20 transition-colors dark:border-slate-800 sm:px-6 sm:py-24 md:py-28"
        >
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/4.5 blur-3xl dark:bg-primary-500/6"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                <motion.div
                    className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-primary-500/2.5 blur-3xl dark:bg-primary-500/[0.035]"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                <motion.div
                    className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-violet-500/2 blur-3xl dark:bg-violet-500/3"
                    animate={{
                        x: [0, -25, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                <div
                    className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]"
                    style={{
                        backgroundImage:
                            'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
            </div>

            <div className="relative mx-auto w-full max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-8 sm:py-14 md:px-16 md:py-16"
                >
                    {/* Top light */}
                    <motion.div
                        className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-primary-500/60 to-transparent"
                        animate={{
                            opacity: [0.3, 0.8, 0.3],
                            scaleX: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Decorative glow */}
                    <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-primary-500/[0.035] blur-3xl dark:bg-primary-500/5" />

                    <div className="relative">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1.5 text-xs font-bold text-primary-600 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            {t('landing.cta.badge', undefined, 'Bắt đầu ngay hôm nay')}
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                            className="mx-auto max-w-3xl text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl"
                        >
                            {t('landing.cta.title_part1', undefined, 'Sẵn sàng nâng cấp')}
                            <br className="hidden sm:block" /> {t('landing.cta.title_part2', undefined, 'hệ thống tuyển dụng?')}
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-500 dark:text-slate-400 sm:text-base md:text-lg"
                        >
                            {t('landing.cta.subtitle', undefined, 'Tự động hóa sàng lọc, đánh giá ứng viên bằng AI và giúp đội ngũ tuyển dụng tập trung vào những người phù hợp nhất.')}
                        </motion.p>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
                        >
                            <Link
                                href={ROUTES.REGISTER}
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-primary-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/25 sm:w-auto"
                            >
                                {t('landing.cta.register_free', undefined, 'Đăng ký miễn phí')}
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </Link>

                            <Link
                                href={ROUTES.FEATURES}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 sm:w-auto cursor-pointer"
                            >
                                <Play className="h-4 w-4 fill-current text-primary-600 dark:text-primary-400" />
                                {t('landing.cta.explore_features', undefined, 'Khám phá tính năng')}
                            </Link>
                        </motion.div>

                        {/* Trust line */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-bold text-slate-400 dark:text-slate-500"
                        >
                            <span>{t('landing.cta.no_card', undefined, 'Không cần thẻ tín dụng')}</span>
                            <span className="hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:block" />
                            <span>{t('landing.cta.fast_setup', undefined, 'Thiết lập nhanh chóng')}</span>
                            <span className="hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:block" />
                            <span>{t('landing.cta.centralized_mgmt', undefined, 'Quản lý tuyển dụng tập trung')}</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}