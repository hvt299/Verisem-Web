'use client';

import { useRouter } from 'next/navigation';
import { Building2, MapPin, Users, Star, Eye, BriefcaseIcon, Heart, ShieldCheck, Globe } from 'lucide-react';

import { Company } from '@/types';
import { INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES } from '@/constants/company.constants';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/useAuthStore';
import { applicationService } from '@/features/application/application.service';
import toast from 'react-hot-toast';
import { useTranslation } from '@/store/useLanguageStore';

interface CompanyCardProps {
    company: Company;
    viewMode?: 'grid' | 'list';
}

export default function CompanyCard({ company, viewMode = 'list' }: CompanyCardProps) {
    const router = useRouter();
    const { user, savedCompanyIds, toggleSavedCompany } = useAuthStore();
    const { t } = useTranslation();

    /*
     * =========================================================
     * LOCATION
     * =========================================================
     */

    const locationTitle = Array.from(
        new Set(
            [
                company.location?.street_address,
                company.location?.ward_name,
                company.location?.district_name,
                company.location?.province_name,
                company.location?.country,
            ].filter(Boolean)
        )
    ).join(', ');

    const locationText =
        company.location?.country &&
            company.location.country !== 'Việt Nam'
            ? Array.from(
                new Set(
                    [
                        company.location.street_address,
                        company.location.country,
                    ].filter(Boolean)
                )
            ).join(', ')
            : Array.from(
                new Set(
                    [
                        company.location?.street_address,
                        company.location?.ward_name,
                        company.location?.district_name,
                        company.location?.province_name,
                    ].filter(Boolean)
                )
            ).join(', ') || (t('companies.card.updating') || 'Đang cập nhật');

    /*
     * =========================================================
     * INDUSTRY
     * =========================================================
     */

    const industryText = (company.industries || [])
        .map(
            (industry) =>
                INDUSTRIES.find((item) => item.value === industry)?.label ||
                industry
        )
        .join(', ');

    /*
     * =========================================================
     * COMPANY SIZE
     * =========================================================
     */

    const companySize =
        COMPANY_SIZES.find((size) => size.value === company.size)?.label || company.size ||
        (t('companies.card.updating') || 'Đang cập nhật');

    /*
     * =========================================================
     * HANDLERS
     * =========================================================
     */

    const handleCardClick = () => {
        if (company.id) {
            router.push(ROUTES.PUBLIC_COMPANY_DETAIL(company.id));
        }
    };

    const isSaved = company.id ? savedCompanyIds.includes(company.id) : false;

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || user.role !== 'applicant') {
            toast.error(t('companies.save_company_applicant_only', undefined, 'Vui lòng đăng nhập với tư cách ứng viên để lưu công ty!'));
            return;
        }

        if (!company.id) return;

        toggleSavedCompany(company.id);

        try {
            if (isSaved) {
                await applicationService.unsaveCompany(company.id);
                toast.success(t('companies.unsave_company_success', undefined, 'Đã bỏ lưu công ty.'));
            } else {
                await applicationService.saveCompany(company.id);
                toast.success(t('companies.save_company_success', undefined, 'Đã lưu công ty thành công.'));
            }
        } catch (error) {
            toggleSavedCompany(company.id);
            toast.error(t('companies.save_company_error', undefined, 'Có lỗi xảy ra khi lưu công ty.'));
        }
    };

    const handleWebsiteClick = (
        e: React.MouseEvent<HTMLSpanElement>
    ) => {
        e.preventDefault();
        e.stopPropagation();

        if (company.website) {
            const url = company.website.startsWith('http') ? company.website : `https://${company.website}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (
        <article
            onClick={handleCardClick}
            className="group/card relative overflow-hidden rounded-2xl p-[1.5px] bg-slate-200/80 dark:bg-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg font-sans cursor-pointer"
        >
            {/* Animated Rotating Border Beam: Blue/Sky conic gradient */}
            <div
                className="pointer-events-none absolute -inset-[150%] animate-border-beam"
                style={{
                    background:
                        'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, rgba(56, 189, 248, 0.15) 305deg, rgba(37, 99, 235, 0.7) 330deg, rgba(56, 189, 248, 0.2) 348deg, transparent 360deg)',
                }}
            />

            {/* Inner Card Container */}
            <div className="relative z-10 w-full h-full rounded-[14.5px] bg-white dark:bg-slate-900 overflow-hidden">
                {/* Company Banner as Background Backdrop */}
                {company.banner_url ? (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <img
                            src={company.banner_url}
                            alt=""
                            className="h-full w-full object-cover opacity-15 dark:opacity-20 blur-[0.5px] transition-transform duration-700 group-hover/card:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-white via-white/95 to-white/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900/90" />
                    </div>
                ) : (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 dark:opacity-20">
                        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
                    </div>
                )}

                {viewMode === 'list' ? (
                    /* ================= LIST VIEW ================= */
                    <div className="relative z-10 flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 p-4 sm:p-5">
                        {/* Left: Company Logo */}
                        <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800 self-start sm:self-center">
                            {company.logo_url ? (
                                <img
                                    src={company.logo_url}
                                    alt={`Logo ${company.name}`}
                                    className="h-full w-full object-contain"
                                    loading="lazy"
                                />
                            ) : (
                                <Building2 className="h-7 w-7 text-slate-300 dark:text-slate-600" />
                            )}
                        </div>

                        {/* Middle: Company Details */}
                        <div className="min-w-0 flex-1 space-y-2">
                            <div>
                                <div className="inline-flex items-center gap-1.5 max-w-full min-w-0">
                                    <h3
                                        className="truncate text-base sm:text-lg font-bold text-slate-900 group-hover/card:text-blue-600 dark:text-white dark:group-hover/card:text-blue-400 transition-colors shrink min-w-0"
                                        title={company.name}
                                    >
                                        {company.name}
                                    </h3>
                                    <span
                                        className="shrink-0 text-emerald-500 dark:text-emerald-400"
                                        title={t('companies.card.verified', undefined, 'Đã xác minh')}
                                    >
                                        <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </span>
                                </div>
                            </div>

                            {/* Metadata Chips (Industry, Location, Size, Website) */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                {industryText && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100/90 dark:bg-slate-800/90 px-2.5 py-1 font-medium text-slate-600 dark:text-slate-300">
                                        <BriefcaseIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                        <span className="max-w-44 truncate">{industryText}</span>
                                    </span>
                                )}

                                <span
                                    className="inline-flex items-center gap-1 rounded-md bg-slate-100/90 dark:bg-slate-800/90 px-2.5 py-1 font-medium text-slate-600 dark:text-slate-300"
                                    title={locationTitle || locationText}
                                >
                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                    <span className="max-w-48 truncate">{locationText}</span>
                                </span>

                                {company.size && (
                                    <span className="hidden md:inline-flex items-center gap-1 rounded-md bg-slate-100/90 dark:bg-slate-800/90 px-2.5 py-1 font-medium text-slate-600 dark:text-slate-300">
                                        <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                        <span>{companySize}</span>
                                    </span>
                                )}

                                {company.website && (
                                    <span
                                        onClick={handleWebsiteClick}
                                        className="hidden lg:inline-flex items-center gap-1 rounded-md bg-blue-50/80 hover:bg-blue-100/80 px-2.5 py-1 font-medium text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 cursor-pointer transition-colors"
                                        title={company.website}
                                    >
                                        <Globe className="h-3.5 w-3.5 shrink-0" />
                                        <span className="max-w-36 truncate">{company.website.replace(/^https?:\/\//, '')}</span>
                                    </span>
                                )}
                            </div>

                            {/* Sub Row: Rating & Views */}
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-0.5">
                                <div className="flex items-center gap-1">
                                    <Star
                                        className={`h-3.5 w-3.5 shrink-0 ${
                                            company.avg_rating > 0
                                                ? 'fill-amber-500 text-amber-500'
                                                : 'text-slate-300 dark:text-slate-600'
                                        }`}
                                    />
                                    {company.avg_rating > 0 ? (
                                        <span>
                                            {company.avg_rating.toFixed(1)}
                                            <span className="ml-1 text-[11px] font-normal text-slate-400 dark:text-slate-500">
                                                ({company.review_count})
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                                            {t('companies.card.not_rated') || 'Chưa đánh giá'}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1">
                                    <Eye className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                    <span>
                                        {(company.view_count || 0).toLocaleString('vi-VN')}{' '}
                                        {t('jobs.details.views') ? ` ${t('jobs.details.views').toLowerCase()}` : ' lượt xem'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Active jobs pill top, Action button ('Xem công ty') + Heart bottom */}
                        <div className="shrink-0 flex items-center justify-between sm:justify-between sm:flex-col sm:items-end sm:self-stretch pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 gap-3 w-full sm:w-auto">
                            {/* Top Right: Active jobs */}
                            <div className="text-left sm:text-right">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 border border-blue-100/80 dark:border-blue-500/20 shadow-2xs">
                                    <BriefcaseIcon className="h-3.5 w-3.5 shrink-0" />
                                    <span>{t('companies.card.active_jobs', { count: company.active_jobs_count ?? 0 }, `${company.active_jobs_count ?? 0} việc làm`)}</span>
                                </span>
                            </div>

                            {/* Bottom Right: Button 'Xem công ty' and Heart */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCardClick}
                                    className="rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-400 shadow-xs active:scale-95"
                                >
                                    {t('companies.card.view_company', undefined, 'Xem công ty')}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                                        isSaved
                                            ? 'border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/30 dark:bg-rose-500/10'
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10'
                                    }`}
                                    title={isSaved ? (t('common.actions.saved') || 'Bỏ lưu công ty') : (t('common.actions.save') || 'Lưu công ty')}
                                    aria-label={isSaved ? (t('common.actions.saved') || 'Bỏ lưu công ty') : (t('common.actions.save') || 'Lưu công ty')}
                                >
                                    <Heart className={`h-4 w-4 transition-colors ${isSaved ? 'fill-rose-500' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ================= GRID VIEW ================= */
                    <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5">
                        {/* Grid Heart Button in top-right */}
                        <button
                            type="button"
                            onClick={handleSave}
                            className={`absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                                isSaved
                                    ? 'border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/30 dark:bg-rose-500/10'
                                    : 'border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10'
                            }`}
                            title={isSaved ? (t('common.actions.saved') || 'Bỏ lưu công ty') : (t('common.actions.save') || 'Lưu công ty')}
                            aria-label={isSaved ? (t('common.actions.saved') || 'Bỏ lưu công ty') : (t('common.actions.save') || 'Lưu công ty')}
                        >
                            <Heart className={`h-4 w-4 transition-colors ${isSaved ? 'fill-rose-500' : ''}`} />
                        </button>

                        <div>
                            {/* Header: Logo + Title */}
                            <div className="flex items-start gap-3.5 pr-8">
                                <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
                                    {company.logo_url ? (
                                        <img
                                            src={company.logo_url}
                                            alt={`Logo ${company.name}`}
                                            className="h-full w-full object-contain"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-slate-300 dark:text-slate-600" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="inline-flex items-center gap-1.5 max-w-full min-w-0">
                                        <h3
                                            className="truncate text-sm sm:text-base font-bold text-slate-900 group-hover/card:text-blue-600 dark:text-white dark:group-hover/card:text-blue-400 transition-colors shrink min-w-0"
                                            title={company.name}
                                        >
                                            {company.name}
                                        </h3>
                                        <span className="shrink-0 text-emerald-500 dark:text-emerald-400" title={t('companies.card.verified', undefined, 'Đã xác minh')}>
                                            <ShieldCheck className="h-4 w-4" />
                                        </span>
                                    </div>
                                    {industryText && (
                                        <p className="line-clamp-1 mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400" title={industryText}>
                                            {industryText}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100/90 dark:bg-slate-800/90 px-2.5 py-1 font-medium text-slate-600 dark:text-slate-300">
                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                    <span className="max-w-36 truncate">{locationText}</span>
                                </span>

                                {company.size && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100/90 dark:bg-slate-800/90 px-2.5 py-1 font-medium text-slate-600 dark:text-slate-300">
                                        <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                        <span>{companySize}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Grid Footer: Rating/Views + Jobs count + View button */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                <Star className={`h-3.5 w-3.5 ${company.avg_rating > 0 ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
                                <span className="font-bold">{company.avg_rating > 0 ? company.avg_rating.toFixed(1) : (t('companies.card.not_rated') || 'Chưa đánh giá')}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md border border-blue-100/80 dark:border-blue-500/20">
                                    {t('companies.card.active_jobs', { count: company.active_jobs_count ?? 0 }, `${company.active_jobs_count ?? 0} việc làm`)}
                                </span>
                                <button
                                    onClick={handleCardClick}
                                    className="rounded-lg px-3 py-1 text-xs font-bold transition-all border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-400 shadow-xs active:scale-95"
                                >
                                    {t('companies.card.view_company', undefined, 'Xem')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}