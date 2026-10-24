'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Sparkles, Search, MapPin, Briefcase, ChevronDown } from 'lucide-react';
import Typewriter from '@/components/ui/Typewriter';
import Select from 'react-select';
import { INDUSTRIES, GROUPED_INDUSTRIES } from '@/constants/job.constants';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from '@/store/useLanguageStore';

const HERO_WORDS_VI = [
    'Nhân viên kinh doanh',
    'Chuyên viên Marketing',
    'Chuyên viên CSKH',
    'Chuyên viên nhân sự',
    'Kỹ sư phần mềm',
    'Công nhân sản xuất',
    'Chuyên viên tài chính',
    'Chuyên viên kinh doanh BĐS',
    'Kỹ sư xây dựng',
    'Kế toán viên',
    'Kỹ sư sản xuất',
    'Giáo viên',
    'Nhân viên bán hàng',
    'Nhà báo',
    'Kỹ sư điện',
    'Nhân viên Logistics',
    'Chuyên viên tư vấn',
    'Bác sĩ',
    'Nhà thiết kế UI/UX',
    'Quản lý nhà hàng',
    'Kỹ sư môi trường',
    'Tài xế',
    'Biên dịch viên',
    'Luật sư',
    'Chuyên viên',
];

const HERO_WORDS_EN = [
    'Sales Executive',
    'Marketing Specialist',
    'Customer Support Specialist',
    'HR Specialist',
    'Software Engineer',
    'Production Worker',
    'Financial Analyst',
    'Real Estate Agent',
    'Civil Engineer',
    'Accountant',
    'Manufacturing Engineer',
    'Teacher',
    'Sales Representative',
    'Journalist',
    'Electrical Engineer',
    'Logistics Coordinator',
    'Consultant',
    'Doctor',
    'UI/UX Designer',
    'Restaurant Manager',
    'Environmental Engineer',
    'Driver',
    'Translator',
    'Lawyer',
    'Specialist',
];

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: 'easeOut',
        },
    },
};

const heroSelectStyles = (isDark = false) => ({
    control: (base: any) => ({
        ...base,
        border: 'none',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        cursor: 'text',
        minHeight: '42px',
    }),
    valueContainer: (base: any) => ({
        ...base,
        padding: '0 8px',
    }),
    input: (base: any) => ({
        ...base,
        color: isDark ? '#f8fafc' : '#0f172a',
        margin: 0,
        padding: 0,
    }),
    singleValue: (base: any, state: any) => ({
        ...base,
        color:
            !state.data || state.data.value === ''
                ? '#94a3b8'
                : isDark
                    ? '#f8fafc'
                    : '#334155',
        fontSize: '14px',
        fontWeight: 500,
    }),
    placeholder: (base: any) => ({
        ...base,
        color: '#94a3b8',
        fontSize: '14px',
        fontWeight: 500,
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        color: '#94a3b8',
    }),
    menu: (base: any) => ({
        ...base,
        zIndex: 9999,
        borderRadius: '1rem',
        overflow: 'hidden',
        padding: '8px',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        boxShadow: isDark
            ? '0 20px 40px rgba(0,0,0,.35)'
            : '0 20px 40px rgba(15,23,42,.12)',
    }),
    menuList: (base: any) => ({
        ...base,
        padding: 0,
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected
            ? '#2563eb'
            : state.isFocused
                ? isDark
                    ? '#1e293b'
                    : '#eff6ff'
                : 'transparent',
        color: state.isSelected
            ? '#fff'
            : isDark
                ? '#e2e8f0'
                : '#334155',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        borderRadius: '0.5rem',
        margin: '2px 0',
    }),
});

interface HeroSectionProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    filters: any;
    setFilters: (val: any) => void;
    filterOptions?: any;
}

