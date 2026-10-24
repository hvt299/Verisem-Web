'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, RefreshCcw, Home, Terminal, Search } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    // Tự động log lỗi ra console hoặc gửi lên Sentry/Datadog nếu có
    useEffect(() => {
        console.error('Hệ thống Verisem phát hiện lỗi nghiêm trọng:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative p-6 transition-colors">
            <div className="absolute inset-0 bg-hot-500/5 dark:bg-hot-500/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-hot-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-4xl shadow-2xl backdrop-blur-xl flex flex-col items-center text-center transition-colors"
            >
                <div className="w-16 h-16 bg-hot-50 dark:bg-hot-500/10 border border-hot-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <AlertOctagon className="w-8 h-8 text-hot-500" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                    Oops! Đã xảy ra sự cố.
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-6">
                    Hệ thống không thể xử lý yêu cầu của bạn lúc này. Chúng tôi đã ghi nhận sự cố và sẽ khắc phục sớm nhất có thể.
                </p>

                {/* Khối hiển thị chi tiết lỗi (Hữu ích khi debug) */}
                <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-8 text-left overflow-hidden">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <Terminal className="w-4 h-4" /> Log chi tiết
                    </div>
                    <p className="text-xs font-mono text-hot-600 dark:text-hot-500 wrap-break-word line-clamp-3">
                        {error.message || "Lỗi ứng dụng nội bộ (Internal Application Error)"}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-3">
                    <Link
                        href={ROUTES.PUBLIC_JOBS}
                        className="flex-1 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Search className="w-4 h-4" /> Khám phá việc làm
                    </Link>
                    <Link
                        href={ROUTES.HOME}
                        className="flex-1 px-6 py-3.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" /> Về Trang chủ
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}