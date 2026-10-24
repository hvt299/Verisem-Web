import apiClient from '@/lib/api-client';

export type BlogCategory =
    | 'interview'
    | 'cv_writing'
    | 'career_path'
    | 'hr_corner'
    | 'ai_tech'
    | 'market_insights';

export interface BlogAuthor {
    name: string;
    avatar_url?: string;
    role?: string;
    bio?: string;
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    category: BlogCategory;
    thumbnail_url: string;
    banner_url?: string;
    gallery_images?: string[];
    content_html: string;
    summary?: string;
    tags?: string[];
    is_featured?: boolean;
    is_hot?: boolean;
    key_takeaways?: string[];
    target_audience?: 'all' | 'applicant' | 'hr';
    author_name: string;
    author_avatar?: string;
    author_role?: string;
    author_bio?: string;
    reading_time_minutes: number;
    view_count: number;
    likes_count?: number;
    shares_count?: number;
    created_at: string;
    updated_at?: string;
}

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
    interview: 'Phỏng vấn',
    cv_writing: 'Viết CV',
    career_path: 'Định hướng',
    hr_corner: 'Góc HR',
    ai_tech: 'AI & Công nghệ',
    market_insights: 'Thị trường',
};

// Màu sắc & Gradient tối giản, tinh tế, đồng bộ chuẩn mực cho ảnh mặc định
export const BLOG_CATEGORY_STYLES: Record<BlogCategory, { gradient: string; badge: string; border: string; accent: string }> = {
    interview: {
        gradient: 'from-slate-100 via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900',
        badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40',
        border: 'border-slate-200 dark:border-slate-800',
        accent: 'text-blue-600 dark:text-blue-400',
    },
    cv_writing: {
        gradient: 'from-slate-100 via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900',
        badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40',
        border: 'border-slate-200 dark:border-slate-800',
        accent: 'text-emerald-600 dark:text-emerald-400',
    },
    career_path: {
        gradient: 'from-slate-100 via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900',
        badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40',
        border: 'border-slate-200 dark:border-slate-800',
        accent: 'text-amber-600 dark:text-amber-400',
    },
    hr_corner: {
        gradient: 'from-slate-100 via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900',
        badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40',
        border: 'border-slate-200 dark:border-slate-800',
        accent: 'text-indigo-600 dark:text-indigo-400',
    },
    ai_tech: {
        gradient: 'from-slate-100 via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900',
        badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/40',
        border: 'border-slate-200 dark:border-slate-800',
        accent: 'text-cyan-600 dark:text-cyan-400',
    },
    market_insights: {
        gradient: 'from-slate-100 via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900',
        badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
        border: 'border-slate-200 dark:border-slate-800',
        accent: 'text-slate-600 dark:text-slate-400',
    },
};

const DEFAULT_CATEGORY_STYLE = {
    gradient: 'from-slate-100 via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    border: 'border-slate-200 dark:border-slate-800',
    accent: 'text-slate-600 dark:text-slate-400',
};

export function getBlogCategoryStyle(category: string) {
    return BLOG_CATEGORY_STYLES[category as BlogCategory] ?? DEFAULT_CATEGORY_STYLE;
}

