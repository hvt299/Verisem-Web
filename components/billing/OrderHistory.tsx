'use client';

import { Receipt, Loader2 } from 'lucide-react';

interface OrderHistoryProps {
    orders: any[];
    isLoading: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    paid: { label: 'Đã thanh toán', className: 'bg-success-50 text-success-600 dark:bg-success-500/10' },
    pending: { label: 'Chờ thanh toán', className: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' },
    expired: { label: 'Hết hạn', className: 'bg-slate-100 text-slate-500 dark:bg-slate-800' },
    cancelled: { label: 'Đã hủy', className: 'bg-slate-100 text-slate-500 dark:bg-slate-800' },
};

export default function OrderHistory({ orders, isLoading }: OrderHistoryProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-primary-500" /> Lịch sử Giao dịch
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold">
                        <tr>
                            <th className="p-4 pl-6">Thời gian</th>
                            <th className="p-4">Mã đơn</th>
                            <th className="p-4">Gói</th>
                            <th className="p-4 text-right">Số tiền</th>
                            <th className="p-4 text-center pr-6">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                        ) : orders.length > 0 ? (
                            orders.map((order: any) => {
                                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                                return (
                                    <tr key={order.order_code} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="p-4 pl-6 text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                                            {new Date(order.created_at).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="p-4 text-sm font-mono font-bold text-slate-800 dark:text-white">{order.order_code}</td>
                                        <td className="p-4 text-sm font-bold text-slate-800 dark:text-white">
                                            {order.plan_name || order.plan_code}
                                            {order.plan_type === 'topup' && <span className="ml-2 text-xs font-medium text-slate-500">(Gói lẻ)</span>}
                                        </td>
                                        <td className="p-4 text-sm text-right font-black text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                            {(order.amount || 0).toLocaleString('vi-VN')} ₫
                                        </td>
                                        <td className="p-4 text-center pr-6">
                                            <span className={`px-2 py-1 rounded-md text-xs font-black whitespace-nowrap ${status.className}`}>
                                                {order.payment_issue === 'underpaid' ? 'Thiếu tiền - chờ xử lý' : status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">Chưa có giao dịch nào phát sinh.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
