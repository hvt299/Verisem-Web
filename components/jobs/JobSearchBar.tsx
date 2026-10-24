'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Search, SlidersHorizontal, X, Flame, ChevronDown, Check, Sparkles } from 'lucide-react';
import Select from 'react-select';
import { INDUSTRIES, GROUPED_INDUSTRIES, JOB_LEVELS, EMPLOYMENT_TYPES, WORK_MODES, SALARY_RANGES, EXPERIENCE_RANGES } from '@/constants/job.constants';
import AsyncSelect from 'react-select/async';
import { systemService } from '@/features/system/system.service';
import { useTranslation } from '@/store/useLanguageStore';

export const customSelectStyles = (isDark: boolean) => ({
    control: (base: any, state: any) => ({
        ...base,
        minHeight: '46px',
        borderRadius: '0.85rem',
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        borderColor: state.isFocused
            ? '#2563eb'
            : isDark
                ? '#334155'
                : '#e2e8f0',
        boxShadow: state.isFocused
            ? '0 0 0 2px rgba(37,99,235,.2)'
            : 'none',
        '&:hover': {
            borderColor: '#2563eb'
        }
    }),

    menu: (base: any) => ({
        ...base,
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderRadius: '0.85rem',
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        overflow: 'hidden',
        zIndex: 9999,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    }),

    menuList: (base: any) => ({
        ...base,
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        padding: '6px',
    }),

    option: (base: any, state: any) => ({
        ...base,
        padding: '9px 12px',
        cursor: 'pointer',
        borderRadius: '0.5rem',
        margin: '2px 0',
        backgroundColor: state.isSelected
            ? '#2563eb'
            : state.isFocused
                ? isDark ? '#1e293b' : '#eff6ff'
                : 'transparent',
        color: state.isSelected
            ? 'white'
            : isDark
                ? '#e2e8f0'
                : '#334155',
        fontSize: '13px',
        fontWeight: 600,
    }),

    singleValue: (base: any) => ({
        ...base,
        color: isDark ? '#f8fafc' : '#1e293b',
        fontWeight: 600,
        fontSize: '13px'
    }),

    input: (base: any) => ({
        ...base,
        color: isDark ? '#f8fafc' : '#1e293b',
    }),

    placeholder: (base: any) => ({
        ...base,
        color: '#94a3b8',
        fontWeight: 500,
        fontSize: '13px'
    }),

    noOptionsMessage: (base: any) => ({
        ...base,
        color: isDark ? '#94a3b8' : '#64748b',
    }),

    loadingMessage: (base: any) => ({
        ...base,
        color: isDark ? '#94a3b8' : '#64748b',
    }),

    multiValue: (base: any) => ({
        ...base,
        backgroundColor: isDark ? '#1e3a8a' : '#eff6ff',
        borderRadius: '6px',
        border: `1px solid ${isDark ? '#1d4ed8' : '#bfdbfe'}`,
    }),

    multiValueLabel: (base: any) => ({
        ...base,
        color: isDark ? '#bfdbfe' : '#1d4ed8',
        fontWeight: 600,
        fontSize: '12px'
    }),

    multiValueRemove: (base: any) => ({
        ...base,
        color: isDark ? '#93c5fd' : '#2563eb',
        '&:hover': {
            backgroundColor: isDark ? '#1e40af' : '#dbeafe',
            color: '#dc2626'
        }
    }),
});

// Dynamic chips will be computed inside JobSearchBar

interface JobSearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filters: any;
    onFiltersChange: (filters: any) => void;
    filterOptions: any;
    onClearFilters: () => void;
    activeFiltersCount: number;
    onSavePreset?: (name: string) => void;
    onLoadPreset?: (preset: any) => void;
    savedPresets?: any[];
}

