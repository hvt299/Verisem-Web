'use client';

import { Search, Sun, Moon, Menu, LogOut, ChevronDown, Settings, CreditCard, Zap, Globe, CalendarDays, Check, Bell, ShieldCheck, Sliders, Star, Map , History as HistoryIcon, MessageSquare } from "lucide-react";
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/store/useLanguageStore';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/shared/NotificationBell';
import { UserRole } from '@/types';
import { ROUTES } from '@/constants/routes';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/utils/utils';
import { getTierBadgeConfig } from '@/utils/tier-colors';
import { useQueryClient } from '@tanstack/react-query';
import { formatSubscriptionDate } from '@/utils/format';
import { LANGUAGES } from './PublicHeader';

interface HeaderProps {
    setIsMobileOpen: (val: boolean) => void;
}

export default function Header({ setIsMobileOpen }: HeaderProps) {
    const { data: subscriptionRes } = useSubscription();
    const planInfo = subscriptionRes?.data;
    const planBadgeConfig = getTierBadgeConfig(planInfo?.tier_level || 1);

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const { language, setLanguage, t } = useTranslation();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);

    const { user, logout, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (isAuthenticated) {
            queryClient.invalidateQueries({
                queryKey: ['my-subscription'],
            });
        } else {
            queryClient.removeQueries({
                queryKey: ['my-subscription'],
            });
        }
    }, [isAuthenticated, queryClient]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setIsDropdownOpen(false);
            }

            if (languageRef.current && !languageRef.current.contains(target)) {
                setIsLanguageOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const role = user?.role || UserRole.APPLICANT;

    const getRoleDisplayName = () => {
        if (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) {
            return t('common.roles.hr', undefined, 'Nhà tuyển dụng');
        }

        if (role === UserRole.ADMIN) {
            return t('common.roles.admin', undefined, 'Quản trị viên');
        }

        return t('common.roles.applicant', undefined, 'Ứng viên');
    };

    const profileRoute =
        role === UserRole.ADMIN
            ? ROUTES.ADMIN_SETTINGS
            : role === UserRole.APPLICANT
                ? ROUTES.APPLICANT_PROFILE
                : ROUTES.HR_SETTINGS;

    const billingRoute =
        role === UserRole.APPLICANT
            ? ROUTES.APPLICANT_BILLING
            : ROUTES.HR_BILLING;

    const getPlanName = () => {
        if (!planInfo?.current_plan) {
            return 'Chưa có gói';
        }

        return planInfo.current_plan
            .replace('HR ', '')
            .replace('App ', '');
    };

    const selectedLanguage = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

    const handleLanguageChange = (code: 'VI' | 'EN') => {
        setLanguage(code);
        setIsLanguageOpen(false);
    };

    return (
        <header className="sticky top-0 z-25 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 font-sans shadow-sm backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/95 md:px-8">
            {/* LEFT */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu */}
                <button onClick={() => setIsMobileOpen(true)} className="rounded-full p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400 md:hidden" aria-label="Mở menu">
                    <Menu className="h-5 w-5" />
                </button>

                {/* Search */}
                <div className="hidden w-80 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition-all focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:focus-within:border-blue-500/50 dark:focus-within:bg-slate-800 md:flex">
                    <Search className="h-4.5 w-4.5 shrink-0 text-slate-400" />

                    <input type="text" placeholder="Tìm kiếm..." className="w-full border-none bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200" />
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-1 md:gap-2">
                {/* Language */}
                <div className="relative" ref={languageRef}>
                    <button type="button" onClick={() => setIsLanguageOpen((prev) => !prev)} className={cn('flex h-10 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors', isLanguageOpen ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400')} title="Chọn ngôn ngữ" aria-label="Chọn ngôn ngữ" aria-expanded={isLanguageOpen}>
                        <img src={selectedLanguage.flag} alt={selectedLanguage.name} className="h-4 w-6 rounded-sm object-cover shadow-sm" />
                        <span>{selectedLanguage.code}</span>
                        <ChevronDown className={cn('h-3 w-3 text-slate-400 transition-transform duration-200', isLanguageOpen && 'rotate-180')} />
                    </button>

                    {isLanguageOpen && (
                        <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
                            {LANGUAGES.map((item) => {
                                const isSelected = language === item.code;

                                return (
                                    <button key={item.code} type="button" onClick={() => handleLanguageChange(item.code)} className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors', isSelected ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white')}>
                                        <img src={item.flag} alt={item.name} className="h-4 w-6 rounded-sm object-cover shadow-sm" />
                                        <span className="flex-1">{item.name}</span>
                                        {isSelected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Theme */}
                {mounted && (
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400" aria-label="Chuyển đổi giao diện" title="Chuyển đổi giao diện">
                        {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                    </button>
                )}

                {/* Notification */}
                <NotificationBell />

                <div className="mx-2 hidden h-6 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

                {/* Profile */}
                <div className="relative" ref={dropdownRef}>
                    <button type="button" onClick={() => setIsDropdownOpen((prev) => !prev)} className="group/profile flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 md:gap-3" aria-expanded={isDropdownOpen} aria-haspopup="menu">
                        <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=0284c7&color=fff&bold=true`} alt="Avatar" className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm dark:border-slate-700" referrerPolicy="no-referrer" />

                        <div className="hidden flex-col items-start text-left md:flex">
                            <div className="relative max-w-[130px] overflow-hidden whitespace-nowrap" title={user?.full_name || 'User'}>
                                {(user?.full_name?.length || 0) > 13 ? (
                                    <div className="inline-flex items-center gap-3 animate-marquee-left hover:[animation-play-state:paused] whitespace-nowrap text-sm font-bold leading-tight text-slate-700 dark:text-white cursor-pointer">
                                        <span>{user?.full_name}</span>
                                        <span className="opacity-40">•</span>
                                        <span>{user?.full_name}</span>
                                        <span className="opacity-40">•</span>
                                    </div>
                                ) : (
                                    <span className="block truncate text-sm font-bold leading-tight text-slate-700 dark:text-white">
                                        {user?.full_name || 'User'}
                                    </span>
                                )}
                            </div>

                            <div className="mt-0.5 flex items-center gap-1.5">
                                <span className="text-[10px] font-medium leading-tight text-slate-500 dark:text-slate-400">
                                    {getRoleDisplayName()}
                                </span>

                                {planInfo?.current_plan && role !== UserRole.ADMIN && (
                                    <span className={cn('rounded-sm border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider shadow-sm', planBadgeConfig.bg, planBadgeConfig.text, planBadgeConfig.border)}>
                                        {getPlanName()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <ChevronDown className={cn('hidden h-4 w-4 text-slate-400 transition-transform duration-200 md:block', isDropdownOpen && 'rotate-180')} />
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            {/* Subscription */}
                            {role !== UserRole.ADMIN && planInfo && (
                                <div className="mx-2 mb-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-0">
                                        <div className="min-w-0 sm:pr-3">
                                            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Gói hiện tại</span>
                                            <span className="mt-0.5 block truncate text-xs font-bold text-blue-600 dark:text-blue-400" title={planInfo.current_plan}>{planInfo.current_plan}</span>
                                        </div>

                                        <div className="border-t border-slate-200 pt-2 sm:border-l sm:border-t-0 sm:px-3 sm:pt-0 dark:border-slate-700">
                                            <div className="flex items-center gap-1.5">
                                                <Zap className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
                                                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Credits</span>
                                            </div>
                                            <span className="mt-0.5 block text-xs font-bold text-slate-700 dark:text-slate-200">{(planInfo.credits_remaining || 0).toLocaleString('vi-VN')}</span>
                                        </div>

                                        <div className="border-t border-slate-200 pt-2 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0 dark:border-slate-700">
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                                                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Thời hạn</span>
                                            </div>
                                            <span className="mt-0.5 block truncate text-xs font-bold text-slate-700 dark:text-slate-200">{formatSubscriptionDate(planInfo.end_date)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Profile */}
                            <Link href={profileRoute} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400">
                                <Settings className="h-4 w-4" />
                                Thiết lập thông tin
                            </Link>

                                                        {/* Admin Quick Links */}
                            {role === UserRole.ADMIN && (
                                <>
                                    <Link href={ROUTES.ADMIN_SYSTEM_SETTINGS} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400">
                                        <Sliders className="h-4 w-4" />
                                        Cấu hình hệ thống
                                    </Link>
                                    <Link href={ROUTES.ADMIN_AUDIT_LOGS} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400">
                                        <HistoryIcon className="h-4 w-4" />
                                        Lịch sử hoạt động
                                    </Link>
                                    <Link href={ROUTES.ADMIN_SUPPORT_TICKETS} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400">
                                        <MessageSquare className="h-4 w-4" />
                                        Hỗ trợ người dùng
                                    </Link>
                                </>
                            )}

                            {/* Billing */}
                            {role !== UserRole.ADMIN && (
                                <Link href={billingRoute} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400">
                                    <CreditCard className="h-4 w-4" />
                                    Quản lý gói cước
                                </Link>
                            )}

                            <div className="my-2 h-px bg-slate-100 dark:bg-slate-700/50" />

                            {/* Logout */}
                            <button type="button" onClick={() => { setIsDropdownOpen(false); logout(router); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10">
                                <LogOut className="h-4 w-4" />
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}