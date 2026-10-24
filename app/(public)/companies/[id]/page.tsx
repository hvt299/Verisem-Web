'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { Building2, MapPin, Users, Star, Eye, Globe, FileText, CheckCircle2, Briefcase, ChevronLeft, Loader2, XCircle, Share2, ShieldCheck, Map, Zap, DollarSign, Calendar, Heart, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/lib/api-client';
import { jobService } from '@/features/job/job.service';
import { Company, Job } from '@/types';
import { INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES } from '@/constants/company.constants';
import { ROUTES } from '@/constants/routes';
import { applicationService } from '@/features/application/application.service';
import { useTranslation } from '@/store/useLanguageStore';

export default function PublicCompanyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user, savedCompanyIds, toggleSavedCompany } = useAuthStore();
    const { t } = useTranslation();
    const [company, setCompany] = useState<Company | null>(null);
    const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const isSaved = company?.id ? savedCompanyIds.includes(company.id) : false;

    const handleSaveCompany = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || user.role !== 'applicant') {
            toast.error(t('companies.details.follow_applicant_only', undefined, 'Vui lòng đăng nhập với tư cách ứng viên để theo dõi công ty!'));
            return;
        }

        if (!company?.id) return;

        toggleSavedCompany(company.id);

        try {
            if (isSaved) {
                await applicationService.unsaveCompany(company.id);
                toast.success(t('companies.details.unfollow_success', undefined, 'Đã bỏ theo dõi công ty.'));
            } else {
                await applicationService.saveCompany(company.id);
                toast.success(t('companies.details.follow_success', undefined, 'Đã theo dõi công ty thành công.'));
            }
        } catch (error) {
            toggleSavedCompany(company.id);
            toast.error(t('companies.details.follow_error', undefined, 'Có lỗi xảy ra khi theo dõi công ty.'));
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!company?.id) return;
        const link = `${window.location.origin}${ROUTES.PUBLIC_COMPANY_DETAIL(company.id)}`;
        try {
            await navigator.clipboard.writeText(link);
            toast.success(t('companies.details.copy_link_success', undefined, 'Đã sao chép link công ty!'));
        } catch {
            toast.error(t('companies.details.copy_link_error', undefined, 'Không thể sao chép liên kết'));
        }
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!params.id) return;
        const fetchData = async () => {
            try {
                const [compRes, jobsRes] = await Promise.all([apiClient.get(`/companies/public/${params.id}`), jobService.getPublicJobs()]);
                setCompany(compRes.data);
                setCompanyJobs(jobsRes.filter((job: Job) => String(job.company_id) === String(params.id)));
            } catch (error) {
                console.error('Failed to fetch company:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
                <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative mb-5">
                            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
                            <Loader2 className="relative w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{t('common.status.loading') || 'Đang tải hồ sơ doanh nghiệp...'}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!company) {
        notFound();
    }

    const companyLocation = company.location ? company.location.country && company.location.country !== 'Việt Nam' ? Array.from(new Set([company.location.street_address, company.location.country].filter(Boolean))).join(', ') : Array.from(new Set([company.location.street_address, company.location.ward_name, company.location.district_name, company.location.province_name].filter(Boolean))).join(', ') : '';

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 animate-in fade-in duration-500">
                <button
                    onClick={() => router.push(ROUTES.PUBLIC_COMPANIES)}
                    className="group flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 font-bold mb-6 transition-colors w-fit"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-primary-200 dark:group-hover:border-primary-800 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </span>
                    {t('companies.title') || 'Danh sách công ty'}
                </button>

                <div className="relative mb-8 overflow-hidden rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl dark:shadow-black/20">
                    <div className="relative h-52 md:h-72 overflow-hidden bg-slate-100 dark:bg-slate-900">
                        {company.banner_url ? (
                            <>
                                <img src={company.banner_url} alt={`Banner ${company.name}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
                            </>
                        ) : (
                            <div className="relative flex items-center justify-center w-full h-full overflow-hidden bg-linear-to-br from-blue-50 via-slate-100 to-indigo-50 dark:from-blue-950/30 dark:via-slate-900 dark:to-indigo-950/20">
                                <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-3xl" />
                                <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-3xl" />
                                <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[18px_18px]" />
                                <Building2 className="relative z-10 w-20 h-20 text-slate-300 dark:text-slate-700" />
                            </div>
                        )}
                    </div>

                    <div className="relative px-5 sm:px-7 md:px-10 pb-7 md:pb-8">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-6 w-full min-w-0">
                                <div className="relative z-10 shrink-0 flex items-center justify-center w-32 h-32 md:w-40 md:h-40 -mt-20 md:-mt-24 overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-lg dark:shadow-black/40">
                                    {company.logo_url ? <img src={company.logo_url} alt={`Logo ${company.name}`} className="w-full h-full object-contain p-2.5" /> : <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
                                </div>

                                <div className="z-10 flex-1 min-w-0 w-full pt-1 md:pt-0 mb-1 text-center md:text-left">
                                    <h1 className="mb-3 text-2xl md:text-4xl leading-tight font-black tracking-tight text-slate-900 dark:text-white wrap-break-word">
                                        {company.name}
                                        <ShieldCheck className="inline-block ml-2 -mt-1 w-6 h-6 md:w-8 md:h-8 text-emerald-500 align-middle" />
                                    </h1>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-black text-slate-600 dark:text-slate-300">
                                            <Star className={`w-4 h-4 ${company.avg_rating > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-400 dark:text-slate-600'}`} />
                                            {company.avg_rating > 0 ? `${company.avg_rating.toFixed(1)} (${company.review_count})` : (t('companies.card.not_rated') || 'Chưa đánh giá')}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-black text-slate-600 dark:text-slate-300">
                                            <Eye className="w-4 h-4" />
                                            {(company.view_count || 0).toLocaleString('vi-VN')} {t('jobs.details.views')?.toLowerCase() || 'lượt xem'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row gap-2 w-full lg:w-auto">
                                <button onClick={handleSaveCompany} className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3.5 rounded-xl font-black border transition-all whitespace-nowrap ${isSaved ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-500/20'}`}>
                                    <Heart className={`w-4 h-4 shrink-0 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                                    {isSaved ? (t('common.actions.saved') || 'Đã lưu') : (t('common.actions.save') || 'Lưu')}
                                </button>
                                <button onClick={handleShare} className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3.5 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all whitespace-nowrap">
                                    <Share2 className="w-4 h-4" />
                                    {t('common.actions.share') || 'Chia sẻ'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-8">
                    <div className="lg:col-span-2 space-y-7 h-fit">
                        {(() => {
                            const validGallery = (company.gallery_urls || []).filter((u: string) => Boolean(u && u.trim()));
                            if (validGallery.length === 0) return null;
                            return (
                                <section className="overflow-hidden rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl dark:shadow-black/10">
                                    <div className="px-6 md:px-8 pt-6 md:pt-7">
                                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                                            <h3 className="flex items-center gap-2.5 text-base md:text-lg font-black text-slate-900 dark:text-white">
                                                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                                    <ImageIcon className="w-5 h-5" />
                                                </span>
                                                {t('companies.detail.workspace') || 'Không gian làm việc'}
                                            </h3>
                                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{t('companies.details.photos_count', { count: validGallery.length }, `${validGallery.length} ảnh`)}</span>
                                        </div>
                                    </div>

                                    <div className="p-6 md:p-8">
                                        <div className={`grid gap-3 ${validGallery.length >= 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                                            <div className="relative col-span-2 md:col-span-2 row-span-2 h-64 md:h-80 overflow-hidden rounded-2xl cursor-pointer bg-slate-100 dark:bg-slate-800 group">
                                                <img src={validGallery[0]} alt={t('companies.details.office_photo', undefined, 'Văn phòng')} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                                            </div>
                                            {validGallery.slice(1, 3).map((url: string, idx: number) => (
                                                <div key={idx} className="hidden md:block h-30 md:h-38.5 overflow-hidden rounded-2xl cursor-pointer bg-slate-100 dark:bg-slate-800 group">
                                                    <img src={url} alt={`Gallery ${idx + 2}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            );
                        })()}

                        {company.benefits && company.benefits.length > 0 && (
                            <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl dark:shadow-black/10">
                                <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                        <Zap className="w-5 h-5" />
                                    </span>
                                    <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white">{t('companies.detail.benefits') || 'Phúc lợi dành cho bạn'}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {company.benefits.map((benefit: string, idx: number) => (
                                        <span key={idx} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border bg-amber-50/70 dark:bg-amber-500/10 border-amber-100 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 font-bold text-sm hover:-translate-y-0.5 transition-transform">
                                            <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-500" />
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl dark:shadow-black/10">
                            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                    <FileText className="w-5 h-5" />
                                </span>
                                <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white">{t('companies.detail.about_us') || 'Về chúng tôi'}</h3>
                            </div>
                            {company.description ? (
                                <div className="prose prose-slate dark:prose-invert max-w-none text-sm md:text-base text-slate-600 dark:text-slate-300 leading-loose" dangerouslySetInnerHTML={{ __html: company.description }} />
                            ) : (
                                <div className="py-12 px-5 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
                                    <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400 italic font-medium">{t('companies.detail.about_empty') || 'Doanh nghiệp chưa cập nhật thông tin giới thiệu chi tiết.'}</p>
                                </div>
                            )}
                        </section>

                        <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl dark:shadow-black/10">
                            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                </span>
                                <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white">{t('companies.detail.legal_info') || 'Thông tin pháp lý'}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <p className="mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('companies.detail.tax_code') || 'Mã số thuế'}</p>
                                    <p className="font-black text-slate-800 dark:text-slate-200">{company.tax_code || (t('companies.card.updating') || 'Đang cập nhật')}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                                    <p className="mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('companies.detail.identity_status') || 'Trạng thái định danh'}</p>
                                    <p className="flex items-center gap-1.5 font-black text-emerald-600 dark:text-emerald-400">
                                        <ShieldCheck className="w-4 h-4" />
                                        {t('companies.card.verified') || 'Đã xác minh (KYC)'}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-28 space-y-7 h-fit">
                        <section className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl dark:shadow-black/10">
                            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                    <Building2 className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">{t('companies.detail.overview') || 'Tổng quan'}</h3>
                            </div>

                            <div className="space-y-5">
                                {(company.industries?.length ?? 0) > 0 && (
                                    <div className="flex items-start gap-3">
                                        <div className="shrink-0 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('companies.detail.industry') || 'Lĩnh vực hoạt động'}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(company.industries || []).map((ind: string, idx: number) => (
                                                    <span key={idx} className="px-2 py-1 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300">{INDUSTRIES.find((item) => item.value === ind)?.label || ind}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {company.size && (
                                    <div className="flex items-center gap-3">
                                        <div className="shrink-0 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="mb-0.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('companies.detail.company_size') || 'Quy mô công ty'}</p>
                                            <p className="font-black text-sm text-slate-700 dark:text-slate-200">{COMPANY_SIZES.find((size) => size.value === company.size)?.label || (t('companies.card.updating') || 'Đang cập nhật')}</p>
                                        </div>
                                    </div>
                                )}

                                {company.website && (
                                    <div className="flex items-center gap-3">
                                        <div className="shrink-0 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="mb-0.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('companies.detail.website') || 'Website'}</p>
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="block text-sm font-black text-blue-600 dark:text-blue-400 hover:underline line-clamp-1">{company.website.replace(/^https?:\/\//, '')}</a>
                                        </div>
                                    </div>
                                )}

                                {companyLocation && (
                                    <div className="flex items-start gap-3 pt-1">
                                        <div className="shrink-0 mt-0.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('companies.detail.headquarters') || 'Trụ sở chính'}</p>
                                            <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">{companyLocation}</p>
                                            <button
                                                type="button"
                                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyLocation)}`, '_blank')}
                                                className="flex items-center gap-1 mt-2 text-xs font-black text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                            >
                                                <Map className="w-3 h-3" />
                                                {t('companies.detail.view_map', undefined, 'Xem bản đồ')}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {company.created_at && (
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="shrink-0 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="mb-0.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('companies.detail.member_since', undefined, 'Ngày gia nhập')}</p>
                                            <p className="text-sm font-black text-slate-700 dark:text-slate-200">{new Date(company.created_at).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                )}

                                {company.social_links && (company.social_links.facebook || company.social_links.linkedin || company.social_links.youtube) && (
                                    <div className="pt-4 mt-1 border-t border-slate-100 dark:border-slate-800">
                                        <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('companies.details.social_media', undefined, 'Mạng xã hội')}</p>
                                        <div className="flex items-center gap-2.5">
                                            {company.social_links.facebook && (
                                                <a href={company.social_links.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20 transition-all" title="Facebook">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                                </a>
                                            )}
                                            {company.social_links.linkedin && (
                                                <a href={company.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-500 dark:text-blue-400 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20 transition-all" title="LinkedIn">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                                                </a>
                                            )}
                                            {company.social_links.youtube && (
                                                <a href={company.social_links.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all" title="YouTube">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88-.46 8.6-2a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33z" /><polygon points="10 15 15 12 10 9 10 15" /></svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl dark:shadow-black/10">
                            <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                        <Zap className="w-4 h-4" />
                                    </span>
                                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">{t('companies.detail.open_jobs', { count: companyJobs.length }) || 'Đang tuyển'}</h3>
                                </div>
                                <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-black text-slate-500 dark:text-slate-400">{companyJobs.length}</span>
                            </div>

                            {companyJobs.length > 0 ? (
                                <div className="space-y-3">
                                    {companyJobs.slice(0, 3).map((job) => (
                                        <div key={job.id} onClick={() => router.push(ROUTES.PUBLIC_JOB_DETAIL(job.id))} className="cursor-pointer group p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-sm transition-all">
                                            <h4 className="mb-2 line-clamp-2 text-sm font-black leading-snug text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h4>
                                            <div className="flex flex-col gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                    {job.location?.province_name || (t('common.status.nationwide') || 'Toàn quốc')}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                                    <DollarSign className="w-3.5 h-3.5 shrink-0" />
                                                    {t('jobs.salary.negotiable') || 'Thỏa thuận'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {companyJobs.length > 3 && (
                                        <button className="w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black text-xs transition-colors">{t('common.actions.view_more') || 'Xem tất cả'} ({companyJobs.length})</button>
                                    )}
                                </div>
                            ) : (
                                <div className="py-7 text-center">
                                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">{t('companies.detail.no_open_jobs') || 'Chưa có chiến dịch tuyển dụng nào đang mở.'}</p>
                                </div>
                            )}
                        </section>
                    </aside>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}