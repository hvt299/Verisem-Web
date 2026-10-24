'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/features/admin/admin.service';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import { Activity, Server, Users, Building2, Briefcase, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { systemService } from '@/features/system/system.service';

export default function AdminAnalyticsPage() {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [metricsData, setMetricsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [days, setDays] = useState(14);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            adminService.getAdminAnalytics(days),
            adminService.getAdminDashboardMetrics(days)
        ])
        .then(([analytics, metrics]) => {
            setDashboardData(analytics);
            setMetricsData(metrics);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }, [days]);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Phân tích Hệ thống</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Giám sát tổng quan, tải hệ thống, và biểu đồ tăng trưởng từ dữ liệu thực.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <select 
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 shadow-sm cursor-pointer"
                    >
                        <option value="7">7 ngày qua</option>
                        <option value="14">14 ngày qua</option>
                        <option value="30">30 ngày qua</option>
                        <option value="90">3 tháng qua</option>
                        <option value="180">6 tháng qua</option>
                        <option value="365">1 năm qua</option>
                        <option value="9999">Toàn thời gian</option>
                    </select>
                </div>
            </div>

            {/* Metrics Cards */}
            {metricsData && metricsData.overview_stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <MetricCard 
                        title="Tổng Người Dùng" 
                        value={metricsData.overview_stats.total_users?.value || 0} 
                        subtitle={`+${metricsData.overview_stats.total_users?.trend || 0} (${days} ngày)`}
                        icon={Users} 
                        colorClass="text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20" 
                    />
                    <MetricCard 
                        title="Doanh Nghiệp" 
                        value={metricsData.overview_stats.total_companies?.value || 0} 
                        subtitle={`(${days} ngày)`}
                        icon={Building2} 
                        colorClass="text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20" 
                    />
                    <MetricCard 
                        title="DN Đã Duyệt" 
                        value={metricsData.overview_stats.total_companies?.trend || 0} 
                        subtitle={`(${days} ngày)`}
                        icon={CheckCircle2} 
                        colorClass="text-green-600 bg-green-50 border-green-100 dark:bg-green-500/10 dark:border-green-500/20" 
                    />
                    <MetricCard 
                        title="DN Chờ Duyệt" 
                        value={metricsData.overview_stats.pending_kyc?.value || 0} 
                        subtitle={`(${days} ngày)`}
                        icon={AlertCircle} 
                        colorClass="text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20" 
                    />
                    <MetricCard 
                        title="Tin Tuyển Dụng" 
                        value={metricsData.overview_stats.active_jobs?.value || 0} 
                        subtitle={`(${days} ngày)`}
                        icon={Briefcase} 
                        colorClass="text-pink-600 bg-pink-50 border-pink-100 dark:bg-pink-500/10 dark:border-pink-500/20" 
                    />
                    <MetricCard 
                        title="Việc Làm Mới" 
                        value={metricsData.overview_stats.active_jobs?.trend || metricsData.overview_stats.active_jobs?.value || 0} 
                        subtitle={`(${days} ngày)`}
                        icon={Activity} 
                        colorClass="text-primary-600 bg-primary-50 border-primary-100 dark:bg-primary-500/10 dark:border-primary-500/20" 
                    />
                </div>
            )}

            <AdminAnalytics charts={dashboardData?.charts} />

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <SystemHealthMonitor />
            </div>
        </div>
    );
}

function MetricCard({ title, value, subtitle, icon: Icon, colorClass }: any) {
    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl border ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div>
                <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{value.toLocaleString()}</p>
                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{subtitle}</p>
            </div>
        </div>
    );
}

function SystemHealthMonitor() {
    const [health, setHealth] = useState<Record<string, string> | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchHealth = async (force: boolean = false) => {
        if (!force && typeof document !== 'undefined' && document.hidden) return;
        setIsRefreshing(true);
        try {
            const res = await systemService.getSystemHealth();
            setHealth(res);
        } catch (e) {
            setHealth({ error: 'disconnected' });
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHealth(true);
        // Ping every 60s instead of 30s, and pause if browser tab is hidden
        const interval = setInterval(() => fetchHealth(false), 60000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        if (!status) return 'bg-slate-500';
        if (status === 'connected' || status === 'healthy' || status === 'Hoạt động' || status === 'Bỏ qua') return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
        return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    };

    const getStatusText = (status: string) => {
        if (!status) return 'Đang tải...';
        if (status === 'connected' || status === 'healthy' || status === 'Hoạt động') return 'Hoạt động';
        if (status === 'Bỏ qua') return 'Hoạt động (Local)';
        return status;
    };

    if (!health) {
        return (
            <div className="flex items-center gap-3 text-slate-500">
                <Activity className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Đang kiểm tra tín hiệu máy chủ...</span>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shrink-0">
                        <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Giám sát Kết nối Backend (Real-time)</h2>
                        <p className="text-xs text-slate-500 mt-1">Tự động kiểm tra định kỳ mỗi 60s (Cache 5 phút bảo vệ Quota AI)</p>
                    </div>
                </div>
                <button
                    onClick={() => fetchHealth(true)}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    title="Làm mới trạng thái kết nối"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Làm mới</span>
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                <HealthCard title="NextJS / FastAPI" status={health.fastapi} />
                <HealthCard title="MongoDB Database" status={health.mongodb} />
                <HealthCard title="Redis Cache" status={health.redis} />
                <HealthCard title="Gemini 3.6 Flash" status={health.gemini_3_6} />
                <HealthCard title="Gemini 3.1 Lite" status={health.gemini_3_1_lite} />
                <HealthCard title="Gemini 2.5 Flash" status={health.gemini_2_5} />
                <HealthCard title="BGE-M3 (Vector)" status={health.bgem3} />
            </div>
        </div>
    );

    function HealthCard({ title, status }: { title: string, status: string }) {
        const isError = !['connected', 'healthy', 'Hoạt động', 'Bỏ qua'].includes(status);
        return (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3 truncate" title={title}>{title}</p>
                <div className="flex items-center gap-2">
                    <span className="relative flex w-2.5 h-2.5 shrink-0">
                        <span className={`absolute inline-flex w-full h-full rounded-full animate-ping opacity-75 ${isError ? 'bg-red-400' : 'bg-green-400'}`} />
                        <span className={`relative inline-flex w-2.5 h-2.5 rounded-full ${getStatusColor(status)}`} />
                    </span>
                    <span className={`text-sm font-black truncate ${isError ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {getStatusText(status)}
                    </span>
                </div>
            </div>
        );
    }
}
