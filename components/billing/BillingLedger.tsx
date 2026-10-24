'use client';

import { Sparkles, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface BillingLedgerProps {
    transactions: any[];
    isLoading: boolean;
}

const ACTION_MAP: Record<string, string> = {
    'AI_CV_SCORING': 'Chấm điểm CV tự động bằng AI',
    'AI_INTERVIEW_GEN': 'Tạo bộ câu hỏi phỏng vấn thông minh',
    'AI_JD_PARSING': 'Phân tích & Tối ưu hóa JD tuyển dụng',
    'AI_COVER_LETTER': 'Tối ưu Thư ứng tuyển (Cover Letter)',
    'AI_CANDIDATE_MATCH': 'Phân tích độ phù hợp ứng viên',
    'INITIAL_GRANT': 'Cấp Credit kích hoạt gói cước',
    'FREE_PLAN_CREDITS': 'Credit kích hoạt gói Miễn phí',
    'ADMIN_ADJUST': 'Admin điều chỉnh số dư Credit',
    'REFUND': 'Hoàn trả Credit xử lý AI',
    'REFUND_AI_FAILURE': 'Hoàn Credit do AI gián đoạn',
};

const PLAN_NAME_MAP: Record<string, string> = {
    'hr_enterprise_yearly': 'HR Enterprise (1 Năm)',
    'hr_enterprise_monthly': 'HR Enterprise',
    'hr_pro_yearly': 'HR Pro (1 Năm)',
    'hr_pro_monthly': 'HR Pro',
    'hr_growth_yearly': 'HR Growth (1 Năm)',
    'hr_growth_monthly': 'HR Growth',
    'hr_free': 'HR Starter',
    'hr_topup_100': 'Gói nạp 100 Credit AI',
    'hr_topup_500': 'Gói nạp 500 Credit AI',
    'hr_topup_1500': 'Gói nạp 1.500 Credit AI',
    'hr_topup_5000': 'Gói nạp 5.000 Credit AI',
    'app_vip_yearly': 'App VIP (1 Năm)',
    'app_vip_monthly': 'App VIP',
    'app_pro_yearly': 'App Pro (1 Năm)',
    'app_pro_monthly': 'App Pro',
    'app_plus_yearly': 'App Plus (1 Năm)',
    'app_plus_monthly': 'App Plus',
    'app_free': 'App Basic',
    'app_topup_50': 'Gói nạp 50 Credit AI',
    'app_topup_150': 'Gói nạp 150 Credit AI',
    'app_topup_400': 'Gói nạp 400 Credit AI',
    'app_topup_1000': 'Gói nạp 1.000 Credit AI',
};

const formatAction = (actionType: string = '') => {
    if (!actionType) return 'Giao dịch Credit';
    if (ACTION_MAP[actionType]) return ACTION_MAP[actionType];
    if (actionType.startsWith('PURCHASE_')) {
        const planCode = actionType.replace('PURCHASE_', '');
        const planName = PLAN_NAME_MAP[planCode] || planCode;
        return `Cấp Credit từ ${planName}`;
    }
    if (actionType.startsWith('UPGRADE_')) {
        const planCode = actionType.replace('UPGRADE_', '');
        const planName = PLAN_NAME_MAP[planCode] || planCode;
        return `Nâng cấp gói ${planName}`;
    }
    if (actionType.startsWith('ADMIN_GRANT_')) {
        return `Quản trị viên cấp Credit: ${actionType.replace('ADMIN_GRANT_', '')}`;
    }
    if (actionType.startsWith('REFUND_')) {
        return `Hoàn trả Credit: ${actionType.replace('REFUND_', '')}`;
    }
    return actionType;
};

export default function BillingLedger({ transactions, isLoading }: BillingLedgerProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" /> Nhật ký Sử dụng Credit AI
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        Lịch sử chi tiết các lượt cấp phát và tiêu hao Credit khi sử dụng các tính năng trí tuệ nhân tạo.
                    </p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold">
                        <tr>
                            <th className="p-4 pl-6">Thời gian</th>
                            <th className="p-4">Tính năng / Hoạt động</th>
                            <th className="p-4 text-center">Biến động</th>
                            <th className="p-4 text-center pr-6">Số dư còn lại</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                        ) : transactions.length > 0 ? (
                            transactions.map((tx: any) => {
                                // credit_cost < 0 hoặc delta > 0 là cộng credit
                                const isAddition = (tx.credit_cost !== undefined && tx.credit_cost < 0) || (tx.delta !== undefined && tx.delta > 0);
                                const amount = tx.delta !== undefined ? Math.abs(tx.delta) : Math.abs(tx.credit_cost || 0);
                                const displayCost = isAddition ? `+${amount.toLocaleString('vi-VN')}` : `-${amount.toLocaleString('vi-VN')}`;
                                const action = tx.action_type || tx.reason || '';

                                return (
                                    <tr key={tx.id || tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="p-4 pl-6 text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                                            {new Date(tx.created_at).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-slate-800 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                {isAddition ? (
                                                    <span className="p-1 rounded-md bg-success-50 text-success-600 dark:bg-success-500/10">
                                                        <ArrowDownRight className="w-3.5 h-3.5" />
                                                    </span>
                                                ) : (
                                                    <span className="p-1 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-500/10">
                                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                                    </span>
                                                )}
                                                <span>{formatAction(action)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black ${
                                                isAddition 
                                                    ? 'bg-success-50 text-success-600 dark:bg-success-500/10 border border-success-200 dark:border-success-800/30' 
                                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                            }`}>
                                                {displayCost} Credit
                                            </span>
                                        </td>
                                        <td className="p-4 text-center pr-6 font-black text-slate-700 dark:text-slate-200">
                                            {(tx.balance_after || 0).toLocaleString('vi-VN')}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-medium">Chưa có lượt sử dụng Credit AI nào được ghi nhận.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
