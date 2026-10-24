'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import NotificationToast from '@/components/shared/NotificationToast';
import { useAuthStore } from '@/store/useAuthStore';
import { Hexagon } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { loading } = useAuthStore();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (loading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="relative flex flex-col items-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary-500/20 blur-xl rounded-full animate-pulse" />
                    <div className="relative w-16 h-16 flex items-center justify-center mb-6">
                        <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-2xl" />
                        <div className="absolute inset-0 border-4 border-primary-600 rounded-2xl border-t-transparent border-b-transparent animate-spin" />
                        <Hexagon className="w-8 h-8 text-primary-600 animate-pulse" fill="currentColor" />
                    </div>
                    <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
                        VERI<span className="text-primary-600 dark:text-primary-400">SEM</span>
                    </h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 animate-pulse">
                        Đang xác thực phiên đăng nhập...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Sidebar
                isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}
            />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header setIsMobileOpen={setIsMobileOpen} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </div>
            <NotificationToast />
        </div>
    );
}