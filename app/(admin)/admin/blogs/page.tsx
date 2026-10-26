'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2, Edit, Trash2, ChevronLeft, ChevronRight, Filter, Plus, ExternalLink, Eye, Star, Flame, ImageOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '@/features/admin/admin.service';
import { BLOG_CATEGORY_LABELS, BlogCategory } from '@/features/blog/blog.service';
import { ROUTES } from '@/constants/routes';

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const pageSize = 10;

    const getVisiblePages = (current: number, total: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 3) return [1, 2, 3, 4, '...', total];
        if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    const fetchBlogs = async () => {
        try {
            setIsLoading(true);
            setBlogs(await adminService.getBlogs());
        } catch {
            toast.error('Không thể tải danh sách bài viết');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, statusFilter]);

    const togglePublished = async (blog: any) => {
        try {
            setTogglingId(blog.id);
            await adminService.updateBlog(blog.id, { is_published: !blog.is_published });
            toast.success(blog.is_published ? 'Đã chuyển bài viết về bản nháp' : 'Đã đăng bài viết');
            fetchBlogs();
        } catch {
            toast.error('Lỗi khi cập nhật trạng thái');
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (blog: any) => {
        if (!confirm(`Xóa vĩnh viễn bài viết "${blog.title}"?`)) return;
        try {
            await adminService.deleteBlog(blog.id);
            toast.success('Đã xóa bài viết');
            fetchBlogs();
        } catch {
            toast.error('Lỗi khi xóa bài viết');
        }
    };

    const filtered = blogs.filter(b => {
        const keyword = searchTerm.toLowerCase();
        const matchSearch = b.title?.toLowerCase().includes(keyword) || b.tags?.some((t: string) => t.toLowerCase().includes(keyword));
        const matchCategory = categoryFilter === 'All' || b.category === categoryFilter;
        const matchStatus = statusFilter === 'All' || (statusFilter === 'Published' ? b.is_published : !b.is_published);
        return matchSearch && matchCategory && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginatedBlogs = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Quản lý Blog</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Soạn, đăng và quản lý các bài viết trên trang Blog.</p>
                </div>
                <Link href={ROUTES.ADMIN_BLOG_NEW} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" /> Viết bài mới
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm theo tiêu đề hoặc tag..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm focus:border-primary-500 shadow-sm transition-colors text-slate-700 dark:text-slate-200 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                    <div className="relative min-w-40 flex-1">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="All">Tất cả danh mục</option>
                            {Object.entries(BLOG_CATEGORY_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative min-w-40 flex-1">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Tất cả trạng thái</option>
                            <option value="Published">Đã đăng</option>
                            <option value="Draft">Bản nháp</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="p-5 pl-6">Bài viết</th>
                                <th className="p-5">Danh mục</th>
                                <th className="p-5 text-center">Lượt xem</th>
                                <th className="p-5">Ngày tạo</th>
                                <th className="p-5 text-center">Trạng thái</th>
                                <th className="p-5 pr-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-10 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto" /></td></tr>
                            ) : paginatedBlogs.length === 0 ? (
                                <tr><td colSpan={6} className="p-10 text-center text-sm font-medium text-slate-500">Không có bài viết nào.</td></tr>
                            ) : (
                                paginatedBlogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="p-5 pl-6">
                                            <div className="flex items-center gap-4 min-w-72">
                                                <div className="w-20 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    {blog.thumbnail_url ? (
                                                        <img src={blog.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageOff className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2">{blog.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {blog.is_featured && (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400"><Star className="w-3 h-3" /> Tiêu điểm</span>
                                                        )}
                                                        {blog.is_hot && (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400"><Flame className="w-3 h-3" /> Thịnh hành</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                            {BLOG_CATEGORY_LABELS[blog.category as BlogCategory] || blog.category}
                                        </td>
                                        <td className="p-5 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
                                            <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-400" /> {blog.view_count || 0}</span>
                                        </td>
                                        <td className="p-5 text-sm text-slate-500 whitespace-nowrap">
                                            {blog.created_at ? new Date(blog.created_at).toLocaleDateString('vi-VN') : '-'}
                                        </td>
                                        <td className="p-5 text-center">
                                            <button
                                                onClick={() => togglePublished(blog)}
                                                disabled={togglingId === blog.id}
                                                title="Bấm để đổi trạng thái"
                                                className={`px-3 py-1 rounded-full text-xs font-black whitespace-nowrap transition-colors disabled:opacity-50 ${blog.is_published ? 'bg-success-50 text-success-600 dark:bg-success-500/10 hover:bg-success-100' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                            >
                                                {togglingId === blog.id ? <Loader2 className="w-3.5 h-3.5 animate-spin inline" /> : blog.is_published ? 'Đã đăng' : 'Bản nháp'}
                                            </button>
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {blog.is_published && (
                                                    <a href={`${ROUTES.BLOG}/${blog.slug}`} target="_blank" rel="noreferrer" className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Xem bài trên trang Blog">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <Link href={`${ROUTES.ADMIN_BLOGS}/${blog.id}`} className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors" title="Sửa">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(blog)} className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 rounded-lg transition-colors" title="Xóa">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && totalPages > 1 && (
                    <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 mt-auto">
                        <p className="text-sm font-medium text-slate-500">
                            Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filtered.length)}</span> trong {filtered.length} bài viết
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-1">
                                {getVisiblePages(currentPage, totalPages).map((page, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                        disabled={page === '...'}
                                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${page !== '...' ? 'shadow-sm' : ''} ${currentPage === page ? 'bg-primary-600 text-white' : page === '...' ? 'text-slate-400 bg-transparent cursor-default' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
