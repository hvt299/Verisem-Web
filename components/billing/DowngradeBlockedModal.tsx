'use client';

import { X, ShieldAlert } from 'lucide-react';

export interface DowngradeBlockedInfo {
    code: 'PLAN_DOWNGRADE_BLOCKED';
    message: string;
    current_plan?: string;
    current_period_end?: string | null;
    target_plan?: string;
}

interface DowngradeBlockedModalProps {
    info: DowngradeBlockedInfo | null;
    onClose: () => void;
}

export const isDowngradeBlocked = (detail: any): detail is DowngradeBlockedInfo =>
    detail?.code === 'PLAN_DOWNGRADE_BLOCKED';

export default function DowngradeBlockedModal({ info, onClose }: DowngradeBlockedModalProps) {
    if (!info) return null;

    const periodEnd = info.current_period_end ? new Date(info.current_period_end).toLocaleDateString('vi-VN') : null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-200 flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end p-4 pb-0">
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-8 pb-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 border border-amber-200 dark:border-amber-800/50">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Chưa thể hạ cấp gói</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Gói hiện tại vẫn còn hạn sử dụng. Vui lòng chờ gói cũ hết hạn để mua gói này.
                    </p>

                    {(info.current_plan || info.target_plan) && (
                        <div className="w-full mt-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 text-left">
                            {info.current_plan && (
                                <div className="flex justify-between items-center gap-4">
                                    <span className="text-sm text-slate-500 font-medium">Gói hiện tại</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-white text-right">{info.current_plan}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-sm text-slate-500 font-medium">Hết hạn</span>
                                <span className="text-sm font-bold text-slate-800 dark:text-white">{periodEnd || 'Vĩnh viễn'}</span>
                            </div>
                            {info.target_plan && (
                                <div className="flex justify-between items-center gap-4">
                                    <span className="text-sm text-slate-500 font-medium">Gói muốn mua</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-white text-right">{info.target_plan}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                        Đã hiểu
                    </button>
                </div>
            </div>
        </div>
    );
}
