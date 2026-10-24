'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, ChevronDown, Globe, Hexagon, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import { ROUTES } from '@/constants/routes';
import { useTranslation } from '@/store/useLanguageStore';
import { LANGUAGES } from './PublicHeader';

export default function PublicFooter() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { language, setLanguage, t } = useTranslation();
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);

    const languageRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (
                languageRef.current &&
                !languageRef.current.contains(target)
            ) {
                setIsLanguageOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const selectedLanguage =
        LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

    const handleLanguageChange = (code: 'VI' | 'EN') => {
        setLanguage(code);
        setIsLanguageOpen(false);
    };

    return (
        <footer className="border-t border-slate-200 bg-white px-4 sm:px-6 pb-10 pt-16 sm:pt-20 font-sans transition-colors dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto mb-14 grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                {/* Brand (5 cột trên Desktop, full trên mobile) */}
                <div className="sm:col-span-2 lg:col-span-5 space-y-4">
                    <button
                        type="button"
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth',
                            })
                        }
                        className="group flex w-fit items-center gap-2 cursor-pointer"
                        aria-label={t('common.footer.back_to_top', undefined, 'Về đầu trang')}
                    >
                        <div className="relative flex h-10 w-10 items-center justify-center">
                            <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-md transition-all duration-500 group-hover:bg-blue-500/35 group-hover:blur-lg" />

                            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-600 to-blue-800 shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-blue-600/30">
                                <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/25 to-transparent transition-all duration-700 group-hover:left-[130%]" />

                                <Hexagon
                                    className="relative z-10 h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110"
                                    fill="currentColor"
                                />
                            </div>
                        </div>

                        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                            VERI
                            <span className="text-blue-600 transition-colors duration-300 group-hover:text-blue-500 dark:text-blue-400 dark:group-hover:text-blue-300">
                                SEM
                            </span>
                        </span>
                    </button>

                    <p className="max-w-md text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                        {t('common.footer.tagline', undefined, 'Nền tảng Quản trị Tuyển dụng Ứng dụng Trí tuệ Nhân tạo. Giải pháp tối ưu giúp doanh nghiệp tìm đúng người, và ứng viên tìm đúng việc chỉ trong chớp mắt.')}
                    </p>
                </div>

                {/* 3 Cột Liên kết: Responsive dạng Grid 2 cột trên Mobile nhỏ, 3 cột trên Tablet/Desktop */}
                <div className="sm:col-span-2 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                    {/* Candidate */}
                    <div>
                        <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">{t('common.footer.candidates_title', undefined, 'Dành cho Ứng viên')}</h4>

                        <ul className="space-y-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                            <li>
                                <Link
                                    href={ROUTES.PUBLIC_JOBS}
                                    className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                                >{t('common.footer.latest_jobs', undefined, 'Việc làm mới nhất')}</Link>
                            </li>

                            <li>
                                <Link
                                    href={ROUTES.PUBLIC_COMPANIES}
                                    className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                                >{t('common.footer.company_directory', undefined, 'Danh sách công ty')}</Link>
                            </li>

                            <li>
                                <Link
                                    href={ROUTES.BLOG}
                                    className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                                >{t('common.footer.career_guide', undefined, 'Cẩm nang nghề nghiệp')}</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Business */}
                    <div>
                        <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">{t('common.footer.business_title', undefined, 'Doanh nghiệp')}</h4>

                        <ul className="space-y-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                            <li>
                                <Link
                                    href="/features"
                                    className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                                >{t('common.footer.products_features', undefined, 'Sản phẩm & Tính năng')}</Link>
                            </li>

                            <li>
                                <Link
                                    href={ROUTES.PRICING}
                                    className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                                >{t('common.footer.pricing_plans', undefined, 'Bảng giá dịch vụ')}</Link>
                            </li>

                            <li>
                                <Link
                                    href={ROUTES.SUPPORT}
                                    className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                                >{t('common.footer.customer_support', undefined, 'Hỗ trợ khách hàng')}</Link>
                            </li>
                        </ul>
                    </div>

                    {/* About */}
                    <div className="col-span-2 sm:col-span-1">
                        <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">{t('common.footer.about_title', undefined, 'Về Verisem')}</h4>

                        <ul className="space-y-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                            <li>
                                <Link
                                    href={ROUTES.ABOUT}
                                    className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                                >{t('common.footer.about_us', undefined, 'Về chúng tôi')}</Link>
                            </li>

                            <li>
                                <Link
                                    href="/terms"
                                    className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                                >{t('common.footer.terms_of_service', undefined, 'Điều khoản dịch vụ')}</Link>
                            </li>

                            <li>
                                <Link
                                    href="/privacy"
                                    className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                                >{t('common.footer.privacy_policy', undefined, 'Chính sách bảo mật')}</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 border-t border-slate-100 pt-8 text-xs font-medium text-slate-400 dark:border-slate-800 dark:text-slate-500 md:flex-row">
                <p>{t('common.footer.copyright', undefined, '© 2026 Verisem. Bản quyền đã được bảo hộ.')}</p>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                    {/* Social */}
                    <div className="flex items-center gap-5 pr-2 sm:pr-3">
                        <button
                            type="button"
                            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            X (Twitter)
                        </button>

                        <button
                            type="button"
                            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            Facebook
                        </button>

                        <button
                            type="button"
                            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            LinkedIn
                        </button>

                        <button
                            type="button"
                            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            GitHub
                        </button>
                    </div>

                    <div className="hidden h-5 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

                    {/* Language - đồng bộ Header */}
                    <div className="relative" ref={languageRef}>
                        <button
                            type="button"
                            onClick={() =>
                                setIsLanguageOpen((prev) => !prev)
                            }
                            className={`flex h-10 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors ${isLanguageOpen
                                    ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400'
                                }`}
                            title={t('common.header.aria.select_language', undefined, 'Chọn ngôn ngữ')}
                            aria-label={t('common.header.aria.select_language', undefined, 'Chọn ngôn ngữ')}
                            aria-expanded={isLanguageOpen}
                        >
                            <img
                                src={selectedLanguage.flag}
                                alt={selectedLanguage.name}
                                className="h-4 w-6 rounded-sm object-cover shadow-sm"
                            />

                            <span>{selectedLanguage.code}</span>

                            <ChevronDown
                                className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {isLanguageOpen && (
                            <div className="absolute bottom-full right-0 mb-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-bottom-2 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
                                {LANGUAGES.map((item) => {
                                    const isSelected =
                                        language === item.code;

                                    return (
                                        <button
                                            key={item.code}
                                            type="button"
                                            onClick={() =>
                                                handleLanguageChange(item.code)
                                            }
                                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${isSelected
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                                                }`}
                                        >
                                            <img
                                                src={item.flag}
                                                alt={item.name}
                                                className="h-4 w-6 rounded-sm object-cover shadow-sm"
                                            />

                                            <span className="flex-1">
                                                {item.name}
                                            </span>

                                            {isSelected && (
                                                <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Theme - đồng bộ Header */}
                    {mounted && (
                        <button
                            type="button"
                            onClick={() =>
                                setTheme(
                                    theme === 'dark' ? 'light' : 'dark'
                                )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                            aria-label={t('common.header.aria.toggle_theme', undefined, 'Chuyển đổi giao diện')}
                            title={t('common.header.aria.toggle_theme', undefined, 'Chuyển đổi giao diện')}
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-4.5 w-4.5" />
                            ) : (
                                <Moon className="h-4.5 w-4.5" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </footer>
    );
}