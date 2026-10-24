'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Hexagon,
    Search,
    Building2,
    LayoutDashboard,
    CreditCard,
    Menu,
    X,
    ChevronDown,
    Layers,
    Sparkles,
    BookOpen,
    Info,
    FileText,
    HelpCircle,
    Sun,
    Moon,
    Settings,
    LogOut,
    Zap,
    CalendarDays,
    Check,
    Flame,
    MapPin,
    Briefcase,
    Laptop,
    Users,
    ArrowRight,
    Compass,
    TrendingUp,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { UserRole } from '@/types';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/store/useLanguageStore';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/utils/utils';
import { getTierBadgeConfig } from '@/utils/tier-colors';
import { formatSubscriptionDate } from '@/utils/format';

interface PublicHeaderProps {
    isAuthenticated?: boolean;
    user?: any;
    isScrolled?: boolean;
}

export interface MegaMenuItem {
    label: string;
    href: string;
    isHot?: boolean;
    badge?: string;
}

export interface MegaMenuColumn {
    title: string;
    icon: any;
    items: MegaMenuItem[];
}

export interface MegaMenuConfig {
    title: string;
    href: string;
    columns: MegaMenuColumn[];
    highlight: {
        title: string;
        desc: string;
        href: string;
        buttonText: string;
    };
}

export interface HeaderNavItem {
    key: string;
    type: 'mega-jobs' | 'mega-companies' | 'dropdown' | 'link';
    name: string;
    href: string;
    icon: any;
    children?: { name: string; href: string; icon: any }[];
}

export const getMegaJobsConfig = (t: (path: string, params?: any, fallback?: string) => string): MegaMenuConfig => ({
    title: t('common.header.mega_jobs.title', undefined, 'Việc làm'),
    href: ROUTES.PUBLIC_JOBS,
    columns: [
        {
            title: t('common.header.mega_jobs.col_industry', undefined, 'Theo Ngành nghề hot'),
            icon: Briefcase,
            items: [
                { label: t('common.header.mega_jobs.it_ai', undefined, 'Công nghệ thông tin / AI'), href: `${ROUTES.PUBLIC_JOBS}?industry=Công nghệ thông tin`, isHot: true },
                { label: t('common.header.mega_jobs.business', undefined, 'Kinh doanh / Bán hàng'), href: `${ROUTES.PUBLIC_JOBS}?industry=Kinh doanh` },
                { label: t('common.header.mega_jobs.marketing', undefined, 'Marketing / Truyền thông'), href: `${ROUTES.PUBLIC_JOBS}?industry=Marketing` },
                { label: t('common.header.mega_jobs.finance', undefined, 'Tài chính / Kế toán'), href: `${ROUTES.PUBLIC_JOBS}?industry=Tài chính` },
                { label: t('common.header.mega_jobs.hr', undefined, 'Hành chính / Nhân sự'), href: `${ROUTES.PUBLIC_JOBS}?industry=Nhân sự` },
                { label: t('common.header.mega_jobs.design', undefined, 'Thiết kế / UI-UX'), href: `${ROUTES.PUBLIC_JOBS}?industry=Thiết kế` },
            ],
        },
        {
            title: t('common.header.mega_jobs.col_level', undefined, 'Cấp bậc & Hình thức'),
            icon: Laptop,
            items: [
                { label: t('common.header.mega_jobs.intern', undefined, 'Thực tập sinh (Intern)'), href: `${ROUTES.PUBLIC_JOBS}?jobLevel=Intern` },
                { label: t('common.header.mega_jobs.fresher', undefined, 'Mới tốt nghiệp (Fresher)'), href: `${ROUTES.PUBLIC_JOBS}?jobLevel=Fresher`, badge: t('common.header.badges.easy_apply', undefined, 'Dễ trúng tuyển') },
                { label: t('common.header.mega_jobs.junior', undefined, 'Chuyên viên (Junior / Mid)'), href: `${ROUTES.PUBLIC_JOBS}?jobLevel=Junior` },
                { label: t('common.header.mega_jobs.senior', undefined, 'Quản lý (Senior / Lead)'), href: `${ROUTES.PUBLIC_JOBS}?jobLevel=Senior` },
                { label: t('common.header.mega_jobs.remote', undefined, 'Làm việc từ xa (Remote)'), href: `${ROUTES.PUBLIC_JOBS}?workMode=Remote`, badge: t('common.header.badges.trend', undefined, 'Xu hướng') },
                { label: t('common.header.mega_jobs.hybrid', undefined, 'Làm kết hợp (Hybrid)'), href: `${ROUTES.PUBLIC_JOBS}?workMode=Hybrid` },
            ],
        },
        {
            title: t('common.header.mega_jobs.col_location', undefined, 'Địa điểm & Thu nhập'),
            icon: MapPin,
            items: [
                { label: t('common.header.mega_jobs.jobs_hn', undefined, 'Việc làm tại Hà Nội'), href: `${ROUTES.PUBLIC_JOBS}?provinces=01` },
                { label: t('common.header.mega_jobs.jobs_hcm', undefined, 'Việc làm tại TP. Hồ Chí Minh'), href: `${ROUTES.PUBLIC_JOBS}?provinces=79` },
                { label: t('common.header.mega_jobs.jobs_dn', undefined, 'Việc làm tại Đà Nẵng'), href: `${ROUTES.PUBLIC_JOBS}?provinces=48` },
                { label: t('common.header.mega_jobs.salary_20_50', undefined, 'Thu nhập 20 - 50 triệu'), href: `${ROUTES.PUBLIC_JOBS}?salaryRange=20-50` },
                { label: t('common.header.mega_jobs.salary_over_50', undefined, 'Thu nhập trên 50 triệu'), href: `${ROUTES.PUBLIC_JOBS}?salaryRange=50-100`, badge: t('common.header.badges.high_salary', undefined, 'Lương cao') },
            ],
        },
    ],
    highlight: {
        title: t('common.header.mega_jobs.highlight_title', undefined, 'Việc làm Tuyển Gấp & Hot'),
        desc: t('common.header.mega_jobs.highlight_desc', undefined, 'Hàng trăm cơ hội việc làm hấp dẫn được ứng dụng AI kết nối nhanh chóng.'),
        href: `${ROUTES.PUBLIC_JOBS}?jobType=hot`,
        buttonText: t('common.header.mega_jobs.highlight_btn', undefined, 'Xem Việc Làm Hot'),
    },
});

