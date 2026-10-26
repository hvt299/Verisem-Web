'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, UploadCloud, X, Star, Flame, Save, Send, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '@/features/admin/admin.service';
import { BLOG_CATEGORY_LABELS, BlogCategory } from '@/features/blog/blog.service';

// CKEditor chỉ chạy được ở client
const RichTextEditor = dynamic(() => import('@/components/shared/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 animate-pulse" />,
});

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export interface BlogFormValues {
    title: string;
    category: BlogCategory;
    summary: string;
    content_html: string;
    thumbnail_url: string;
    banner_url: string;
    gallery_images: string[];
    tags: string[];
    key_takeaways: string[];
    target_audience: 'all' | 'applicant' | 'hr';
    author_name: string;
    author_role: string;
    author_avatar: string;
    author_bio: string;
    is_featured: boolean;
    is_hot: boolean;
    is_published: boolean;
}

const EMPTY_VALUES: BlogFormValues = {
    title: '',
    category: 'interview',
    summary: '',
    content_html: '',
    thumbnail_url: '',
    banner_url: '',
    gallery_images: [],
    tags: [],
    key_takeaways: [],
    target_audience: 'all',
    author_name: 'Ban Biên Tập',
    author_role: 'Ban Biên Tập Verisem',
    author_avatar: '',
    author_bio: '',
    is_featured: false,
    is_hot: false,
    is_published: false,
};

export const toBlogFormValues = (blog: any): BlogFormValues => ({
    ...EMPTY_VALUES,
    ...Object.fromEntries(Object.keys(EMPTY_VALUES).map((key) => [key, blog?.[key] ?? EMPTY_VALUES[key as keyof BlogFormValues]])),
});

const inputCls = 'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white';
const labelCls = 'text-sm font-bold text-slate-700 dark:text-slate-300';
const cardCls = 'bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const uploadImage = async (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error('Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc GIF');
        return null;
    }
    if (file.size > MAX_IMAGE_SIZE) {
        toast.error('Ảnh vượt quá 5MB');
        return null;
    }
    try {
        return await adminService.uploadBlogImage(file);
    } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Tải ảnh lên thất bại');
        return null;
    }
};

function ImageUploadField({ label, value, onChange, required, aspect = 'aspect-video' }: {
    label: string;
    value: string;
    onChange: (url: string) => void;
    required?: boolean;
    aspect?: string;
}) {
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file?: File) => {
        if (!file) return;
        setIsUploading(true);
        const url = await uploadImage(file);
        if (url) onChange(url);
        setIsUploading(false);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="space-y-2">
            <label className={labelCls}>{label}{required && <span className="text-error-500"> *</span>}</label>
            <div className={`relative ${aspect} w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50`}>
                {value ? (
                    <>
                        <img src={value} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => onChange('')} className="absolute top-2 right-2 p-1.5 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full transition-colors" title="Xóa ảnh">
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading} className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary-500 transition-colors">
                        {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                        <span className="text-xs font-bold">{isUploading ? 'Đang tải lên...' : 'Bấm để tải ảnh (tối đa 5MB)'}</span>
                    </button>
                )}
            </div>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>
    );
}

interface BlogFormProps {
    initialValues?: BlogFormValues;
    isSubmitting: boolean;
    submitLabel: string;
    onSubmit: (values: BlogFormValues) => Promise<void>;
}

