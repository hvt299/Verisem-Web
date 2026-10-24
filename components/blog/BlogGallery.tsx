'use client';

import { useState, useEffect } from 'react';
import { Images, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogGalleryProps {
    images: string[];
    title?: string;
}

export default function BlogGallery({ images, title = 'Bộ sưu tập hình ảnh thực tế' }: BlogGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Lắng nghe phím ESC & mũi tên để điều khiển Lightbox
    useEffect(() => {
        if (lightboxIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxIndex(null);
            if (e.key === 'ArrowRight') {
                setLightboxIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
            }
            if (e.key === 'ArrowLeft') {
                setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [lightboxIndex, images.length]);

    if (!images || images.length === 0) return null;

    return (
        <section aria-label="Bộ sưu tập ảnh bài viết" className="pt-6 font-sans">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <Images className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    {title}
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {images.length} ảnh
                </span>
            </div>

            {/* Grid hiển thị hình ảnh */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {images.map((imgUrl, idx) => (
                    <div
                        key={idx}
                        onClick={() => setLightboxIndex(idx)}
                        className="group relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-850 cursor-pointer shadow-xs hover:shadow-md transition-all duration-300"
                    >
                        <img
                            src={imgUrl}
                            alt={`Hình ảnh minh họa ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="p-2.5 rounded-full bg-white/90 text-slate-900 shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                                <Maximize2 className="w-4 h-4" />
                            </span>
                        </div>
                        <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/70 text-white backdrop-blur-xs">
                            Ảnh 0{idx + 1}
                        </span>
                    </div>
                ))}
            </div>

            {/* Modal Lightbox Toàn Màn Hình */}
            {lightboxIndex !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={() => setLightboxIndex(null)}
                >
                    {/* Nút Đóng */}
                    <button
                        type="button"
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
                        title="Đóng (Esc)"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Vị trí ảnh hiện tại */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-white/80 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
                        {lightboxIndex + 1} / {images.length}
                    </div>

                    {/* Nút Previous */}
                    {images.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
                            }}
                            className="absolute left-3 sm:left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
                            title="Ảnh trước (Mũi tên trái)"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}

                    {/* Khung ảnh chính */}
                    <div
                        className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center p-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[lightboxIndex]}
                            alt={`Phóng to ảnh ${lightboxIndex + 1}`}
                            className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                        />
                    </div>

                    {/* Nút Next */}
                    {images.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
                            }}
                            className="absolute right-3 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
                            title="Ảnh tiếp theo (Mũi tên phải)"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}
