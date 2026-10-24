'use client';

import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { LineChart as LineIcon, PieChart as PieIcon, BarChart2, Cpu, Users, Building2, Briefcase, FileText, Wrench, LifeBuoy } from 'lucide-react';
import React from 'react';

interface AdminAnalyticsProps {
    charts: any;
}

const tooltipStyle = {
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-card-bg)',
    boxShadow: 'var(--shadow-dropdown)',
    color: 'var(--color-text)',
    fontSize: '12px',
    fontWeight: 'bold' as const
};
const tooltipItemStyle = { color: 'var(--color-text)', fontWeight: 'bold' as const };

const renderCustomBarLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    if (value === undefined || value === null) return null;
    return (
        <text
            x={Number(x) + Number(width) + 8}
            y={Number(y) + Number(height) / 2}
            className="fill-slate-700 dark:fill-slate-200 text-[11px] font-bold select-none"
            dominantBaseline="central"
            textAnchor="start"
        >
            {value}
        </text>
    );
};

// Helper components for consistency
const AnalyticsCard = ({ index, icon: Icon, iconClass, bgClass, borderClass, title, description, children }: any) => (
    <div className={`animate-in fade-in slide-in-from-bottom-4 bg-card-bg border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col p-5 h-[380px]`} style={{ animationDelay: `${index * 50}ms` }}>
        <div className="flex items-center gap-3 mb-4">
            <div className={`p-2.5 rounded-xl ${bgClass} ${borderClass} border`}>
                <Icon className={`w-5 h-5 ${iconClass}`} />
            </div>
            <div>
                <h3 className="font-bold text-sm text-text">{title}</h3>
                <p className="text-[10px] text-text-subtle mt-0.5">{description}</p>
            </div>
        </div>
        <div className="flex-1 w-full relative min-h-0">
            {children}
        </div>
    </div>
);

const EmptyChartState = ({ message }: { message: string }) => (
    <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-text-subtle">
        {message}
    </div>
);