export default function BlogForm({ initialValues, isSubmitting, submitLabel, onSubmit }: BlogFormProps) {
    const [values, setValues] = useState<BlogFormValues>(initialValues || EMPTY_VALUES);
    const [tagInput, setTagInput] = useState('');
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const set = <K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) => setValues((prev) => ({ ...prev, [key]: value }));

    const addTag = () => {
        const tag = tagInput.trim().replace(/,$/, '');
        if (tag && !values.tags.includes(tag)) set('tags', [...values.tags, tag]);
        setTagInput('');
    };

    const handleGalleryFiles = async (files: FileList | null) => {
        if (!files?.length) return;
        setIsUploadingGallery(true);
        const urls: string[] = [];
        for (const file of Array.from(files)) {
            const url = await uploadImage(file);
            if (url) urls.push(url);
        }
        setValues((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, ...urls] }));
        setIsUploadingGallery(false);
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    };

    const handleSubmit = async (publish: boolean) => {
        const plainContent = values.content_html.replace(/<[^>]+>/g, '').trim();
        if (!values.title.trim()) return toast.error('Vui lòng nhập tiêu đề');
        if (!values.thumbnail_url) return toast.error('Vui lòng tải ảnh bìa');
        if (!plainContent) return toast.error('Vui lòng nhập nội dung bài viết');

        await onSubmit({
            ...values,
            title: values.title.trim(),
            summary: values.summary.trim(),
            key_takeaways: values.key_takeaways.map((s) => s.trim()).filter(Boolean),
            is_published: publish,
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* CỘT TRÁI: NỘI DUNG */}
            <div className="lg:col-span-2 space-y-6">
                <div className={cardCls}>
                    <div className="space-y-2">
                        <label className={labelCls}>Tiêu đề <span className="text-error-500">*</span></label>
                        <input type="text" value={values.title} onChange={(e) => set('title', e.target.value)} className={`${inputCls} text-base font-bold`} placeholder="VD: 10 câu hỏi phỏng vấn thường gặp và cách trả lời" />
                    </div>
                    <div className="space-y-2">
                        <label className={labelCls}>Tóm tắt</label>
                        <textarea value={values.summary} onChange={(e) => set('summary', e.target.value)} className={`${inputCls} min-h-20`} placeholder="Đoạn mô tả ngắn hiển thị ở danh sách bài viết và khi chia sẻ" />
                    </div>
                    <div className="space-y-2">
                        <label className={labelCls}>Nội dung <span className="text-error-500">*</span></label>
                        <RichTextEditor value={values.content_html} onChange={(val) => set('content_html', val)} placeholder="Viết nội dung bài viết..." />
                    </div>
                    <div className="space-y-2">
                        <label className={labelCls}>Các ý chính cần nhớ</label>
                        <textarea
                            value={values.key_takeaways.join('\n')}
                            onChange={(e) => set('key_takeaways', e.target.value.split('\n'))}
                            className={`${inputCls} min-h-24`}
                            placeholder="Mỗi dòng một ý"
                        />
                    </div>
                </div>

                <div className={cardCls}>
                    <h3 className="text-base font-black text-slate-800 dark:text-white">Hình ảnh</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <ImageUploadField label="Ảnh bìa (thumbnail)" required value={values.thumbnail_url} onChange={(url) => set('thumbnail_url', url)} />
                        <ImageUploadField label="Ảnh banner đầu bài" value={values.banner_url} onChange={(url) => set('banner_url', url)} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelCls}>Bộ sưu tập ảnh</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {values.gallery_images.map((url, idx) => (
                                <div key={url + idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => set('gallery_images', values.gallery_images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => galleryInputRef.current?.click()} disabled={isUploadingGallery} className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary-500 transition-colors">
                                {isUploadingGallery ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                                <span className="text-[11px] font-bold">Thêm ảnh</span>
                            </button>
                        </div>
                        <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={(e) => handleGalleryFiles(e.target.files)} />
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: XUẤT BẢN & PHÂN LOẠI */}
            <div className="space-y-6 lg:sticky lg:top-6">
                <div className={cardCls}>
                    <h3 className="text-base font-black text-slate-800 dark:text-white">Xuất bản</h3>
                    <label className="flex items-center justify-between gap-3 cursor-pointer">
                        <span className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300"><Star className="w-4 h-4 text-amber-500" /> Bài tiêu điểm (ghim)</span>
                        <input type="checkbox" checked={values.is_featured} onChange={(e) => set('is_featured', e.target.checked)} className="w-4 h-4 accent-primary-600" />
                    </label>
                    <label className="flex items-center justify-between gap-3 cursor-pointer">
                        <span className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300"><Flame className="w-4 h-4 text-rose-500" /> Bài thịnh hành</span>
                        <input type="checkbox" checked={values.is_hot} onChange={(e) => set('is_hot', e.target.checked)} className="w-4 h-4 accent-primary-600" />
                    </label>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button type="button" onClick={() => handleSubmit(false)} disabled={isSubmitting} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 disabled:opacity-50 transition-colors">
                            <Save className="w-4 h-4" /> Lưu nháp
                        </button>
                        <button type="button" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-colors">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {submitLabel}
                        </button>
                    </div>
                </div>

                <div className={cardCls}>
                    <h3 className="text-base font-black text-slate-800 dark:text-white">Phân loại</h3>
                    <div className="space-y-2">
                        <label className={labelCls}>Danh mục <span className="text-error-500">*</span></label>
                        <select value={values.category} onChange={(e) => set('category', e.target.value as BlogCategory)} className={inputCls}>
                            {Object.entries(BLOG_CATEGORY_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelCls}>Đối tượng độc giả</label>
                        <select value={values.target_audience} onChange={(e) => set('target_audience', e.target.value as BlogFormValues['target_audience'])} className={inputCls}>
                            <option value="all">Tất cả</option>
                            <option value="applicant">Ứng viên</option>
                            <option value="hr">Nhà tuyển dụng</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelCls}>Tag</label>
                        <div className="flex flex-wrap gap-2">
                            {values.tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold">
                                    #{tag}
                                    <button type="button" onClick={() => set('tags', values.tags.filter((t) => t !== tag))}><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                            onBlur={addTag}
                            className={inputCls}
                            placeholder="Gõ tag rồi nhấn Enter"
                        />
                    </div>
                </div>

                <div className={cardCls}>
                    <h3 className="text-base font-black text-slate-800 dark:text-white">Tác giả</h3>
                    <ImageUploadField label="Ảnh đại diện" aspect="aspect-square max-w-28" value={values.author_avatar} onChange={(url) => set('author_avatar', url)} />
                    <div className="space-y-2">
                        <label className={labelCls}>Tên tác giả</label>
                        <input type="text" value={values.author_name} onChange={(e) => set('author_name', e.target.value)} className={inputCls} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelCls}>Chức danh</label>
                        <input type="text" value={values.author_role} onChange={(e) => set('author_role', e.target.value)} className={inputCls} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelCls}>Giới thiệu ngắn</label>
                        <textarea value={values.author_bio} onChange={(e) => set('author_bio', e.target.value)} className={`${inputCls} min-h-20`} />
                    </div>
                </div>
            </div>
        </div>
    );
}
