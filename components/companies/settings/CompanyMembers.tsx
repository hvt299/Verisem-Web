'use client';

import { useState, useEffect } from 'react';
import { Mail, Loader2, UserCog, UserMinus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserRole } from '@/types';
import { companyService } from '@/features/company/company.service';
import { cn } from '@/utils/utils';

export default function CompanyMembers({ user, companyId }: { user: any; companyId: string }) {
    const [members, setMembers] = useState<any[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);

    // Search & Filter state
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // For actions
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const loadMembers = () => {
        companyService
            .getMembers()
            .then((res) => {
                const memData = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
                setMembers(memData);
                setIsLoading(false);
            })
            .catch(() => {
                toast.error('Lỗi khi tải danh sách nhân sự');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadMembers();
    }, [companyId]);

    // Reset về trang 1 khi gõ tìm kiếm hoặc đổi filter
    useEffect(() => {
        setCurrentPage(1);
    }, [search, roleFilter]);

    const handleInviteMember = async () => {
        if (!inviteEmail.trim()) return toast.error('Vui lòng nhập Email');
        setIsInviting(true);
        try {
            await companyService.inviteMember(inviteEmail);
            toast.success('Đã gửi thư mời gia nhập công ty thành công!');
            setInviteEmail('');
            loadMembers();
        } catch (e: any) {
            toast.error(e.response?.data?.detail || 'Không thể gửi thư mời');
        } finally {
            setIsInviting(false);
        }
    };

    const handleChangeRole = async (memberId: string, currentRole: string) => {
        const newRole = currentRole === UserRole.HR_OWNER ? UserRole.HR_MEMBER : UserRole.HR_OWNER;
        if (!window.confirm(`Xác nhận đổi quyền của thành viên này thành ${newRole === UserRole.HR_OWNER ? 'HR Owner' : 'HR Member'}?`)) return;

        setLoadingAction(`role-${memberId}`);
        try {
            await companyService.updateMemberRole(memberId, newRole);
            toast.success('Cập nhật quyền thành công');
            loadMembers();
        } catch (e: any) {
            toast.error(e.response?.data?.detail || 'Lỗi khi cập nhật quyền');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi công ty? Họ sẽ không thể truy cập vào dữ liệu công ty nữa.')) return;

        setLoadingAction(`remove-${memberId}`);
        try {
            await companyService.removeMember(memberId);
            toast.success('Đã xóa thành viên khỏi công ty');
            loadMembers();
        } catch (e: any) {
            toast.error(e.response?.data?.detail || 'Lỗi khi xóa thành viên');
        } finally {
            setLoadingAction(null);
        }
    };

    // Lọc danh sách thành viên
    const filtered = members.filter((m) => {
        const query = search.trim().toLowerCase();
        const matchSearch =
            !query ||
            (Boolean(m.email) && m.email.toLowerCase().includes(query)) ||
            (Boolean(m.full_name) && m.full_name.toLowerCase().includes(query));
        const matchRole = roleFilter === 'All' || m.role === roleFilter;
        return Boolean(matchSearch && matchRole);
    });

    // Tính toán Paginated Data
    const paginatedMembers = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    const getVisiblePages = (current: number, total: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 3) return [1, 2, 3, 4, '...', total];
        if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    if (isLoading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* KHỐI MỜI THÀNH VIÊN MỚI */}
            {user.role === UserRole.HR_OWNER && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-black mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                        <Mail className="w-5 h-5 text-primary-500" /> Mời thành viên mới (HR Member)
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="Nhập email nhân viên..."
                            className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500 transition-colors"
                        />
                        <button
                            onClick={handleInviteMember}
                            disabled={isInviting}
                            className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all flex justify-center items-center disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed shrink-0"
                        >
                            {isInviting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gửi lời mời'}
                        </button>
                    </div>
                </div>
            )}

            {/* THANH TÌM KIẾM & BỘ LỌC QUYỀN (ĐỒNG BỘ VỚI ADMIN/SETTINGS) */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm theo email hoặc họ tên thành viên..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium focus:border-slate-800 dark:focus:border-slate-600 transition-colors shadow-sm"
                    />
                </div>
                <div className="relative min-w-48 shrink-0">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <select
                        className="w-full pl-10 pr-8 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-slate-800 dark:focus:border-slate-600 shadow-sm transition-colors"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="All">Tất cả Quyền ({members.length})</option>
                        <option value={UserRole.HR_OWNER}>
                            HR Owner ({members.filter((m) => m.role === UserRole.HR_OWNER).length})
                        </option>
                        <option value={UserRole.HR_MEMBER}>
                            HR Member ({members.filter((m) => m.role === UserRole.HR_MEMBER).length})
                        </option>
                    </select>
                </div>
            </div>

            {/* SỐ LƯỢNG KẾT QUẢ TÌM THẤY */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Đã tìm thấy <span className="text-primary-600 font-bold">{filtered.length}</span> nhân sự
                </div>
            </div>

            {/* BẢNG DANH SÁCH THÀNH VIÊN */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-5 pl-6">Thành viên</th>
                                <th className="p-5">Quyền hạn</th>
                                <th className="p-5">Trạng thái</th>
                                {user.role === UserRole.HR_OWNER && <th className="p-5 text-right pr-6">Thao tác</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {paginatedMembers.map((m) => {
                                const isOwner = m.role === UserRole.HR_OWNER;
                                return (
                                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-5 pl-6">
                                            <div className="flex items-center gap-4">
                                                {m.avatar_url ? (
                                                    <img
                                                        src={m.avatar_url}
                                                        alt="Avatar"
                                                        className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700 shrink-0"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 uppercase shadow-sm shrink-0">
                                                        {m.full_name?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800 dark:text-white mb-0.5">
                                                        {m.full_name || 'Người dùng'} {m.id === user.id && '(Bạn)'}
                                                    </p>
                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{m.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span
                                                className={cn(
                                                    'px-3 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm border',
                                                    isOwner
                                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                                        : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                                )}
                                            >
                                                {isOwner ? 'HR Owner' : 'HR Member'}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span
                                                className={cn(
                                                    'px-3 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm',
                                                    m.is_verified
                                                        ? 'bg-success-100 text-success-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : 'bg-warning-100 text-warning-700 dark:bg-amber-950/60 dark:text-amber-300'
                                                )}
                                            >
                                                {m.is_verified ? 'Hoạt động' : 'Chờ xác thực'}
                                            </span>
                                        </td>
                                        {user.role === UserRole.HR_OWNER && (
                                            <td className="p-5 pr-6 text-right">
                                                {m.id !== user.id && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleChangeRole(m.id, m.role)}
                                                            disabled={loadingAction === `role-${m.id}`}
                                                            title={isOwner ? 'Giáng quyền xuống Member' : 'Nâng cấp lên Owner'}
                                                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                                        >
                                                            {loadingAction === `role-${m.id}` ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <UserCog className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveMember(m.id)}
                                                            disabled={loadingAction === `remove-${m.id}`}
                                                            title="Xóa khỏi công ty"
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                                        >
                                                            {loadingAction === `remove-${m.id}` ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <UserMinus className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* THÔNG BÁO RỖNG KHI TÌM KIẾM */}
                {filtered.length === 0 && (
                    <div className="text-center py-16 text-slate-400 text-sm font-medium">
                        Không tìm thấy thành viên nào khớp với từ khóa tìm kiếm.
                    </div>
                )}

                {/* UI PHÂN TRANG GỌN GÀNG (SMART PAGINATION WITH ELLIPSIS) */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 mt-auto">
                        <p className="text-sm font-medium text-slate-500">
                            Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến{' '}
                            <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filtered.length)}</span> trong số{' '}
                            <span className="font-bold text-slate-800 dark:text-white">{filtered.length}</span> kết quả
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
                                            'w-9 h-9 rounded-lg text-sm font-bold transition-colors',
                                            page !== '...' ? 'shadow-sm cursor-pointer' : 'text-slate-400 bg-transparent cursor-default',
                                            currentPage === page
                                                ? 'bg-primary-600 text-white'
                                                : page !== '...'
                                                ? 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                                : ''
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
        </div>
    );
}
