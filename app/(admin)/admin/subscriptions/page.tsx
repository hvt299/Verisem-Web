'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/features/admin/admin.service';
import { Search, Loader2, Edit, Trash2, ChevronLeft, ChevronRight, X, Filter, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSubscriptionsPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [audienceFilter, setAudienceFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    const getVisiblePages = (current: number, total: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 3) return [1, 2, 3, 4, '...', total];
        if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };
    
    const [editingPlan, setEditingPlan] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const emptyGrantForm = { email: '', plan_code: '', days: '', note: '' };
    const [grantForm, setGrantForm] = useState<typeof emptyGrantForm | null>(null);
    const [isGranting, setIsGranting] = useState(false);

    const fetchPlans = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getSubscriptions();
            setPlans(data.data || data);
        } catch (e) {
            toast.error('Không thể tải danh sách Gói cước');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const toggleStatus = async (plan: any) => {
        try {
            await adminService.toggleSubscriptionStatus(plan.id || plan._id, !plan.is_active);
            toast.success(`Đã ${!plan.is_active ? 'bật' : 'tắt'} gói cước`);
            fetchPlans();
        } catch {
            toast.error('Lỗi cập nhật');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                name: editingPlan.name,
                description: editingPlan.description,
                badge: editingPlan.badge,
                display_order: Number(editingPlan.display_order),
                tier_level: Number(editingPlan.tier_level),
                plan_type: editingPlan.plan_type || 'subscription',
                credits_granted: Number(editingPlan.credits_granted || 0),
                credit_validity_days: editingPlan.credit_validity_days === '' || editingPlan.credit_validity_days == null ? null : Number(editingPlan.credit_validity_days),
                original_price: Number(editingPlan.original_price),
                current_price: Number(editingPlan.current_price),
                display_features: Array.isArray(editingPlan.display_features) ? editingPlan.display_features : editingPlan.display_features.split('\n').map((s: string) => s.trim()).filter(Boolean)
            };
            await adminService.updateSubscription(editingPlan.id || editingPlan._id, payload);
            toast.success('Cập nhật thành công');
            setEditingPlan(null);
            fetchPlans();
        } catch (error) {
            toast.error('Lỗi khi cập nhật gói cước');
        } finally {
            setIsSaving(false);
        }
    };

    const handleGrant = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!grantForm) return;
        setIsGranting(true);
        try {
            const res = await adminService.grantSubscription({
                email: grantForm.email.trim(),
                plan_code: grantForm.plan_code,
                days: grantForm.days === '' ? null : Number(grantForm.days),
                note: grantForm.note.trim() || undefined
            });
            toast.success(res.message || 'Đã cấp gói thành công');
            setGrantForm(null);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Lỗi khi cấp gói');
        } finally {
            setIsGranting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
        try {
            await adminService.deleteSubscription(id);
            toast.success('Đã xóa gói cước');
            fetchPlans();
        } catch {
            toast.error('Lỗi khi xóa');
        }
    };

    const filtered = plans.filter(p => {
        const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.plan_code?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchAudience = audienceFilter === 'All' || p.target_audience === audienceFilter;
        const matchStatus = statusFilter === 'All' || (statusFilter === 'Active' ? p.is_active : !p.is_active);
        return matchSearch && matchAudience && matchStatus;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, audienceFilter, statusFilter]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginatedPlans = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        Quản lý Gói cước
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cấu hình thông tin các gói dịch vụ (Billing).</p>
                </div>
                <button onClick={() => setGrantForm(emptyGrantForm)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm">
                    <Gift className="w-4 h-4" /> Cấp gói thủ công
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm gói cước..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm focus:border-primary-500 shadow-sm transition-colors text-slate-700 dark:text-slate-200 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                    <div className="relative min-w-40 flex-1">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={audienceFilter}
                            onChange={(e) => setAudienceFilter(e.target.value)}
                        >
                            <option value="All">Tất cả đối tượng</option>
                            <option value="hr">Doanh nghiệp</option>
                            <option value="applicant">Ứng viên</option>
                        </select>
                    </div>
                    <div className="relative min-w-40 flex-1">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Tất cả trạng thái</option>
                            <option value="Active">Đang bật</option>
                            <option value="Inactive">Đang tắt</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 mb-4 px-2">
                <div className="text-sm font-medium text-slate-500">
                    Đã tìm thấy <span className="text-primary-600 font-bold">{filtered.length}</span> gói cước
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-5 pl-6">Tên Gói</th>
                                <th className="p-5">Mã Code</th>
                                <th className="p-5">Đối tượng</th>
                                <th className="p-5">Giá tiền</th>
                                <th className="p-5">Trạng thái</th>
                                <th className="p-5 pr-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto" />
                                        <p className="text-slate-500 text-sm mt-3 font-medium">Đang tải dữ liệu...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-slate-500 font-medium">Không tìm thấy gói cước nào.</td>
                                </tr>
                            ) : (
                                paginatedPlans.map((plan, index) => (
                                    <tr key={plan.id || plan._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-5 pl-6">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{plan.name}</p>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <span className="font-mono text-sm font-bold bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">{plan.plan_code}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${plan.target_audience === 'hr' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'}`}>
                                                    {plan.target_audience === 'hr' ? 'Doanh nghiệp' : 'Ứng viên'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm font-medium text-slate-500">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <span className="text-primary-600 font-bold dark:text-primary-400">{plan.current_price?.toLocaleString('vi-VN') || 0} đ</span>
                                                <span className="text-xs text-slate-400 block font-normal">/{plan.billing_cycle_days === 0 ? 'Vĩnh viễn' : `${plan.billing_cycle_days} ngày`}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <button 
                                                    onClick={() => toggleStatus(plan)}
                                                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors shadow-sm border ${plan.is_active ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400 border-success-200 dark:border-success-500/20' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                                                >
                                                    {plan.is_active ? 'Đang bật' : 'Đang tắt'}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <button onClick={() => setEditingPlan({...plan, display_features: plan.display_features?.join('\n') || ''})} className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors" title="Sửa">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(plan.id || plan._id)} className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 rounded-lg transition-colors" title="Xóa">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && totalPages > 1 && (
                    <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 mt-auto">
                        <p className="text-sm font-medium text-slate-500">
                            Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filtered.length)}</span> kết quả
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-1">
                                {getVisiblePages(currentPage, totalPages).map((page, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => typeof page === 'number' && setCurrentPage(page)} 
                                        disabled={page === '...'}
                                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${page !== '...' ? 'shadow-sm' : ''} ${currentPage === page ? 'bg-primary-600 text-white' : page === '...' ? 'text-slate-400 bg-transparent cursor-default' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        
            {editingPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Chỉnh sửa Gói Cước</h2>
                            <button onClick={() => setEditingPlan(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form id="edit-plan-form" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tên Gói</label>
                                        <input type="text" value={editingPlan.name} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" required />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Badge (Nhãn nổi bật)</label>
                                        <input type="text" value={editingPlan.badge || ''} onChange={e => setEditingPlan({...editingPlan, badge: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" placeholder="VD: Phổ biến nhất" />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mô tả ngắn</label>
                                        <input type="text" value={editingPlan.description || ''} onChange={e => setEditingPlan({...editingPlan, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" />
                                    </div>
                                    
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Giá gốc (VNĐ)</label>
                                        <input type="number" value={editingPlan.original_price} onChange={e => setEditingPlan({...editingPlan, original_price: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" required min="0" />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Giá khuyến mãi hiện tại (VNĐ)</label>
                                        <input type="number" value={editingPlan.current_price} onChange={e => setEditingPlan({...editingPlan, current_price: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" required min="0" />
                                    </div>

                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Thứ tự hiển thị (Order)</label>
                                        <input type="number" value={editingPlan.display_order} onChange={e => setEditingPlan({...editingPlan, display_order: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" required />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Cấp độ (Tier)</label>
                                        <input type="number" value={editingPlan.tier_level} onChange={e => setEditingPlan({...editingPlan, tier_level: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" required />
                                    </div>

                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Loại gói</label>
                                        <select value={editingPlan.plan_type || 'subscription'} onChange={e => setEditingPlan({...editingPlan, plan_type: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white">
                                            <option value="subscription">Thuê bao theo kỳ</option>
                                            <option value="topup">Gói lẻ (mua credit)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Số credit được cộng</label>
                                        <input type="number" min="0" value={editingPlan.credits_granted ?? 0} onChange={e => setEditingPlan({...editingPlan, credits_granted: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" required />
                                    </div>
                                    {editingPlan.plan_type === 'topup' && (
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hạn dùng credit (ngày)</label>
                                            <input type="number" min="1" value={editingPlan.credit_validity_days ?? ''} onChange={e => setEditingPlan({...editingPlan, credit_validity_days: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" placeholder="Để trống = không hết hạn" />
                                        </div>
                                    )}

                                    <div className="space-y-2 col-span-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Các tính năng nổi bật (Mỗi dòng 1 tính năng)</label>
                                        <textarea value={editingPlan.display_features} onChange={e => setEditingPlan({...editingPlan, display_features: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white min-h-[120px]" placeholder="VD: Mở khóa kho CV cao cấp..." />
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                            <button type="button" onClick={() => setEditingPlan(null)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Hủy bỏ
                            </button>
                            <button type="submit" form="edit-plan-form" disabled={isSaving} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {grantForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Cấp gói thủ công</h2>
                            <button onClick={() => setGrantForm(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form id="grant-plan-form" onSubmit={handleGrant} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email tài khoản</label>
                                    <input type="email" value={grantForm.email} onChange={e => setGrantForm({...grantForm, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" placeholder="Email HR (cấp cho cả công ty) hoặc Ứng viên" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Gói cước</label>
                                    <select value={grantForm.plan_code} onChange={e => setGrantForm({...grantForm, plan_code: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" required>
                                        <option value="">-- Chọn gói --</option>
                                        {plans.map(p => (
                                            <option key={p.plan_code} value={p.plan_code}>
                                                [{p.target_audience === 'hr' ? 'Doanh nghiệp' : 'Ứng viên'}] {p.name} ({p.plan_code}){!p.is_active ? ' - Đã ẩn' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Số ngày sử dụng</label>
                                    <input type="number" min="0" value={grantForm.days} onChange={e => setGrantForm({...grantForm, days: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" placeholder="Để trống = theo chu kỳ của gói, 0 = vĩnh viễn" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ghi chú</label>
                                    <input type="text" value={grantForm.note} onChange={e => setGrantForm({...grantForm, note: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" placeholder="VD: Tặng khách hàng, bù sự cố thanh toán..." />
                                </div>
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                    Gói mới sẽ thay thế gói hiện tại của tài khoản và cộng thêm credit theo cấu hình gói. Thao tác được ghi vào Audit Log.
                                </p>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                            <button type="button" onClick={() => setGrantForm(null)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Hủy bỏ
                            </button>
                            <button type="submit" form="grant-plan-form" disabled={isGranting} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                                {isGranting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                                Cấp gói
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
