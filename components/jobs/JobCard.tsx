'use client';

import Link from 'next/link';
import { MapPin, Briefcase, Heart, Building2, DollarSign, Clock, Flame, Timer } from 'lucide-react';
import { Job } from '@/types';
import { formatSalaryRange, getDeadlineCountdown } from '@/utils/format';
import toast from 'react-hot-toast';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { JOB_BADGE_CONFIG } from '@/utils/tier-colors';
import { applicationService } from '@/features/application/application.service';
import { useTranslation } from '@/store/useLanguageStore';

interface PublicJob extends Partial<Job> {
    company_name?: string;
    company_logo?: string;
}

interface JobCardProps {
    job: PublicJob;
    viewMode: 'list' | 'grid';
}

export default function JobCard({ job, viewMode }: JobCardProps) {
    const { openApplyModal } = useUIStore();
    const { user, savedJobIds, toggleSavedJob } = useAuthStore();
    const { language, t } = useTranslation();

    const isSaved = job.id ? savedJobIds.includes(job.id) : false;

    const handleSaveJob = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || user.role !== 'applicant') {
            toast.error(t('jobs.save_job_applicant_only', undefined, 'Vui lòng đăng nhập với tư cách ứng viên để lưu việc làm!'));
            return;
        }

        if (!job.id) return;

        // Optimistic UI update
        toggleSavedJob(job.id);

        try {
            if (isSaved) {
                await applicationService.unsaveJob(job.id);
                toast.success(t('jobs.unsave_job_success', undefined, 'Đã bỏ lưu việc làm.'));
            } else {
                await applicationService.saveJob(job.id);
                toast.success(t('jobs.save_job_success', undefined, 'Đã lưu việc làm thành công.'));
            }
        } catch (error) {
            // Revert on failure
            toggleSavedJob(job.id);
            toast.error(t('jobs.save_job_error', undefined, 'Có lỗi xảy ra khi lưu việc làm.'));
        }
    };

    const isClosed = job.status === 'closed';
    const isExpired = Boolean(
        job.deadline &&
        new Date(job.deadline).getTime() < Date.now()
    ) || job.status === 'expired';
    const isClosedOrExpired = isClosed || isExpired;

    const statusBadge = isClosed
        ? JOB_BADGE_CONFIG.closed
        : isExpired
        ? JOB_BADGE_CONFIG.expired
        : JOB_BADGE_CONFIG.active;

    const hotBadge = JOB_BADGE_CONFIG.hot;
    const badgeLabel = isClosed
        ? t('jobs.status.closed', undefined, 'Đã đóng')
        : isExpired
        ? t('jobs.status.expired', undefined, 'Hết hạn')
        : t('jobs.status.active', undefined, 'Đang mở');

    const handleApply = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (user && user.role !== 'applicant') {
            toast.error(
                t('jobs.hr_cannot_apply', undefined, 'Tài khoản Nhà tuyển dụng không thể ứng tuyển. Vui lòng đổi tài khoản!'),
                { id: 'role_error' }
            );
            return;
        }

        if (!job.id || !job.title) {
            toast.error(t('jobs.job_data_not_ready', undefined, 'Dữ liệu công việc chưa sẵn sàng, vui lòng thử lại!'), {
                id: 'job_data_error',
            });
            return;
        }

        openApplyModal(job.id, job.title);
    };

    const locationLabel = job.location?.country && job.location.country !== 'Việt Nam'
        ? job.location.country
        : job.location?.province_name || t('common.status.nationwide') || 'Toàn quốc';

    const isHotActive = Boolean(job.is_hot && !isClosedOrExpired);
    const isRegularActive = Boolean(!job.is_hot && !isClosedOrExpired);

    return (
        <div
            className={`group/card relative overflow-hidden rounded-2xl transition-all duration-300 font-sans ${
                !isClosedOrExpired
                    ? 'p-[1.5px] bg-slate-200/80 dark:bg-slate-800 shadow-xs hover:shadow-md'
                    : 'border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80'
            }`}
        >
            {/* Animated Rotating Border Beam:
                - Tin Hot: Màu cam/amber chạy xoay vòng quanh viền liên tục
                - Tin Thường: Màu xanh dương/sky chạy xoay vòng quanh viền liên tục */}
            {isHotActive && (
                <div
                    className="pointer-events-none absolute -inset-[150%] animate-border-beam"
                    style={{
                        background:
                            'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, rgba(251, 146, 60, 0.15) 305deg, rgba(249, 115, 22, 0.75) 330deg, rgba(251, 146, 60, 0.2) 348deg, transparent 360deg)',
                    }}
                />
            )}
            {isRegularActive && (
                <div
                    className="pointer-events-none absolute -inset-[150%] animate-border-beam"
                    style={{
                        background:
                            'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, rgba(56, 189, 248, 0.15) 305deg, rgba(37, 99, 235, 0.7) 330deg, rgba(56, 189, 248, 0.2) 348deg, transparent 360deg)',
                    }}
                />
            )}

            {/* Inner Card Container */}
            <div
                className={`relative h-full w-full rounded-[14.5px] bg-white dark:bg-slate-900 z-10 ${
                    viewMode === 'grid' ? 'p-4 sm:p-5 flex flex-col justify-between' : 'p-4 sm:p-5'
                }`}
            >
                {/* In Grid View: Bookmark Heart Button in top-right */}
                {viewMode === 'grid' && (
                    <button
                        onClick={handleSaveJob}
                        className={`absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                            isSaved
                                ? 'border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/30 dark:bg-rose-500/10'
                                : 'border-transparent bg-slate-100/70 dark:bg-slate-800/70 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10'
                        }`}
                        title={isSaved ? (t('common.actions.saved') || 'Đã lưu') : (t('common.actions.save') || 'Lưu việc')}
                        type="button"
                    >
                        <Heart className={`h-4 w-4 transition-colors ${isSaved ? 'fill-rose-500' : ''}`} />
                    </button>
                )}

                {viewMode === 'grid' ? (
                    /* ================= GRID VIEW ================= */
                    <div>
                        {/* Header: Logo + Title + Company */}
                        <div className="flex items-start gap-3.5 pr-8">
                            <Link
                                href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id!)}
                                onClick={(e) => e.stopPropagation()}
                                className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1 shadow-2xs dark:border-slate-800 dark:bg-slate-800"
                            >
                                {job.company_logo ? (
                                    <img
                                        src={job.company_logo}
                                        alt={job.company_name || 'Company'}
                                        className="h-full w-full object-contain"
                                        loading="lazy"
                                    />
                                ) : (
                                    <Building2 className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                                )}
                            </Link>

                            <div className="min-w-0 flex-1">
                                {/* Badges: HOT badge giữ nguyên như cũ */}
                                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                                    {isHotActive && (
                                        <span
                                            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${hotBadge.bg} ${hotBadge.text} ${hotBadge.border} ${hotBadge.glow}`}
                                        >
                                            <Flame className="h-3 w-3" />
                                            {t('jobs.card.hot', undefined, 'HOT')}
                                        </span>
                                    )}
                                    {isClosedOrExpired && (
                                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                                            {badgeLabel}
                                        </span>
                                    )}
                                </div>

                                <Link href={ROUTES.PUBLIC_JOB_DETAIL(job.id!)} className="group/title block">
                                    <h3
                                        className="line-clamp-2 text-sm sm:text-base font-bold text-slate-900 group-hover/title:text-blue-600 dark:text-white dark:group-hover/title:text-blue-400 transition-colors"
                                        title={job.title}
                                    >
                                        {job.title}
                                    </h3>
                                </Link>

                                <Link
                                    href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id!)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-block mt-0.5"
                                >
                                    <p
                                        className="line-clamp-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                                        title={job.company_name}
                                    >
                                        {job.company_name || t('companies.anonymous') || 'Công ty Ẩn danh'}
                                    </p>
                                </Link>
                            </div>
                        </div>

                        {/* Metadata Tags: Lương có nền đệm như cũ */}
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1.5 font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100/80 dark:border-emerald-500/20">
                                <DollarSign className="h-3.5 w-3.5 shrink-0" />
                                <span>{formatSalaryRange(job.salary, language)}</span>
                            </span>

                            {locationLabel && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                    <span className="max-w-28 truncate">{locationLabel}</span>
                                </span>
                            )}

                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                <Timer className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <span>
                                    {job.min_yoe
                                        ? `${job.min_yoe} ${t('jobs.details.years_exp', undefined, 'năm KN')}`
                                        : (t('jobs.details.experience_none') || 'Không yêu cầu KN')}
                                </span>
                            </span>
                        </div>

                        {/* Skills Chips */}
                        {job.required_skills && job.required_skills.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap items-center gap-1">
                                {job.required_skills.slice(0, 3).map((skill: any, idx: number) => (
                                    <span
                                        key={idx}
                                        className="rounded border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-400"
                                    >
                                        {typeof skill === 'string' ? skill : skill.name}
                                    </span>
                                ))}
                                {job.required_skills.length > 3 && (
                                    <span className="text-[10px] font-medium text-slate-400">
                                        +{job.required_skills.length - 3}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Grid Footer: Deadline + Apply (Chữ xanh dương, nền trắng/đen, bỏ icon) */}
                        <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                <Clock className="h-3 w-3 shrink-0" />
                                <span className="truncate">
                                    {job.deadline ? getDeadlineCountdown(job.deadline, language) : (t('jobs.card.deadline_unlimited') || 'Không thời hạn')}
                                </span>
                            </div>

                            <button
                                onClick={handleApply}
                                disabled={isClosedOrExpired}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all border ${
                                    isClosedOrExpired
                                        ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500'
                                        : 'border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-400 shadow-xs active:scale-95'
                                }`}
                            >
                                {isClosedOrExpired ? (t('jobs.card.expired') || 'Hết hạn') : (t('jobs.card.apply_now') || 'Ứng tuyển')}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ================= LIST VIEW ================= */
                    <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6">
                        {/* Left: Company Logo */}
                        <Link
                            href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id!)}
                            onClick={(e) => e.stopPropagation()}
                            className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800 self-start sm:self-center"
                        >
                            {job.company_logo ? (
                                <img
                                    src={job.company_logo}
                                    alt={job.company_name || 'Company'}
                                    className="h-full w-full object-contain"
                                    loading="lazy"
                                />
                            ) : (
                                <Building2 className="h-7 w-7 text-slate-300 dark:text-slate-600" />
                            )}
                        </Link>

                        {/* Middle: Job Details */}
                        <div className="min-w-0 flex-1 space-y-2">
                            <div>
                                {/* Badges: HOT badge giữ nguyên như cũ */}
                                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                                    {isHotActive && (
                                        <span
                                            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${hotBadge.bg} ${hotBadge.text} ${hotBadge.border} ${hotBadge.glow}`}
                                        >
                                            <Flame className="h-3 w-3" />
                                            {t('jobs.card.hot', undefined, 'HOT')}
                                        </span>
                                    )}
                                    {isClosedOrExpired && (
                                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                                            {badgeLabel}
                                        </span>
                                    )}
                                </div>

                                <Link href={ROUTES.PUBLIC_JOB_DETAIL(job.id!)} className="group/title block">
                                    <h3
                                        className="line-clamp-1 text-base sm:text-lg font-bold text-slate-900 group-hover/title:text-blue-600 dark:text-white dark:group-hover/title:text-blue-400 transition-colors"
                                        title={job.title}
                                    >
                                        {job.title}
                                    </h3>
                                </Link>

                                <Link
                                    href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id!)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-block mt-0.5"
                                >
                                    <p
                                        className="line-clamp-1 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                                        title={job.company_name}
                                    >
                                        {job.company_name || t('companies.anonymous') || 'Công ty Ẩn danh'}
                                    </p>
                                </Link>
                            </div>

                            {/* Key Tags (Location, Experience, Level/Mode) */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                {locationLabel && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                        <span className="max-w-35 truncate">{locationLabel}</span>
                                    </span>
                                )}

                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    <Timer className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                    <span>
                                        {job.min_yoe
                                            ? `${job.min_yoe} ${t('jobs.details.years_exp', undefined, 'năm KN')}`
                                            : (t('jobs.details.experience_none') || 'Không yêu cầu KN')}
                                </span>
                                </span>

                                {(job.job_level || job.work_mode) && (
                                    <span className="hidden md:inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        <Briefcase className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                        <span>{job.job_level || job.work_mode}</span>
                                    </span>
                                )}
                            </div>

                            {/* Sub Row: Skills & Deadline */}
                            <div className="flex flex-wrap items-center gap-3 pt-0.5">
                                {job.required_skills && job.required_skills.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1">
                                        {job.required_skills.slice(0, 3).map((skill: any, idx: number) => (
                                            <span
                                                key={idx}
                                                className="rounded border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-400"
                                            >
                                                {typeof skill === 'string' ? skill : skill.name}
                                            </span>
                                        ))}
                                        {job.required_skills.length > 3 && (
                                            <span className="text-[10px] font-medium text-slate-400">
                                                +{job.required_skills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                    <Clock className="h-3 w-3 shrink-0" />
                                    <span>
                                        {job.deadline ? getDeadlineCountdown(job.deadline, language) : (t('jobs.card.deadline_unlimited') || 'Không thời hạn')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Top Salary with buffer, Bottom Apply + Heart */}
                        <div className="shrink-0 flex items-center justify-between sm:justify-between sm:flex-col sm:items-end sm:self-stretch pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 gap-3 w-full sm:w-auto">
                            {/* Góc trên bên phải: Mức lương có nền đệm như cũ */}
                            <div className="text-left sm:text-right">
                                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100/80 dark:border-emerald-500/20 shadow-2xs">
                                    <DollarSign className="h-3.5 w-3.5 shrink-0" />
                                    <span>{formatSalaryRange(job.salary, language)}</span>
                                </span>
                            </div>

                            {/* Góc dưới bên phải: Nút Ứng tuyển đứng TRƯỚC, sau đó đến Nút Tim */}
                            <div className="flex items-center gap-2">
                                {/* Nút Ứng tuyển: Chữ màu xanh dương, nền trắng/đen, bỏ icon */}
                                <button
                                    onClick={handleApply}
                                    disabled={isClosedOrExpired}
                                    className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all border ${
                                        isClosedOrExpired
                                            ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500'
                                            : 'border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-400 shadow-xs active:scale-95'
                                    }`}
                                >
                                    {isClosedOrExpired ? (t('jobs.card.expired') || 'Hết hạn') : (t('jobs.card.apply_now') || 'Ứng tuyển')}
                                </button>

                                {/* Nút Tim */}
                                <button
                                    onClick={handleSaveJob}
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                                        isSaved
                                            ? 'border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/30 dark:bg-rose-500/10'
                                            : 'border-slate-200/80 bg-slate-50/80 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10'
                                    }`}
                                    title={isSaved ? (t('common.actions.saved') || 'Đã lưu') : (t('common.actions.save') || 'Lưu việc')}
                                    type="button"
                                >
                                    <Heart className={`h-4 w-4 transition-colors ${isSaved ? 'fill-rose-500' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
