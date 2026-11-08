'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '@/features/admin/admin.service';
import BlogForm, { BlogFormValues, toBlogFormValues } from '@/components/admin/blog/BlogForm';
import { ROUTES } from '@/constants/routes';

export default function AdminEditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [blog, setBlog] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        adminService.getBlog(id)
            .then(setBlog)
            .catch(() => {
                toast.error('Không tìm thấy bài viết');
                router.push(ROUTES.ADMIN_BLOGS);
            })
            .finally(() => setIsLoading(false));
    }, [id, router]);

    const handleSubmit = async (values: BlogFormValues) => {
        try {
            setIsSubmitting(true);
            await adminService.updateBlog(id, values);
            toast.success(values.is_published ? 'Đã cập nhật và đăng bài viết' : 'Đã lưu bản nháp');
            router.push(ROUTES.ADMIN_BLOGS);
        } catch (error: any) {
            toast.error(error.response?.data?.detail?.[0]?.msg || error.response?.data?.detail || 'Không thể lưu bài viết');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !blog) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href={ROUTES.ADMIN_BLOGS} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" title="Quay lại">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Sửa bài viết</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Đường dẫn: /blog/{blog.slug}</p>
                    </div>
                </div>
                {blog.is_published && (
                    <a href={`${ROUTES.BLOG}/${blog.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <ExternalLink className="w-4 h-4" /> Xem trên trang Blog
                    </a>
                )}
            </div>
            <BlogForm initialValues={toBlogFormValues(blog)} isSubmitting={isSubmitting} submitLabel={blog.is_published ? 'Cập nhật' : 'Đăng bài'} onSubmit={handleSubmit} />
        </div>
    );
}
