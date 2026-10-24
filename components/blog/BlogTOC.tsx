'use client';

import { useEffect, useState } from 'react';
import { ListCollapse, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/store/useLanguageStore';

interface HeadingItem {
    id: string;
    text: string;
}

interface BlogTOCProps {
    htmlContent: string;
}

export default function BlogTOC({ htmlContent }: BlogTOCProps) {
    const { t } = useTranslation();
    const [headings, setHeadings] = useState<HeadingItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Trích xuất các thẻ <h2> từ HTML
        const extracted: HeadingItem[] = [];
        const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
        let match;
        let index = 0;

        while ((match = regex.exec(htmlContent)) !== null) {
            const rawText = match[1].replace(/<[^>]+>/g, '').trim();
            if (rawText) {
                // Tạo id thân thiện từ tiêu đề
                const id = `heading-${index}-${rawText
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')}`;

                extracted.push({ id, text: rawText });
                index++;
            }
        }

        setHeadings(extracted);

        // Gắn id tương ứng vào các thẻ <h2> trong DOM bài viết ngay lập tức và theo chu kỳ render
        const attachIds = () => {
            const articleH2s = document.querySelectorAll('article h2');
            articleH2s.forEach((h2, i) => {
                if (extracted[i]) {
                    h2.setAttribute('id', extracted[i].id);
                    h2.classList.add('scroll-mt-28');
                }
            });
        };

        attachIds();
        const t1 = setTimeout(attachIds, 150);
        const t2 = setTimeout(attachIds, 500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [htmlContent]);

    // Lắng nghe scroll để highlight mục đang đọc
    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-90px 0px -65% 0px' }
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    const scrollToHeading = (id: string) => {
        const target = document.getElementById(id);
        if (target) {
            const headerOffset = 96; // Chiều cao Header cố định + khoảng đệm an toàn
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth',
            });
            setActiveId(id);

            // Thêm hiệu ứng phát sáng nhẹ báo hiệu vị trí vừa cuộn tới
            target.classList.add('ring-2', 'ring-blue-500/50', 'rounded-lg', 'transition-all', 'duration-300');
            setTimeout(() => {
                target.classList.remove('ring-2', 'ring-blue-500/50', 'rounded-lg');
            }, 1500);
        }
    };

    if (headings.length === 0) return null;

    return (
        <nav
            aria-label={t('public_pages.blog.toc.title', undefined, 'Mục lục bài viết')}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xs backdrop-blur-md font-sans"
        >
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <ListCollapse className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {t('public_pages.blog.toc.title', undefined, 'Mục lục bài viết')}
                </h4>
            </div>

            <ul className="space-y-1.5 text-xs">
                {headings.map((item, idx) => {
                    const isActive = activeId === item.id;
                    return (
                        <li key={item.id}>
                            <button
                                type="button"
                                onClick={() => scrollToHeading(item.id)}
                                className={`w-full text-left py-1.5 px-2.5 rounded-xl font-bold transition-all flex items-start gap-2 cursor-pointer ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                }`}
                            >
                                <span className={`text-[11px] font-black shrink-0 mt-0.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                                    0{idx + 1}.
                                </span>
                                <span className="line-clamp-2 leading-snug">{item.text}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
