'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Job } from '@/types';
import { jobService } from '@/features/job/job.service';
import { systemService } from '@/features/system/system.service';
import { companyService } from '@/features/company/company.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import PublicHeader from '@/components/layout/PublicHeader';
import HeroSection from '@/components/landing/HeroSection';
import CompanyMarquee from '@/components/landing/CompanyMarquee';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StatsSection from '@/components/landing/StatsSection';
import HotJobsSection from '@/components/landing/HotJobsSection';
import LatestJobsSection from '@/components/landing/LatestJobsSection';
import WorkflowSection from '@/components/landing/WorkflowSection';
import FaqSection from '@/components/landing/FaqSection';
import BottomCTA from '@/components/landing/BottomCTA';
import PublicFooter from '@/components/layout/PublicFooter';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from '@/store/useLanguageStore';

export default function LandingClient() {
    const router = useRouter();
    const { t } = useTranslation();
    const { isAuthenticated, user } = useAuthStore();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [uniqueCompanies, setUniqueCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        location: '', workMode: '', jobLevel: '', employmentType: '',
        salaryRange: '', experienceRange: '', isHot: false,
        skills: [] as string[], company: '', industry: '', education: ''
    });

    const [filterOptions, setFilterOptions] = useState({
        locations: [] as any[], workModes: [] as string[], jobLevels: [] as string[], employmentTypes: [] as string[], skills: [] as string[], companies: [] as string[], industries: [] as string[], educations: [] as string[]
    });

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [data, locationsRes, companiesRes] = await Promise.all([
                    jobService.getPublicJobs(),
                    systemService.getLocations(),
                    companyService.getPublicCompanies(),
                ]);

                // Ánh xạ logo từ danh sách công ty vào danh sách job
                const jobsWithLogos = data.map((job: Job) => {
                    const matchedCompany = companiesRes.find((c: any) => c.id === job.company_id);
                    return {
                        ...job,
                        company_logo: matchedCompany?.logo_url || null,
                        company_name: matchedCompany?.name || job.company_name
                    };
                });

                setJobs(jobsWithLogos);

                const locations = locationsRes;

                const industries = [
                    ...new Set(
                        data
                            .map((job: any) => job.industry)
                            .filter(Boolean)
                    ),
                ] as string[];

                // Lấy trực tiếp company từ API public
                // API đã có logo_url
                setUniqueCompanies(companiesRes);

                setFilterOptions({
                    locations,
                    workModes: [],
                    jobLevels: [],
                    employmentTypes: [],
                    skills: [],
                    companies: [],
                    industries,
                    educations: [],
                });
            } catch (error) {
                console.error('Landing initial data error:', error);
                toast.error(t('landing.toast_system_error', undefined, 'Không thể tải dữ liệu hệ thống'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleSelectCompany = (companyName: string) => {
        router.push(`${ROUTES.PUBLIC_JOBS}?company=${encodeURIComponent(companyName)}`);
    };

    return (
        <>
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
            <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} filterOptions={filterOptions} />
            <CompanyMarquee companies={uniqueCompanies} onSelectCompany={handleSelectCompany} />
            <FeaturesSection />
            <StatsSection />
            <HotJobsSection jobs={jobs} />
            <LatestJobsSection jobs={jobs} />
            <WorkflowSection />
            <FaqSection />
            <BottomCTA />
            <PublicFooter />
        </>
    );
}