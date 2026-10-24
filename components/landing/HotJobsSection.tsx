'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Flame, ChevronRight, ChevronLeft, MapPin, Building2, DollarSign } from 'lucide-react';
import { Job } from '@/types';
import { formatSalaryRange } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { JOB_BADGE_CONFIG } from '@/utils/tier-colors';
import { useTranslation } from '@/store/useLanguageStore';

interface HotJobsSectionProps {
    jobs: Job[];
}

type SortOption = 'default' | 'salary_desc' | 'latest';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export const HotJobItem = ({
    job
}: {
    job: Partial<Job> & { company_name?: string; company_logo?: string };
}) => {
    const { t } = useTranslation();
    const hotBadge = JOB_BADGE_CONFIG.hot;

    return (
        <div className="group/item relative overflow-hidden rounded-2xl p-[1.5px] bg-slate-200/80 dark:bg-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/10">
            {/* Animated Rotating Border Beam (Hot job: Orange/Amber) */}
            <div
                className="pointer-events-none absolute -inset-[150%] animate-border-beam"
                style={{
                    background:
                        'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, rgba(251, 146, 60, 0.15) 305deg, rgba(249, 115, 22, 0.75) 330deg, rgba(251, 146, 60, 0.2) 348deg, transparent 360deg)',
                }}
            />

            <Link
                href={ROUTES.PUBLIC_JOB_DETAIL(job.id!)}
                className="relative z-10 flex h-full min-w-0 w-full rounded-[14.5px] bg-white p-5 transition-all duration-300 dark:bg-slate-900 overflow-hidden"
            >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl transition-all group-hover/item:bg-orange-500/20" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-orange-400 via-orange-500 to-rose-500 opacity-70" />

                <div className="relative z-10 flex w-full min-w-0 gap-4">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 p-1.5 shadow-sm dark:border-slate-700 ${job.company_logo ? 'bg-white' : 'bg-slate-50 dark:bg-slate-800'}`}>
                        {job.company_logo ? (
                            <img src={job.company_logo} alt={job.company_name || 'Company'} className="h-full w-full object-contain" loading="lazy" />
                        ) : (
                            <Building2 className="h-8 w-8 text-slate-300" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                            <h3 className="min-w-0 flex-1 line-clamp-2 text-base font-bold leading-6 text-slate-900 transition-colors group-hover/item:text-orange-600 dark:text-white dark:group-hover/item:text-orange-400">
                                {job.title}
                            </h3>

                            {job.is_hot && (
                                <span className={`flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${hotBadge.bg} ${hotBadge.text} ${hotBadge.border} ${hotBadge.glow}`}>
                                    <Flame className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">{hotBadge.label}</span>
                                </span>
                            )}
                        </div>

                        <p className="mb-3 mt-1.5 truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                            {job.company_name || t('landing.hot_jobs.anonymous_company', undefined, 'Công ty Ẩn danh')}
                        </p>

                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <span className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <DollarSign className="h-4 w-4 shrink-0" />
                                <span className="truncate">{formatSalaryRange(job.salary)}</span>
                            </span>

                            {(job.location?.province_name || job.location?.country) && (
                                <span className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-md bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    <span className="truncate">
                                        {job.location.country && job.location.country !== 'Việt Nam' ? job.location.country : job.location.province_name}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default function HotJobsSection({ jobs }: HotJobsSectionProps) {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const itemsPerPage = 6;

    const allHotJobs = useMemo(() => jobs.filter(job => job.is_hot), [jobs]);

    const sortedHotJobs = useMemo(() => {
        const result = [...allHotJobs];

        if (sortBy === 'salary_desc') {
            result.sort((a, b) => Number(b.salary?.max_salary ?? 0) - Number(a.salary?.max_salary ?? 0));
        } else if (sortBy === 'latest') {
            result.sort((a, b) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime());
        }

        return result;
    }, [allHotJobs, sortBy]);

    const totalPages = Math.max(1, Math.ceil(sortedHotJobs.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const currentJobs = sortedHotJobs.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

    if (allHotJobs.length === 0) return null;

    return (
        <section className="border-b border-slate-200 bg-background pt-12 pb-12 sm:pt-14 sm:pb-14 md:pt-16 md:pb-16 lg:pt-16 lg:pb-16 font-sans transition-colors dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Gian hàng */}
                <div className="group/shop relative overflow-hidden rounded-2xl border border-orange-200/70 bg-linear-to-br from-orange-50/40 via-white to-rose-50/30 shadow-sm transition-all duration-500 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 dark:border-orange-500/20 dark:bg-linear-to-br dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/20 dark:hover:border-orange-500/40">

                    {/* Ánh sáng nền chuyển động */}
                    <motion.div
                        className="pointer-events-none absolute -left-32 top-0 h-40 w-72 rounded-full bg-orange-400/10 blur-3xl"
                        animate={{
                            x: [0, 120, 0],
                            opacity: [0.35, 0.65, 0.35]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />

                    <motion.div
                        className="pointer-events-none absolute -right-32 top-0 h-40 w-72 rounded-full bg-rose-400/10 blur-3xl"
                        animate={{
                            x: [0, -120, 0],
                            opacity: [0.25, 0.55, 0.25]
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />

                    {/* Header */}
                    <div className="relative z-10 border-b border-slate-100 px-5 py-5 dark:border-slate-800 md:px-6">
                        <div className="flex items-center justify-between gap-4">

                            <div className="flex min-w-0 items-center gap-3">

                                {/* Flame */}
                                <motion.div
                                    className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-400 to-rose-500 text-white shadow-lg shadow-orange-500/25"
                                    animate={{
                                        scale: [1, 1.05, 0.98, 1.04, 1],
                                        rotate: [0, -2, 2, -1, 0]
                                    }}
                                    transition={{
                                        duration: 1.8,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    <motion.div
                                        className="absolute inset-0 rounded-xl bg-orange-400/40 blur-md"
                                        animate={{
                                            opacity: [0.3, 0.7, 0.35, 0.65, 0.3],
                                            scale: [0.9, 1.15, 0.95, 1.1, 0.9]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: 'easeInOut'
                                        }}
                                    />

                                    <Flame className="relative z-10 h-6 w-6 fill-current" />
                                </motion.div>

                                <div className="min-w-0">
                                    <h2 className="truncate text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white md:text-2xl">
                                        {t('landing.hot_jobs.title_prefix', undefined, 'Việc Làm')}{' '}
                                        <span className="bg-linear-to-r from-orange-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                                            {t('landing.hot_jobs.title_highlight', undefined, 'Hot')}
                                        </span>
                                    </h2>

                                    <p className="mt-0.5 hidden text-sm text-slate-400 sm:block">
                                        {t('landing.hot_jobs.subtitle', undefined, 'Những cơ hội việc làm nổi bật dành cho bạn')}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={`${ROUTES.PUBLIC_JOBS}?is_hot=true`}
                                className="flex shrink-0 items-center gap-1 text-sm font-bold text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400"
                            >
                                {t('landing.hot_jobs.view_all', undefined, 'Xem tất cả')}
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Filter */}
                        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-2.5 dark:bg-slate-800/60">
                            <div className="flex min-w-0 items-center gap-2">
                                <span className="hidden shrink-0 text-sm font-medium text-slate-500 sm:inline dark:text-slate-400">
                                    {t('landing.hot_jobs.sort_by', undefined, 'Sắp xếp theo:')}
                                </span>

                                <select
                                    value={sortBy}
                                    onChange={e => {
                                        setSortBy(e.target.value as SortOption);
                                        setCurrentPage(1);
                                    }}
                                    className="h-9 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                >
                                    <option value="default">{t('landing.hot_jobs.sort_default', undefined, 'Mặc định')}</option>
                                    <option value="salary_desc">{t('landing.hot_jobs.sort_salary', undefined, 'Lương cao nhất')}</option>
                                    <option value="latest">{t('landing.hot_jobs.sort_latest', undefined, 'Mới cập nhật')}</option>
                                </select>
                            </div>

                            <span className="shrink-0 text-sm font-medium text-slate-400">
                                {t('landing.hot_jobs.jobs_count', { count: sortedHotJobs.length }, `${sortedHotJobs.length} việc làm`)}
                            </span>
                        </div>
                    </div>

                    {/* Jobs */}
                    <div className="relative z-10 bg-linear-to-b from-transparent via-orange-50/20 to-orange-50/40 p-5 md:p-6 dark:from-transparent dark:via-orange-950/5 dark:to-orange-950/10">
                        <motion.div
                            key={`${safeCurrentPage}-${sortBy}`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {currentJobs.map(job => (
                                <motion.div key={job.id} variants={itemVariants} className="min-w-0">
                                    <HotJobItem job={job} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-center">
                                <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800/70">
                                    <button
                                        type="button"
                                        disabled={safeCurrentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        aria-label={t('landing.hot_jobs.prev_page', undefined, 'Trang trước')}
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    <div className="min-w-16 px-2 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
                                        <span className="text-orange-600 dark:text-orange-500">{safeCurrentPage}</span>
                                        <span className="mx-1">/</span>
                                        {totalPages}
                                    </div>

                                    <button
                                        type="button"
                                        disabled={safeCurrentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        aria-label={t('landing.hot_jobs.next_page', undefined, 'Trang tiếp theo')}
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}