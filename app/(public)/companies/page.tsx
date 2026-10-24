'use client';

import { useState, useEffect, useMemo } from 'react';
import { Building2, Loader2, XCircle, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useTranslation } from '@/store/useLanguageStore';
import CompanyCard from '@/components/companies/CompanyCard';
import CompanySearchBar from '@/components/companies/CompanySearchBar';
import { useAuthStore } from '@/store/useAuthStore';
import { Company, Job } from '@/types';
import apiClient from '@/lib/api-client';
import { systemService } from '@/features/system/system.service';
import { jobService } from '@/features/job/job.service';
import Image from 'next/image';

export default function PublicCompaniesPage() {
    const { isAuthenticated, user } = useAuthStore();
    const { t } = useTranslation();
    const searchParams = useSearchParams();

    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState('rating');
    const [currentPage, setCurrentPage] = useState(1);

    const scrollToResults = () => {
        if (typeof window !== 'undefined') {
            const el = document.getElementById('companies-results-section');
            if (el) {
                const yOffset = -90;
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
            }
        }
    };

    const handleFiltersChange = (newFilters: any) => {
        setFilters(newFilters);
        setCurrentPage(1);
        if (typeof window !== 'undefined' && window.scrollY > 350) {
            scrollToResults();
        }
    };

    const handleClearFilters = () => {
        clearFilters();
        if (typeof window !== 'undefined' && window.scrollY > 350) {
            scrollToResults();
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        scrollToResults();
    };

    const [searchQuery, setSearchQuery] = useState(searchParams.get('keyword') || '');
    const [filters, setFilters] = useState({
        industry: searchParams.get('industry') || '',
        provinceCodes: searchParams.get('provinces')?.split(',').filter(Boolean) || [] as string[],
        districtCodes: searchParams.get('districts')?.split(',').filter(Boolean) || [] as string[],
        wardCodes: searchParams.get('wards')?.split(',').filter(Boolean) || [] as string[],
        foreignLocation: searchParams.get('foreign') || '',
        size: searchParams.get('size') || ''
    });
    const [filterOptions, setFilterOptions] = useState({ industries: [] as string[], locations: [] as any[], sizes: [] as string[] });

    // Lắng nghe thay đổi của searchParams khi người dùng click từ Mega Menu hoặc liên kết ngoài
    useEffect(() => {
        const kw = searchParams.get('keyword') || '';
        const provs = searchParams.get('provinces')?.split(',').filter(Boolean) || [];
        const dists = searchParams.get('districts')?.split(',').filter(Boolean) || [];
        const ind = searchParams.get('industry') || '';
        const sz = searchParams.get('size') || '';

        setSearchQuery(kw);
        setFilters(prev => ({
            ...prev,
            provinceCodes: provs,
            districtCodes: dists,
            industry: ind,
            size: sz,
        }));
    }, [searchParams]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [compRes, locRes, jobs] = await Promise.all([
                    apiClient.get('/companies/public/list'),
                    systemService.getLocations(),
                    jobService.getPublicJobs().catch(() => [] as Job[])
                ]);

                // Map số lượng công việc đang mở (active)
                const activeJobCounts = new Map<string, number>();
                const now = new Date();
                for (const j of jobs) {
                    const isClosedOrExpired =
                        j.status === 'expired' ||
                        j.status === 'closed' ||
                        (j.deadline && new Date(j.deadline) < now);
                    if (!isClosedOrExpired && (j.status === 'open' || !j.status)) {
                        const cId = String(j.company_id || '');
                        if (cId) {
                            activeJobCounts.set(cId, (activeJobCounts.get(cId) || 0) + 1);
                        }
                    }
                }

                const rawData = Array.isArray(compRes.data) ? compRes.data : compRes.data?.items || [];
                const data = rawData.map((c: Company) => {
                    const cId = String(c.id || '');
                    const countFromJobs = activeJobCounts.get(cId);
                    return {
                        ...c,
                        active_jobs_count: countFromJobs !== undefined
                            ? countFromJobs
                            : (c.active_jobs_count ?? 0)
                    };
                });
                setCompanies(data);

                // Cập nhật lấy danh sách ngành nghề từ mảng industries
                const industries = [...new Set(data.flatMap((c: Company) => c.industries || []).filter(Boolean))] as string[];
                const sizes = [...new Set(data.map((c: Company) => c.size).filter(Boolean))] as string[];

                setFilterOptions({ industries, locations: locRes, sizes });
            } catch (error) {
                console.error('Không thể tải danh sách công ty:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const filteredCompanies = useMemo(() => {
        let result = [...companies];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(query) ||
                (c.tax_code && c.tax_code.includes(query)) ||
                c.location?.street_address?.toLowerCase().includes(query)
            );
        }

        // Cập nhật logic lọc theo mảng industries
        if (filters.industry) result = result.filter(c => c.industries && c.industries.includes(filters.industry));
        if (filters.size) result = result.filter(c => c.size === filters.size);

        const hasLocationFilter = filters.provinceCodes.length > 0 || filters.districtCodes.length > 0 || filters.wardCodes.length > 0 || filters.foreignLocation;
        if (hasLocationFilter) {
            result = result.filter(c => {
                const matchProv = filters.provinceCodes.includes(c.location?.province_code || '');
                const matchDist = filters.districtCodes.includes(c.location?.district_code || '');
                const matchWard = filters.wardCodes.includes(c.location?.ward_code || '');
                const matchForeign = filters.foreignLocation && c.location?.country !== 'Việt Nam' && c.location?.street_address?.toLowerCase().includes(filters.foreignLocation.toLowerCase());

                return matchProv || matchDist || matchWard || matchForeign;
            });
        }

        switch (sortBy) {
            case 'rating': result.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0)); break;
            case 'views': result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0)); break;
            case 'newest': result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()); break;
        }

        return result;
    }, [companies, searchQuery, filters, sortBy]);

    const activeFiltersCount = Object.values(filters).filter(value => Array.isArray(value) ? value.length > 0 : value !== '').length + (searchQuery ? 1 : 0);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchQuery, sortBy]);

    const clearFilters = () => {
        setFilters({ industry: '', provinceCodes: [], districtCodes: [], wardCodes: [], foreignLocation: '', size: '' });
        setSearchQuery('');
        setSortBy('rating');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner Tích hợp Pattern */}
            <div className="relative pt-32 pb-24 md:pt-40 md:pb-32 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
                {/* Background image - giống HeroSection */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/company-bg.jpg"
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center opacity-[0.22] dark:opacity-[0.22]"
                    />

                    {/* Light mode overlay */}
                    <div className="absolute inset-0 bg-linear-to-b from-background/45 via-background/70 to-background/95 dark:hidden" />

                    {/* Dark mode overlay */}
                    <div className="absolute inset-0 hidden bg-linear-to-b from-[#020617]/55 dark:block" />

                    {/* Dark mode color tint */}
                    <div className="absolute inset-0 hidden bg-blue-950/20 mix-blend-multiply dark:block" />
                </div>

                {/* Primary glow */}
                <div className="absolute left-1/2 top-[-12%] h-130 w-205 -translate-x-1/2 rounded-full bg-primary-500/10 blur-[140px] dark:bg-primary-500/10" />

                {/* Soft side glows */}
                <div className="absolute left-[-15%] top-[20%] h-105 w-105 rounded-full bg-primary-400/4.5 blur-[120px] dark:bg-primary-500/6" />

                <div className="absolute right-[-15%] top-[30%] h-105 w-105 rounded-full bg-blue-300/4 blur-[120px] dark:bg-blue-500/5" />

                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background via-background/65 to-transparent" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        {t('companies.title_prefix', undefined, 'Khám phá')}{' '}<span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">{t('companies.title_highlight', undefined, 'doanh nghiệp hàng đầu')}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        {companies.length > 0
                            ? t('companies.hero_subtitle', { count: companies.length }, `Tìm hiểu văn hóa doanh nghiệp và cơ hội nghề nghiệp tại ${companies.length} tổ chức uy tín.`)
                            : t('companies.hero_subtitle_hundreds', undefined, 'Tìm hiểu văn hóa doanh nghiệp và cơ hội nghề nghiệp tại hàng trăm tổ chức uy tín.')}
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-350 mx-auto px-4 sm:px-6 w-full py-12 -mt-12 sm:-mt-14 relative z-10 flex flex-col gap-20">
                <div id="companies-results-section" className="flex flex-col lg:flex-row gap-8 items-start scroll-mt-28">

                    {/* CỘT TRÁI (25%): Bộ lọc dính (Sticky Sidebar) */}
                    <aside className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto pr-1 pb-4 [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        <CompanySearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            filterOptions={filterOptions}
                            onClearFilters={handleClearFilters}
                            activeFiltersCount={activeFiltersCount}
                        />
                    </aside>

                    {/* CỘT PHẢI (75%): Kết quả lọc */}
                    <div className="w-full lg:w-3/4 flex flex-col gap-6">

                        {/* Khu vực Điều hướng Lọc Phụ & Chế độ xem */}
                        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                {t('companies.found_results', { count: filteredCompanies.length }, `Tìm thấy ${filteredCompanies.length} doanh nghiệp`)}
                            </span>

                            <div className="flex items-center gap-4">
                                {activeFiltersCount > 0 && (
                                    <button onClick={clearFilters} className="text-rose-500 font-bold hover:underline hidden md:block">
                                        {t('companies.filters.clear_count', { count: activeFiltersCount }, `Xóa (${activeFiltersCount}) bộ lọc`)}
                                    </button>
                                )}
                                <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-4">
                                    <label className="font-bold hidden sm:block">{t('companies.sort.label', undefined, 'Sắp xếp:')}</label>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-[#1e293b] text-slate-800 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer">
                                        <option value="rating">{t('companies.sort.rating', undefined, 'Đánh giá cao')}</option>
                                        <option value="views">{t('companies.sort.views', undefined, 'Nhiều lượt xem')}</option>
                                        <option value="newest">{t('companies.sort.newest', undefined, 'Mới gia nhập')}</option>
                                    </select>
                                </div>
                                <div className="flex bg-slate-100 dark:bg-[#1e293b] p-1 rounded-xl">
                                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title={t('companies.grid_view', undefined, 'Lưới')}>
                                        <LayoutGrid className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title={t('companies.list_view', undefined, 'Danh sách')}>
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Danh sách Công ty */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-blue-500">
                                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                <p className="text-slate-500 font-medium">{t('companies.loading_companies', undefined, 'Đang tải danh sách công ty...')}</p>
                            </div>
                        ) : filteredCompanies.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
                                <XCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">{t('companies.no_results', undefined, 'Không tìm thấy công ty phù hợp')}</h3>
                                <p className="text-slate-500 font-medium mb-6">{t('companies.no_results_desc', undefined, 'Thử thay đổi từ khóa hoặc thiết lập lại bộ lọc.')}</p>
                                <button onClick={clearFilters} className="px-6 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                                    {t('companies.clear_filters', undefined, 'Xóa toàn bộ bộ lọc')}
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                                    {filteredCompanies.slice((currentPage - 1) * 12, currentPage * 12).map(company => (
                                        <CompanyCard key={company.id} company={company} viewMode={viewMode} />
                                    ))}
                                </div>

                                {Math.ceil(filteredCompanies.length / 12) > 1 && (
                                    <div className="mt-8 flex items-center justify-center gap-4">
                                        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                            <span className="text-blue-600 dark:text-blue-400">{currentPage}</span> / {Math.ceil(filteredCompanies.length / 12)}
                                        </span>
                                        <button disabled={currentPage === Math.ceil(filteredCompanies.length / 12)} onClick={() => handlePageChange(currentPage + 1)} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}