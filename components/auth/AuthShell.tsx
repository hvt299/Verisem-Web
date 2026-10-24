import React from 'react';
import AuthLogo from '@/components/ui/AuthLogo';
import AuthPageBackground from '@/components/auth/AuthPageBackground';

interface AuthShellProps {
    children: React.ReactNode;
    variant: 'login' | 'register';
}

export default function AuthShell({ children, variant }: AuthShellProps) {
    const isLogin = variant === 'login';
    const cardMaxWidth = isLogin ? 'max-w-[520px]' : 'max-w-[1000px]';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 pt-24 sm:pt-28 pb-16 transition-colors duration-300 relative overflow-hidden font-sans">
            {/* Background hình ảnh mờ giống ngoài trang chủ */}
            <AuthPageBackground />

            {/* Thanh Header Cố định (Fixed, trong suốt, không che nội dung) */}
            <AuthLogo />

            <div className="relative z-10 w-full flex flex-col items-center">
                <div 
                    className={`w-full bg-white dark:bg-slate-900 rounded-3xl shadow-sm dark:shadow-none p-6 sm:p-8 md:p-10 border border-slate-200 dark:border-slate-800 transition-[max-width,height] duration-500 ease-in-out ${cardMaxWidth}`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
