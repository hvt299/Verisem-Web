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
