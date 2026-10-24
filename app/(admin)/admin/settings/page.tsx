'use client';

import { useState, useEffect } from 'react';
import { Shield, Search, User as UserIcon, AlertCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { ROLES } from '@/constants/user.constants';
import { companyService } from '@/features/company/company.service';
import ProfileForm from '@/components/shared/ProfileForm';
import { cn } from '@/utils/utils';

export default function AdminSettingsPage() {
    const { user } = useAuthStore();
    const [mainTab, setMainTab] = useState<'personal' | 'admin'>('personal');

    if (!user || user.role !== UserRole.ADMIN) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            {/* HEADER CÀI ĐẶT */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Cài đặt Hệ thống</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý tài khoản cá nhân và cấu hình nền tảng.</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start md:self-auto border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setMainTab('personal')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${mainTab === 'personal' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <UserIcon className="w-4 h-4" /> Cá nhân
                    </button>
                    <button
                        onClick={() => setMainTab('admin')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${mainTab === 'admin' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Shield className="w-4 h-4" /> Quản trị
                    </button>
                </div>
            </div>

            {/* CONTENT RENDER */}
            <div className="w-full">
                {mainTab === 'personal' ? (
                    <ProfileForm />
                ) : (
                    <AdminManagementSection currentUser={user} />
                )}
            </div>
        </div>
    );
}

// Bóc tách phần Quản lý Người dùng xuống đây
function AdminManagementSection({ currentUser }: { currentUser: any }) {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'ROLE' | 'STATUS', user: any, newValue: any } | null>(null);

    // Thêm State Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        companyService.getAdminUsers()
            .then(res => {
                const usersData = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
                setUsers(usersData);
            })
            .catch(() => toast.error('Không thể tải danh sách người dùng'))
            .finally(() => setIsLoading(false));
    }, []);

    const executeRoleChange = async () => {
        if (!confirmAction) return;
        setUpdatingId(confirmAction.user.id);
        try {
            await companyService.updateUserRole(confirmAction.user.id, confirmAction.newValue);
            setUsers(prev => prev.map(u => u.id === confirmAction.user.id ? { ...u, role: confirmAction.newValue } : u));
            toast.success('Đã cập nhật quyền thành công');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Lỗi khi cập nhật quyền');
        } finally {
            setUpdatingId(null);
            setConfirmAction(null);
        }
    };

    const executeStatusToggle = async () => {
        if (!confirmAction) return;
        setUpdatingId(confirmAction.user.id);
        try {
            await companyService.updateUserStatus(confirmAction.user.id, confirmAction.newValue);
            setUsers(prev => prev.map(u => u.id === confirmAction.user.id ? { ...u, is_active: confirmAction.newValue } : u));
            toast.success(confirmAction.newValue ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Lỗi khi cập nhật trạng thái');
        } finally {
            setUpdatingId(null);
            setConfirmAction(null);
        }
    };

    // Reset về trang 1 khi gõ tìm kiếm
    useEffect(() => {
        setCurrentPage(1);
    }, [search, roleFilter]);

    const filtered = users.filter(u => {
        const query = search.trim().toLowerCase();
        const matchSearch = !query || 
            (Boolean(u.email) && u.email.toLowerCase().includes(query)) || 
            (Boolean(u.full_name) && u.full_name.toLowerCase().includes(query));
        const matchRole = roleFilter === 'All' || u.role === roleFilter;
        return Boolean(matchSearch && matchRole);
    });

    // Tính toán Paginated Data
    const paginatedUsers = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    const getVisiblePages = (current: number, total: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 3) return [1, 2, 3, 4, '...', total];
        if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Tìm theo email hoặc tên..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium focus:border-slate-800 transition-colors shadow-sm" />
                </div>
                <div className="relative min-w-48 shrink-0">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <select
                        className="w-full pl-10 pr-8 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-slate-800 shadow-sm transition-colors"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="All">Tất cả Quyền ({users.length})</option>
                        {ROLES.map((r) => {
                            const count = users.filter((u) => u.role === r.value).length;
                            return (
                                <option key={r.value} value={r.value}>
                                    {r.label} ({count})
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 mb-4 px-2">
                <div className="text-sm font-medium text-slate-500">
                    Đã tìm thấy <span className="text-primary-600 font-bold">{filtered.length}</span> người dùng
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" /></div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr><th className="p-5 pl-6">Người dùng</th><th className="p-5">Xác thực</th><th className="p-5">Hoạt động</th><th className="p-5">Ngày tạo</th><th className="p-5 pr-6 text-right">Quyền hệ thống</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {paginatedUsers.map(u => {
                                    const roleConfig = ROLES.find(r => r.value === u.role) || ROLES[0];
                                    return (
                                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-5 pl-6">
                                                <div className="flex items-center gap-4">
                                                    {u.avatar_url ? (
                                                        <img src={u.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700 shrink-0" referrerPolicy="no-referrer" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 uppercase shadow-sm shrink-0">
                                                            {u.full_name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-800 dark:text-white mb-0.5">{u.full_name}</p>
                                                        <p className="text-xs font-medium text-slate-400">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5"><span className={`text-[10px] uppercase tracking-wider font-black px-3 py-1.5 rounded-lg shadow-sm ${u.is_verified ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'}`}>{u.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}</span></td>
                                            <td className="p-5">
                                                <button
                                                    disabled={updatingId === u.id || u.email === currentUser?.email}
                                                    onClick={() => setConfirmAction({ type: 'STATUS', user: u, newValue: u.is_active === false })}
                                                    className={`text-[10px] uppercase tracking-wider font-black px-3 py-1.5 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${u.is_active !== false ? 'bg-success-50 text-success-600 hover:bg-success-100 dark:bg-success-500/10 dark:text-success-400' : 'bg-error-50 text-error-600 hover:bg-error-100 dark:bg-error-500/10 dark:text-error-400'}`}
                                                >
                                                    {u.is_active !== false ? 'Đang hoạt động' : 'Bị khóa'}
                                                </button>
                                            </td>
                                            <td className="p-5 text-sm font-medium text-slate-500">{u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '—'}</td>
                                            <td className="p-5 pr-6 text-right">
                                                <select value={u.role || UserRole.APPLICANT} disabled={updatingId === u.id || u.email === currentUser?.email} onChange={e => setConfirmAction({ type: 'ROLE', user: u, newValue: e.target.value })} className={`text-xs font-bold px-4 py-2 rounded-xl outline-none cursor-pointer border border-transparent shadow-sm ${roleConfig.color} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}>
                                                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {!isLoading && filtered.length === 0 && (
                    <div className="text-center py-16 text-slate-400 text-sm font-medium">Không tìm thấy người dùng nào khớp với từ khóa.</div>
                )}

                {/* UI PHÂN TRANG GỌN GÀNG (SMART PAGINATION WITH ELLIPSIS) */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 mt-auto">
                        <p className="text-sm font-medium text-slate-500">
                            Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filtered.length)}</span> trong số <span className="font-bold text-slate-800 dark:text-white">{filtered.length}</span> kết quả
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed"
                                title="Trang trước"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-1">
                                {getVisiblePages(currentPage, totalPages).map((page, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                        disabled={page === '...'}
                                        className={cn(
                                            "w-9 h-9 rounded-lg text-sm font-bold transition-colors",
                                            page !== '...' ? "shadow-sm cursor-pointer" : "text-slate-400 bg-transparent cursor-default",
                                            currentPage === page
                                                ? "bg-primary-600 text-white"
                                                : page !== '...'
                                                ? "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                                : ""
                                        )}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed"
                                title="Trang sau"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL XÁC NHẬN CHO USER */}
            {confirmAction && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-warning-500" /> Xác nhận thao tác
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            Bạn có chắc chắn muốn {confirmAction.type === 'ROLE' ? <><br />Đổi quyền của <strong>{confirmAction.user.email}</strong> thành <span className="text-primary-600 font-bold">{ROLES.find(r => r.value === confirmAction.newValue)?.label}</span>?</> : <><br /><span className={confirmAction.newValue ? 'text-success-600 font-bold' : 'text-error-600 font-bold'}>{confirmAction.newValue ? 'MỞ KHÓA' : 'KHÓA ĐÌNH CHỈ'}</span> tài khoản <strong>{confirmAction.user.email}</strong>?</>}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmAction(null)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">Hủy</button>
                            <button onClick={confirmAction.type === 'ROLE' ? executeRoleChange : executeStatusToggle} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all">Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}