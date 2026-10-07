'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Eye, ChevronLeft, Loader2, User, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { blogService, BlogPost, BLOG_CATEGORY_LABELS, formatBlogDate } from '@/features/blog/blog.service';

export default function BlogDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { isAuthenticated, user } = useAuthStore();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!slug) return;
        const fetchPost = async () => {
            try {
                setPost(await blogService.getBlogDetail(slug));
            } catch (error) {
                console.error('Failed to fetch blog:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Đã sao chép link bài viết!');
        } catch {
            toast.error('Không thể sao chép liên kết');
        }
    };

    if (isLoading) {
        return (
            <div className="font-sans min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
                <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mb-5" />
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        notFound();
    }

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20 animate-in fade-in duration-500">
                <Link
                    href={ROUTES.BLOG}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
                >
                    <ChevronLeft className="w-4 h-4" /> Quay lại Cẩm nang
                </Link>

                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider rounded-lg mb-4">
                    {BLOG_CATEGORY_LABELS[post.category] ?? post.category}
                </span>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author_name}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatBlogDate(post.created_at)}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.reading_time_minutes} phút đọc</span>
                        <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {post.view_count} lượt xem</span>
                    </div>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Share2 className="w-4 h-4" /> Chia sẻ
                    </button>
                </div>

                {post.thumbnail_url && (
                    <img
                        src={post.thumbnail_url}
                        alt={post.title}
                        className="w-full aspect-video object-cover rounded-3xl border border-slate-200 dark:border-slate-800 mb-10"
                    />
                )}

                <article
                    className="prose prose-slate dark:prose-invert max-w-none text-base text-slate-700 dark:text-slate-300 leading-8"
                    dangerouslySetInnerHTML={{ __html: post.content_html }}
                />
            </main>

            <PublicFooter />
        </div>
    );
}
