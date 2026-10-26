'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { BookOpen, Loader2, ChevronLeft, ChevronRight, Sparkles, Flame, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import BlogSearchBar, { BlogFilterState } from '@/components/blog/BlogSearchBar';
import BlogCard from '@/components/blog/BlogCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/store/useLanguageStore';
import { ROUTES } from '@/constants/routes';
import {
    blogService,
    BlogPost,
    BlogCategory,
    BLOG_CATEGORY_LABELS,
    getBlogCategoryStyle,
    getBlogExcerpt,
    formatBlogDate,
    getSmartBlogTags,
    getSmartBlogAuthor,
} from '@/features/blog/blog.service';

const POSTS_PER_PAGE = 9;

export default function BlogPage() {
    const { isAuthenticated, user } = useAuthStore();
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<BlogFilterState>({
        category: 'all',
        tag: '',
        readingTime: 'all',
        sortBy: 'latest',
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const listTopRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setPosts(await blogService.getPublicBlogs());
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Danh sách các tags phổ biến tổng hợp từ các bài viết
    const popularTags = useMemo(() => {
        const allTags: string[] = [];
        posts.forEach((p) => {
            const tags = getSmartBlogTags(p);
            allTags.push(...tags);
        });
        const counts: Record<string, number> = {};
        allTags.forEach((t) => {
            counts[t] = (counts[t] || 0) + 1;
        });
        return Object.keys(counts)
            .sort((a, b) => counts[b] - counts[a])
            .slice(0, 8);
    }, [posts]);

    // Số lượng bộ lọc đang được kích hoạt
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.category !== 'all') count++;
        if (filters.tag) count++;
        if (filters.readingTime !== 'all') count++;
        if (filters.sortBy !== 'latest') count++;
        return count;
    }, [filters]);

    // Lọc và sắp xếp dữ liệu bài viết
    const filteredPosts = useMemo(() => {
        let result = [...posts];

        // 1. Lọc theo danh mục
        if (filters.category !== 'all') {
            result = result.filter((post) => post.category === filters.category);
        }

        // 2. Lọc theo Tag
        if (filters.tag) {
            const lowerTag = filters.tag.toLowerCase();
            result = result.filter((post) => {
                const postTags = getSmartBlogTags(post).map((t) => t.toLowerCase());
                return postTags.includes(lowerTag);
            });
        }

        // 3. Lọc theo thời lượng đọc
        if (filters.readingTime !== 'all') {
            result = result.filter((post) => {
                const time = post.reading_time_minutes || 3;
                if (filters.readingTime === 'under_5') return time < 5;
                if (filters.readingTime === '5_to_10') return time >= 5 && time <= 10;
                if (filters.readingTime === 'over_10') return time > 10;
                return true;
            });
        }

        // 4. Lọc theo Từ khóa tìm kiếm
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    getBlogExcerpt(post.content_html, 1000).toLowerCase().includes(query) ||
                    getSmartBlogTags(post).some((t) => t.toLowerCase().includes(query)) ||
                    post.author_name.toLowerCase().includes(query)
            );
        }

        // 5. Sắp xếp
        if (filters.sortBy === 'latest') {
            result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (filters.sortBy === 'popular') {
            result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        } else if (filters.sortBy === 'reading_time_asc') {
            result.sort((a, b) => (a.reading_time_minutes || 0) - (b.reading_time_minutes || 0));
        } else if (filters.sortBy === 'reading_time_desc') {
            result.sort((a, b) => (b.reading_time_minutes || 0) - (a.reading_time_minutes || 0));
        }

        return result;
    }, [posts, searchQuery, filters]);

    // Bài nổi bật hiển thị to nhất khi đang ở trang 1, không tìm kiếm và không có filter phụ
    const showFeatured =
        filters.category === 'all' &&
        !filters.tag &&
        filters.readingTime === 'all' &&
        filters.sortBy === 'latest' &&
        !searchQuery.trim();

    // Ưu tiên bài được Admin ghim (is_featured) mới nhất, nếu không có thì lấy bài mới nhất
    const featuredPost = showFeatured
        ? filteredPosts.find((post) => post.is_featured) ?? filteredPosts[0]
        : undefined;
    const regularPosts = featuredPost ? filteredPosts.filter((post) => post.id !== featuredPost.id) : filteredPosts;

    const totalPages = Math.max(1, Math.ceil(regularPosts.length / POSTS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const pagedPosts = regularPosts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

    const handleResetFilters = () => {
        setFilters({
            category: 'all',
            tag: '',
            readingTime: 'all',
            sortBy: 'latest',
        });
        setSearchQuery('');
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner: Đồng bộ hình ảnh mờ & hào quang chuẩn như trang chủ và jobs */}
            <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
                {/* Background image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/blog-bg.jpg"
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
                <div className="absolute left-1/2 top-[-12%] h-130 w-205 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px] dark:bg-blue-500/10 pointer-events-none" />

                {/* Soft side glows */}
                <div className="absolute left-[-15%] top-[20%] h-105 w-105 rounded-full bg-blue-400/4.5 blur-[120px] dark:bg-blue-500/6 pointer-events-none" />
                <div className="absolute right-[-15%] top-[30%] h-105 w-105 rounded-full bg-cyan-300/4 blur-[120px] dark:bg-cyan-500/5 pointer-events-none" />

                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background via-background/65 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xs border border-blue-100 dark:border-blue-900/50">
                        <BookOpen className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        {t('public_pages.blog.hero.title_prefix', undefined, 'Cẩm nang')}{' '}<span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">{t('public_pages.blog.hero.title_highlight', undefined, 'Nghề nghiệp')}</span>
                    </h1>

                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t('public_pages.blog.hero.desc', undefined, 'Cập nhật phương pháp chuẩn hóa CV theo ATS, chiến lược phỏng vấn chuyên sâu và xu hướng tuyển dụng ứng dụng trí tuệ nhân tạo.')}
                    </p>

                    {/* Thanh tìm kiếm phong cách Capsule (giống HeroSection trang chủ) */}
                    <BlogSearchBar
                        searchQuery={searchQuery}
                        onSearchChange={(val) => {
                            setSearchQuery(val);
                            setCurrentPage(1);
                        }}
                        filters={filters}
                        onFiltersChange={(newFilters) => {
                            setFilters(newFilters);
                            setCurrentPage(1);
                        }}
                        onResetFilters={handleResetFilters}
                        activeFiltersCount={activeFiltersCount}
                        popularTags={popularTags}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                    />
                </div>
            </div>

            <main
                ref={listTopRef}
                className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-10 md:py-14 relative z-10 space-y-10 scroll-mt-24"
            >
                {/* Header thanh trạng thái kết quả */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                            {filters.category !== 'all' ? BLOG_CATEGORY_LABELS[filters.category] : t('public_pages.blog.status.all_articles', undefined, 'Tất cả bài viết')}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200/60 dark:border-blue-800/60">
                            {t('public_pages.blog.status.count_label', { count: filteredPosts.length }, `${filteredPosts.length} bài viết`)}
                        </span>
                    </div>

                    {(searchQuery || activeFiltersCount > 0) && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer self-start sm:self-auto"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>{t('public_pages.blog.status.reset_filters', undefined, 'Đặt lại bộ lọc')}</span>
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{t('public_pages.blog.status.loading', undefined, 'Đang tải cẩm nang nghề nghiệp...')}</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 shadow-xs">
                        <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">
                            {hasError
                                ? t('public_pages.blog.status.error_title', undefined, 'Không thể tải bài viết')
                                : posts.length === 0
                                ? t('public_pages.blog.status.empty_title', undefined, 'Chưa có bài viết nào')
                                : t('public_pages.blog.status.not_found_title', undefined, 'Không tìm thấy bài viết phù hợp')}
                        </h3>
                        <p className="text-slate-500 font-medium text-sm max-w-md mx-auto mb-6 leading-relaxed">
                            {hasError
                                ? t('public_pages.blog.status.error_desc', undefined, 'Hệ thống đang gặp sự cố khi kết nối dữ liệu. Vui lòng thử lại sau ít phút.')
                                : posts.length === 0
                                ? t('public_pages.blog.status.empty_desc', undefined, 'Các bài viết kiến thức mới đang được ban biên tập hoàn thiện.')
                                : t('public_pages.blog.status.not_found_desc', undefined, 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các tiêu chí lọc để xem thêm bài viết nhé.')}
                        </p>
                        {(searchQuery || activeFiltersCount > 0) && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                            >
                                {t('public_pages.blog.status.clear_filters_btn', undefined, 'Xóa bộ lọc & xem tất cả')}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* Bài viết nổi bật (Featured Hero Card) - Đặt ở đầu khi xem toàn bộ */}
                        {featuredPost && safePage === 1 && (
                            <div className="group/featured relative overflow-hidden rounded-3xl p-[1.5px] bg-slate-200/90 dark:bg-slate-800 shadow-md transition-all duration-300 hover:shadow-2xl">
                                {/* Border beam rotating animation */}
                                <div
                                    className="pointer-events-none absolute -inset-[150%] animate-border-beam"
                                    style={{
                                        background:
                                            'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, rgba(56, 189, 248, 0.25) 305deg, rgba(37, 99, 235, 0.85) 330deg, rgba(56, 189, 248, 0.3) 348deg, transparent 360deg)',
                                    }}
                                />

                                <Link
                                    href={`${ROUTES.BLOG}/${featuredPost.slug}`}
                                    className="relative z-10 flex flex-col lg:flex-row rounded-[22.5px] bg-white dark:bg-slate-900 overflow-hidden"
                                >
                                    {/* Thumbnail lớn */}
                                    <div className="lg:w-1/2 min-h-72 lg:min-h-96 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        {featuredPost.thumbnail_url ? (
                                            <img
                                                src={featuredPost.thumbnail_url}
                                                alt={featuredPost.title}
                                                className="w-full h-full object-cover group-hover/featured:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-12">
                                                <BookOpen className="w-20 h-20 text-slate-400 dark:text-slate-500" />
                                            </div>
                                        )}

                                        <div className="absolute top-4 left-4 flex items-center gap-2">
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                                {t('public_pages.blog.status.featured_badge', undefined, 'Bài viết tiêu điểm')}
                                            </span>
                                            <span
                                                className={`px-3 py-1 ${
                                                    getBlogCategoryStyle(featuredPost.category).badge
                                                } text-xs font-black uppercase tracking-wider rounded-xl shadow-sm backdrop-blur-md`}
                                            >
                                                {BLOG_CATEGORY_LABELS[featuredPost.category] ?? featuredPost.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Nội dung Featured */}
                                    <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover/featured:text-blue-600 dark:group-hover/featured:text-blue-400 transition-colors leading-tight">
                                                {featuredPost.title}
                                            </h2>

                                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-sm sm:text-base line-clamp-3">
                                                {featuredPost.summary || getBlogExcerpt(featuredPost.content_html, 240)}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {getSmartBlogTags(featuredPost).map((t) => (
                                                    <span
                                                        key={t}
                                                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                                                    >
                                                        #{t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getSmartBlogAuthor(featuredPost).avatar_url}
                                                    alt={featuredPost.author_name}
                                                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-slate-200">
                                                        {featuredPost.author_name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">
                                                        {formatBlogDate(featuredPost.created_at)} • {t('public_pages.blog.status.minutes_read', { minutes: featuredPost.reading_time_minutes || 3 }, `${featuredPost.reading_time_minutes || 3} phút đọc`)}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 group-hover/featured:translate-x-1.5 transition-transform text-sm">
                                                {t('public_pages.blog.status.read_now', undefined, 'Khám phá ngay →')}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Danh sách bài viết theo ViewMode (Grid hoặc List) */}
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {pagedPosts.map((post) => (
                                    <BlogCard key={post.id} post={post} viewMode="grid" />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 sm:gap-5">
                                {pagedPosts.map((post) => (
                                    <BlogCard key={post.id} post={post} viewMode="list" />
                                ))}
                            </div>
                        )}

                        {/* Phân trang (Pagination) */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-6">
                                <button
                                    type="button"
                                    onClick={() => goToPage(safePage - 1)}
                                    disabled={safePage === 1}
                                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                    title={t('public_pages.blog.status.prev_page', undefined, 'Trang trước')}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => goToPage(page)}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                                            safePage === page
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => goToPage(safePage + 1)}
                                    disabled={safePage === totalPages}
                                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                    title={t('public_pages.blog.status.next_page', undefined, 'Trang sau')}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <PublicFooter />
        </div>
    );
}