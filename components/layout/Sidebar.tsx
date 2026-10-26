'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, FolderOpen, FileText, ClipboardCheck, Home, BarChart2, Settings, HelpCircle, ChevronLeft, ChevronRight, Hexagon, X, Building2, ShieldCheck, ArrowRightLeft, MessageSquare, Sliders, CreditCard, Star, Map, History, FileSignature, Bookmark, Heart, Mail, Send, Newspaper } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useHRViewStore } from "@/store/useHRViewStore";
import { UserRole } from "@/types";
import { cn } from "@/utils/utils";
import { getTierBadgeConfig } from "@/utils/tier-colors";
import { ROUTES } from "@/constants/routes";

type MenuItem = {
    name: string;
    icon: any;
    href: string;
    badge?: string;
    requiredTierLevel?: number;
};

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (val: boolean) => void;
}

export default function Sidebar({
    isCollapsed,
    setIsCollapsed,
    isMobileOpen,
    setIsMobileOpen
}: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const role = user?.role || UserRole.APPLICANT;
    const isAdmin = role === UserRole.ADMIN;
    const isHrOwner = role === UserRole.HR_OWNER;

    const { hrViewMode, setHrViewMode } = useHRViewStore();
    const [adminMenuGroup, setAdminMenuGroup] = useState<'MANAGEMENT' | 'SYSTEM'>('MANAGEMENT');

    const viewMode = isHrOwner ? hrViewMode : 'MEMBER';

    const handleToggleView = () => {
        if (!isHrOwner) return;
        setHrViewMode(viewMode === 'OWNER' ? 'MEMBER' : 'OWNER');
    };

    const hrMenu: MenuItem[] = [
        {
            name: "Tổng quan",
            icon: LayoutDashboard,
            href: ROUTES.HR_DASHBOARD
        },
        {
            name: "Chiến dịch tuyển dụng",
            icon: Briefcase,
            href: ROUTES.HR_JOBS
        },
        {
            name: "Kho hồ sơ",
            icon: Users,
            href: ROUTES.HR_CANDIDATES
        },
        {
            name: "Hồ sơ đã lưu",
            icon: Bookmark,
            href: ROUTES.HR_SAVED_PROFILES
        }
    ];

    const hrAdvancedMenu: MenuItem[] = viewMode === 'OWNER'
        ? [
            {
                name: "Phân tích & Báo cáo",
                icon: BarChart2,
                href: ROUTES.HR_ANALYTICS,
                requiredTierLevel: 2
            }
        ]
        : [];

    const adminManagementMenu: MenuItem[] = [
        { name: "Tổng quan", icon: LayoutDashboard, href: ROUTES.ADMIN_DASHBOARD },
        { name: "Quản lý công ty", icon: Building2, href: ROUTES.ADMIN_COMPANIES },
        { name: "Quản lý chiến dịch", icon: Briefcase, href: ROUTES.ADMIN_JOBS },
        { name: "Quản lý CV", icon: FileText, href: ROUTES.ADMIN_CVS },
        { name: "Quản lý thư", icon: FileSignature, href: ROUTES.ADMIN_COVER_LETTERS },
        { name: "Quản lý blog", icon: Newspaper, href: ROUTES.ADMIN_BLOGS },
        { name: "Hỗ trợ người dùng", icon: MessageSquare, href: ROUTES.ADMIN_SUPPORT_TICKETS }
    ];

    const adminSystemMenu: MenuItem[] = [
        { name: "Phân tích hệ thống", icon: BarChart2, href: ROUTES.ADMIN_ANALYTICS },
        { name: "Cấu hình hệ thống", icon: Sliders, href: ROUTES.ADMIN_SYSTEM_SETTINGS },
        { name: "Gói cước & Thanh toán", icon: CreditCard, href: ROUTES.ADMIN_SUBSCRIPTIONS },
        { name: "Kỹ năng (Skills)", icon: Star, href: ROUTES.ADMIN_SKILLS },
        { name: "Đơn vị hành chính", icon: Map, href: ROUTES.ADMIN_UNITS },
        { name: "Lịch sử hoạt động", icon: History, href: ROUTES.ADMIN_AUDIT_LOGS }
    ];

    const applicantMenu: MenuItem[] = [
        {
            name: "Tổng quan",
            icon: LayoutDashboard,
            href: ROUTES.APPLICANT_DASHBOARD
        },
        {
            name: "Thư viện CV",
            icon: FolderOpen,
            href: ROUTES.APPLICANT_CV_LIBRARY
        },
        {
            name: "Thư giới thiệu",
            icon: FileSignature,
            href: ROUTES.APPLICANT_COVER_LETTERS
        },
        {
            name: "Việc làm đã nộp",
            icon: FileText,
            href: ROUTES.APPLICANT_APPLICATIONS
        },
        {
            name: "Việc làm đã lưu",
            icon: Bookmark,
            href: ROUTES.APPLICANT_SAVED_JOBS
        },
        {
            name: "Công ty đã lưu",
            icon: Heart,
            href: ROUTES.APPLICANT_SAVED_COMPANIES
        },
        {
            name: "Tự đánh giá AI",
            icon: ClipboardCheck,
            href: ROUTES.APPLICANT_SELF_SCORE
        }
    ];

    const mainMenuItems =
        isAdmin
            ? (adminMenuGroup === 'MANAGEMENT' ? adminManagementMenu : adminSystemMenu)
            : role === UserRole.APPLICANT
                ? applicantMenu
                : hrMenu;

    const advancedMenuItems =
        isAdmin
            ? []
            : role === UserRole.APPLICANT
                ? []
                : hrAdvancedMenu;

    const bottomItems: MenuItem[] = [
        {
            name: "Cài đặt",
            icon: Settings,
            href: isAdmin
                ? ROUTES.ADMIN_SETTINGS
                : role === UserRole.APPLICANT
                    ? ROUTES.APPLICANT_PROFILE
                    : ROUTES.HR_SETTINGS
        },
        {
            name: "Trợ giúp",
            icon: HelpCircle,
            href: ROUTES.SUPPORT
        },
        {
            name: "Về trang chủ",
            icon: Home,
            href: ROUTES.HOME
        }
    ];

    const renderMenuBlock = (items: MenuItem[]) => {
        return items.map((item) => {
            const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

            const showText = !isCollapsed || isMobileOpen;

            const tierLevel = item.requiredTierLevel || 0;
            const tierConfig = getTierBadgeConfig(tierLevel);

            const activeBgClass =
                tierLevel === 3
                    ? "bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-500"
                    : "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400";

            const indicatorClass =
                tierLevel === 3
                    ? "bg-warning-500"
                    : "bg-primary-600";

            const iconActiveClass =
                tierLevel === 3
                    ? "text-warning-600 dark:text-warning-500"
                    : "text-primary-600 dark:text-primary-400";

            return (
                <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    title={!showText ? item.name : undefined}
                    className={cn("group relative flex items-center gap-3 overflow-hidden rounded-xl text-sm font-medium transition-all duration-200", !showText ? "justify-center p-3" : "px-4 py-3", isActive ? activeBgClass : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200")}
                >
                    {isActive && (
                        <div className={`absolute bottom-0 left-0 top-0 w-1 rounded-r-full ${indicatorClass}`} />
                    )}

                    <item.icon
                        className={cn("h-5 w-5 shrink-0 transition-all duration-200", isActive ? iconActiveClass : "text-slate-500 group-hover:scale-105 group-hover:text-slate-700 dark:group-hover:text-slate-300")}
                    />

                    {showText && (
                        <span className="flex-1 whitespace-nowrap">
                            {item.name}
                        </span>
                    )}

                    {showText && item.badge && (
                        <span
                            className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-sm", tierConfig.bg, tierConfig.text, tierConfig.border)}
                        >
                            {item.badge}
                        </span>
                    )}
                </Link>
            );
        });
    };

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity dark:bg-slate-950/50 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={cn("fixed left-0 top-0 z-50 flex h-full shrink-0 flex-col border-r border-slate-200 bg-white shadow-[8px_0_30px_-20px_rgba(37,99,235,0.35)] transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[8px_0_30px_-20px_rgba(37,99,235,0.28)] md:relative", isCollapsed ? "w-20" : "w-64", isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")}
            >
                <div
                    className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800/80"
                >
                    <Link
                        href={
                            isAdmin
                                ? ROUTES.ADMIN_DASHBOARD
                                : role === UserRole.APPLICANT
                                    ? ROUTES.APPLICANT_DASHBOARD
                                    : ROUTES.HR_DASHBOARD
                        }
                        className="group relative z-50 flex items-center gap-2"
                    >
                        {/* Logo Mark */}
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                            {/* Ambient glow */}
                            <div className="absolute inset-0 rounded-xl bg-primary-500/20 blur-md transition-all duration-500 group-hover:bg-primary-500/35 group-hover:blur-lg" />

                            {/* Main mark */}
                            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-primary-600 to-primary-800 shadow-md shadow-primary-500/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-primary-600/30">
                                {/* Subtle light sweep */}
                                <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/25 to-transparent transition-all duration-700 group-hover:left-[130%]" />

                                {/* Hexagon */}
                                <Hexagon
                                    className="relative z-10 h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110"
                                    fill="currentColor"
                                />
                            </div>
                        </div>

                        {(!isCollapsed || isMobileOpen) && (
                            <span className="whitespace-nowrap text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                VERI
                                <span className="text-primary-600 transition-colors duration-300 group-hover:text-primary-500 dark:text-primary-400 dark:group-hover:text-primary-300">
                                    SEM
                                </span>
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white md:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-6 z-50 hidden h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:scale-110 hover:bg-primary-500 md:flex"
                    aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                >
                    {isCollapsed
                        ? <ChevronRight className="h-4 w-4" />
                        : <ChevronLeft className="h-4 w-4" />
                    }
                </button>

                <nav className="scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 flex-1 overflow-x-hidden overflow-y-auto px-3 py-6">
                    {isHrOwner && (
                        <div className="mb-6 px-2">
                            {(!isCollapsed || isMobileOpen) ? (
                                <div className="relative flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner dark:border-slate-700/70 dark:bg-slate-800/80">
                                    <div
                                        className={cn("absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm transition-all duration-300 ease-out dark:bg-slate-700", viewMode === 'OWNER' ? "left-1" : "left-[calc(50%+1px)]")}
                                    />

                                    <button
                                        onClick={() => setHrViewMode('OWNER')}
                                        className={cn("relative z-10 flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors duration-200", viewMode === 'OWNER' ? "text-primary-600 dark:text-primary-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")}
                                    >
                                        Quản lý
                                    </button>

                                    <button
                                        onClick={() => setHrViewMode('MEMBER')}
                                        className={cn("relative z-10 flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors duration-200", viewMode === 'MEMBER' ? "text-primary-600 dark:text-primary-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")}
                                    >
                                        Tuyển dụng
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleToggleView}
                                    title={viewMode === 'OWNER' ? "Đổi sang: Tuyển dụng" : "Đổi sang: Quản lý"}
                                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-3 text-primary-600 shadow-inner transition-all duration-200 hover:bg-slate-200 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-800/80 dark:text-primary-400 dark:hover:bg-slate-700"
                                >
                                    <ArrowRightLeft className="h-5 w-5 transition-transform duration-300 hover:rotate-180" />
                                </button>
                            )}
                        </div>
                    )}
                    {isAdmin && (
                        <div className="mb-6 px-2">
                            {(!isCollapsed || isMobileOpen) ? (
                                <div className="relative flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner dark:border-slate-700/70 dark:bg-slate-800/80">
                                    <div
                                        className={cn("absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm transition-all duration-300 ease-out dark:bg-slate-700", adminMenuGroup === 'MANAGEMENT' ? "left-1" : "left-[calc(50%+1px)]")}
                                    />

                                    <button
                                        onClick={() => setAdminMenuGroup('MANAGEMENT')}
                                        className={cn("relative z-10 flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors duration-200", adminMenuGroup === 'MANAGEMENT' ? "text-primary-600 dark:text-primary-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")}
                                    >
                                        Quản lý
                                    </button>

                                    <button
                                        onClick={() => setAdminMenuGroup('SYSTEM')}
                                        className={cn("relative z-10 flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors duration-200", adminMenuGroup === 'SYSTEM' ? "text-primary-600 dark:text-primary-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")}
                                    >
                                        Hệ thống
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAdminMenuGroup(prev => prev === 'MANAGEMENT' ? 'SYSTEM' : 'MANAGEMENT')}
                                    title={adminMenuGroup === 'MANAGEMENT' ? "Đổi sang: Hệ thống" : "Đổi sang: Quản lý"}
                                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-3 text-primary-600 shadow-inner transition-all duration-200 hover:bg-slate-200 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-800/80 dark:text-primary-400 dark:hover:bg-slate-700"
                                >
                                    <ArrowRightLeft className="h-5 w-5 transition-transform duration-300 hover:rotate-180" />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="mb-2 px-3">
                        {(!isCollapsed || isMobileOpen) && (
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                                {isAdmin
                                    ? "Quản trị hệ thống"
                                    : role === UserRole.APPLICANT
                                        ? "Không gian Ứng viên"
                                        : viewMode === 'OWNER'
                                            ? "Quản lý Doanh nghiệp"
                                            : "Chuyên viên Tuyển dụng"}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        {renderMenuBlock(mainMenuItems)}
                    </div>

                    {advancedMenuItems.length > 0 && (
                        <div className="mb-2 mt-6">
                            {(!isCollapsed || isMobileOpen) ? (
                                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                                    Tính năng nâng cao
                                </p>
                            ) : (
                                <div className="my-4 h-px w-full bg-slate-200 dark:bg-slate-700/50" />
                            )}

                            <div className="mt-2 space-y-1.5">
                                {renderMenuBlock(advancedMenuItems)}
                            </div>
                        </div>
                    )}
                </nav>

                <div className="shrink-0 space-y-1.5 border-t border-slate-200 px-3 py-4 dark:border-slate-800/50">
                    {bottomItems.map((item) => {
                        const isActive = pathname === item.href;
                        const showText = !isCollapsed || isMobileOpen;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                title={!showText ? item.name : undefined}
                                className={cn("group flex items-center gap-3 overflow-hidden rounded-xl text-sm font-medium transition-all duration-200", !showText ? "justify-center p-3" : "px-4 py-3", isActive ? "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200")}
                            >
                                <item.icon
                                    className={cn("h-5 w-5 shrink-0 transition-all duration-200", isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-500 group-hover:scale-105 group-hover:text-slate-700 dark:group-hover:text-slate-300")}
                                />

                                {showText && (
                                    <span className="whitespace-nowrap">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </aside>
        </>
    );
}