export const blogService = {
    async getPublicBlogs(category?: BlogCategory, limit: number = 200): Promise<BlogPost[]> {
        const params: any = { limit };
        if (category && category !== ('all' as any)) params.category = category;
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
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/** Fallback thông minh: Tạo danh sách tags dựa trên danh mục & tiêu đề bài viết nếu backend chưa gán */
export function getSmartBlogTags(post: BlogPost): string[] {
    if (post.tags && post.tags.length > 0) return post.tags;

    const tagsMap: Record<string, string[]> = {
        cv_writing: ['CV ATS', 'Kỹ năng viết CV', 'Tối ưu hồ sơ', 'Template CV'],
        interview: ['Phỏng vấn STAR', 'Thương lượng lương', 'Kinh nghiệm phỏng vấn', 'Trả lời câu hỏi khó'],
        career_path: ['Định hướng nghề nghiệp', 'Kỹ năng mềm', 'Thăng tiến', 'Chuyển ngành'],
        hr_corner: ['Tuyển dụng hiện đại', 'HR Tech', 'Giữ chân nhân tài', 'Văn hóa doanh nghiệp'],
        ai_tech: ['Trí tuệ nhân tạo', 'NLP So khớp CV', 'Tự động hóa tuyển dụng'],
        market_insights: ['Thị trường lao động', 'Xu hướng tuyển dụng', 'Báo cáo lương'],
    };

    const specific: string[] = [];
    const lowerTitle = post.title.toLowerCase();
    if (lowerTitle.includes('ats')) specific.push('Chuẩn ATS');
    if (lowerTitle.includes('lương')) specific.push('Mức lương');
    if (lowerTitle.includes('star')) specific.push('Mô hình STAR');
    if (lowerTitle.includes('ai')) specific.push('AI Tuyển dụng');
    if (lowerTitle.includes('onboarding')) specific.push('Onboarding');
    if (lowerTitle.includes('sinh viên')) specific.push('Fresher');

    const base = tagsMap[post.category] || ['Cẩm nang'];
    return Array.from(new Set([...specific, ...base])).slice(0, 4);
}

/** Fallback thông minh: Tác giả chuyên sâu */
export function getSmartBlogAuthor(post: BlogPost): BlogAuthor {
    const roleMap: Record<string, string> = {
        cv_writing: 'Chuyên gia Đánh giá Hồ sơ & ATS',
        interview: 'Cố vấn Nhân sự & Phỏng vấn Cấp cao',
        career_path: 'Chuyên gia Tư vấn Lộ trình Sự nghiệp',
        hr_corner: 'Chuyên gia Chiến lược Tuyển dụng',
        ai_tech: 'Kỹ sư Thuật toán NLP & AI',
        market_insights: 'Nhà phân tích Thị trường Lao động',
    };

    return {
        name: post.author_name || 'Ban Biên Tập Verisem',
        avatar_url: post.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name || 'Verisem Editorial')}&background=0284c7&color=fff&bold=true`,
        role: post.author_role || roleMap[post.category] || 'Ban Biên Tập Chuyên môn',
        bio: post.author_bio || 'Đội ngũ cố vấn và chuyên gia của Verisem, chuyên nghiên cứu phương pháp tối ưu hóa tuyển dụng và kết nối nhân tài ứng dụng công nghệ AI.',
    };
}

/** Fallback thông minh: Tự động trích xuất các điểm mấu chốt (key takeaways) từ nội dung nếu chưa có */
export function getSmartKeyTakeaways(post: BlogPost): string[] {
    if (post.key_takeaways && post.key_takeaways.length > 0) return post.key_takeaways;

    // Trích xuất các thẻ <h2> từ HTML
    const headings: string[] = [];
    const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    let match;
    while ((match = regex.exec(post.content_html)) !== null) {
        const clean = match[1].replace(/<[^>]+>/g, '').trim();
        if (clean) headings.push(clean);
    }

    if (headings.length > 0) {
        return headings.slice(0, 4);
    }

    return [
        'Nắm vững bản chất yêu cầu tuyển dụng và chuẩn hóa từ khóa tương thích.',
        'Định lượng các kết quả công việc để chứng minh năng lực thực tế.',
        'Tận dụng công nghệ AI và công cụ so khớp để gia tăng cơ hội thành công.',
    ];
}

/** Trích xuất hoặc cung cấp bộ sưu tập hình ảnh liên quan cho bài viết (Gallery) */
export function getSmartBlogGallery(post: BlogPost): string[] {
    if (post.gallery_images && post.gallery_images.length > 0) {
        return post.gallery_images;
    }

    // Các bộ ảnh chất lượng cao theo ngữ cảnh danh mục bài viết
    const curatedGalleries: Record<string, string[]> = {
        interview: [
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
        ],
        cv_writing: [
            'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
        ],
        career_path: [
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
        ],
        hr_corner: [
            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80',
        ],
        ai_tech: [
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
        ],
        market_insights: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
        ],
    };

    return curatedGalleries[post.category] || [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80',
    ];
}