export const getMegaCompaniesConfig = (t: (path: string, params?: any, fallback?: string) => string): MegaMenuConfig => ({
    title: t('common.header.mega_companies.title', undefined, 'Công ty'),
    href: ROUTES.PUBLIC_COMPANIES,
    columns: [
        {
            title: t('common.header.mega_companies.col_field', undefined, 'Theo Lĩnh vực hoạt động'),
            icon: Building2,
            items: [
                { label: t('common.header.mega_companies.software_ai', undefined, 'Công nghệ phần mềm & AI'), href: `${ROUTES.PUBLIC_COMPANIES}?industry=Công nghệ thông tin`, isHot: true },
                { label: t('common.header.mega_companies.finance_fintech', undefined, 'Tài chính & FinTech'), href: `${ROUTES.PUBLIC_COMPANIES}?industry=Tài chính` },
                { label: t('common.header.mega_companies.ecommerce', undefined, 'Thương mại điện tử & Retail'), href: `${ROUTES.PUBLIC_COMPANIES}?industry=Thương mại điện tử` },
                { label: t('common.header.mega_companies.consulting_hr', undefined, 'Dịch vụ tư vấn & Nhân sự'), href: `${ROUTES.PUBLIC_COMPANIES}?industry=Nhân sự` },
                { label: t('common.header.mega_companies.education', undefined, 'Giáo dục & Đào tạo'), href: `${ROUTES.PUBLIC_COMPANIES}?industry=Giáo dục` },
            ],
        },
        {
            title: t('common.header.mega_companies.col_size', undefined, 'Theo Quy mô nhân sự'),
            icon: Users,
            items: [
                { label: t('common.header.mega_companies.large_corp', undefined, 'Tập đoàn lớn (> 500 nhân sự)'), href: `${ROUTES.PUBLIC_COMPANIES}?size=500%2B`, badge: t('common.header.badges.top_tier', undefined, 'Top Tier') },
                { label: t('common.header.mega_companies.medium_corp', undefined, 'Doanh nghiệp vừa (100 - 499)'), href: `${ROUTES.PUBLIC_COMPANIES}?size=100-499` },
                { label: t('common.header.mega_companies.startup', undefined, 'Startup năng động (< 100)'), href: `${ROUTES.PUBLIC_COMPANIES}?size=1-99` },
            ],
        },
        {
            title: t('common.header.mega_companies.col_office', undefined, 'Khu vực văn phòng'),
            icon: MapPin,
            items: [
                { label: t('common.header.mega_companies.companies_hn', undefined, 'Doanh nghiệp tại Hà Nội'), href: `${ROUTES.PUBLIC_COMPANIES}?provinces=01` },
                { label: t('common.header.mega_companies.companies_hcm', undefined, 'Doanh nghiệp tại TP. HCM'), href: `${ROUTES.PUBLIC_COMPANIES}?provinces=79` },
                { label: t('common.header.mega_companies.companies_dn', undefined, 'Doanh nghiệp tại Đà Nẵng'), href: `${ROUTES.PUBLIC_COMPANIES}?provinces=48` },
            ],
        },
    ],
    highlight: {
        title: t('common.header.mega_companies.highlight_title', undefined, 'Top Doanh Nghiệp Uy Tín'),
        desc: t('common.header.mega_companies.highlight_desc', undefined, 'Được Verisem AI xác thực hồ sơ và đánh giá chất lượng môi trường làm việc.'),
        href: ROUTES.PUBLIC_COMPANIES,
        buttonText: t('common.header.mega_companies.highlight_btn', undefined, 'Khám phá Công Ty'),
    },
});

