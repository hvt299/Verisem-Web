'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import { jobService } from '@/features/job/job.service';
import apiClient from '@/lib/api-client';
import { Job, Company } from '@/types';
import { Building2, MapPin, Briefcase, ChevronLeft, UploadCloud, Loader2, DollarSign, Clock, GraduationCap, CheckCircle2, Star, FileText, Zap, Flame, CalendarDays, Users, Share2, Timer, UserCheck, XCircle, Heart, Globe, ExternalLink, Send, Eye, Sparkles, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import JobCard from '@/components/jobs/JobCard';
import PromoBanner from '@/components/ads/PromoBanner';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { formatSalaryRange, getDeadlineCountdown } from '@/utils/format';
import { INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES } from '@/constants/company.constants';
import { ROUTES } from '@/constants/routes';
import { applicationService } from '@/features/application/application.service';
import { useTranslation } from '@/store/useLanguageStore';

export default function PublicJobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user, savedJobIds, toggleSavedJob } = useAuthStore();
    const { openApplyModal } = useUIStore();
    const { t } = useTranslation();

    const [job, setJob] = useState<Job | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!params.id) return;

        jobService.getPublicJobById(params.id as string)
            .then((jobData) => {
                setJob(jobData);
                setIsLoading(false);

                if (jobData.company_id) {
                    apiClient.get(`/companies/public/${jobData.company_id}`)
                        .then((res) => setCompany(res.data))
                        .catch(() => console.warn('Không thể tải thông tin công ty'));
                }

                jobService.getPublicJobs()
                    .then((allJobs) => {
                        const related = allJobs.filter((j: Job) => j.id !== jobData.id && (j.company_id === jobData.company_id || j.industry === jobData.industry)).slice(0, 4);
                        setRelatedJobs(related);
                    })
                    .catch(() => console.warn('Không thể tải việc làm liên quan'));
            })
            .catch((error: any) => {
                console.error('Lỗi khi tải chi tiết job:', error);
                setJob(null);
                setIsLoading(false);
            });
    }, [params.id]);

    const isSaved = job?.id ? savedJobIds.includes(job.id) : false;

    const handleSaveJob = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || user.role !== 'applicant') {
            toast.error(t('jobs.save_job_applicant_only', undefined, 'Vui lòng đăng nhập với tư cách ứng viên để lưu việc làm!'));
            return;
        }

        if (!job?.id) return;

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
            toggleSavedJob(job.id);
            toast.error(t('jobs.save_job_error', undefined, 'Có lỗi xảy ra khi lưu việc làm.'));
        }
    };

    const handleApplyClick = () => {
        if (user && user.role !== 'applicant') {
            toast.error(t('jobs.hr_cannot_apply', undefined, 'Tài khoản Nhà tuyển dụng không thể ứng tuyển. Vui lòng đổi tài khoản!'), { id: 'role_error' });
            return;
        }

        if (job?.id && job?.title) {
            openApplyModal(job.id, job.title);
        } else {
            toast.error(t('jobs.job_data_not_ready', undefined, 'Dữ liệu công việc chưa sẵn sàng, vui lòng thử lại!'), { id: 'data_error' });
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!job?.id) return;

        const link = `${window.location.origin}${ROUTES.PUBLIC_JOB_DETAIL(job.id)}`;

        navigator.clipboard.writeText(link)
            .then(() => toast.success(t('jobs.details.copy_link_success', undefined, 'Đã sao chép link công việc!')))
            .catch(() => toast.error(t('jobs.details.copy_link_error', undefined, 'Không thể sao chép liên kết.')));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
                <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
                <div className="flex-1 flex flex-col items-center justify-center text-primary-500">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-500/10 mb-4">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold">{t('jobs.loading_jobs', undefined, 'Đang tải thông tin việc làm...')}</p>
                </div>
            </div>
        );
    }

    if (!job) {
        notFound();
    }

    const isExpired = Boolean(job.deadline && new Date(job.deadline).getTime() < Date.now());
    const viewCount = Number(job.view_count || 0);
    const companySize = COMPANY_SIZES.find((size) => size.value === company?.size)?.label || (t('companies.card.updating') || 'Đang cập nhật');
    const industryLabel = INDUSTRIES.find((item) => item.value === job.industry)?.label || job.industry || (t('companies.card.updating') || 'Đang cập nhật');
    const locationLabel = job.location?.country && job.location.country !== 'Việt Nam' ? job.location.country : [job.location?.district_name, job.location?.province_name].filter(Boolean).join(', ') || (t('common.status.nationwide') || 'Toàn quốc');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-28 pb-24 font-sans animate-in fade-in duration-500">
                <button onClick={() => router.push(ROUTES.PUBLIC_JOBS)} className="group flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 font-bold mb-6 transition-colors w-fit">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-primary-200 dark:group-hover:border-primary-800 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </span>
                    {t('jobs.title') || 'Danh sách việc làm'}
                </button>

                <section className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-4xl shadow-sm mb-8">
                    <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

                    <div className="relative z-10 p-6 md:p-10">
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2.5 mb-5">
                                    {job.is_hot && (
                                        <span className="inline-flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] font-black px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-500/20 uppercase tracking-wide">
                                            <Flame className="w-3.5 h-3.5" />
                                            {t('jobs.filters.hot_jobs') || 'Việc làm Hot'}
                                        </span>
                                    )}

                                    {isExpired && (
                                        <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-black px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-wide">{t('jobs.details.expired') || 'Đã hết hạn'}</span>
                                    )}

                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-3 py-1.5 rounded-full border border-primary-100 dark:border-primary-500/20">
                                        <CalendarDays className="w-3.5 h-3.5" />
                                        {t('jobs.details.posted_at', { date: new Date(job.created_at || Date.now()).toLocaleDateString('vi-VN') }) || `Đăng ngày ${new Date(job.created_at || Date.now()).toLocaleDateString('vi-VN')}`}
                                    </span>

                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                                        <Eye className="w-3.5 h-3.5" />
                                        {viewCount.toLocaleString('vi-VN')} {t('jobs.details.views')?.toLowerCase() || 'lượt xem'}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl lg:text-[3.25rem] font-black text-slate-900 dark:text-white mb-7 leading-[1.1] tracking-tight max-w-4xl">{job.title}</h1>

                                <div className="flex flex-wrap items-center gap-x-5 gap-y-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                    <span className="flex items-center gap-2.5">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                            <Building2 className="w-4 h-4" />
                                        </span>
                                        {job.company_name || t('companies.anonymous') || 'Công ty Ẩn danh'}
                                    </span>

                                    <span className="flex items-center gap-2.5" title={[job.location?.street_address, job.location?.ward_name, job.location?.district_name, job.location?.province_name].filter(Boolean).join(', ') || ''}>
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                        </span>
                                        {locationLabel}
                                    </span>

                                    <span className="flex items-center gap-2.5">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
                                            <DollarSign className="w-4 h-4" />
                                        </span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-black text-base">{formatSalaryRange(job.salary)}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="hidden lg:flex flex-col gap-3 shrink-0 w-52">
                                <button onClick={handleApplyClick} disabled={isExpired} className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                                    <UploadCloud className="w-5 h-5" />
                                    {isExpired ? (t('jobs.details.expired') || 'Đã hết hạn') : (t('jobs.details.apply_button') || 'Ứng tuyển ngay')}
                                </button>

                                <div className="flex gap-2">
                                    <button type="button" onClick={handleSaveJob} className={`flex-1 py-3 bg-slate-50 dark:bg-slate-800 font-bold rounded-xl flex items-center justify-center gap-2 border transition-colors whitespace-nowrap ${isSaved ? 'text-rose-600 border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10' : 'text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 border-slate-200 dark:border-slate-700'}`}>
                                        <Heart className={`w-4 h-4 shrink-0 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                                        {isSaved ? (t('common.actions.saved') || 'Đã lưu') : (t('common.actions.save') || 'Lưu')}
                                    </button>

                                    <button type="button" onClick={handleShare} className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-500/10 text-slate-600 dark:text-slate-300 hover:text-primary-600 font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap">
                                        <Share2 className="w-4 h-4 shrink-0" />
                                        {t('common.actions.share') || 'Chia sẻ'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 px-6 md:px-10 py-4">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                {t('jobs.details.opportunity_tag') || 'Cơ hội việc làm dành cho ứng viên phù hợp'}
                            </span>

                            {!isExpired && job.deadline && (
                                <span className="inline-flex items-center gap-2 text-rose-500">
                                    <Timer className="w-4 h-4" />
                                    {getDeadlineCountdown(job.deadline)}
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="w-full lg:w-[70%] space-y-8">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-10 rounded-4xl shadow-sm">
                            <div className="space-y-10">
                                {job.description && (
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                                <FileText className="w-5 h-5" />
                                            </span>
                                            {t('jobs.details.description') || 'Mô tả công việc'}
                                        </h3>
                                        <div className="prose prose-slate dark:prose-invert max-w-none text-[15px] md:text-base text-slate-600 dark:text-slate-300 leading-8" dangerouslySetInnerHTML={{ __html: job.description }} />
                                    </div>
                                )}

                                {job.requirements && (
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </span>
                                            {t('jobs.details.requirements') || 'Yêu cầu ứng viên'}
                                        </h3>
                                        <div className="prose prose-slate dark:prose-invert max-w-none text-[15px] md:text-base text-slate-600 dark:text-slate-300 leading-8" dangerouslySetInnerHTML={{ __html: job.requirements }} />
                                    </div>
                                )}

                                {job.benefits && (
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                                <Star className="w-5 h-5" />
                                            </span>
                                            {t('jobs.details.benefits') || 'Quyền lợi & Chế độ'}
                                        </h3>
                                        <div className="prose prose-slate dark:prose-invert max-w-none text-[15px] md:text-base text-slate-600 dark:text-slate-300 leading-8" dangerouslySetInnerHTML={{ __html: job.benefits }} />
                                    </div>
                                )}

                                {job.other_info && (
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                                <FileText className="w-5 h-5" />
                                            </span>
                                            {t('jobs.details.other_info') || 'Thông tin khác'}
                                        </h3>
                                        <div className="prose prose-slate dark:prose-invert max-w-none text-[15px] md:text-base text-slate-600 dark:text-slate-300 leading-8" dangerouslySetInnerHTML={{ __html: job.other_info }} />
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                            <MapPin className="w-5 h-5" />
                                        </span>
                                        {t('jobs.details.location_and_time') || 'Địa điểm và Thời gian'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <p className="font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                {t('jobs.details.location') || 'Địa điểm làm việc'}
                                            </p>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-6">
                                                {job.location?.country && job.location.country !== 'Việt Nam' ? [job.location.street_address, job.location.country].filter(Boolean).join(', ') : [job.location?.street_address, job.location?.ward_name, job.location?.district_name, job.location?.province_name].filter(Boolean).join(', ') || t('jobs.details.location_unspecified', undefined, 'Chưa cập nhật chi tiết')}
                                            </p>
                                        </div>

                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <p className="font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                {t('jobs.details.working_hours') || 'Thời gian làm việc'}
                                            </p>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-6">{job.working_hours || t('jobs.details.standard_hours', undefined, 'Theo quy định của công ty')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {relatedJobs.length > 0 && (
                            <section className="pt-2">
                                <div className="flex items-end justify-between gap-4 mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t('jobs.details.recommended') || 'Có thể bạn quan tâm'}</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-800 dark:text-white">{t('jobs.details.related_jobs') || 'Việc làm liên quan'}</h2>
                                    </div>

                                    <button type="button" onClick={() => router.push(ROUTES.PUBLIC_JOBS)} className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">
                                        {t('common.actions.view_more') || 'Xem tất cả'}
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {relatedJobs.map((relatedJob) => (
                                        <JobCard key={relatedJob.id} job={relatedJob} viewMode="grid" />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="w-full lg:w-[30%] shrink-0 space-y-6 lg:sticky lg:top-24">
                        <div className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            {company?.banner_url && (
                                <div className="absolute top-0 left-0 w-full h-28 opacity-25 pointer-events-none">
                                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/50 to-white dark:via-slate-900/50 dark:to-slate-900 z-10" />
                                    <img src={company.banner_url} className="w-full h-full object-cover" alt="" />
                                </div>
                            )}

                            <div className="relative z-10 p-6">
                                <div className="flex items-start gap-4 mb-6">
                                    <Link href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id)} className="w-16 h-16 rounded-2xl border-2 border-white dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-center p-1 shrink-0 hover:scale-105 transition-transform shadow-lg">
                                        {company?.logo_url ? (
                                            <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain rounded-xl" />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-slate-300" />
                                        )}
                                    </Link>

                                    <div className="flex-1 min-w-0 pt-1">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{t('jobs.details.employer') || 'Nhà tuyển dụng'}</span>
                                        <Link href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id)} className="block font-black text-lg text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 transition-colors leading-tight mt-1">
                                            {company?.name || job.company_name || t('jobs.details.updating', undefined, 'Đang cập nhật')}
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-5 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 shrink-0">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">{t('companies.card.size') || 'Quy mô'}</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-200 font-bold">{companySize}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 shrink-0">
                                            <Briefcase className="w-4 h-4" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">{t('companies.detail.industry') || 'Lĩnh vực hoạt động'}</p>

                                            {company?.industries && company.industries.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {company.industries.map((ind: string, idx: number) => (
                                                        <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md text-[11px] font-bold border border-slate-200 dark:border-slate-700">
                                                            {INDUSTRIES.find((i) => i.value === ind)?.label || ind}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{t('companies.card.updating') || 'Đang cập nhật'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 pt-2">
                                        {company?.website && (
                                            <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors">
                                                <Globe className="w-3.5 h-3.5" />
                                                Website
                                            </a>
                                        )}

                                        <Link href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id)} className="flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 hover:underline ml-auto bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                                            {t('jobs.details.company_profile') || 'Hồ sơ công ty'}
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-2">
                                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm">{t('jobs.details.general_info') || 'Thông tin chung'}</h3>
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                    <Briefcase className="w-3.5 h-3.5" />
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                <InfoRow icon={<Briefcase />} label={t('jobs.details.industry') || 'Ngành nghề'} value={industryLabel} />
                                <InfoRow icon={<Briefcase />} label={t('jobs.levels.label') || 'Cấp bậc'} value={job.job_level} />
                                <InfoRow icon={<Clock />} label={t('jobs.work_modes.label') || 'Hình thức'} value={`${job.work_mode} - ${job.employment_type}`} />
                                <InfoRow icon={<Timer />} label={t('jobs.details.experience') || 'Kinh nghiệm'} value={job.min_yoe ? (t('jobs.details.experience_min', { years: job.min_yoe }) || `Tối thiểu ${job.min_yoe} năm`) : (t('jobs.details.experience_none') || 'Không yêu cầu')} />
                                <InfoRow icon={<GraduationCap />} label={t('jobs.details.education') || 'Học vấn'} value={job.education?.min_level || (t('jobs.details.experience_none') || 'Không yêu cầu')} />
                                <InfoRow icon={<Users />} label={t('jobs.details.headcount') || 'Số lượng tuyển'} value={job.headcount ? `${job.headcount} ${t('common.roles.applicant')?.toLowerCase() || 'người'}` : (t('jobs.details.deadline_unlimited') || 'Không giới hạn')} />
                                <InfoRow icon={<UserCheck />} label={t('jobs.details.gender') || 'Giới tính'} value={job.gender_requirement || (t('jobs.details.experience_none') || 'Không yêu cầu')} />
                                <InfoRow icon={<Timer />} label={t('jobs.details.probation') || 'Thử việc'} value={job.probation_period || 'Theo quy định'} />

                                <div className="flex justify-between items-start gap-4 py-3.5 text-sm">
                                    <span className="text-slate-500 flex items-center gap-2 shrink-0">
                                        <CalendarDays className="w-4 h-4" />
                                        {t('jobs.details.deadline') || 'Hạn nộp'}
                                    </span>

                                    <div className="text-right">
                                        <div className={`font-bold ${isExpired ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : (t('jobs.details.deadline_unlimited') || 'Không thời hạn')}
                                        </div>

                                        {!isExpired && job.deadline && (
                                            <div className="text-[10px] font-black text-rose-500 mt-1 bg-rose-50 dark:bg-rose-500/10 inline-block px-2 py-1 rounded-md uppercase">
                                                {getDeadlineCountdown(job.deadline)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center gap-4 py-3.5 text-sm">
                                    <span className="text-slate-500 flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        {t('jobs.details.views') || 'Lượt xem'}
                                    </span>
                                    <span className="font-black text-slate-800 dark:text-slate-200">{viewCount.toLocaleString('vi-VN')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                    <Zap className="w-4 h-4" />
                                </span>
                                {t('jobs.details.skill_criteria') || 'Tiêu chí chuyên môn'}
                            </h3>

                            {job.required_skills && job.required_skills.length > 0 && <SkillGroup title={t('jobs.details.skills_required') || 'Kỹ năng bắt buộc'} skills={job.required_skills} variant="required" />}
                            {job.preferred_skills && job.preferred_skills.length > 0 && <SkillGroup title={t('jobs.details.skills_preferred') || 'Điểm cộng (Ưu tiên)'} skills={job.preferred_skills} variant="preferred" />}
                            {job.languages && job.languages.length > 0 && <SkillGroup title={t('jobs.details.languages') || 'Ngoại ngữ'} skills={job.languages} variant="language" />}
                            {job.required_certifications && job.required_certifications.length > 0 && <SkillGroup title={t('jobs.details.certifications') || 'Chứng chỉ yêu cầu'} skills={job.required_certifications} variant="certification" />}
                        </div>
                        <div className="mt-6">
                            <PromoBanner
                                variant="right-rail"
                                title={t('common.promo.cv_scoring_title', undefined, 'Chấm điểm mức độ tương thích CV')}
                                description={t('common.promo.cv_scoring_desc', undefined, 'Ứng dụng công nghệ AI ATS để phân tích sự phù hợp giữa hồ sơ của bạn và vị trí này.')}
                                badge="AI Scoring"
                                ctaText={t('common.promo.cv_scoring_cta', undefined, 'Đánh giá CV ngay')}
                                ctaLink="/applicant/profile"
                            />
                        </div>
                    </aside>
                </div>
            </main>

            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-3.5 z-50 shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.18)] flex items-center gap-3">
                <button type="button" onClick={handleSaveJob} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${isSaved ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 border-slate-200 dark:border-slate-700'}`}>
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <button type="button" onClick={handleShare} className="flex h-12 w-12 shrink-0 items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>

                <button onClick={handleApplyClick} disabled={isExpired} className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
                    <Send className="w-5 h-5" />
                    {isExpired ? (t('jobs.details.expired') || 'Đã hết hạn') : (t('jobs.details.apply_button') || 'Ứng tuyển ngay')}
                </button>
            </div>

            <div className="lg:hidden h-24 bg-slate-50 dark:bg-slate-950" />
            <PublicFooter />
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
    return (
        <div className="flex justify-between items-start gap-4 py-3.5 text-sm">
            <span className="text-slate-500 flex items-center gap-2 shrink-0">
                <span className="text-slate-400 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
                {label}
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-right max-w-[58%]">{value || 'N/A'}</span>
        </div>
    );
}

function SkillGroup({ title, skills, variant }: { title: string; skills: any[]; variant: 'required' | 'preferred' | 'language' | 'certification' }) {
    const styles = {
        required: { badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
        preferred: { badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30' },
        language: { badge: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30' },
        certification: { badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/30' }
    };

    return (
        <div className="space-y-2.5 mb-5 last:mb-0">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</p>

            <div className="flex flex-wrap gap-2">
                {skills.map((skill: any, idx: number) => {
                    const name = typeof skill === 'string' ? skill : skill?.name || skill;
                    const minYears = typeof skill === 'object' ? skill?.min_years ?? 0 : 0;

                    return (
                        <span key={idx} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${styles[variant].badge}`}>
                            {name}
                            {minYears > 0 && <span className="text-primary-500 ml-1">({minYears}y)</span>}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}