export default function HeroSection({
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filterOptions,
}: HeroSectionProps) {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { t, language } = useTranslation();
    const heroWords = language === 'EN' ? HERO_WORDS_EN : HERO_WORDS_VI;

    const [showLocationPopover, setShowLocationPopover] = useState(false);
    const [mainTab, setMainTab] = useState<'domestic' | 'foreign'>('domestic');
    const [domesticVersion, setDomesticVersion] = useState<'new' | 'old'>('new');
    const [foreignInput, setForeignInput] = useState(filters.foreignLocation || '');
    const [locationSearchKeyword, setLocationSearchKeyword] = useState('');
    const [expandedProvince, setExpandedProvince] = useState<string | null>(null);
    const [subLocations, setSubLocations] = useState<any[]>([]);

    const popoverRef = useRef<HTMLDivElement>(null);

    const locations = filterOptions?.locations || [];
    const activeProvinces = locations.filter((l: any) => l.version === domesticVersion);
    const displayedProvinces = activeProvinces.filter((l: any) =>
        l.name.toLowerCase().includes(locationSearchKeyword.toLowerCase()),
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setShowLocationPopover(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleExpandProvince = async (provCode: string) => {
        if (expandedProvince === provCode) {
            setExpandedProvince(null);
            setSubLocations([]);
            return;
        }

        setExpandedProvince(provCode);

        const { systemService } = await import('@/features/system/system.service');
        const subs = await systemService.getSubLocations(provCode);

        setSubLocations(subs.filter((s: any) => s.version === domesticVersion));
    };

    const handleForeignSubmit = () => {
        const value = foreignInput.trim();

        setFilters({
            ...filters,
            foreignLocation: value,
        });

        if (value) {
            setShowLocationPopover(false);
        }
    };

    const selectedLocCount =
        (filters.provinceCodes?.length || 0) +
        (filters.districtCodes?.length || 0) +
        (filters.wardCodes?.length || 0) +
        (filters.foreignLocation ? 1 : 0);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (searchQuery.trim()) {
            params.append('keyword', searchQuery.trim());
        }

        if (filters.industry) {
            params.append('industry', filters.industry);
        }

        if (filters.provinceCodes?.length > 0) {
            params.append('provinces', filters.provinceCodes.join(','));
        }

        if (filters.districtCodes?.length > 0) {
            params.append('districts', filters.districtCodes.join(','));
        }

        if (filters.wardCodes?.length > 0) {
            params.append('wards', filters.wardCodes.join(','));
        }

        if (filters.foreignLocation) {
            params.append('foreign', filters.foreignLocation);
        }

        router.push(`${ROUTES.PUBLIC_JOBS}?${params.toString()}`);
    };

    return (
        <section className="relative isolate z-30 flex min-h-[105vh] items-center overflow-visible border-b border-slate-200 bg-background px-4 pb-24 pt-28 transition-colors dark:border-slate-800 sm:px-6 sm:pb-28 sm:pt-32 md:min-h-[108vh] md:pb-32 md:pt-36">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero-bg.jpg"
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
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center text-center"
            >
                {/* Badge */}
                <motion.div
                    variants={fadeUp}
                    className="group relative mb-7 inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-primary-200/80 bg-white/75 px-3 py-2 shadow-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:scale-[1.015] hover:border-primary-300 hover:shadow-[0_12px_35px_rgb(37_99_235/0.16)] dark:border-primary-800/70 dark:bg-slate-900/70 dark:hover:border-primary-600/70 dark:hover:shadow-[0_12px_35px_rgb(37_99_235/0.18)]"
                >
                    {/* Soft glow */}
                    <motion.div
                        animate={{
                            opacity: [0.15, 0.35, 0.15],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-r from-primary-500/0 via-primary-500/8 to-primary-500/0"
                    />

                    {/* Icon */}
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                        <motion.span
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeOut',
                            }}
                            className="absolute inset-0 rounded-full bg-primary-500/30"
                        />

                        <motion.span
                            animate={{
                                scale: [1, 1.08, 1],
                                boxShadow: [
                                    '0 4px 12px rgb(37 99 235 / 0.25)',
                                    '0 6px 18px rgb(37 99 235 / 0.4)',
                                    '0 4px 12px rgb(37 99 235 / 0.25)',
                                ],
                            }}
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="relative flex h-7 w-7 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 text-white dark:from-primary-400 dark:to-primary-600"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                        </motion.span>
                    </div>

                    {/* Content */}
                    <div className="relative flex flex-col items-start pr-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-primary-500 dark:text-primary-400">
                                AI Recruiting
                            </span>

                            <span className="h-1 w-1 rounded-full bg-primary-400" />

                            <motion.span
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                }}
                                className="text-[9px] font-bold uppercase tracking-wider text-success-600 dark:text-success-500"
                            >
                                Live
                            </motion.span>
                        </div>

                        <motion.span
                            animate={{ opacity: [0.82, 1, 0.82] }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="text-xs font-black tracking-tight text-slate-700 dark:text-slate-100 sm:text-[13px]"
                        >
                            {t('landing.hero.badge', undefined, 'Nền tảng Tuyển dụng AI thế hệ mới')}
                        </motion.span>
                    </div>

                    {/* Shine chạy hết badge */}
                    <motion.div
                        animate={{
                            x: ['-180%', '380%'],
                        }}
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            repeatDelay: 2,
                            ease: 'easeInOut',
                        }}
                        className="pointer-events-none absolute inset-y-0 left-0 w-16 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/70 to-transparent dark:via-primary-300/15"
                    />

                    {/* Decorative dots */}
                    <motion.div
                        animate={{
                            y: [0, -3, 0],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.3,
                        }}
                        className="absolute right-2 top-1 h-1 w-1 rounded-full bg-primary-400"
                    />

                    <motion.div
                        animate={{
                            y: [0, 3, 0],
                            opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            delay: 0.8,
                        }}
                        className="absolute bottom-1 right-8 h-1 w-1 rounded-full bg-primary-300"
                    />
                </motion.div>

                {/* Heading */}
                <motion.h1
                    variants={fadeUp}
                    className="max-w-5xl text-4xl font-black leading-[1.15] tracking-tight text-text dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
                >
                    {t('landing.hero.heading_prefix', undefined, 'Khám phá cơ hội cho')} <br className="hidden sm:block" />
                    <span className="text-primary-600 dark:text-primary-400">
                        <Typewriter words={heroWords} />
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    variants={fadeUp}
                    className="mt-5 max-w-xl text-sm font-medium leading-6 text-text-muted dark:text-slate-400 sm:text-base"
                >
                    {t('landing.hero.subtitle', undefined, 'AI giúp kết nối đúng ứng viên với đúng công việc, giảm thao tác thủ công và rút ngắn thời gian tuyển dụng.')}
                </motion.p>

                {/* Search */}
                <motion.div
                    variants={fadeUp}
                    className="relative mt-8 w-full max-w-5xl"
                >
                    <div className="rounded-[1.75rem] border border-slate-200 bg-surface/90 p-2 shadow-card backdrop-blur-xl dark:border-slate-800 dark:bg-surface/80 md:rounded-full">
                        <div className="flex flex-col md:flex-row md:items-center">
                            {/* Keyword */}
                            <div className="flex min-w-0 flex-[1.35] items-center px-4 py-2.5 md:px-5">
                                <Search className="h-5 w-5 shrink-0 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={t('landing.hero.keyword_placeholder', undefined, 'Từ khóa, công ty...')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full border-none bg-transparent px-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                                />
                            </div>

                            <div className="mx-4 hidden h-7 w-px bg-slate-200 dark:bg-slate-800 md:block" />

                            {/* Industry */}
                            <div className="flex min-w-0 flex-1 items-center border-t border-slate-100 px-4 py-2 dark:border-slate-800 md:border-t-0 md:px-5">
                                <Briefcase className="h-5 w-5 shrink-0 text-slate-400" />
                                <div className="w-full text-left">
                                    <Select
                                        instanceId="hero-industry-select"
                                        options={[
                                            {
                                                value: '',
                                                label: t('landing.hero.all_industries', undefined, 'Tất cả Ngành'),
                                            },
                                            ...GROUPED_INDUSTRIES,
                                        ]}
                                        value={
                                            INDUSTRIES.find(
                                                (i) => i.value === filters.industry,
                                            ) || {
                                                value: '',
                                                label: t('landing.hero.all_industries', undefined, 'Tất cả Ngành'),
                                            }
                                        }
                                        onChange={(selected: any) =>
                                            setFilters({
                                                ...filters,
                                                industry: selected?.value || '',
                                                skills: [],
                                            })
                                        }
                                        placeholder={t('landing.hero.industry_placeholder', undefined, 'Tất cả Ngành...')}
                                        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                                        menuPosition="fixed"
                                        styles={{
                                            ...heroSelectStyles(isDark),
                                            menu: (base: any) => ({
                                                ...heroSelectStyles(isDark).menu(base),
                                                width: '320px',
                                                minWidth: '320px',
                                            }),
                                            menuPortal: (base: any) => ({
                                                ...base,
                                                zIndex: 99999,
                                            }),
                                        }}
                                        isSearchable
                                    />
                                </div>
                            </div>

                            <div className="mx-4 hidden h-7 w-px bg-slate-200 dark:bg-slate-800 md:block" />

                            {/* Location */}
                            <div
                                ref={popoverRef}
                                className="relative flex min-w-0 flex-1 items-center border-t border-slate-100 px-4 py-2 dark:border-slate-800 md:border-t-0 md:px-5"
                            >
                                <MapPin className="h-5 w-5 shrink-0 text-slate-400" />

                                <button
                                    type="button"
                                    onClick={() => setShowLocationPopover(!showLocationPopover)}
                                    className="flex w-full items-center justify-between px-3 py-2 text-left"
                                >
                                    <span
                                        className={`text-sm font-medium ${selectedLocCount > 0
                                            ? 'text-slate-800 dark:text-white'
                                            : 'text-slate-400'
                                            }`}
                                    >
                                        {selectedLocCount > 0
                                            ? t('landing.hero.selected_locations', { count: selectedLocCount }, `Đã chọn ${selectedLocCount} khu vực`)
                                            : t('landing.hero.location_label', undefined, 'Địa điểm')}
                                    </span>

                                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                                </button>

                                {showLocationPopover && (
                                    <div className="absolute left-0 top-[calc(100%+10px)] z-99999 flex w-full min-w-87.5 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-surface text-left shadow-dropdown dark:border-slate-800 dark:bg-surface md:w-87.5">
                                        {/* Tabs */}
                                        <div className="flex border-b border-slate-200 dark:border-slate-800">
                                            <button
                                                type="button"
                                                className={`flex-1 py-3 text-sm font-bold transition-colors ${mainTab === 'domestic'
                                                    ? 'border-b-2 border-primary-600 bg-primary-50/50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
                                                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                                                    }`}
                                                onClick={() => setMainTab('domestic')}
                                            >
                                                {t('jobs.location_popover.domestic', undefined, 'Trong nước')}
                                            </button>

                                            <button
                                                type="button"
                                                className={`flex-1 py-3 text-sm font-bold transition-colors ${mainTab === 'foreign'
                                                    ? 'border-b-2 border-primary-600 bg-primary-50/50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
                                                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                                                    }`}
                                                onClick={() => setMainTab('foreign')}
                                            >
                                                {t('jobs.location_popover.foreign', undefined, 'Nước ngoài')}
                                            </button>
                                        </div>

                                        {/* Domestic */}
                                        {mainTab === 'domestic' && (
                                            <div className="flex h-95 flex-col p-3">
                                                <div className="mb-3 flex shrink-0 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                                                    <button
                                                        type="button"
                                                        className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${domesticVersion === 'new'
                                                            ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white'
                                                            : 'text-slate-500 dark:text-slate-400'
                                                            }`}
                                                        onClick={() => {
                                                            setDomesticVersion('new');
                                                            setExpandedProvince(null);
                                                            setSubLocations([]);
                                                        }}
                                                    >
                                                        {t('jobs.location_popover.domestic_new', undefined, 'Mới (Tỉnh → Xã)')}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${domesticVersion === 'old'
                                                            ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white'
                                                            : 'text-slate-500 dark:text-slate-400'
                                                            }`}
                                                        onClick={() => {
                                                            setDomesticVersion('old');
                                                            setExpandedProvince(null);
                                                            setSubLocations([]);
                                                        }}
                                                    >
                                                        {t('jobs.location_popover.domestic_old', undefined, 'Cũ (Tỉnh → Huyện)')}
                                                    </button>
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder={t('landing.hero.search_province_placeholder', undefined, 'Tìm nhanh Tỉnh/Thành phố...')}
                                                    value={locationSearchKeyword}
                                                    onChange={(e) => setLocationSearchKeyword(e.target.value)}
                                                    className="mb-3 w-full shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                />

                                                <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-2">
                                                    {displayedProvinces.map((prov: any) => (
                                                        <div
                                                            key={prov.code}
                                                            className="overflow-hidden rounded-xl border border-slate-100 shadow-sm dark:border-slate-800"
                                                        >
                                                            <div className="flex items-center justify-between p-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60">
                                                                <label className="flex flex-1 cursor-pointer items-center gap-3">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                                        checked={filters.provinceCodes?.includes(prov.code)}
                                                                        onChange={() => {
                                                                            const isChecked =
                                                                                filters.provinceCodes?.includes(prov.code);

                                                                            const newCodes = isChecked
                                                                                ? filters.provinceCodes.filter(
                                                                                    (c: string) => c !== prov.code,
                                                                                )
                                                                                : [
                                                                                    ...(filters.provinceCodes || []),
                                                                                    prov.code,
                                                                                ];

                                                                            setFilters({
                                                                                ...filters,
                                                                                provinceCodes: newCodes,
                                                                            });
                                                                        }}
                                                                    />
                                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                                        {prov.name}
                                                                    </span>
                                                                </label>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleExpandProvince(prov.code)}
                                                                    className="rounded-lg bg-slate-100 p-1.5 text-slate-400 transition-colors hover:text-primary-500 dark:bg-slate-800"
                                                                >
                                                                    <ChevronDown
                                                                        className={`h-4 w-4 transition-transform ${expandedProvince === prov.code
                                                                            ? 'rotate-180'
                                                                            : ''
                                                                            }`}
                                                                    />
                                                                </button>
                                                            </div>

                                                            {expandedProvince === prov.code && (
                                                                <div className="max-h-48 space-y-1.5 overflow-y-auto border-t border-slate-100 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900/60">
                                                                    {subLocations.length > 0 ? (
                                                                        subLocations.map((sub) => {
                                                                            const isOld =
                                                                                domesticVersion === 'old';

                                                                            const isChecked = isOld
                                                                                ? filters.districtCodes?.includes(sub.code)
                                                                                : filters.wardCodes?.includes(sub.code);

                                                                            return (
                                                                                <label
                                                                                    key={sub.code}
                                                                                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 pl-8 transition-colors hover:bg-white dark:hover:bg-slate-800"
                                                                                >
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                                                        checked={isChecked}
                                                                                        onChange={() => {
                                                                                            const newProvCodes =
                                                                                                filters.provinceCodes?.filter(
                                                                                                    (c: string) =>
                                                                                                        c !== prov.code,
                                                                                                ) || [];

                                                                                            if (isOld) {
                                                                                                const newCodes = isChecked
                                                                                                    ? filters.districtCodes.filter(
                                                                                                        (c: string) =>
                                                                                                            c !== sub.code,
                                                                                                    )
                                                                                                    : [
                                                                                                        ...(filters.districtCodes || []),
                                                                                                        sub.code,
                                                                                                    ];

                                                                                                setFilters({
                                                                                                    ...filters,
                                                                                                    districtCodes: newCodes,
                                                                                                    provinceCodes: newProvCodes,
                                                                                                });
                                                                                            } else {
                                                                                                const newCodes = isChecked
                                                                                                    ? filters.wardCodes.filter(
                                                                                                        (c: string) =>
                                                                                                            c !== sub.code,
                                                                                                    )
                                                                                                    : [
                                                                                                        ...(filters.wardCodes || []),
                                                                                                        sub.code,
                                                                                                    ];

                                                                                                setFilters({
                                                                                                    ...filters,
                                                                                                    wardCodes: newCodes,
                                                                                                    provinceCodes: newProvCodes,
                                                                                                });
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                                                        {sub.name}
                                                                                    </span>
                                                                                </label>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <div className="py-3 text-center text-xs font-medium text-slate-400">
                                                                            {t('jobs.location_popover.loading_regions', undefined, 'Đang tải...')}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {displayedProvinces.length === 0 && (
                                                        <div className="py-4 text-center text-xs font-medium text-slate-400">
                                                            {t('jobs.location_popover.no_location_found', undefined, 'Không tìm thấy địa điểm')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Foreign */}
                                        {mainTab === 'foreign' && (
                                            <div className="flex h-72 flex-col p-4">
                                                <p className="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    {t('landing.hero.foreign_instruction', undefined, 'Nhập tên quốc gia hoặc khu vực làm việc ở nước ngoài:')}
                                                </p>

                                                <input
                                                    type="text"
                                                    placeholder={t('landing.hero.foreign_placeholder', undefined, 'VD: Nhật Bản, Mỹ, Singapore...')}
                                                    value={foreignInput}
                                                    onChange={(e) => setForeignInput(e.target.value)}
                                                    onKeyDown={(e) =>
                                                        e.key === 'Enter' && handleForeignSubmit()
                                                    }
                                                    className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={handleForeignSubmit}
                                                    className="w-full rounded-xl bg-primary-600 py-2.5 font-bold text-white shadow-md shadow-primary-500/20 transition-colors hover:bg-primary-700"
                                                >
                                                    {t('jobs.location_popover.confirm', undefined, 'Xác nhận')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Search */}
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="mt-1 flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-button-primary-bg px-7 py-3.5 text-sm font-bold text-button-primary-text shadow-md shadow-primary-500/20 transition-all hover:bg-button-primary-hover hover:shadow-lg md:mt-0 md:w-auto md:rounded-full"
                            >
                                <Search className="h-4 w-4" />
                                {t('landing.hero.search_btn', undefined, 'Tìm việc')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}