export const MEGA_JOBS_CONFIG = getMegaJobsConfig((k, _p, f) => f || k);
export const MEGA_COMPANIES_CONFIG = getMegaCompaniesConfig((k, _p, f) => f || k);

export const LANGUAGES = [
    { code: 'VI' as const, name: 'Tiếng Việt', flag: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/960px-Flag_of_Vietnam.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail' },
    { code: 'EN' as const, name: 'English', flag: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/3840px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?utm_source=vi.wikipedia.org&utm_campaign=index&utm_content=thumbnail' },
];

export default function PublicHeader({ isAuthenticated = false, user = null, isScrolled = false }: PublicHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { logout } = useAuthStore();

    const { data: subscriptionRes } = useSubscription();
    const planInfo = subscriptionRes?.data;
    const planBadgeConfig = getTierBadgeConfig(planInfo?.tier_level || 1);

    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
    const { language, setLanguage, t } = useTranslation();
    const megaJobsConfig = getMegaJobsConfig(t);
    const megaCompaniesConfig = getMegaCompaniesConfig(t);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
        setIsLanguageOpen(false);
        setMobileExpandedSection(null);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setIsDropdownOpen(false);
            }

            if (languageRef.current && !languageRef.current.contains(target)) {
                setIsLanguageOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const role = user?.role || UserRole.APPLICANT;

    const systemLink =
        role === UserRole.APPLICANT
            ? ROUTES.APPLICANT_DASHBOARD
            : role === UserRole.ADMIN
                ? ROUTES.ADMIN_DASHBOARD
                : ROUTES.HR_DASHBOARD;

    const profileRoute =
        role === UserRole.ADMIN
            ? ROUTES.ADMIN_SETTINGS
            : role === UserRole.APPLICANT
                ? ROUTES.APPLICANT_PROFILE
                : ROUTES.HR_SETTINGS;

    const getRoleDisplayName = () => {
        if (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) {
            return t('common.roles.hr', undefined, 'Nhà tuyển dụng');
        }

        if (role === UserRole.ADMIN) {
            return t('common.roles.admin', undefined, 'Quản trị viên');
        }

        return t('common.roles.applicant', undefined, 'Ứng viên');
    };

    const navItems: HeaderNavItem[] = [
        {
            key: 'jobs',
            type: 'mega-jobs' as const,
            name: t('common.nav.jobs', undefined, 'Việc làm'),
            href: ROUTES.PUBLIC_JOBS,
            icon: Search,
        },
        {
            key: 'companies',
            type: 'mega-companies' as const,
            name: t('common.nav.companies', undefined, 'Công ty'),
            href: ROUTES.PUBLIC_COMPANIES,
            icon: Building2,
        },
        {
            key: 'products',
            type: 'dropdown' as const,
            name: t('common.nav.products', undefined, 'Sản phẩm'),
            href: '#',
            icon: Layers,
            children: [
                { name: t('common.nav.features', undefined, 'Tính năng cốt lõi'), href: '/features', icon: Sparkles },
                { name: t('common.nav.pricing', undefined, 'Bảng giá dịch vụ'), href: ROUTES.PRICING, icon: CreditCard },
            ],
        },
        {
            key: 'resources',
            type: 'dropdown' as const,
            name: t('common.nav.resources', undefined, 'Tài nguyên'),
            href: '#',
            icon: BookOpen,
            children: [
                { name: t('common.nav.about', undefined, 'Về chúng tôi'), href: ROUTES.ABOUT, icon: Info },
                { name: t('common.nav.blog', undefined, 'Cẩm nang nghề nghiệp'), href: ROUTES.BLOG, icon: FileText },
                { name: t('common.nav.support', undefined, 'Trung tâm hỗ trợ'), href: ROUTES.SUPPORT, icon: HelpCircle },
            ],
        },
    ];

    const selectedLanguage = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

    const handleLanguageChange = (code: 'VI' | 'EN') => {
        setLanguage(code);
        setIsLanguageOpen(false);
    };

    const headerBg = isScrolled || isMobileMenuOpen ? 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 py-3 shadow-sm backdrop-blur-md' : 'bg-transparent border-transparent py-5';

    return (
        <header className={`fixed top-0 z-50 w-full border-b font-sans transition-all duration-300 ${headerBg}`}>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-10">
                    <Link
                        href={ROUTES.HOME}
                        className="group relative z-50 flex items-center gap-2"
                    >
                        {/* Logo Mark */}
                        <div className="relative flex h-10 w-10 items-center justify-center">
                            {/* Ambient glow */}
                            <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-md transition-all duration-500 group-hover:bg-blue-500/35 group-hover:blur-lg" />

                            {/* Main mark */}
                            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-600 to-blue-800 shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-blue-600/30">
                                {/* Subtle light sweep */}
                                <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/25 to-transparent transition-all duration-700 group-hover:left-[130%]" />

                                {/* Hexagon */}
                                <Hexagon
                                    className="relative z-10 h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110"
                                    fill="currentColor"
                                />
                            </div>
                        </div>

                        {/* Wordmark */}
                        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                            VERI
                            <span className="text-blue-600 transition-colors duration-300 group-hover:text-blue-500 dark:text-blue-400 dark:group-hover:text-blue-300">
                                SEM
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-10 lg:flex">
                        {navItems.map((item) => {
                            if (item.type === 'mega-jobs') {
                                const isJobsActive = pathname === ROUTES.PUBLIC_JOBS || pathname.startsWith(`${ROUTES.PUBLIC_JOBS}/`);
                                return (
                                    <div key={item.key} className="group relative">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'relative flex items-center gap-1.5 py-2 text-sm font-bold transition-colors',
                                                isJobsActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                            )}
                                        >
                                            {item.name}
                                            <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover:rotate-180" />
                                            <span
                                                className={cn(
                                                    'absolute -bottom-1 left-0 h-0.5 w-9 origin-left scale-x-0 rounded-full bg-linear-to-r from-primary-600 to-primary-800 transition-transform duration-300 group-hover:scale-x-100',
                                                    isJobsActive && 'scale-x-100'
                                                )}
                                            />
                                        </Link>

                                        {/* Mega Panel Việc làm (TopCV Style - Bám sát globals.css, không truncate chữ) */}
                                        <div className="invisible absolute -left-8 xl:-left-16 top-full mt-3 w-[880px] xl:w-[940px] -translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50">
                                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                                <div className="grid grid-cols-12 gap-6 items-stretch">
                                                    {/* 3 Cột lọc tiêu chí rộng rãi */}
                                                    <div className="col-span-9 grid grid-cols-3 gap-6">
                                                        {megaJobsConfig.columns.map((col, idx) => {
                                                            const ColIcon = col.icon;
                                                            return (
                                                                <div key={idx} className="space-y-3">
                                                                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                                                                        <ColIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                                                            {col.title}
                                                                        </span>
                                                                    </div>
                                                                    <ul className="space-y-2">
                                                                        {col.items.map((sub, sIdx) => (
                                                                            <li key={sIdx}>
                                                                                <Link
                                                                                    href={sub.href}
                                                                                    className="group/item flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-0.5 transition-colors"
                                                                                >
                                                                                    <span className="leading-snug group-hover/item:translate-x-0.5 transition-transform">
                                                                                        {sub.label}
                                                                                    </span>
                                                                                    {sub.isHot && (
                                                                                        <span className="shrink-0 ml-1.5 flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                                                                                            <Flame className="w-2.5 h-2.5" /> {t('common.header.badges.hot', undefined, 'Hot')}
                                                                                        </span>
                                                                                    )}
                                                                                    {sub.badge && !sub.isHot && (
                                                                                        <span className="shrink-0 ml-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                                                                            {sub.badge}
                                                                                        </span>
                                                                                    )}
                                                                                </Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Card Banner phẳng đơn giản, không gradient sáng chéo - bám sát globals.css */}
                                                    <div className="col-span-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                                                        <div>
                                                            <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 mb-2.5">
                                                                <Flame className="w-3 h-3 text-blue-600 dark:text-blue-400" /> {t('common.header.badges.featured', undefined, 'Nổi bật')}
                                                            </div>
                                                            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                                                                {megaJobsConfig.highlight.title}
                                                            </h4>
                                                            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                                                {megaJobsConfig.highlight.desc}
                                                            </p>
                                                        </div>

                                                        <div className="pt-4 space-y-2">
                                                            <Link
                                                                href={megaJobsConfig.highlight.href}
                                                                className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition-colors"
                                                            >
                                                                <span>{megaJobsConfig.highlight.buttonText}</span>
                                                                <ArrowRight className="w-3.5 h-3.5" />
                                                            </Link>
                                                            <Link
                                                                href={ROUTES.PUBLIC_JOBS}
                                                                className="flex items-center justify-center w-full py-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                                            >
                                                                {t('common.header.mega_jobs.view_all', undefined, 'Xem tất cả việc làm →')}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            if (item.type === 'mega-companies') {
                                const isCompaniesActive = pathname === ROUTES.PUBLIC_COMPANIES || pathname.startsWith(`${ROUTES.PUBLIC_COMPANIES}/`);
                                return (
                                    <div key={item.key} className="group relative">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'relative flex items-center gap-1.5 py-2 text-sm font-bold transition-colors',
                                                isCompaniesActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                            )}
                                        >
                                            {item.name}
                                            <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover:rotate-180" />
                                            <span
                                                className={cn(
                                                    'absolute -bottom-1 left-0 h-0.5 w-9 origin-left scale-x-0 rounded-full bg-linear-to-r from-primary-600 to-primary-800 transition-transform duration-300 group-hover:scale-x-100',
                                                    isCompaniesActive && 'scale-x-100'
                                                )}
                                            />
                                        </Link>

                                        {/* Mega Panel Công ty (TopCV Style - Bám sát globals.css, không truncate chữ) */}
                                        <div className="invisible absolute -left-20 xl:-left-28 top-full mt-3 w-[880px] xl:w-[940px] -translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50">
                                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                                <div className="grid grid-cols-12 gap-6 items-stretch">
                                                    {/* 3 Cột lọc tiêu chí rộng rãi */}
                                                    <div className="col-span-9 grid grid-cols-3 gap-6">
                                                        {megaCompaniesConfig.columns.map((col, idx) => {
                                                            const ColIcon = col.icon;
                                                            return (
                                                                <div key={idx} className="space-y-3">
                                                                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                                                                        <ColIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                                                            {col.title}
                                                                        </span>
                                                                    </div>
                                                                    <ul className="space-y-2">
                                                                        {col.items.map((sub, sIdx) => (
                                                                            <li key={sIdx}>
                                                                                <Link
                                                                                    href={sub.href}
                                                                                    className="group/item flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-0.5 transition-colors"
                                                                                >
                                                                                    <span className="leading-snug group-hover/item:translate-x-0.5 transition-transform">
                                                                                        {sub.label}
                                                                                    </span>
                                                                                    {sub.isHot && (
                                                                                        <span className="shrink-0 ml-1.5 flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                                                                                            <Flame className="w-2.5 h-2.5" /> {t('common.header.badges.hot', undefined, 'Hot')}
                                                                                        </span>
                                                                                    )}
                                                                                    {sub.badge && !sub.isHot && (
                                                                                        <span className="shrink-0 ml-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                                                                            {sub.badge}
                                                                                        </span>
                                                                                    )}
                                                                                </Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Card Banner phẳng đơn giản, không gradient sáng chéo - bám sát globals.css */}
                                                    <div className="col-span-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                                                        <div>
                                                            <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-2.5">
                                                                <Building2 className="w-3 h-3 text-slate-600 dark:text-slate-400" /> {t('common.header.badges.verified', undefined, 'Xác minh')}
                                                            </div>
                                                            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                                                                {megaCompaniesConfig.highlight.title}
                                                            </h4>
                                                            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                                                {megaCompaniesConfig.highlight.desc}
                                                            </p>
                                                        </div>

                                                        <div className="pt-4 space-y-2">
                                                            <Link
                                                                href={megaCompaniesConfig.highlight.href}
                                                                className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition-colors"
                                                            >
                                                                <span>{megaCompaniesConfig.highlight.buttonText}</span>
                                                                <ArrowRight className="w-3.5 h-3.5" />
                                                            </Link>
                                                            <Link
                                                                href={`${ROUTES.PUBLIC_COMPANIES}?size=500%2B`}
                                                                className="flex items-center justify-center w-full py-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                                            >
                                                                {t('common.header.mega_companies.view_all_large', undefined, 'Xem tập đoàn lớn →')}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            if (item.children) {
                                const isParentActive = item.children.some((child) => pathname.startsWith(child.href));
                                return (
                                    <div key={item.key} className="group relative">
                                        <button className={cn('relative flex items-center gap-1.5 py-2 text-sm font-bold transition-colors cursor-pointer', isParentActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white')}>
                                            {item.name}

                                            <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover:rotate-180" />

                                            <span className={cn('absolute -bottom-1 left-0 h-0.5 w-9 origin-left scale-x-0 rounded-full bg-linear-to-r from-primary-600 to-primary-800 transition-transform duration-300 group-hover:scale-x-100', isParentActive && 'scale-x-100')} />
                                        </button>

                                        <div className="invisible absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50">
                                            <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                                {item.children.map((child) => {
                                                    const isChildActive = pathname.startsWith(child.href);
                                                    const Icon = child.icon;

                                                    return (
                                                        <Link key={child.href} href={child.href} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors whitespace-nowrap', isChildActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400')}>
                                                            <Icon className={cn('h-4 w-4 shrink-0', isChildActive ? 'text-blue-500' : 'text-slate-400')} />
                                                            <span className="leading-snug">{child.name}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.key} href={item.href} className={cn('group relative py-2 text-sm font-bold transition-colors', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white')}>
                                    {item.name}

                                    <span className={cn('absolute -bottom-1 left-0 h-0.5 w-9 origin-left scale-x-0 rounded-full bg-linear-to-r from-primary-600 to-primary-800 transition-transform duration-300 group-hover:scale-x-100', isActive && 'scale-x-100')} />
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="relative z-50 flex items-center gap-1 md:gap-2">
                    {/* Language */}
                    <div className="relative" ref={languageRef}>
                        <button onClick={() => setIsLanguageOpen((prev) => !prev)} className={cn('flex h-10 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors', isLanguageOpen ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400')} title={t('common.header.aria.select_language', undefined, 'Chọn ngôn ngữ')} aria-label={t('common.header.aria.select_language', undefined, 'Chọn ngôn ngữ')} aria-expanded={isLanguageOpen}>
                            <img src={selectedLanguage.flag} alt={selectedLanguage.name} className="h-4 w-6 rounded-sm object-cover shadow-sm" />
                            <span>{selectedLanguage.code}</span>
                            <ChevronDown className={cn('h-3 w-3 text-slate-400 transition-transform duration-200', isLanguageOpen && 'rotate-180')} />
                        </button>

                        {isLanguageOpen && (
                            <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
                                {LANGUAGES.map((item) => {
                                    const isSelected = language === item.code;

                                    return (
                                        <button key={item.code} onClick={() => handleLanguageChange(item.code)} className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors', isSelected ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white')}>
                                            <img src={item.flag} alt={item.name} className="h-4 w-6 rounded-sm object-cover shadow-sm" />
                                            <span className="flex-1">{item.name}</span>
                                            {isSelected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Theme */}
                    {mounted && (
                        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400" aria-label={t('common.header.aria.toggle_theme', undefined, 'Chuyển đổi giao diện')} title={t('common.header.aria.toggle_theme', undefined, 'Chuyển đổi giao diện')}>
                            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                        </button>
                    )}

                    <div className="mx-2 hidden h-6 w-px bg-slate-200 dark:bg-slate-700 lg:block" />

                    {/* Authenticated User */}
                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsDropdownOpen((prev) => !prev)} className="group/profile flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 md:gap-3" aria-expanded={isDropdownOpen} aria-haspopup="menu">
                                <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=0284c7&color=fff&bold=true`} alt="Avatar" className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm dark:border-slate-700" referrerPolicy="no-referrer" />

                                <div className="hidden flex-col items-start text-left md:flex">
                                    <div className="relative max-w-[130px] overflow-hidden whitespace-nowrap" title={user?.full_name || 'User'}>
                                        {(user?.full_name?.length || 0) > 13 ? (
                                            <div className="inline-flex items-center gap-3 animate-marquee-left hover:[animation-play-state:paused] whitespace-nowrap text-sm font-bold leading-tight text-slate-700 dark:text-white cursor-pointer">
                                                <span>{user?.full_name}</span>
                                                <span className="opacity-40">•</span>
                                                <span>{user?.full_name}</span>
                                                <span className="opacity-40">•</span>
                                            </div>
                                        ) : (
                                            <span className="block truncate text-sm font-bold leading-tight text-slate-700 dark:text-white">
                                                {user?.full_name || 'User'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-0.5 flex items-center gap-1.5">
                                        <span className="text-[10px] font-medium leading-tight text-slate-500 dark:text-slate-400">
                                            {getRoleDisplayName()}
                                        </span>

                                        {planInfo?.current_plan && role !== UserRole.ADMIN && (
                                            <span className={cn('rounded-sm border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider shadow-sm', planBadgeConfig.bg, planBadgeConfig.text, planBadgeConfig.border)}>
                                                {planInfo.current_plan.replace('HR ', '').replace('App ', '')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <ChevronDown className={cn('hidden h-4 w-4 text-slate-400 transition-transform duration-200 md:block', isDropdownOpen && 'rotate-180')} />
                            </button>

                            {/* User Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl animate-in fade-in slide-in-from-top-2 dark:border-slate-800 dark:bg-slate-900">
                                    {role !== UserRole.ADMIN && planInfo && (
                                        <div className="mx-2 mb-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-0">
                                                <div className="min-w-0 sm:pr-3">
                                                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{t('common.header.user_menu.current_plan', undefined, 'Gói hiện tại')}</span>
                                                    <span className="mt-0.5 block text-xs font-bold text-blue-600 dark:text-blue-400 leading-snug" title={planInfo.current_plan}>{planInfo.current_plan}</span>
                                                </div>

                                                <div className="border-t border-slate-200 pt-2 sm:border-l sm:border-t-0 sm:px-3 sm:pt-0 dark:border-slate-700">
                                                    <div className="flex items-center gap-1.5">
                                                        <Zap className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{t('common.header.user_menu.credits', undefined, 'Credits')}</span>
                                                    </div>
                                                    <span className="mt-0.5 block text-xs font-bold text-slate-700 dark:text-slate-200">{(planInfo.credits_remaining || 0).toLocaleString('vi-VN')}</span>
                                                </div>

                                                <div className="border-t border-slate-200 pt-2 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0 dark:border-slate-700">
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{t('common.header.user_menu.expiry', undefined, 'Thời hạn')}</span>
                                                    </div>
                                                    <span className="mt-0.5 block text-xs font-bold text-slate-700 dark:text-slate-200 leading-snug">{formatSubscriptionDate(planInfo.end_date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <Link href={profileRoute} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400">
                                        <Settings className="h-4 w-4" />
                                        {t('common.header.user_menu.profile', undefined, 'Hồ sơ cá nhân')}
                                    </Link>

                                    <Link href={systemLink} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400">
                                        <LayoutDashboard className="h-4 w-4" />
                                        {t('common.header.user_menu.enter_system', undefined, 'Vào hệ thống Verisem')}
                                    </Link>

                                    <div className="my-2 h-px bg-slate-100 dark:bg-slate-700/50" />

                                    <button onClick={() => { setIsDropdownOpen(false); logout(router); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10">
                                        <LogOut className="h-4 w-4" />
                                        {t('common.header.user_menu.logout', undefined, 'Đăng xuất')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden items-center gap-2 lg:flex">
                            <Link href={ROUTES.LOGIN} className="rounded-full px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400">{t('common.header.user_menu.login', undefined, 'Đăng nhập')}</Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button onClick={() => setIsMobileMenuOpen((prev) => !prev)} className="rounded-full bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden" aria-label={isMobileMenuOpen ? t('common.header.aria.close_menu', undefined, 'Đóng menu') : t('common.header.aria.open_menu', undefined, 'Mở menu')}>
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={cn('absolute left-0 top-full flex w-full flex-col overflow-hidden border-b border-slate-200 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 lg:hidden', isMobileMenuOpen ? 'max-h-[calc(100vh-70px)] opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6">
                        <nav className="flex flex-col gap-2">
                            {/* 1. MỤC VIỆC LÀM (ACCORDION MEGA MENU TRÊN MOBILE) */}
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setMobileExpandedSection(mobileExpandedSection === 'jobs' ? null : 'jobs')}
                                    className="flex w-full items-center justify-between p-3.5 text-sm font-bold text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="flex items-center gap-3">
                                        <Search className="h-4 w-4 text-blue-500" />
                                        <span>{t('common.nav.jobs', undefined, 'Việc làm')}</span>
                                    </span>
                                    <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", mobileExpandedSection === 'jobs' && "rotate-180 text-blue-500")} />
                                </button>

                                {mobileExpandedSection === 'jobs' && (
                                    <div className="px-3.5 pb-4 pt-1 space-y-4 border-t border-slate-200/60 dark:border-slate-700/60">
                                        <Link
                                            href={ROUTES.PUBLIC_JOBS}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-500/20"
                                        >
                                            <span>{t('common.header.mega_jobs.view_all_mobile', undefined, 'Xem tất cả cơ hội việc làm')}</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>

                                        {megaJobsConfig.columns.map((col, cIdx) => (
                                            <div key={cIdx} className="space-y-1.5">
                                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                                                    {col.title}
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {col.items.map((sub, sIdx) => (
                                                        <Link
                                                            key={sIdx}
                                                            href={sub.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                        >
                                                            <span>{sub.label}</span>
                                                            {sub.isHot && (
                                                                <span className="text-[9px] font-black text-rose-500">{t('common.header.badges.hot', undefined, 'Hot')}</span>
                                                            )}
                                                            {sub.badge && !sub.isHot && (
                                                                <span className="text-[8px] font-black text-blue-500">{sub.badge}</span>
                                                            )}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 2. MỤC CÔNG TY (ACCORDION MEGA MENU TRÊN MOBILE) */}
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setMobileExpandedSection(mobileExpandedSection === 'companies' ? null : 'companies')}
                                    className="flex w-full items-center justify-between p-3.5 text-sm font-bold text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="flex items-center gap-3">
                                        <Building2 className="h-4 w-4 text-blue-500" />
                                        <span>{t('common.nav.companies', undefined, 'Công ty')}</span>
                                    </span>
                                    <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", mobileExpandedSection === 'companies' && "rotate-180 text-blue-500")} />
                                </button>

                                {mobileExpandedSection === 'companies' && (
                                    <div className="px-3.5 pb-4 pt-1 space-y-4 border-t border-slate-200/60 dark:border-slate-700/60">
                                        <Link
                                            href={ROUTES.PUBLIC_COMPANIES}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-500/20"
                                        >
                                            <span>{t('common.header.mega_companies.view_all_mobile', undefined, 'Khám phá toàn bộ công ty')}</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>

                                        {megaCompaniesConfig.columns.map((col, cIdx) => (
                                            <div key={cIdx} className="space-y-1.5">
                                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                                                    {col.title}
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {col.items.map((sub, sIdx) => (
                                                        <Link
                                                            key={sIdx}
                                                            href={sub.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                        >
                                                            <span>{sub.label}</span>
                                                            {sub.badge && (
                                                                <span className="text-[8px] font-black text-emerald-500">{sub.badge}</span>
                                                            )}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 3. MỤC SẢN PHẨM & TÀI NGUYÊN (ACCORDION DROPDOWN) */}
                            {navItems.filter((i) => i.type === 'dropdown').map((item) => {
                                const isExpanded = mobileExpandedSection === item.key;
                                const Icon = item.icon;

                                return (
                                    <div key={item.key} className="rounded-2xl border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setMobileExpandedSection(isExpanded ? null : item.key)}
                                            className="flex w-full items-center justify-between p-3.5 text-sm font-bold text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="flex items-center gap-3">
                                                <Icon className="h-4 w-4 text-blue-500" />
                                                <span>{item.name}</span>
                                            </span>
                                            <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isExpanded && "rotate-180 text-blue-500")} />
                                        </button>

                                        {isExpanded && item.children && (
                                            <div className="px-3.5 pb-3 pt-1 space-y-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                                                {item.children.map((child) => {
                                                    const ChildIcon = child.icon;
                                                    const isChildActive = pathname.startsWith(child.href);
                                                    return (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={cn(
                                                                'flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors',
                                                                isChildActive
                                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600'
                                                            )}
                                                        >
                                                            <ChildIcon className="h-3.5 w-3.5 text-blue-500" />
                                                            <span>{child.name}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Mobile User */}
                        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
                            {isAuthenticated ? (
                                <div className="flex flex-col gap-2">
                                    {role !== UserRole.ADMIN && planInfo && (
                                        <div className="mb-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">{t('common.header.user_menu.current_plan', undefined, 'Gói hiện tại')}</span>
                                                    <span className="block text-sm font-black text-blue-600 dark:text-blue-400 leading-snug">{planInfo.current_plan}</span>
                                                </div>

                                                <span className={cn('shrink-0 rounded-md border px-2 py-1 text-[9px] font-black uppercase', planBadgeConfig.bg, planBadgeConfig.text, planBadgeConfig.border)}>
                                                    {planInfo.current_plan.replace('HR ', '').replace('App ', '')}
                                                </span>
                                            </div>

                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                                                    <div className="flex items-center gap-1.5">
                                                        <Zap className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
                                                        <span className="text-[9px] font-bold uppercase text-slate-400">{t('common.header.user_menu.credits', undefined, 'Credits')}</span>
                                                    </div>
                                                    <span className="text-sm font-black text-slate-800 dark:text-white">{(planInfo.credits_remaining || 0).toLocaleString('vi-VN')}</span>
                                                </div>

                                                <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                                                        <span className="text-[9px] font-bold uppercase text-slate-400">{t('common.header.user_menu.expiry', undefined, 'Thời hạn')}</span>
                                                    </div>
                                                    <span className="text-sm font-black text-slate-800 dark:text-white">{formatSubscriptionDate(planInfo.end_date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <Link href={profileRoute} onClick={() => setIsMobileMenuOpen(false)} className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400">
                                        <Settings className="h-4 w-4" />
                                        {t('common.header.user_menu.profile', undefined, 'Hồ sơ cá nhân')}
                                    </Link>

                                    <Link href={systemLink} onClick={() => setIsMobileMenuOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700">
                                        <LayoutDashboard className="h-4 w-4" />
                                        {t('common.header.user_menu.enter_system', undefined, 'Vào hệ thống Verisem')}
                                    </Link>

                                    <button onClick={() => { setIsMobileMenuOpen(false); logout(router); }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-3.5 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20">
                                        <LogOut className="h-4 w-4" />
                                        {t('common.header.user_menu.logout', undefined, 'Đăng xuất')}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link href={ROUTES.LOGIN} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3.5 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">{t('common.header.user_menu.login_system', undefined, 'Đăng nhập hệ thống')}</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}