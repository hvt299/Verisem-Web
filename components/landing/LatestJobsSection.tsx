'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin, Building2, DollarSign, Clock3 } from 'lucide-react';
import { Job } from '@/types';
import { formatSalaryRange } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from '@/store/useLanguageStore';

interface LatestJobsSectionProps {
    jobs: Job[];
}

type SortOption = 'latest' | 'salary_desc';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export const LatestJobItem = ({
    job
}: {
    job: Partial<Job> & { company_name?: string; company_logo?: string };
}) => {
    const { t } = useTranslation();
    return (
    <div className="group/item relative overflow-hidden rounded-2xl p-[1.5px] bg-slate-200/80 dark:bg-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10">
        {/* Animated Rotating Border Beam (Latest job: Blue/Cyan) */}
        <div
            className="pointer-events-none absolute -inset-[150%] animate-border-beam"
            style={{
                background:
                    'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, rgba(56, 189, 248, 0.15) 305deg, rgba(37, 99, 235, 0.7) 330deg, rgba(56, 189, 248, 0.2) 348deg, transparent 360deg)',
            }}
        />

        <Link
            href={ROUTES.PUBLIC_JOB_DETAIL(job.id!)}
            className="relative z-10 flex h-full min-w-0 w-full rounded-[14.5px] bg-white p-5 transition-all duration-300 dark:bg-slate-900 overflow-hidden"
        >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl transition-all group-hover/item:bg-blue-500/10" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-blue-400 via-sky-400 to-cyan-400 opacity-60" />

            <div className="relative z-10 flex w-full min-w-0 gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 p-1.5 shadow-sm dark:border-slate-700 ${job.company_logo ? 'bg-white' : 'bg-slate-50 dark:bg-slate-800'}`}>
                    {job.company_logo ? (
                        <img src={job.company_logo} alt={job.company_name || 'Company'} className="h-full w-full object-contain" loading="lazy" />
                    ) : (
                        <Building2 className="h-8 w-8 text-slate-300" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-900 transition-colors group-hover/item:text-blue-600 dark:text-white dark:group-hover/item:text-blue-400">
                        {job.title}
                    </h3>

                    <p className="mb-3 mt-1.5 truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                        {job.company_name || t('landing.latest_jobs.anonymous_company', undefined, 'Công ty Ẩn danh')}
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

export default function LatestJobsSection({ jobs }: LatestJobsSectionProps) {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortOption>('latest');
    const itemsPerPage = 6;

    const sortedJobs = useMemo(() => {
        const result = [...jobs];

        if (sortBy === 'salary_desc') {
            result.sort((a, b) => Number(b.salary?.max_salary ?? 0) - Number(a.salary?.max_salary ?? 0));
        } else {
            result.sort((a, b) =>
                new Date(b.updated_at || b.created_at || 0).getTime() -
                new Date(a.updated_at || a.created_at || 0).getTime()
            );
        }

        return result;
    }, [jobs, sortBy]);

    const totalPages = Math.max(1, Math.ceil(sortedJobs.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const currentJobs = sortedJobs.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage
    );

    if (!jobs || jobs.length === 0) return null;

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as SortOption);
        setCurrentPage(1);
    };

    return (
        <section className="border-b border-slate-200 bg-background py-10 font-sans transition-colors dark:border-slate-800 dark:bg-slate-950 md:py-12">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Gian hàng */}
                <div className="group/shop relative overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50/40 via-white to-cyan-50/30 shadow-sm transition-all duration-500 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 dark:border-blue-500/15 dark:bg-linear-to-br dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/10">

                    {/* Animation nhẹ */}
                    <motion.div
                        className="pointer-events-none absolute -left-32 top-0 h-36 w-72 rounded-full bg-blue-400/5 blur-3xl"
                        animate={{
                            x: [0, 80, 0],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />

                    <motion.div
                        className="pointer-events-none absolute -right-32 bottom-0 h-36 w-72 rounded-full bg-cyan-400/5 blur-3xl"
                        animate={{
                            x: [0, -70, 0],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                            duration: 9,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />

                    {/* Header */}
                    <div className="relative z-10 border-b border-blue-100/70 px-5 py-5 dark:border-slate-800 md:px-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <motion.div
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                    animate={{
                                        y: [0, -2, 0],
                                        scale: [1, 1.02, 1]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    <Clock3 className="h-5.5 w-5.5" />
                                </motion.div>

                                <div className="min-w-0">
                                    <h2 className="truncate text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white md:text-2xl">
                                        {t('landing.latest_jobs.title_prefix', undefined, 'Việc Làm')}{' '}
                                        <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                            {t('landing.latest_jobs.title_highlight', undefined, 'Mới Nhất')}
                                        </span>
                                    </h2>

                                    <p className="mt-0.5 hidden text-sm text-slate-400 sm:block">
                                        {t('landing.latest_jobs.subtitle', undefined, 'Cập nhật liên tục những cơ hội việc làm mới')}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={ROUTES.PUBLIC_JOBS}
                                className="flex shrink-0 items-center gap-1 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                {t('landing.latest_jobs.view_all', undefined, 'Xem tất cả')}
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Filter */}
                        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-blue-50/60 px-4 py-2.5 dark:bg-blue-500/5">
                            <div className="flex min-w-0 items-center gap-2">
                                <span className="hidden shrink-0 text-sm font-medium text-slate-500 sm:inline dark:text-slate-400">
                                    {t('landing.latest_jobs.sort_by', undefined, 'Sắp xếp theo:')}
                                </span>

                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="h-9 cursor-pointer rounded-lg border border-blue-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                >
                                    <option value="latest">{t('landing.latest_jobs.sort_latest', undefined, 'Mới nhất')}</option>
                                    <option value="salary_desc">{t('landing.latest_jobs.sort_salary', undefined, 'Lương cao nhất')}</option>
                                </select>
                            </div>

                            <span className="shrink-0 text-sm font-medium text-slate-400">
                                {t('landing.latest_jobs.jobs_count', { count: sortedJobs.length }, `${sortedJobs.length} việc làm`)}
                            </span>
                        </div>
                    </div>

                    {/* Jobs */}
                    <div className="relative z-10 bg-linear-to-b from-transparent via-blue-50/10 to-blue-50/20 p-5 dark:via-blue-950/5 dark:to-blue-950/10 md:p-6">
                        <motion.div
                            key={`${safeCurrentPage}-${sortBy}`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {currentJobs.map(job => (
                                <motion.div key={job.id} variants={itemVariants} className="min-w-0">
                                    <LatestJobItem job={job} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-center">
                                <div className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50/60 p-1 dark:border-slate-800 dark:bg-slate-800/70">
                                    <button
                                        type="button"
                                        disabled={safeCurrentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        aria-label={t('landing.latest_jobs.prev_page', undefined, 'Trang trước')}
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    <div className="min-w-16 px-2 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
                                        <span className="text-blue-600 dark:text-blue-400">{safeCurrentPage}</span>
                                        <span className="mx-1">/</span>
                                        {totalPages}
                                    </div>

                                    <button
                                        type="button"
                                        disabled={safeCurrentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        aria-label={t('landing.latest_jobs.next_page', undefined, 'Trang tiếp theo')}
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700"
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