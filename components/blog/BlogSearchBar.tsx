'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import Select from 'react-select';
import { Search, SlidersHorizontal, X, ArrowUpDown, Clock, Tag, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { BlogCategory, BLOG_CATEGORY_LABELS } from '@/features/blog/blog.service';
import { useTranslation } from '@/store/useLanguageStore';

export type BlogSortOption = 'latest' | 'popular' | 'reading_time_asc' | 'reading_time_desc';
export type ReadingTimeFilter = 'all' | 'under_5' | '5_to_10' | 'over_10';

export interface BlogFilterState {
    category: BlogCategory | 'all';
    tag: string;
    readingTime: ReadingTimeFilter;
    sortBy: BlogSortOption;
}

interface BlogSearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filters: BlogFilterState;
    onFiltersChange: (newFilters: BlogFilterState) => void;
    onResetFilters: () => void;
    activeFiltersCount: number;
    popularTags: string[];
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

const heroSelectStyles = (isDark = false) => ({
    control: (base: any) => ({
        ...base,
        border: 'none',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        minHeight: '42px',
    }),
    valueContainer: (base: any) => ({
        ...base,
        padding: '0 4px',
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
            !state.data || state.data.value === 'all'
                ? '#94a3b8'
                : isDark
                ? '#f8fafc'
                : '#1e293b',
        fontSize: '14px',
        fontWeight: 700,
    }),
    placeholder: (base: any) => ({
        ...base,
        color: '#94a3b8',
        fontSize: '14px',
        fontWeight: 600,
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        color: '#94a3b8',
        padding: '0 4px',
        '&:hover': {
            color: '#2563eb',
        },
    }),
    menu: (base: any) => ({
        ...base,
        zIndex: 99999,
        borderRadius: '1rem',
        overflow: 'hidden',
        padding: '6px',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        boxShadow: isDark
            ? '0 20px 40px rgba(0,0,0,.5)'
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
            ? '#ffffff'
            : isDark
            ? '#e2e8f0'
            : '#1e293b',
        fontSize: '13px',
        fontWeight: 700,
        cursor: 'pointer',
        borderRadius: '0.65rem',
        margin: '2px 0',
        padding: '9px 12px',
        transition: 'all 0.15s ease',
    }),
});

export default function BlogSearchBar({
    searchQuery,
    onSearchChange,
    filters,
    onFiltersChange,
    onResetFilters,
    activeFiltersCount,
    popularTags,
    viewMode,
    onViewModeChange,
}: BlogSearchBarProps) {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';
    const [showFilters, setShowFilters] = useState(false);

    const categoryOptions = [
        { value: 'all', label: t('public_pages.blog.search.all_categories', undefined, 'Tất cả chủ đề') },
        ...(Object.entries(BLOG_CATEGORY_LABELS) as [BlogCategory, string][]).map(([value, label]) => ({
            value,
            label,
        })),
    ];

    const sortOptions: { value: BlogSortOption; label: string }[] = [
        { value: 'latest', label: t('public_pages.blog.search.sort_latest', undefined, 'Mới nhất') },
        { value: 'popular', label: t('public_pages.blog.search.sort_popular', undefined, 'Đọc nhiều nhất') },
        { value: 'reading_time_asc', label: t('public_pages.blog.search.sort_time_asc', undefined, 'Thời lượng: Ngắn trước') },
        { value: 'reading_time_desc', label: t('public_pages.blog.search.sort_time_desc', undefined, 'Thời lượng: Dài trước') },
    ];

    const readingTimeOptions: { value: ReadingTimeFilter; label: string }[] = [
        { value: 'all', label: t('public_pages.blog.search.time_all', undefined, 'Mọi thời lượng') },
        { value: 'under_5', label: t('public_pages.blog.search.time_under_5', undefined, '< 5 phút') },
        { value: '5_to_10', label: t('public_pages.blog.search.time_5_10', undefined, '5 - 10 phút') },
        { value: 'over_10', label: t('public_pages.blog.search.time_over_10', undefined, '> 10 phút') },
    ];

    const currentCategoryOption =
        categoryOptions.find((opt) => opt.value === filters.category) || categoryOptions[0];

    return (
        <div className="w-full max-w-5xl mx-auto space-y-4 font-sans text-left">
            {/* 1. Thanh tìm kiếm chính phong cách Capsule (Chuẩn HeroSection trang chủ) */}
            <div className="rounded-[1.75rem] md:rounded-full border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 p-2 shadow-card backdrop-blur-xl transition-all hover:shadow-xl hover:border-blue-500/40">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
                    {/* Keyword Input */}
                    <div className="flex min-w-0 flex-[1.4] items-center px-4 py-2.5 md:px-5">
                        <Search className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder={t('public_pages.blog.search.placeholder', undefined, 'Tìm kiếm bài viết, chủ đề chuyên môn, kỹ năng, mẹo ATS...')}
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full border-none bg-transparent px-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 dark:text-white outline-none focus:outline-hidden"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => onSearchChange('')}
                                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title={t('public_pages.blog.search.clear_keyword', undefined, 'Xóa từ khóa')}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="mx-2 hidden h-7 w-px bg-slate-200 dark:bg-slate-800 md:block" />

                    {/* Dropdown Chủ đề sử dụng React-Select (giống trang chủ HeroSection) */}
                    <div className="flex min-w-0 flex-1 items-center px-3 py-1.5 md:px-4">
                        <Tag className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500 mr-2" />
                        <div className="w-full">
                            <Select
                                instanceId="blog-category-select"
                                options={categoryOptions}
                                value={currentCategoryOption}
                                onChange={(selected: any) =>
                                    onFiltersChange({ ...filters, category: selected?.value || 'all' })
                                }
                                placeholder={t('public_pages.blog.search.select_category', undefined, 'Chọn chủ đề...')}
                                isSearchable={false}
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                                menuPosition="fixed"
                                styles={{
                                    ...heroSelectStyles(isDark),
                                    menu: (base: any) => ({
                                        ...heroSelectStyles(isDark).menu(base),
                                        width: '240px',
                                        minWidth: '240px',
                                    }),
                                    menuPortal: (base: any) => ({
                                        ...base,
                                        zIndex: 99999,
                                    }),
                                }}
                            />
                        </div>
                    </div>

                    {/* Action Buttons: Filter Toggle & View Mode */}
                    <div className="flex items-center gap-2 px-2 pb-1 md:pb-0">
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                                showFilters || activeFiltersCount > 0
                                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 shadow-2xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                            }`}
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>{t('public_pages.blog.search.filters_btn', undefined, 'Bộ lọc')}</span>
                            {activeFiltersCount > 0 && (
                                <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-black">
                                    {activeFiltersCount}
                                </span>
                            )}
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {/* View Mode Toggle: Grid vs List (tham khảo Jobs & Companies) */}
                        <div className="hidden sm:flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-800/80 p-0.5">
                            <button
                                type="button"
                                onClick={() => onViewModeChange('grid')}
                                className={`p-2 rounded-full transition-all cursor-pointer ${
                                    viewMode === 'grid'
                                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                                title={t('public_pages.blog.search.view_grid', undefined, 'Xem dạng lưới')}
                                aria-label="Xem dạng lưới"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onViewModeChange('list')}
                                className={`p-2 rounded-full transition-all cursor-pointer ${
                                    viewMode === 'list'
                                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                                title={t('public_pages.blog.search.view_list', undefined, 'Xem dạng danh sách')}
                                aria-label="Xem dạng danh sách"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Khối Bộ Lọc Mở Rộng Chi Tiết (tham khảo trang jobs & companies) */}
            {showFilters && (
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-300 space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('public_pages.blog.search.deep_filters', undefined, 'Bộ lọc chuyên sâu')}</h3>
                            {activeFiltersCount > 0 && (
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {t('public_pages.blog.search.applying_count', { count: activeFiltersCount }, `(Đang áp dụng ${activeFiltersCount} tiêu chí)`)}
                                </span>
                            )}
                        </div>

                        {activeFiltersCount > 0 && (
                            <button
                                type="button"
                                onClick={onResetFilters}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                                <span>{t('public_pages.blog.search.clear_all', undefined, 'Xóa tất cả')}</span>
                            </button>
                        )}
                    </div>

                    {/* Danh mục (Categories dạng Chips nhanh) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                            {t('public_pages.blog.search.category_title', undefined, 'Chủ đề danh mục')}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categoryOptions.map((c) => {
                                const isSelected = filters.category === c.value;
                                return (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => onFiltersChange({ ...filters, category: c.value as any })}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                            isSelected
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                                        }`}
                                    >
                                        {c.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tags / Chủ đề phổ biến */}
                    {popularTags.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-2.5">
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                    {t('public_pages.blog.search.trending_tags', undefined, 'Từ khóa thịnh hành')}
                                </label>
                                {filters.tag && (
                                    <button
                                        type="button"
                                        onClick={() => onFiltersChange({ ...filters, tag: '' })}
                                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                    >
                                        {t('public_pages.blog.search.all_tags', undefined, 'Tất cả từ khóa')}
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {popularTags.map((t) => {
                                    const isSelected = filters.tag === t;
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => onFiltersChange({ ...filters, tag: isSelected ? '' : t })}
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                                isSelected
                                                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 shadow-2xs'
                                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/80 hover:text-blue-600 hover:border-blue-300'
                                            }`}
                                        >
                                            <span>#{t}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Sắp xếp & Thời gian đọc */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Thời lượng đọc */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {t('public_pages.blog.search.reading_time', undefined, 'Thời lượng đọc')}
                                </span>
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {readingTimeOptions.map((opt) => {
                                    const isSelected = filters.readingTime === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => onFiltersChange({ ...filters, readingTime: opt.value })}
                                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sắp xếp theo */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                                <span className="inline-flex items-center gap-1.5">
                                    <ArrowUpDown className="w-3.5 h-3.5" />
                                    {t('public_pages.blog.search.sort_by', undefined, 'Sắp xếp theo')}
                                </span>
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {sortOptions.map((opt) => {
                                    const isSelected = filters.sortBy === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => onFiltersChange({ ...filters, sortBy: opt.value })}
                                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
