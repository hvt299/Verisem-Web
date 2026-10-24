'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useTranslation, LanguageCode } from '@/store/useLanguageStore';
import { cn } from '@/utils/utils';

export const LANGUAGES = [
    {
        code: 'VI' as LanguageCode,
        name: 'Tiếng Việt',
        flag: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/960px-Flag_of_Vietnam.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail'
    },
    {
        code: 'EN' as LanguageCode,
        name: 'English',
        flag: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/3840px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?utm_source=vi.wikipedia.org&utm_campaign=index&utm_content=thumbnail'
    },
];

interface LanguageSwitcherProps {
    variant?: 'pill' | 'minimal' | 'select';
    className?: string;
}

export default function LanguageSwitcher({
    variant = 'pill',
    className = ''
}: LanguageSwitcherProps) {
    const { language, setLanguage } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLanguage = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

    const handleSelect = (code: LanguageCode) => {
        setLanguage(code);
        setIsOpen(false);
    };

    if (variant === 'minimal') {
        return (
            <div className={cn('flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800', className)}>
                {LANGUAGES.map((item) => {
                    const isSelected = item.code === language;
                    return (
                        <button
                            key={item.code}
                            type="button"
                            onClick={() => setLanguage(item.code)}
                            className={cn(
                                'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all',
                                isSelected
                                    ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-blue-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            )}
                        >
                            <img src={item.flag} alt={item.name} className="h-3 w-4.5 rounded-xs object-cover" />
                            <span>{item.code}</span>
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={cn('relative', className)} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-3 py-1.5 text-xs font-bold text-slate-700 backdrop-blur-xs transition-colors hover:bg-slate-100 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                aria-expanded={isOpen}
            >
                <img
                    src={currentLanguage.flag}
                    alt={currentLanguage.name}
                    className="h-3.5 w-5 rounded-xs object-cover shadow-xs"
                />
                <span>{currentLanguage.code}</span>
                <ChevronDown className={cn('h-3 w-3 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 z-50">
                    {LANGUAGES.map((item) => {
                        const isSelected = language === item.code;
                        return (
                            <button
                                key={item.code}
                                type="button"
                                onClick={() => handleSelect(item.code)}
                                className={cn(
                                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors',
                                    isSelected
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                                )}
                            >
                                <img src={item.flag} alt={item.name} className="h-3.5 w-5 rounded-xs object-cover shadow-xs" />
                                <span className="flex-1">{item.name}</span>
                                {isSelected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
