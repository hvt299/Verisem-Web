'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Calendar,
    Clock,
    Eye,
    ChevronLeft,
    Loader2,
    Share2,
    Bookmark,
    Sparkles,
    CheckCircle2,
    BookOpen,
    ArrowRight,
    ArrowLeft,
    Flame,
    Printer,
    FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import BlogTOC from '@/components/blog/BlogTOC';
import BlogAuthorBio from '@/components/blog/BlogAuthorBio';
import BlogCTA from '@/components/blog/BlogCTA';
import BlogCard from '@/components/blog/BlogCard';
import BlogGallery from '@/components/blog/BlogGallery';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/store/useLanguageStore';
import { ROUTES } from '@/constants/routes';
import {
    blogService,
    BlogPost,
    BLOG_CATEGORY_LABELS,
    getBlogCategoryStyle,
    formatBlogDate,
    getSmartBlogTags,
    getSmartBlogAuthor,
    getSmartKeyTakeaways,
    getSmartBlogGallery,
    getBlogExcerpt,
} from '@/features/blog/blog.service';

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { isAuthenticated, user } = useAuthStore();
    const { t, isEnglish } = useTranslation();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!slug) return;
        const fetchData = async () => {
            try {
                const [detail, list] = await Promise.all([
                    blogService.getBlogDetail(slug),
                    blogService.getPublicBlogs(),
                ]);
                setPost(detail);
                setAllPosts(list);
            } catch (error) {
                console.error('Failed to fetch blog detail:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success(t('public_pages.blog.detail.toast_copied', undefined, 'Đã sao chép link bài viết vào clipboard!'));
        } catch {
            toast.error(t('public_pages.blog.detail.toast_copy_error', undefined, 'Không thể sao chép liên kết.'));
        }
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        if (!isBookmarked) {
            toast.success(t('public_pages.blog.detail.toast_bookmarked', undefined, 'Đã lưu bài viết vào danh sách quan tâm!'));
        } else {
            toast(t('public_pages.blog.detail.toast_unbookmarked', undefined, 'Đã bỏ lưu bài viết.'), { icon: '🗑️' });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="font-sans min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
                <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mb-5" />
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{t('public_pages.blog.detail.loading_detail', undefined, 'Đang tải nội dung bài viết...')}</p>
                </div>
            </div>
        );
    }

    if (!post) {
        notFound();
    }

    const categoryStyle = getBlogCategoryStyle(post.category);
    const categoryLabel = BLOG_CATEGORY_LABELS[post.category] || post.category;
    const author = getSmartBlogAuthor(post);
    const tags = getSmartBlogTags(post);
    const keyTakeaways = getSmartKeyTakeaways(post);
    const galleryImages = getSmartBlogGallery(post);

    // Tính toán bài viết trước & tiếp theo
    const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    // {t('public_pages.blog.detail.related_title', undefined, 'Bài viết liên quan')} (cùng danh mục, loại trừ bài hiện tại)
    const relatedPosts = allPosts
        .filter((p) => p.slug !== post.slug && p.category === post.category)
        .slice(0, 2);

    // Bài viết thịnh hành nhiều lượt xem nhất cho sidebar
    const trendingPosts = [...allPosts]
        .filter((p) => p.slug !== post.slug)
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 4);

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner Đầu trang (Hỗ trợ ảnh banner riêng hoặc nền chung) */}
            <div className="relative pt-28 pb-12 md:pt-36 md:pb-16 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
                {/* Background image & gradient overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    {post.banner_url ? (
                        <img
                            src={post.banner_url}
                            alt=""
                            className="w-full h-full object-cover object-center opacity-25 dark:opacity-20 blur-[1px]"
                        />
                    ) : (
                        <Image
                            src="/images/blog-bg.jpg"
                            alt=""
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover object-center opacity-[0.22] dark:opacity-[0.22]"
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-b from-background/45 via-background/70 to-background/95 dark:hidden" />
                    <div className="absolute inset-0 hidden bg-linear-to-b from-[#020617]/55 dark:block" />
                    <div className="absolute inset-0 hidden bg-blue-950/20 mix-blend-multiply dark:block" />
                </div>

                {/* Primary glow */}
                <div className="absolute left-1/2 top-[-12%] h-130 w-205 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px] dark:bg-blue-500/10 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    {/* Breadcrumbs & Nút quay lại */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <Link
                            href={ROUTES.BLOG}
                            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </span>
                            <span>{t('public_pages.blog.detail.back_to_blog', undefined, 'Quay lại Cẩm nang nghề nghiệp')}</span>
                        </Link>

                        {/* Cụm hành động nhanh (Chia sẻ, Lưu, In) */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleBookmark}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                    isBookmarked
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                                title={isBookmarked ? t('public_pages.blog.detail.unbookmark', undefined, 'Bỏ lưu') : t('public_pages.blog.detail.bookmark', undefined, 'Lưu bài viết')}
                            >
                                <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                                <span>{isBookmarked ? t('public_pages.blog.detail.bookmarked', undefined, 'Đã lưu') : t('public_pages.blog.detail.bookmark', undefined, 'Lưu bài')}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleShare}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
                                title={t('public_pages.blog.detail.share_title', undefined, 'Sao chép link chia sẻ')}
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>{t('public_pages.blog.detail.share', undefined, 'Chia sẻ')}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handlePrint}
                                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title={t('public_pages.blog.detail.print_title', undefined, 'In bài viết')}
                            >
                                <Printer className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Metadata chips đầu bài */}
                    <div className="flex flex-wrap items-center gap-2.5 mb-4">
                        <span className={`px-3 py-1 ${categoryStyle.badge} text-xs font-black uppercase tracking-wider rounded-lg shadow-2xs`}>
                            {categoryLabel}
                        </span>

                        {post.is_hot && (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-2xs animate-pulse">
                                <Flame className="w-3.5 h-3.5" /> {t('public_pages.blog.detail.trending', undefined, 'Xu hướng')}
                            </span>
                        )}

                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            {t('public_pages.blog.status.minutes_read', { minutes: post.reading_time_minutes }, `${post.reading_time_minutes} phút đọc`)}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {t('public_pages.blog.detail.views', { count: (post.view_count || 0).toLocaleString() }, `${(post.view_count || 0).toLocaleString()} lượt xem`)}
                        </span>
                    </div>

                    {/* Tiêu đề chính H1 */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mb-6">
                        {post.title}
                    </h1>

                    {/* Tác giả & Ngày đăng */}
                    <div className="flex items-center gap-3">
                        <img
                            src={author.avatar_url}
                            alt={author.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                                    {author.name}
                                </span>
                                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                                    {author.role}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {t('public_pages.blog.detail.published_on', undefined, 'Xuất bản:')} {formatBlogDate(post.created_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout 2 Cột Thân Trang: Cột bài viết (8 phần) + Cột tiện ích Sidebar (4 phần) */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* CỘT CHÍNH (NỘI DUNG BÀI VIẾT) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Ảnh bìa lớn tỉ lệ chuẩn */}
                        {post.thumbnail_url ? (
                            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800">
                                <img
                                    src={post.thumbnail_url}
                                    alt={post.title}
                                    className="w-full aspect-16/9 object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full aspect-16/9 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                                <BookOpen className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                            </div>
                        )}

                        {/* Khung Ghi nhớ nhanh (Key Takeaways) */}
                        <div className="rounded-3xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/60 dark:bg-blue-950/30 p-6 sm:p-7 shadow-xs">
                            <div className="flex items-center gap-2 mb-3.5">
                                <div className="p-1.5 rounded-xl bg-blue-600 text-white shadow-xs">
                                    <Sparkles className="w-4 h-4 text-amber-300" />
                                </div>
                                <h3 className="text-sm font-black text-blue-950 dark:text-blue-100 uppercase tracking-wider">
                                    {t('public_pages.blog.detail.key_takeaways', undefined, 'Điểm cốt lõi cần nhớ')}
                                </h3>
                            </div>
                            <ul className="space-y-2.5">
                                {keyTakeaways.map((point, index) => (
                                    <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Nội dung bài viết rich text */}
                        <article
                            className="blog-content w-full"
                            dangerouslySetInnerHTML={{ __html: post.content_html }}
                        />

                        {/* Bộ sưu tập hình ảnh đính kèm bài viết (Gallery) */}
                        {galleryImages.length > 0 && (
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                                <BlogGallery images={galleryImages} />
                            </div>
                        )}

                        {/* Danh sách Tags liên quan */}
                        {tags.length > 0 && (
                            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                                    {t('public_pages.blog.detail.related_tags', undefined, 'Từ khóa liên quan:')}
                                </span>
                                {tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`${ROUTES.BLOG}?keyword=${encodeURIComponent(tag)}`}
                                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Hộp thông tin Tác giả chuyên sâu (Author Bio) */}
                        <div className="pt-2">
                            <BlogAuthorBio author={author} />
                        </div>

                        {/* Điều hướng Bài trước / Bài tiếp theo */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                            {prevPost ? (
                                <Link
                                    href={`${ROUTES.BLOG}/${prevPost.slug}`}
                                    className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
                                >
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors mb-2">
                                        <ArrowLeft className="w-3.5 h-3.5" /> {t('public_pages.blog.detail.prev_post', undefined, 'Bài trước đó')}
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                        {prevPost.title}
                                    </h4>
                                </Link>
                            ) : (
                                <div className="hidden sm:block" />
                            )}

                            {nextPost && (
                                <Link
                                    href={`${ROUTES.BLOG}/${nextPost.slug}`}
                                    className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between text-right"
                                >
                                    <span className="flex items-center justify-end gap-1.5 text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors mb-2">
                                        {t('public_pages.blog.detail.next_post', undefined, 'Bài tiếp theo')} <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                        {nextPost.title}
                                    </h4>
                                </Link>
                            )}
                        </div>

                        {/* {t('public_pages.blog.detail.related_title', undefined, 'Bài viết liên quan')} (Related Articles) */}
                        {relatedPosts.length > 0 && (
                            <div className="pt-8 space-y-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                        {t('public_pages.blog.detail.related_title', undefined, 'Bài viết liên quan')}
                                    </h3>
                                    <Link
                                        href={`${ROUTES.BLOG}?category=${post.category}`}
                                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        {t('public_pages.blog.detail.view_more_category', undefined, 'Xem thêm trong danh mục →')}
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {relatedPosts.map((related) => (
                                        <BlogCard key={related.id} post={related} viewMode="grid" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CỘT PHỤ (SIDEBAR CỐ ĐỊNH - STICKY) */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        {/* Mục lục bài viết (Table of Contents - TOC) */}
                        <BlogTOC htmlContent={post.content_html} />

                        {/* Widget kêu gọi hành động Tuyển dụng AI (CTA) */}
                        <BlogCTA />

                        {/* Bài viết được quan tâm nhiều nhất (Trending Widget) */}
                        {trendingPosts.length > 0 && (
                            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs backdrop-blur-md">
                                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                                        <Flame className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                        {t('public_pages.blog.detail.most_read', undefined, 'Đọc nhiều nhất')}
                                    </h4>
                                </div>

                                <div className="space-y-4">
                                    {trendingPosts.map((item, idx) => (
                                        <Link
                                            key={item.id}
                                            href={`${ROUTES.BLOG}/${item.slug}`}
                                            className="group flex items-start gap-3 text-xs"
                                        >
                                            <span className="text-lg font-black text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0 leading-none mt-0.5">
                                                0{idx + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <h5 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                                                    {item.title}
                                                </h5>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                                                    <span>{item.reading_time_minutes} {t('public_pages.blog.min_read', undefined, 'p đọc')}</span>
                                                    <span>•</span>
                                                    <span>{(item.view_count || 0).toLocaleString(isEnglish ? 'en-US' : 'vi-VN')} {t('public_pages.blog.views', undefined, 'lượt xem')}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
