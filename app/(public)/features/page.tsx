'use client';

import { useState, useEffect } from 'react';
import { Layers, Bot, ScanSearch, Target, ShieldCheck, Sparkles, FileText, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/store/useLanguageStore';
import { ROUTES } from '@/constants/routes';

const getFeatures = (t: (path: string, params?: any, fallback?: string) => string) => [
    {
        icon: Bot,
        title: t('public_pages.features.modules.m1_title', undefined, 'Trích xuất & Chuẩn hóa Hồ sơ (CV Parsing)'),
        description: t('public_pages.features.modules.m1_desc', undefined, 'Thuật toán bóc tách cấu trúc văn bản từ các định dạng PDF và DOCX. Tự động nhận diện học vấn, kinh nghiệm làm việc và phân loại kỹ năng theo từ điển chuyên ngành kỹ thuật, chuẩn hóa các biến thể từ ngữ (ví dụ: React, ReactJS, React.js quy về một chuẩn đồng nhất).'),
        highlight: t('public_pages.features.modules.m1_highlight', undefined, 'Xử lý tệp PDF & DOCX tự động'),
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40'
    },
    {
        icon: ScanSearch,
        title: t('public_pages.features.modules.m2_title', undefined, 'So khớp Ngữ nghĩa Vector (Cosine Similarity)'),
        description: t('public_pages.features.modules.m2_desc', undefined, 'Biến đổi nội dung CV ứng viên và Bản mô tả công việc (JD) thành các Vector nhúng ngữ nghĩa (Text Embeddings). Áp dụng công thức đo góc tương đồng Cosine kết hợp ma trận trọng số kỹ năng thực tế để tính điểm phù hợp (0 - 100%), không phụ thuộc vào việc đếm từ khóa cơ học.'),
        highlight: t('public_pages.features.modules.m2_highlight', undefined, 'Khớp ngữ nghĩa toán học chính xác'),
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40'
    },
    {
        icon: Target,
        title: t('public_pages.features.modules.m3_title', undefined, 'Tự Chấm điểm & Phân tích Lỗ hổng Kỹ năng (Self-Scoring)'),
        description: t('public_pages.features.modules.m3_desc', undefined, 'Cho phép ứng viên tự đối soát CV với JD công việc cụ thể trước khi chính thức nộp hồ sơ. Hệ thống trực quan hóa danh sách Kỹ năng đã khớp (Matched Skills), Kỹ năng còn thiếu (Missing Skills) và các khuyến nghị thiết thực để nâng cấp chất lượng hồ sơ.'),
        highlight: t('public_pages.features.modules.m3_highlight', undefined, 'Thấu hiểu điểm mạnh & thiếu sót'),
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40'
    },
    {
        icon: FileText,
        title: t('public_pages.features.modules.m4_title', undefined, 'Quản lý Pipeline Tuyển dụng Toàn diện'),
        description: t('public_pages.features.modules.m4_desc', undefined, 'Giao diện bảng điều khiển dành cho Nhà tuyển dụng theo dõi ứng viên qua từng giai đoạn cụ thể: Mới nộp, Đã duyệt, Hẹn phỏng vấn, Nhận việc hoặc Từ chối. Tích hợp bộ lọc đa chiều theo Tỉnh/Thành, Quận/Huyện chuẩn hành chính, Chế độ làm việc (Remote/On-site/Hybrid) và Mức lương.'),
        highlight: t('public_pages.features.modules.m4_highlight', undefined, 'Tiết kiệm 70% thời gian lọc hồ sơ ban đầu'),
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40'
    },
    {
        icon: ShieldCheck,
        title: t('public_pages.features.modules.m5_title', undefined, 'Bảo mật Thông tin & Kho lưu trữ CV Riêng tư'),
        description: t('public_pages.features.modules.m5_desc', undefined, 'Hồ sơ cá nhân trong Thư viện ứng viên được bảo mật tuyệt đối. Nhà tuyển dụng chỉ có quyền tiếp cận chi tiết hồ sơ và tải tệp CV gốc khi và chỉ khi ứng viên chủ động bấm nút "Ứng tuyển" vào vị trí tuyển dụng tương ứng của doanh nghiệp.'),
        highlight: t('public_pages.features.modules.m5_highlight', undefined, 'Ứng viên nắm quyền kiểm soát dữ liệu'),
        color: 'text-cyan-600 dark:text-cyan-400',
        bg: 'bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/40'
    },
    {
        icon: Zap,
        title: t('public_pages.features.modules.m6_title', undefined, 'Hệ thống Quản lý Credit & Thanh toán Tự động'),
        description: t('public_pages.features.modules.m6_desc', undefined, 'Cơ chế hạn mức Credit minh bạch cho từng lượt sử dụng tác vụ AI (chấm điểm, phân tích). Tích hợp cổng thanh toán chuyển khoản quét mã VietQR tự động qua Webhook SePay, kích hoạt gói cước và cộng credit ngay tức thì 24/7 không cần chờ duyệt thủ công.'),
        highlight: t('public_pages.features.modules.m6_highlight', undefined, 'Thanh toán VietQR kích hoạt tức thì'),
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40'
    }
];

export default function FeaturesPage() {
    const { isAuthenticated, user } = useAuthStore();
    const { t } = useTranslation();
    const features = getFeatures(t);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner Tích hợp Background Image & Glows */}
            <div className="relative pt-32 pb-24 md:pt-40 md:pb-32 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
                {/* Background image - đồng bộ với /support, /pricing, jobs public */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/feature-bg.jpg"
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center opacity-[0.22] dark:opacity-[0.22]"
                    />

                    {/* Light mode overlay */}
                    <div className="absolute inset-0 bg-linear-to-b from-background/45 via-background/70 to-background/95 dark:hidden" />

                    {/* Dark mode overlay */}
                    <div className="absolute inset-0 hidden bg-linear-to-b from-[#020617]/55 dark:block" />

                    {/* Dark mode color tint */}
                    <div className="absolute inset-0 hidden bg-blue-950/20 mix-blend-multiply dark:block" />
                </div>

                {/* Primary glow */}
                <div className="absolute left-1/2 top-[-12%] h-130 w-205 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px] dark:bg-blue-500/10 pointer-events-none" />

                {/* Soft side glows */}
                <div className="absolute left-[-15%] top-[20%] h-105 w-105 rounded-full bg-blue-400/4.5 blur-[120px] dark:bg-blue-500/6 pointer-events-none" />
                <div className="absolute right-[-15%] top-[30%] h-105 w-105 rounded-full bg-cyan-300/4 blur-[120px] dark:bg-cyan-500/5 pointer-events-none" />

                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background via-background/65 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xs border border-blue-100 dark:border-blue-900/50">
                        <Layers className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        {t('public_pages.features.hero.title_prefix', undefined, 'Sản phẩm &')}{' '}<span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">{t('public_pages.features.hero.title_highlight', undefined, 'Tính năng')}</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('public_pages.features.hero.desc', undefined, 'Khám phá lõi công nghệ NLP và thuật toán so khớp thực tế của Verisem. Đơn giản hóa tuyển dụng, gia tăng độ chính xác và kết nối đúng người với đúng việc.')}
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 -mt-12 sm:-mt-14 relative z-10 space-y-20">

                {/* Grid Tính năng */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 md:p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xs ${feature.bg} ${feature.color}`}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                            Module 0{idx + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>{feature.highlight}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Khối Kêu gọi Hành động (CTA) */}
                <div className="bg-linear-to-br from-primary-700 via-primary-600 to-indigo-700 dark:from-primary-900 dark:via-slate-900 dark:to-indigo-950 rounded-3xl p-10 md:p-14 text-center border border-primary-500/30 shadow-xl shadow-primary-900/10 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 text-white border border-white/20">
                            <Sparkles className="w-7 h-7 text-amber-300" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                            {t('public_pages.features.cta.title', undefined, 'Sẵn sàng trải nghiệm Verisem?')}
                        </h2>
                        <p className="text-primary-100 font-medium text-sm sm:text-base mb-8 leading-relaxed">
                            {t('public_pages.features.cta.desc', undefined, 'Bắt đầu tạo tài khoản miễn phí để tự chấm điểm hồ sơ năng lực hoặc đăng tuyển công việc ngay hôm nay.')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={ROUTES.REGISTER}
                                className="w-full sm:w-auto px-8 py-3.5 bg-white text-primary-600 hover:bg-slate-50 font-black text-sm rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                            >
                                <span>{t('public_pages.features.cta.btn_register', undefined, 'Tạo tài khoản miễn phí')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href={ROUTES.PRICING}
                                className="w-full sm:w-auto px-8 py-3.5 bg-primary-800/50 hover:bg-primary-800/70 text-white font-bold text-sm rounded-xl border border-primary-400/30 transition-all active:scale-98"
                            >
                                {t('public_pages.features.cta.btn_pricing', undefined, 'Xem bảng giá dịch vụ')}
                            </Link>
                        </div>
                    </div>
                </div>

            </main>

            <PublicFooter />
        </div>
    );
}