export default function AdminAnalytics({ charts }: AdminAnalyticsProps) {
    if (!charts) return null;

    const getChart = (key: string) => Array.isArray(charts[key]) ? charts[key] : [];

    const growthTrend = getChart('growth_trend');
    const roleDistribution = getChart('role_distribution');
    const companyStatus = getChart('company_status');
    const jobTrend = getChart('job_trend');
    const jobsByIndustry = getChart('jobs_by_industry');
    const topSkills = getChart('top_skills');
    const systemLoad = getChart('system_load');
    const appFunnel = getChart('app_funnel');
    const subscriptionTier = getChart('subscription_tier');
    const ticketTrend = getChart('ticket_trend');
    const ticketStatus = getChart('ticket_status');
    const jobStatus = getChart('job_status');

    return (
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card-bg shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 bg-linear-to-br from-primary-500/2.5 via-transparent to-info-500/2 pointer-events-none" />

            <div className="relative px-5 py-5 lg:px-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center shadow-sm">
                        <BarChart2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base lg:text-lg font-black text-text tracking-tight">Biểu đồ Phân tích</h2>
                            
                        </div>
                        <p className="text-xs text-text-subtle mt-1">12 Biểu đồ tự động cập nhật theo thời gian thực</p>
                    </div>
                </div>
            </div>

            <div className="relative p-4 lg:p-5 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    
                    {/* 1. Growth Trend */}
                    <AnalyticsCard index={0} icon={LineIcon} iconClass="text-primary-600 dark:text-primary-400" bgClass="bg-primary-50 dark:bg-primary-500/10" borderClass="border-primary-100 dark:border-primary-500/20" title="Tăng trưởng Người dùng & DN" description="Số lượng đăng ký mới theo thời gian">
                        {growthTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                                        <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} opacity={0.5} />
                                    <XAxis dataKey="date" stroke="var(--color-text-subtle)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--color-text-subtle)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <RechartsTooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                                    <Area type="monotone" dataKey="users" name="Người dùng mới" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="companies" name="Doanh nghiệp mới" stroke="#10b981" fillOpacity={1} fill="url(#colorCompanies)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                    {/* 2. System Load (Applications) */}
                    <AnalyticsCard index={1} icon={Cpu} iconClass="text-info-600 dark:text-info-400" bgClass="bg-info-50 dark:bg-info-500/10" borderClass="border-info-100 dark:border-info-500/20" title="Lưu lượng Ứng tuyển (System Load)" description="Số CV nộp vào toàn hệ thống theo thời gian">
                        {systemLoad.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={systemLoad} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                    <defs>
                                        <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-info-500)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--color-info-500)" stopOpacity={0} /></linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11 }} allowDecimals={false} />
                                    <RechartsTooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                                    <Area type="monotone" dataKey="cv_received" name="CV Mới" stroke="var(--color-info-500)" strokeWidth={2.5} fill="url(#colorLoad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                    {/* 3. Job Trend */}
                    <AnalyticsCard index={2} icon={Briefcase} iconClass="text-pink-600 dark:text-pink-400" bgClass="bg-pink-50 dark:bg-pink-500/10" borderClass="border-pink-100 dark:border-pink-500/20" title="Xu hướng Đăng tuyển" description="Số lượng Job mới tạo theo thời gian">
                        {jobTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={jobTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11 }} allowDecimals={false} />
                                    <RechartsTooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} cursor={{ fill: 'var(--color-border)', opacity: 0.2 }} />
                                    <Area type="monotone" dataKey="jobs" name="Việc làm mới" stroke="#ec4899" fillOpacity={0.15} fill="#ec4899" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                    {/* 4. Application Funnel */}
                    <AnalyticsCard index={3} icon={FileText} iconClass="text-success-600 dark:text-success-400" bgClass="bg-success-50 dark:bg-success-500/10" borderClass="border-success-100 dark:border-success-500/20" title="Phễu Trạng thái Ứng tuyển" description="Tỉ lệ chuyển đổi CV toàn hệ thống">
                        {appFunnel.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={appFunnel} layout="vertical" margin={{ top: 5, right: 35, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600 }} className="text-slate-600 dark:text-slate-300" width={80} />
                                    <RechartsTooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" name="Số lượng CV" radius={[0, 4, 4, 0]} barSize={24} label={renderCustomBarLabel}>
                                        {appFunnel.map((entry: any, index: number) => (
                                            <Cell key={`funnel-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                    {/* 5. Company Status (Donut) */}
                    <AnalyticsCard index={4} icon={Building2} iconClass="text-warning-600 dark:text-warning-400" bgClass="bg-warning-50 dark:bg-warning-500/10" borderClass="border-warning-100 dark:border-warning-500/20" title="Trạng thái Doanh nghiệp" description="Tỉ lệ DN Đã duyệt / Chờ duyệt / Bị từ chối">
                        {companyStatus.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={companyStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {companyStatus.map((entry: any, index: number) => (
                                            <Cell key={`company-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-subtle)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                    {/* 6. Roles Distribution (Pie) */}
                    <AnalyticsCard index={5} icon={Users} iconClass="text-indigo-600 dark:text-indigo-400" bgClass="bg-indigo-50 dark:bg-indigo-500/10" borderClass="border-indigo-100 dark:border-indigo-500/20" title="Phân bổ Vai trò Người dùng" description="Tỉ lệ tài khoản Hệ thống">
                        {roleDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={roleDistribution} cx="50%" cy="50%" outerRadius={85} dataKey="value" stroke="none" labelLine={false} label={({ cx, cy, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 }: any) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                        if (percent < 0.05) return null;
                                        return <text x={x} y={y} fill="white" fontSize={11} fontWeight="bold" textAnchor="middle" dominantBaseline="central">{`${(percent * 100).toFixed(0)}%`}</text>;
                                    }}>
                                        {roleDistribution.map((entry: any, index: number) => (
                                            <Cell key={`role-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-subtle)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                    {/* 7. Subscriptions (Pie) */}
                    <AnalyticsCard index={6} icon={PieIcon} iconClass="text-amber-600 dark:text-amber-400" bgClass="bg-amber-50 dark:bg-amber-500/10" borderClass="border-amber-100 dark:border-amber-500/20" title="Phân bổ Gói Cước" description="Tỉ lệ sử dụng Gói Miễn phí & Trả phí">
                        {subscriptionTier.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={subscriptionTier} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {subscriptionTier.map((entry: any, index: number) => (
                                            <Cell key={`sub-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-subtle)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                    {/* 8. Top Jobs By Industry */}
                    <AnalyticsCard index={7} icon={BarChart2} iconClass="text-cyan-600 dark:text-cyan-400" bgClass="bg-cyan-50 dark:bg-cyan-500/10" borderClass="border-cyan-100 dark:border-cyan-500/20" title="Top Ngành Nghề" description="Số lượng Job mở nhiều nhất">
                        {jobsByIndustry.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={jobsByIndustry} layout="vertical" margin={{ top: 5, right: 35, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 500 }} className="text-slate-600 dark:text-slate-300" width={85} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                                    <Bar dataKey="value" name="Jobs" radius={[0, 4, 4, 0]} barSize={20} label={renderCustomBarLabel}>
                                        {jobsByIndustry.map((entry: any, index: number) => (
                                            <Cell key={`ind-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                    {/* 9. Top Skills */}
                    <AnalyticsCard index={8} icon={Wrench} iconClass="text-violet-600 dark:text-violet-400" bgClass="bg-violet-50 dark:bg-violet-500/10" borderClass="border-violet-100 dark:border-violet-500/20" title="Top 10 Kỹ năng Hot" description="Các kỹ năng được yêu cầu nhiều nhất">
                        {topSkills.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topSkills} layout="vertical" margin={{ top: 5, right: 35, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 600 }} className="text-slate-600 dark:text-slate-300" width={100} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                                    <Bar dataKey="value" name="Xuất hiện" radius={[0, 4, 4, 0]} barSize={16} fill="var(--color-violet-500)" label={renderCustomBarLabel} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                    {/* 10. Tickets Trend */}
                    <AnalyticsCard index={9} icon={LifeBuoy} iconClass="text-rose-600 dark:text-rose-400" bgClass="bg-rose-50 dark:bg-rose-500/10" borderClass="border-rose-100 dark:border-rose-500/20" title="Khối lượng Hỗ trợ (Tickets)" description="Số lượng yêu cầu tạo mới">
                        {ticketTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ticketTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11 }} allowDecimals={false} />
                                    <RechartsTooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                                    <Line type="monotone" dataKey="tickets" name="Tickets Mới" stroke="#f43f5e" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 3, fill: '#f43f5e', strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                    {/* 11. Tickets Status */}
                    <AnalyticsCard index={10} icon={LifeBuoy} iconClass="text-emerald-600 dark:text-emerald-400" bgClass="bg-emerald-50 dark:bg-emerald-500/10" borderClass="border-emerald-100 dark:border-emerald-500/20" title="Trạng thái Tickets" description="Phân bổ trạng thái xử lý CSKH">
                        {ticketStatus.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={ticketStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {ticketStatus.map((entry: any, index: number) => (
                                            <Cell key={`tick-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-subtle)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                    {/* 12. Job Status */}
                    <AnalyticsCard index={11} icon={Briefcase} iconClass="text-slate-600 dark:text-slate-400" bgClass="bg-slate-50 dark:bg-slate-500/10" borderClass="border-slate-100 dark:border-slate-500/20" title="Trạng thái Việc làm" description="Tỉ lệ việc làm đang mở / đóng / nháp">
                        {jobStatus.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={jobStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {jobStatus.map((entry: any, index: number) => (
                                            <Cell key={`js-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-subtle)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <EmptyChartState message="Chưa có dữ liệu" />}
                    </AnalyticsCard>

                </div>
            </div>
        </section>
    );
}
