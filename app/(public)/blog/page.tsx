'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { BookOpen, Search, Calendar, Clock, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { blogService, BlogPost, BlogCategory, BLOG_CATEGORY_LABELS, getBlogCategoryStyle, getBlogExcerpt, formatBlogDate } from '@/features/blog/blog.service';

const POSTS_PER_PAGE = 9;

const CATEGORIES: { value: BlogCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    ...(Object.entries(BLOG_CATEGORY_LABELS) as [BlogCategory, string][]).map(([value, label]) => ({ value, label })),
];

function BlogThumbnail({ post, iconClassName }: { post: BlogPost; iconClassName: string }) {
    if (post.thumbnail_url) {
        return (
            <img
                src={post.thumbnail_url}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
        );
    }
    return (
        <div className={`absolute inset-0 bg-linear-to-br ${getBlogCategoryStyle(post.category).gradient} flex items-center justify-center`}>
            <BookOpen className={`${iconClassName} text-white/50 group-hover:scale-110 transition-transform duration-500`} />
        </div>
    );
}

export default function BlogPage() {
    const { isAuthenticated, user } = useAuthStore();
    const [isScrolled, setIsScrolled] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<BlogCategory | 'all'>('all');
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

    // Lọc dữ liệu bài viết
    const filteredPosts = useMemo(() => {
        let result = posts;

        if (activeCategory !== 'all') {
            result = result.filter(post => post.category === activeCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(query) ||
                getBlogExcerpt(post.content_html, 1000).toLowerCase().includes(query)
            );
        }

        return result;
    }, [posts, searchQuery, activeCategory]);

    // Bài mới nhất làm bài nổi bật, chỉ khi đang xem "Tất cả" và không tìm kiếm
    const showFeatured = activeCategory === 'all' && !searchQuery.trim();
    const featuredPost = showFeatured ? filteredPosts[0] : undefined;
    const regularPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

    const totalPages = Math.max(1, Math.ceil(regularPosts.length / POSTS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const pagedPosts = regularPosts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

    const handleCategoryChange = (category: BlogCategory | 'all') => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner */}
            <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Cẩm nang <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">Nghề nghiệp</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto mb-10">
                        Nâng tầm sự nghiệp với những kiến thức chuyên sâu, mẹo phỏng vấn và xu hướng công nghệ nhân sự mới nhất.
                    </p>

                    {/* Thanh tìm kiếm */}
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết, chủ đề..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium placeholder:text-slate-400 transition-all"
                        />
                    </div>
                </div>
            </div>

            <main ref={listTopRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 md:py-16 space-y-12 scroll-mt-24">

                {/* Bộ lọc Danh mục (Categories) */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                    {CATEGORIES.map(category => (
                        <button
                            key={category.value}
                            onClick={() => handleCategoryChange(category.value)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeCategory === category.value
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Đang tải bài viết...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">
                            {hasError ? 'Không thể tải bài viết' : posts.length === 0 ? 'Chưa có bài viết nào' : 'Không tìm thấy bài viết nào'}
                        </h3>
                        <p className="text-slate-500 font-medium">
                            {hasError ? 'Vui lòng thử lại sau ít phút.' : posts.length === 0 ? 'Các bài viết mới sẽ sớm được cập nhật.' : 'Thử thay đổi từ khóa hoặc chọn danh mục khác nhé.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Bài viết nổi bật (Featured Post) - Chỉ hiện ở trang 1 của danh mục Tất cả */}
                        {featuredPost && safePage === 1 && (
                            <Link href={`${ROUTES.BLOG}/${featuredPost.slug}`} className="group block bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/2 h-64 md:h-auto md:min-h-80 relative overflow-hidden">
                                        <BlogThumbnail post={featuredPost} iconClassName="w-20 h-20" />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    </div>
                                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`px-3 py-1 ${getBlogCategoryStyle(featuredPost.category).badge} text-xs font-black uppercase tracking-wider rounded-lg`}>
                                                {BLOG_CATEGORY_LABELS[featuredPost.category] ?? featuredPost.category}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
                                            {getBlogExcerpt(featuredPost.content_html, 240)}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 mt-auto">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatBlogDate(featuredPost.created_at)}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {featuredPost.reading_time_minutes} phút đọc</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Danh sách bài viết thông thường (Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pagedPosts.map(post => (
                                <Link key={post.id} href={`${ROUTES.BLOG}/${post.slug}`} className="group bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                    <div className="h-48 w-full relative overflow-hidden shrink-0">
                                        <BlogThumbnail post={post} iconClassName="w-12 h-12" />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    </div>

                                    <div className="p-6 md:p-8 flex flex-col flex-1">
                                        <div className="mb-4">
                                            <span className={`px-3 py-1 ${getBlogCategoryStyle(post.category).badge} text-xs font-black uppercase tracking-wider rounded-lg`}>
                                                {BLOG_CATEGORY_LABELS[post.category] ?? post.category}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium line-clamp-3 mb-6 flex-1">
                                            {getBlogExcerpt(post.content_html)}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50">
                                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatBlogDate(post.created_at)}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.reading_time_minutes} phút</span>
                                            </div>
                                            <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Phân trang */}
                        {totalPages > 1 && (
                            <nav aria-label="Phân trang bài viết" className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() => goToPage(safePage - 1)}
                                    disabled={safePage === 1}
                                    aria-label="Trang trước"
                                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        aria-current={page === safePage ? 'page' : undefined}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === safePage
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => goToPage(safePage + 1)}
                                    disabled={safePage === totalPages}
                                    aria-label="Trang sau"
                                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </nav>
                        )}
                    </div>
                )}
            </main>

            <PublicFooter />
        </div>
    );
}