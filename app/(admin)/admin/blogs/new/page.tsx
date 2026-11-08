'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '@/features/admin/admin.service';
import BlogForm, { BlogFormValues } from '@/components/admin/blog/BlogForm';
import { ROUTES } from '@/constants/routes';

export default function AdminNewBlogPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: BlogFormValues) => {
        try {
            setIsSubmitting(true);
            await adminService.createBlog(values);
            toast.success(values.is_published ? 'Đã đăng bài viết' : 'Đã lưu bản nháp');
            router.push(ROUTES.ADMIN_BLOGS);
        } catch (error: any) {
            toast.error(error.response?.data?.detail?.[0]?.msg || error.response?.data?.detail || 'Không thể lưu bài viết');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <Link href={ROUTES.ADMIN_BLOGS} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" title="Quay lại">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Viết bài mới</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bài viết chỉ hiện trên trang Blog sau khi bấm Đăng bài.</p>
                </div>
            </div>
            <BlogForm isSubmitting={isSubmitting} submitLabel="Đăng bài" onSubmit={handleSubmit} />
        </div>
    );
}
