'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Hexagon, Sun, Moon, ChevronDown, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from '@/store/useLanguageStore';
import { cn } from '@/utils/utils';

export const LANGUAGES = [
    {
        code: 'VI' as const,
        name: 'Tiếng Việt',
        flag: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/960px-Flag_of_Vietnam.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail'
    },
    {
        code: 'EN' as const,
        name: 'English',
        flag: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/3840px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?utm_source=vi.wikipedia.org&utm_campaign=index&utm_content=thumbnail'
    },
];

export default function AuthLogo() {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const languageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (languageRef.current && !languageRef.current.contains(target)) {
                setIsLanguageOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLanguage = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

    const handleLanguageChange = (code: 'VI' | 'EN') => {
        setLanguage(code);
        setIsLanguageOpen(false);
    };

    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-transparent pointer-events-none transition-all duration-300 font-sans">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 pointer-events-none">
                {/* Logo + Tên bộ nhận diện website (trùng khớp 100% PublicHeader, fixed, click về trang chủ) */}
                <Link
                    href={ROUTES.HOME}
                    className="group relative z-50 flex items-center gap-2 pointer-events-auto focus:outline-hidden"
                    title={t('common.header.home', undefined, 'Trang chủ Verisem')}
                >
                    {/* Logo Mark */}
                    <div className="relative flex h-10 w-10 items-center justify-center">
                        {/* Ambient glow */}
                        <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-md transition-all duration-500 group-hover:bg-blue-500/35 group-hover:blur-lg" />

                        {/* Main mark */}
                        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-600 to-blue-800 shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-blue-600/30">
                            {/* Subtle light sweep */}
                            <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/25 to-transparent transition-all duration-700 group-hover:left-[130%]" />

                            {/* Hexagon */}
                            <Hexagon
                                className="relative z-10 h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110"
                                fill="currentColor"
                            />
                        </div>
                    </div>

                    {/* Wordmark */}
                    <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                        VERI
                        <span className="text-blue-600 transition-colors duration-300 group-hover:text-blue-500 dark:text-blue-400 dark:group-hover:text-blue-300">
                            SEM
                        </span>
                    </span>
                </Link>

                {/* Cụm điều khiển: Dark/Light Mode & Ngôn ngữ (bám sát PublicHeader, nền trong suốt) */}
                <div className="relative z-50 flex items-center gap-1 md:gap-2 pointer-events-auto">
                    {/* Chọn Ngôn ngữ */}
                    <div className="relative" ref={languageRef}>
                        <button
                            onClick={() => setIsLanguageOpen((prev) => !prev)}
                            className={cn(
                                'flex h-10 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors cursor-pointer',
                                isLanguageOpen
                                    ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400'
                            )}
                            title={t('common.header.select_language', undefined, 'Chọn ngôn ngữ')}
                            aria-label={t('common.header.select_language', undefined, 'Chọn ngôn ngữ')}
                            aria-expanded={isLanguageOpen}
                        >
                            <img
                                src={selectedLanguage.flag}
                                alt={selectedLanguage.name}
                                className="h-4 w-6 rounded-xs object-cover shadow-xs"
                            />
                            <span>{selectedLanguage.code}</span>
                            <ChevronDown className={cn('h-3 w-3 text-slate-400 transition-transform duration-200', isLanguageOpen && 'rotate-180')} />
                        </button>

                        {isLanguageOpen && (
                            <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 z-50">
                                {LANGUAGES.map((item) => {
                                    const isSelected = language === item.code;
                                    return (
                                        <button
                                            key={item.code}
                                            onClick={() => handleLanguageChange(item.code)}
                                            className={cn(
                                                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors cursor-pointer',
                                                isSelected
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                                            )}
                                        >
                                            <img src={item.flag} alt={item.name} className="h-4 w-6 rounded-xs object-cover shadow-xs" />
                                            <span className="flex-1">{item.name}</span>
                                            {isSelected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Chuyển đổi Dark / Light Theme */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400 cursor-pointer"
                            aria-label={t('common.header.toggle_theme', undefined, 'Chuyển đổi giao diện')}
                            title={theme === 'dark' ? t('common.header.switch_to_light', undefined, 'Chuyển sang chế độ Sáng') : t('common.header.switch_to_dark', undefined, 'Chuyển sang chế độ Tối')}
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
        </header>
    );
}