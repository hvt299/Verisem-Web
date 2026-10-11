'use client';

import { History, Loader2 } from 'lucide-react';

interface BillingLedgerProps {
    transactions: any[];
    isLoading: boolean;
}

const ACTION_LABELS: [string, string][] = [
    ['PURCHASE_', 'Mua gói: '],
    ['ADMIN_GRANT_', 'Admin cấp gói: '],
    ['REFUND_', 'Hoàn credit: '],
    ['UPGRADE_', 'Nâng cấp gói: '],
];

const formatAction = (actionType: string = '') => {
    if (actionType === 'FREE_PLAN_CREDITS') return 'Credit gói Miễn phí';
    const match = ACTION_LABELS.find(([prefix]) => actionType.startsWith(prefix));
    return match ? match[1] + actionType.slice(match[0].length) : actionType;
};

export default function BillingLedger({ transactions, isLoading }: BillingLedgerProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-primary-500" /> Sổ cái Giao dịch (Ledger)
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold">
                        <tr>
                            <th className="p-4 pl-6">Thời gian</th>
                            <th className="p-4">Nội dung / Hành động</th>
                            <th className="p-4 text-center">Biến động Credit</th>
                            <th className="p-4 text-center pr-6">Số dư</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                        ) : transactions.length > 0 ? (
                            transactions.map((tx: any) => {
                                const isAddition = tx.credit_cost < 0;
                                const displayCost = isAddition ? `+${Math.abs(tx.credit_cost)}` : `-${tx.credit_cost}`;

                                return (
                                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="p-4 pl-6 text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                                            {new Date(tx.created_at).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-slate-800 dark:text-white">
                                            {formatAction(tx.action_type)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-md text-xs font-black ${isAddition ? 'bg-success-50 text-success-600 dark:bg-success-500/10' : 'bg-error-50 text-error-600 dark:bg-error-500/10'}`}>
                                                {displayCost}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center pr-6 font-black text-slate-700 dark:text-slate-200">
                                            {tx.balance_after}
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-medium">Chưa có giao dịch nào phát sinh.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}