import apiClient from '@/lib/api-client';

export type BlogCategory = 'interview' | 'cv_writing' | 'career_path' | 'hr_corner';

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    category: BlogCategory;
    thumbnail_url: string;
    content_html: string;
    author_name: string;
    reading_time_minutes: number;
    view_count: number;
    created_at: string;
}

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
    interview: 'Phỏng vấn',
    cv_writing: 'Viết CV',
    career_path: 'Định hướng',
    hr_corner: 'Góc HR',
};

// Màu riêng cho từng danh mục: nền thumbnail (gradient) và nhãn danh mục
export const BLOG_CATEGORY_STYLES: Record<BlogCategory, { gradient: string; badge: string }> = {
    interview: {
        gradient: 'from-blue-500 to-indigo-600',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    },
    cv_writing: {
        gradient: 'from-emerald-400 to-teal-600',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    },
    career_path: {
        gradient: 'from-amber-400 to-orange-500',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    },
    hr_corner: {
        gradient: 'from-rose-400 to-fuchsia-600',
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    },
};

const DEFAULT_CATEGORY_STYLE = {
    gradient: 'from-slate-400 to-slate-600',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

export function getBlogCategoryStyle(category: string) {
    return BLOG_CATEGORY_STYLES[category as BlogCategory] ?? DEFAULT_CATEGORY_STYLE;
}

export const blogService = {
    async getPublicBlogs(category?: BlogCategory, limit: number = 200): Promise<BlogPost[]> {
        const params: any = { limit };
        if (category) params.category = category;
        const response = await apiClient.get('/system/blogs', { params });
        return response.data.data;
    },

    async getBlogDetail(slug: string): Promise<BlogPost> {
        const response = await apiClient.get(`/system/blogs/${slug}`);
        return response.data.data;
    },
};

export function getBlogExcerpt(html: string, maxLength: number = 180): string {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}

export function formatBlogDate(iso: string): string {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('vi-VN');
}