export default function JobSearchBar({
    searchQuery,
    onSearchChange,
    filters,
    onFiltersChange,
    filterOptions,
    onClearFilters,
    activeFiltersCount,
    onSavePreset,
    onLoadPreset,
    savedPresets = []
}: JobSearchBarProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { t } = useTranslation();

    const quickSalaryChips = [
        { value: '', label: t('jobs.chips.salary_all', undefined, 'Tất cả') },
        { value: '0-10000000', label: t('jobs.chips.salary_under_10m', undefined, '< 10 triệu') },
        { value: '10000000-20000000', label: t('jobs.chips.salary_10_20m', undefined, '10 - 20 triệu') },
        { value: '20000000-30000000', label: t('jobs.chips.salary_20_30m', undefined, '20 - 30 triệu') },
        { value: '30000000-50000000', label: t('jobs.chips.salary_over_30m', undefined, '> 30 triệu') },
        { value: 'negotiable', label: t('jobs.chips.salary_negotiable', undefined, 'Thỏa thuận') },
    ];

    const quickWorkModes = [
        { value: '', label: t('jobs.chips.work_mode_all', undefined, 'Tất cả') },
        { value: 'Office', label: t('jobs.chips.work_mode_office', undefined, 'Văn phòng') },
        { value: 'Hybrid', label: t('jobs.chips.work_mode_hybrid', undefined, 'Hybrid') },
        { value: 'Remote', label: t('jobs.chips.work_mode_remote', undefined, 'Từ xa') },
    ];

    const quickJobLevels = [
        { value: '', label: t('jobs.chips.level_all', undefined, 'Tất cả') },
        { value: 'Intern', label: 'Intern' },
        { value: 'Fresher', label: 'Fresher' },
        { value: 'Junior', label: 'Junior' },
        { value: 'Middle', label: 'Middle' },
        { value: 'Senior', label: 'Senior' },
        { value: 'Lead', label: 'Lead' },
        { value: 'Manager', label: 'Manager' },
    ];

    const quickExperiences = [
        { value: '', label: t('jobs.chips.exp_all', undefined, 'Tất cả') },
        { value: 'none', label: t('jobs.chips.exp_none', undefined, 'Không Y/C') },
        { value: '1-2', label: t('jobs.chips.exp_1_2', undefined, '1 - 2 năm') },
        { value: '3-5', label: t('jobs.chips.exp_3_5', undefined, '3 - 5 năm') },
        { value: '5-7', label: t('jobs.chips.exp_over_5', undefined, '> 5 năm') },
    ];

    const [showFilters, setShowFilters] = useState(false);
    const [showPresets, setShowPresets] = useState(false);
    const [presetName, setPresetName] = useState('');

    const [showLocationPopover, setShowLocationPopover] = useState(false);
    const [mainTab, setMainTab] = useState<'domestic' | 'foreign'>('domestic');
    const [domesticVersion, setDomesticVersion] = useState<'new' | 'old'>('new');
    const [foreignInput, setForeignInput] = useState(filters.foreignLocation || '');
    const [locationSearchKeyword, setLocationSearchKeyword] = useState('');
    const popoverRef = useRef<HTMLDivElement>(null);

    const [expandedProvince, setExpandedProvince] = useState<string | null>(null);
    const [subLocations, setSubLocations] = useState<any[]>([]);

    const locations = filterOptions?.locations || [];
    const activeProvinces = locations.filter((l: any) => l.version === domesticVersion);
    const displayedProvinces = activeProvinces.filter((l: any) =>
        l.name?.toLowerCase().includes(locationSearchKeyword.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setShowLocationPopover(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExpandProvince = async (provCode: string) => {
        if (expandedProvince === provCode) {
            setExpandedProvince(null);
            setSubLocations([]);
        } else {
            setExpandedProvince(provCode);
            const subs = await systemService.getSubLocations(provCode);
            setSubLocations(subs.filter((s: any) => s.version === domesticVersion));
        }
    };

    const handleForeignSubmit = () => {
        if (foreignInput.trim()) {
            onFiltersChange({ ...filters, foreignLocation: foreignInput.trim() });
            setShowLocationPopover(false);
        } else {
            onFiltersChange({ ...filters, foreignLocation: '' });
        }
    };

    const selectedLocCount =
        (filters.provinceCodes?.length || 0) +
        (filters.districtCodes?.length || 0) +
        (filters.wardCodes?.length || 0) +
        (filters.foreignLocation ? 1 : 0);

    const loadSkillOptions = async (inputValue: string) => {
        if (!inputValue) return [];
        try {
            const skills = await systemService.searchSkills(inputValue, filters.industry);
            return skills.map((s: any) => ({
                value: s.canonical_name,
                label: `${s.canonical_name} ${s.industry ? `(${s.industry})` : ''}`
            }));
        } catch (error) {
            return [];
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm transition-all hover:shadow-md">
            {/* 1. Thanh Tìm kiếm Chính */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                    type="text"
                    placeholder={t('jobs.search_placeholder') || "Tìm theo chức danh, kỹ năng, công ty..."}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 border border-slate-200 dark:border-slate-700/80 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                        aria-label={t('common.actions.clear_keyword', undefined, 'Xóa từ khóa')}
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* 2. Thanh Tác vụ Nhanh: Segmented selector 3 trạng thái + Nút Bộ lọc chuyên sâu */}
            <div className="mt-3.5 grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                <button
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, jobType: 'all', isHot: false })}
                    className={`py-2 text-center text-xs font-bold rounded-lg transition-all ${
                        (!filters.jobType || filters.jobType === 'all') && !filters.isHot
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    {t('jobs.filters.job_type_all') || 'Tất cả việc'}
                </button>
                <button
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, jobType: 'hot', isHot: true })}
                    className={`inline-flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        filters.jobType === 'hot' || filters.isHot === true
                            ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xs font-black'
                            : 'text-orange-600 dark:text-orange-400 hover:text-orange-700'
                    }`}
                >
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{t('jobs.filters.job_type_hot') || 'Việc HOT'}</span>
                </button>
                <button
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, jobType: 'normal', isHot: false })}
                    className={`py-2 text-center text-xs font-bold rounded-lg transition-all ${
                        filters.jobType === 'normal'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-black'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    {t('jobs.filters.job_type_normal') || 'Việc thường'}
                </button>
            </div>

            {/* Toggle Mở/Đóng Bộ Lọc Chuyên Sâu */}
            <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`mt-2.5 w-full inline-flex items-center justify-between h-10 px-3.5 rounded-xl text-xs font-bold transition-colors border select-none ${
                    showFilters
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
                <span className="flex items-center gap-1.5 truncate">
                    <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t('jobs.filters.filter_button') || 'Bộ lọc chi tiết'}</span>
                </span>
                <div className="flex items-center gap-1 shrink-0">
                    {activeFiltersCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black leading-none">
                            {activeFiltersCount}
                        </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {/* Sub-bar: Nút Xóa bộ lọc (loại bỏ hoàn toàn text thừa) */}
            {activeFiltersCount > 0 && (
                <div className="mt-2.5 flex items-center justify-end px-1 text-xs">
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        <span>{t('jobs.filters.clear_all') || 'Xóa bộ lọc'} ({activeFiltersCount})</span>
                    </button>
                </div>
            )}

            {/* 3. Danh sách Bộ Lọc Chi Tiết (Hiển thị đa dạng input: Chips/Pills, Select, Range) */}
            {showFilters && (
                <div className="flex flex-col gap-5 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-3">

                    {/* MỨC LƯƠNG - DẠNG CHIPS CHỌN NHANH */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            {t('jobs.filters.salary') || 'Mức lương'}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {quickSalaryChips.map((chip) => {
                                const isSelected = (filters.salaryRange || '') === chip.value;
                                return (
                                    <button
                                        key={chip.value}
                                        type="button"
                                        onClick={() => onFiltersChange({ ...filters, salaryRange: chip.value })}
                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                            isSelected
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600'
                                        }`}
                                    >
                                        {chip.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* HÌNH THỨC LÀM VIỆC - DẠNG SEGMENTED PILLS */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            {t('jobs.filters.work_mode') || 'Hình thức làm việc'}
                        </label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                            {quickWorkModes.map((mode) => {
                                const isSelected = (filters.workMode || '') === mode.value;
                                return (
                                    <button
                                        key={mode.value}
                                        type="button"
                                        onClick={() => onFiltersChange({ ...filters, workMode: mode.value })}
                                        className={`py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                                            isSelected
                                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        {mode.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* CẤP BẬC CÔNG VIỆC - DẠNG CHIPS */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            {t('jobs.filters.level') || 'Cấp bậc'}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {quickJobLevels.map((lvl) => {
                                const isSelected = (filters.jobLevel || '') === lvl.value;
                                return (
                                    <button
                                        key={lvl.value}
                                        type="button"
                                        onClick={() => onFiltersChange({ ...filters, jobLevel: lvl.value })}
                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                            isSelected
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600'
                                        }`}
                                    >
                                        {lvl.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* KINH NGHIỆM - DẠNG CHIPS */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            {t('jobs.filters.experience') || 'Kinh nghiệm'}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {quickExperiences.map((exp) => {
                                const isSelected = (filters.experienceRange || '') === exp.value;
                                return (
                                    <button
                                        key={exp.value}
                                        type="button"
                                        onClick={() => onFiltersChange({ ...filters, experienceRange: exp.value })}
                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                            isSelected
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600'
                                        }`}
                                    >
                                        {exp.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* NGÀNH NGHỀ (SEARCHABLE SELECT CHUYÊN NGÀNH) */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            {t('jobs.filters.industry') || 'Ngành nghề'}
                        </label>
                        <Select
                            options={[{ value: '', label: t('jobs.all_industries', undefined, 'Tất cả Ngành nghề') }, ...GROUPED_INDUSTRIES]}
                            value={INDUSTRIES.find(i => i.value === filters.industry) || { value: '', label: t('jobs.all_industries', undefined, 'Tất cả Ngành nghề') }}
                            onChange={(selected: any) => onFiltersChange({ ...filters, industry: selected?.value || '', skills: [] })}
                            styles={customSelectStyles(isDark)}
                            isSearchable={true}
                            placeholder={t('jobs.select_industry', undefined, 'Chọn ngành nghề...')}
                        />
                    </div>

                    {/* CÔNG TY */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            {t('companies.title') || 'Doanh nghiệp'}
                        </label>
                        <Select
                            options={[{ value: '', label: t('jobs.all_companies', undefined, 'Tất cả Doanh nghiệp') }, ...(filterOptions?.companies?.map((c: string) => ({ value: c, label: c })) || [])]}
                            value={filters.company ? { value: filters.company, label: filters.company } : { value: '', label: t('jobs.all_companies', undefined, 'Tất cả Doanh nghiệp') }}
                            onChange={(selected: any) => onFiltersChange({ ...filters, company: selected?.value || '' })}
                            styles={customSelectStyles(isDark)}
                            isSearchable={true}
                            placeholder={t('jobs.select_company', undefined, 'Chọn doanh nghiệp...')}
                        />
                    </div>

                    {/* ĐỊA ĐIỂM (CUSTOM POPOVER MULTI-SELECT) */}
                    <div className="w-full relative" ref={popoverRef}>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            {t('jobs.filters.location') || 'Khu vực & Địa điểm'}
                        </label>
                        <div
                            className="w-full min-h-11 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 cursor-pointer flex items-center justify-between hover:border-blue-500 transition-colors"
                            onClick={() => setShowLocationPopover(!showLocationPopover)}
                        >
                            <span className={`text-xs font-semibold ${selectedLocCount > 0 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}`}>
                                {selectedLocCount > 0 ? t('jobs.location_popover.selected_count', { count: selectedLocCount }, `Đã chọn ${selectedLocCount} khu vực`) : t('jobs.location_popover.select_location_placeholder', undefined, 'Chọn tỉnh thành / địa điểm...')}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>

                        {showLocationPopover && (
                            <div className="absolute top-[110%] left-0 w-full min-w-[320px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl z-50 overflow-hidden text-left flex flex-col">
                                <div className="flex border-b border-slate-200 dark:border-slate-700">
                                    <button
                                        type="button"
                                        className={`flex-1 py-2.5 text-xs font-bold transition-colors ${mainTab === 'domestic' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                        onClick={() => setMainTab('domestic')}
                                    >
                                        {t('jobs.location_popover.domestic', undefined, 'Trong nước')}
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex-1 py-2.5 text-xs font-bold transition-colors ${mainTab === 'foreign' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                        onClick={() => setMainTab('foreign')}
                                    >
                                        {t('jobs.location_popover.foreign', undefined, 'Nước ngoài')}
                                    </button>
                                </div>

                                {mainTab === 'domestic' && (
                                    <div className="p-3 flex flex-col h-80">
                                        <div className="flex mb-2.5 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl shrink-0">
                                            <button
                                                type="button"
                                                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${domesticVersion === 'new' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-xs' : 'text-slate-500'}`}
                                                onClick={() => { setDomesticVersion('new'); setExpandedProvince(null); }}
                                            >
                                                {t('jobs.location_popover.domestic_new', undefined, 'Mới (Tỉnh → Xã)')}
                                            </button>
                                            <button
                                                type="button"
                                                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${domesticVersion === 'old' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-xs' : 'text-slate-500'}`}
                                                onClick={() => { setDomesticVersion('old'); setExpandedProvince(null); }}
                                            >
                                                {t('jobs.location_popover.domestic_old', undefined, 'Cũ (Tỉnh → Huyện)')}
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            placeholder={t('jobs.location_popover.search_province_placeholder', undefined, 'Tìm nhanh Tỉnh/Thành phố...')}
                                            value={locationSearchKeyword}
                                            onChange={(e) => setLocationSearchKeyword(e.target.value)}
                                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs mb-2 outline-none focus:border-blue-500 dark:text-white placeholder:text-slate-400 font-medium shrink-0"
                                        />

                                        <div className="overflow-y-auto flex-1 custom-scrollbar pr-2 space-y-1.5">
                                            {displayedProvinces.map((prov: any) => (
                                                <div key={prov.code} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                                                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                                                            <input
                                                                type="checkbox"
                                                                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                checked={filters.provinceCodes?.includes(prov.code)}
                                                                onChange={() => {
                                                                    const isChecked = filters.provinceCodes?.includes(prov.code);
                                                                    const newCodes = isChecked
                                                                        ? filters.provinceCodes.filter((c: string) => c !== prov.code)
                                                                        : [...(filters.provinceCodes || []), prov.code];
                                                                    onFiltersChange({ ...filters, provinceCodes: newCodes });
                                                                }}
                                                            />
                                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{prov.name}</span>
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleExpandProvince(prov.code)}
                                                            className="p-1 text-slate-400 hover:text-blue-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
                                                        >
                                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedProvince === prov.code ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </div>

                                                    {expandedProvince === prov.code && (
                                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-2 space-y-1 border-t border-slate-100 dark:border-slate-800 max-h-40 overflow-y-auto custom-scrollbar">
                                                            {subLocations.length > 0 ? (
                                                                subLocations.map((sub: any) => {
                                                                    const isOld = domesticVersion === 'old';
                                                                    const isChecked = isOld
                                                                        ? filters.districtCodes?.includes(sub.code)
                                                                        : filters.wardCodes?.includes(sub.code);
                                                                    return (
                                                                        <label key={sub.code} className="flex items-center gap-2 p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors pl-6">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                                checked={isChecked}
                                                                                onChange={() => {
                                                                                    const newProvCodes = filters.provinceCodes?.filter((c: string) => c !== prov.code) || [];
                                                                                    if (isOld) {
                                                                                        const newCodes = isChecked
                                                                                            ? filters.districtCodes.filter((c: string) => c !== sub.code)
                                                                                            : [...(filters.districtCodes || []), sub.code];
                                                                                        onFiltersChange({ ...filters, districtCodes: newCodes, provinceCodes: newProvCodes });
                                                                                    } else {
                                                                                        const newCodes = isChecked
                                                                                            ? filters.wardCodes.filter((c: string) => c !== sub.code)
                                                                                            : [...(filters.wardCodes || []), sub.code];
                                                                                        onFiltersChange({ ...filters, wardCodes: newCodes, provinceCodes: newProvCodes });
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{sub.name}</span>
                                                                        </label>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className="text-center text-xs text-slate-400 py-2 font-medium">{t('jobs.location_popover.loading_regions', undefined, 'Đang tải khu vực...')}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {displayedProvinces.length === 0 && (
                                                <div className="text-center text-slate-400 text-xs py-3 font-medium">{t('jobs.location_popover.no_location_found', undefined, 'Không tìm thấy địa điểm')}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {mainTab === 'foreign' && (
                                    <div className="p-3.5 flex flex-col h-60">
                                        <p className="text-xs text-slate-500 font-medium mb-2.5">{t('jobs.location_popover.foreign_label', undefined, 'Quốc gia / khu vực nước ngoài:')}</p>
                                        <input
                                            type="text"
                                            placeholder={t('jobs.location_popover.foreign_placeholder', undefined, 'VD: Nhật Bản, Singapore, Mỹ...')}
                                            value={foreignInput}
                                            onChange={(e) => setForeignInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleForeignSubmit()}
                                            className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs mb-3"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleForeignSubmit}
                                            className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-xs"
                                        >
                                            {t('jobs.location_popover.confirm', undefined, 'Xác nhận')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* KỸ NĂNG CHUYÊN MÔN VỚI AUTO-COMPLETE AI */}
                    <div className="w-full pt-2">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            {t('jobs.skills_input.label', undefined, 'Kỹ năng chuyên môn')}
                        </label>
                        <AsyncSelect
                            isMulti
                            cacheOptions
                            defaultOptions={false}
                            loadOptions={loadSkillOptions}
                            styles={customSelectStyles(isDark)}
                            className="text-slate-900 dark:text-white text-xs"
                            placeholder={t('jobs.skills_input.placeholder', undefined, 'Gõ kỹ năng (React, Python, AWS...)')}
                            noOptionsMessage={({ inputValue }) => inputValue ? t('jobs.skills_input.not_found', undefined, 'Không tìm thấy kỹ năng') : t('jobs.skills_input.type_keyword', undefined, 'Gõ từ khóa...')}
                            value={(filters.skills || []).map((s: string) => ({ value: s, label: s }))}
                            onChange={(selectedItems: any) => {
                                const newSkills = selectedItems ? selectedItems.map((item: any) => item.value) : [];
                                onFiltersChange({ ...filters, skills: newSkills });
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
