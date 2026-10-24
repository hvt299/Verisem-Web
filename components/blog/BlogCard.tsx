'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Eye, Bookmark, Share2, ArrowRight, BookOpen, Sparkles, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import {
    BlogPost,
    BLOG_CATEGORY_LABELS,
    getBlogCategoryStyle,
    getBlogExcerpt,
    formatBlogDate,
    getSmartBlogTags,
    getSmartBlogAuthor,
} from '@/features/blog/blog.service';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from '@/store/useLanguageStore';

interface BlogCardProps {
    post: BlogPost;
    viewMode?: 'grid' | 'list';
}

export default function BlogCard({ post, viewMode = 'grid' }: BlogCardProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const [isBookmarked, setIsBookmarked] = useState(false);

    const categoryStyle = getBlogCategoryStyle(post.category);
    const categoryLabel = BLOG_CATEGORY_LABELS[post.category] || post.category;
    const tags = getSmartBlogTags(post);
    const author = getSmartBlogAuthor(post);
    const excerpt = post.summary || getBlogExcerpt(post.content_html, viewMode === 'list' ? 140 : 120);

    const handleCardClick = () => {
        router.push(`${ROUTES.BLOG}/${post.slug}`);
    };

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsBookmarked(!isBookmarked);
        if (!isBookmarked) {
            toast.success(t('public_pages.blog.card.toast_saved', undefined, 'Đã lưu bài viết vào danh sách đọc!'));
        } else {
            toast(t('public_pages.blog.card.toast_unmarked', undefined, 'Đã bỏ lưu bài viết.'), { icon: '🗑️' });
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const url = `${window.location.origin}${ROUTES.BLOG}/${post.slug}`;
            await navigator.clipboard.writeText(url);
            toast.success(t('public_pages.blog.card.toast_copied', undefined, 'Đã sao chép link bài viết!'));
        } catch {
            toast.error(t('public_pages.blog.card.toast_copy_error', undefined, 'Không thể sao chép liên kết'));
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className="group/card relative overflow-hidden rounded-2xl p-[1.5px] bg-slate-200/80 dark:bg-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl font-sans cursor-pointer flex flex-col"
        >
            {/* Animated Rotating Border Beam (Áp dụng animation trượt màu viền chuẩn như JobCard & CompanyCard) */}
            <div
                className="pointer-events-none absolute -inset-[150%] animate-border-beam"
                style={{
                    background:
                        'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, rgba(56, 189, 248, 0.15) 305deg, rgba(37, 99, 235, 0.7) 330deg, rgba(56, 189, 248, 0.2) 348deg, transparent 360deg)',
                }}
            />

            {/* Inner Card Container */}
            <div className="relative z-10 w-full h-full rounded-[14.5px] bg-white dark:bg-slate-900 overflow-hidden flex flex-col justify-between">
                {viewMode === 'list' ? (
                    /* ================= LIST VIEW (Dạng danh sách ngang giống JobCard / CompanyCard) ================= */
                    <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 p-4 sm:p-5 h-full">
                        {/* Thumbnail bên trái */}
                        <div className="relative w-full sm:w-56 md:w-64 h-48 sm:h-auto rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                            {post.thumbnail_url ? (
                                <img
                                    src={post.thumbnail_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full min-h-[140px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <BookOpen className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                                </div>
                            )}

                            {/* Badge Danh mục đè lên ảnh */}
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                <span className={`px-2.5 py-1 ${categoryStyle.badge} text-[11px] font-black uppercase tracking-wider rounded-lg shadow-xs backdrop-blur-md`}>
                                    {categoryLabel}
                                </span>
                                {post.is_hot && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-lg shadow-xs animate-pulse">
                                        <Flame className="w-3 h-3" /> {t('common.header.badges.hot', undefined, 'Hot')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thông tin bài viết bên phải */}
                        <div className="flex-1 flex flex-col justify-between min-w-0 space-y-2">
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors line-clamp-2 leading-snug">
                                    {post.title}
                                </h3>

                                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                                    {excerpt}
                                </p>

                                {/* Tags */}
                                {tags.length > 0 && (
                                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                                        {tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Bottom row: Tác giả & Hành động */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2 min-w-0">
                                    <img
                                        src={author.avatar_url}
                                        alt={author.name}
                                        className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                    />
                                    <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                                        {author.name}
                                    </span>
                                    <span className="opacity-40">•</span>
                                    <span className="flex items-center gap-1 shrink-0">
                                        <Clock className="w-3.5 h-3.5" /> {post.reading_time_minutes}p
                                    </span>
                                    <span className="opacity-40 hidden sm:inline">•</span>
                                    <span className="hidden sm:flex items-center gap-1 shrink-0">
                                        <Eye className="w-3.5 h-3.5" /> {post.view_count || 0}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        type="button"
                                        onClick={handleBookmark}
                                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                            isBookmarked
                                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                        title={isBookmarked ? t('public_pages.blog.card.unbookmark', undefined, 'Bỏ lưu') : t('public_pages.blog.card.bookmark', undefined, 'Lưu bài viết')}
                                    >
                                        <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleShare}
                                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                        title={t('public_pages.blog.card.share', undefined, 'Chia sẻ liên kết')}
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ================= GRID VIEW (Dạng thẻ dọc hiện đại) ================= */
                    <div className="flex flex-col h-full">
                        {/* Thumbnail với tỷ lệ chuẩn */}
                        <div className="relative w-full aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                            {post.thumbnail_url ? (
                                <img
                                    src={post.thumbnail_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                                <span className={`px-2.5 py-1 ${categoryStyle.badge} text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm backdrop-blur-md`}>
                                    {categoryLabel}
                                </span>
                                {post.is_hot && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-lg shadow-sm animate-pulse">
                                        <Flame className="w-3 h-3" /> {t('common.header.badges.hot', undefined, 'Hot')}
                                    </span>
                                )}
                            </div>

                            {/* Nút Bookmark nhanh ở góc trên phải */}
                            <button
                                type="button"
                                onClick={handleBookmark}
                                className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                                    isBookmarked
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 shadow-2xs'
                                }`}
                                title={isBookmarked ? t('public_pages.blog.card.unbookmark', undefined, 'Bỏ lưu') : t('public_pages.blog.card.bookmark', undefined, 'Lưu bài viết')}
                            >
                                <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Nội dung chính của Card */}
                        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
                                    {post.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed mb-4">
                                    {excerpt}
                                </p>

                                {/* Tags chip */}
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Metadata tác giả & thời lượng */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2 min-w-0">
                                    <img
                                        src={author.avatar_url}
                                        alt={author.name}
                                        className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-700 dark:text-slate-300 truncate text-[11px]">
                                            {author.name}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <span>{formatBlogDate(post.created_at)}</span>
                                            <span>•</span>
                                            <span>{t('public_pages.blog.status.minutes_read', { minutes: post.reading_time_minutes }, `${post.reading_time_minutes}p đọc`)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold group-hover/card:translate-x-1 transition-transform">
                                    <span className="text-xs">{t('public_pages.blog.card.read', undefined, 'Đọc')}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
