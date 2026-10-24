'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTranslation } from '@/store/useLanguageStore';
import { BrainCircuit, FileSearch, Zap, ShieldCheck, CheckCircle2, Search, Cpu, LockKeyhole, ScanText } from 'lucide-react';

const colorMap = {
    blue: {
        active: 'border-blue-500 bg-blue-50/80 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        icon: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
        glow: 'bg-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
    },
    violet: {
        active: 'border-violet-500 bg-violet-50/80 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
        icon: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
        glow: 'bg-violet-500',
        text: 'text-violet-600 dark:text-violet-400',
    },
    amber: {
        active: 'border-amber-500 bg-amber-50/80 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        icon: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
        glow: 'bg-amber-500',
        text: 'text-amber-600 dark:text-amber-400',
    },
    emerald: {
        active: 'border-emerald-500 bg-emerald-50/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
        glow: 'bg-emerald-500',
        text: 'text-emerald-600 dark:text-emerald-400',
    },
} as const;

const fade: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: 'easeOut' },
    },
};

function ScoringAnimation() {
    const { t } = useTranslation();
    const criteria = [
        [t('landing.features.scoring_skills', undefined, 'Kỹ năng'), 96],
        [t('landing.features.scoring_semantics', undefined, 'Ngữ nghĩa'), 93],
        [t('landing.features.scoring_experience', undefined, 'Kinh nghiệm'), 91],
        [t('landing.features.scoring_education', undefined, 'Học vấn'), 88],
    ];

    return (
        <div className="relative flex min-h-65 items-center justify-center sm:min-h-80">
            {/* AI scanning glow */}
            <motion.div
                className="absolute h-56 w-56 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/15"
                animate={{
                    scale: [0.9, 1.15, 0.9],
                    opacity: [0.35, 0.65, 0.35],
                }}
                transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <div className="relative w-full max-w-[320px] rounded-2xl border border-blue-100 bg-white p-5 shadow-xl shadow-blue-500/10 dark:border-slate-700 dark:bg-slate-900 sm:max-w-sm">
                {/* Header */}
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                            <motion.span
                                className="h-2 w-2 rounded-full bg-blue-500"
                                animate={{
                                    opacity: [0.35, 1, 0.35],
                                    scale: [0.8, 1.2, 0.8],
                                }}
                                transition={{
                                    duration: 1.4,
                                    repeat: Infinity,
                                }}
                            />

                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                                {t('landing.features.scoring_scanning', undefined, 'AI đang phân tích')}
                            </p>
                        </div>

                        <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                            Senior Product Designer
                        </p>
                    </div>

                    {/* Score */}
                    <motion.div
                        className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeOut',
                        }}
                    >
                        {/* Progress ring */}
                        <svg
                            className="absolute inset-0 h-full w-full -rotate-90"
                            viewBox="0 0 64 64"
                        >
                            <circle
                                cx="32"
                                cy="32"
                                r="27"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-slate-100 dark:text-slate-800"
                            />

                            <motion.circle
                                cx="32"
                                cy="32"
                                r="27"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="text-blue-500"
                                strokeDasharray={169.65}
                                initial={{
                                    strokeDashoffset: 169.65,
                                }}
                                animate={{
                                    strokeDashoffset: 10.18,
                                }}
                                transition={{
                                    duration: 1.8,
                                    delay: 0.25,
                                    ease: 'easeOut',
                                }}
                            />
                        </svg>

                        <motion.span
                            className="relative text-lg font-black text-blue-600 dark:text-blue-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1 }}
                        >
                            94%
                        </motion.span>
                    </motion.div>
                </div>

                {/* AI criteria */}
                <div className="space-y-3">
                    {criteria.map(([item, score], i) => (
                        <div key={item}>
                            <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-500 dark:text-slate-400">
                                    {item}
                                </span>

                                <motion.span
                                    className="text-blue-600 dark:text-blue-400"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        delay: 0.55 + i * 0.15,
                                    }}
                                >
                                    {score}%
                                </motion.span>
                            </div>

                            <div className="relative h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <motion.div
                                    className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-blue-500 to-cyan-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${score}%` }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.45 + i * 0.16,
                                        ease: 'easeOut',
                                    }}
                                />

                                {/* AI scan highlight */}
                                <motion.div
                                    className="absolute inset-y-0 w-10 bg-white/40 blur-sm"
                                    initial={{ x: '-120%' }}
                                    animate={{ x: '500%' }}
                                    transition={{
                                        duration: 1.5,
                                        delay: 0.8 + i * 0.12,
                                        ease: 'easeInOut',
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Result */}
                <motion.div
                    className="mt-5 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 1.55,
                        duration: 0.45,
                    }}
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {t('landing.features.scoring_matched', undefined, 'Hồ sơ rất phù hợp')}
                        </span>
                    </div>

                    <motion.span
                        className="text-[10px] font-black uppercase tracking-wide text-emerald-500"
                        animate={{
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                    >
                        AI Match
                    </motion.span>
                </motion.div>

                {/* Scanning line */}
                <motion.div
                    className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-blue-400/70 to-transparent"
                    animate={{
                        y: [0, 260, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>
        </div>
    );
}

function AntiStuffingAnimation() {
    const { t } = useTranslation();
    const keywords = ['React', 'Next.js', 'AI', 'Leadership', 'Python'];

    return (
        <div className="relative flex min-h-65 items-center justify-center sm:min-h-80">
            <motion.div
                className="absolute h-56 w-56 rounded-full bg-violet-500/10 blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative w-full max-w-[320px] rounded-2xl sm:max-w-sm border border-violet-100 bg-white p-5 shadow-xl shadow-violet-500/10 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-violet-100 p-2 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                        <Search className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                            {t('landing.features.fraud_step', undefined, 'Phân tích từ khóa')}
                        </p>
                        <p className="text-xs text-slate-400">
                            {t('landing.features.checking_cv', undefined, 'Đang kiểm tra CV...')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, i) => (
                        <motion.span
                            key={keyword}
                            className={`rounded-lg border px-3 py-2 text-xs font-bold ${i === 3
                                ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-500/20 dark:bg-red-500/10'
                                : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                            animate={
                                i === 3
                                    ? {
                                        scale: [1, 1.05, 1],
                                        opacity: [0.7, 1, 0.7],
                                    }
                                    : {}
                            }
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {keyword}
                        </motion.span>
                    ))}
                </div>

                <motion.div
                    className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10"
                    animate={{ x: [0, -2, 2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400">
                        <FileSearch className="h-4 w-4" />
                        {t('landing.features.anti_detected', undefined, 'Phát hiện nhồi nhét từ khóa')}
                    </div>

                    <p className="mt-1 text-xs text-red-500/80">
                        {t('landing.features.anti_confidence', undefined, 'Độ tin cậy: 98.7%')}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

function ParsingAnimation() {
    const { t } = useTranslation();
    return (
        <div className="relative flex min-h-65 items-center justify-center sm:min-h-80">
            <motion.div
                className="absolute h-56 w-56 rounded-full bg-amber-500/10 blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative w-full max-w-[320px] rounded-2xl sm:max-w-sm border border-amber-100 bg-white p-5 shadow-xl shadow-amber-500/10 dark:border-slate-700 dark:bg-slate-900">
                <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex items-center gap-3">
                        <ScanText className="h-5 w-5 text-amber-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            Nguyen_Resume.pdf
                        </span>
                    </div>

                    <div className="space-y-2">
                        {[70, 90, 55, 82].map((width, i) => (
                            <div
                                key={i}
                                className="h-2 rounded bg-slate-200 dark:bg-slate-700"
                                style={{ width: `${width}%` }}
                            />
                        ))}
                    </div>

                    <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-amber-500 shadow-lg shadow-amber-500"
                        animate={{ top: ['15%', '85%', '15%'] }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                        [t('landing.features.parsing_skills', undefined, 'Kỹ năng'), '12'],
                        [t('landing.features.parsing_experience', undefined, 'Kinh nghiệm'), t('landing.features.parsing_exp_value', undefined, '7 năm')],
                        [t('landing.features.parsing_education', undefined, 'Học vấn'), 'MBA'],
                    ].map(([label, value], i) => (
                        <motion.div
                            key={label}
                            className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-center dark:border-amber-500/20 dark:bg-amber-500/10"
                            animate={{ y: [0, -3, 0] }}
                            transition={{
                                duration: 2,
                                delay: i * 0.2,
                                repeat: Infinity,
                            }}
                        >
                            <p className="text-[10px] font-bold text-slate-400">
                                {label}
                            </p>
                            <p className="mt-1 text-sm font-black text-amber-600 dark:text-amber-400">
                                {value}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SecurityAnimation() {
    const { t } = useTranslation();
    return (
        <div className="relative flex min-h-65 items-center justify-center sm:min-h-80">
            <motion.div
                className="absolute h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl"
                animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative flex w-full max-w-sm flex-col items-center">
                <motion.div
                    className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-50 text-emerald-600 shadow-xl shadow-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                    animate={{
                        scale: [1, 1.04, 1],
                        boxShadow: [
                            '0 0 0 rgba(16,185,129,0.1)',
                            '0 0 35px rgba(16,185,129,0.3)',
                            '0 0 0 rgba(16,185,129,0.1)',
                        ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                >
                    <LockKeyhole className="h-10 w-10" />

                    <motion.div
                        className="absolute -inset-3 rounded-full border border-dashed border-emerald-400/40"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                </motion.div>

                <div className="mt-8 grid w-full grid-cols-3 gap-2">
                    {[t('landing.features.sec_encrypted', undefined, 'Đã mã hóa'), t('landing.features.sec_private', undefined, 'Riêng tư'), t('landing.features.sec_protected', undefined, 'Được bảo vệ')].map((item, i) => (
                        <motion.div
                            key={item}
                            className="rounded-lg border border-emerald-100 bg-white px-2 py-3 text-center shadow-sm dark:border-emerald-500/20 dark:bg-slate-900"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                                duration: 2,
                                delay: i * 0.2,
                                repeat: Infinity,
                            }}
                        >
                            <CheckCircle2 className="mx-auto mb-1 h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300">
                                {item}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FeatureAnimation({ id }: { id: string }) {
    switch (id) {
        case 'anti':
            return <AntiStuffingAnimation />;
        case 'parsing':
            return <ParsingAnimation />;
        case 'security':
            return <SecurityAnimation />;
        default:
            return <ScoringAnimation />;
    }
}

export default function FeaturesSection() {
    const { t } = useTranslation();

    const featuresList = [
        {
            id: 'ai',
            icon: BrainCircuit,
            title: t('landing.features.ai_title', undefined, 'Ma trận chấm điểm AI'),
            short: t('landing.features.ai_short', undefined, 'Chấm điểm CV bằng AI'),
            desc: t('landing.features.ai_desc', undefined, 'Phân tích CV đa chiều bằng AI, đối chiếu trực tiếp với yêu cầu công việc và đưa ra điểm số khách quan.'),
            color: 'blue' as const,
        },
        {
            id: 'anti',
            icon: FileSearch,
            title: t('landing.features.anti_title', undefined, 'Phát hiện gian lận từ khóa'),
            short: t('landing.features.anti_short', undefined, 'Kiểm tra độ tin cậy CV'),
            desc: t('landing.features.anti_desc', undefined, 'Tự động phát hiện hồ sơ cố tình nhồi nhét từ khóa, font chữ trắng hoặc nội dung tàng hình để thao túng kết quả.'),
            color: 'violet' as const,
        },
        {
            id: 'parsing',
            icon: Zap,
            title: t('landing.features.parsing_title', undefined, 'Bóc tách CV thông minh'),
            short: t('landing.features.parsing_short', undefined, 'Phân tích CV tự động'),
            desc: t('landing.features.parsing_desc', undefined, 'Đọc và bóc tách chính xác thông tin Học vấn, Kinh nghiệm và Kỹ năng từ file PDF hoặc DOCX chỉ trong vài giây.'),
            color: 'amber' as const,
        },
        {
            id: 'security',
            icon: ShieldCheck,
            title: t('landing.features.security_title', undefined, 'Bảo mật dữ liệu'),
            short: t('landing.features.security_short', undefined, 'An toàn & riêng tư'),
            desc: t('landing.features.security_desc', undefined, 'Dữ liệu ứng viên và doanh nghiệp được bảo vệ bằng nhiều lớp mã hóa cùng cơ chế kiểm soát truy cập chặt chẽ.'),
            color: 'emerald' as const,
        },
    ];

    const [activeId, setActiveId] = useState('ai');
    const active = featuresList.find(f => f.id === activeId) || featuresList[0];

    const styles = colorMap[active.color as keyof typeof colorMap];

    return (
        <section
            id="features"
            className="relative scroll-mt-20 overflow-hidden bg-slate-50 px-3 pt-14 pb-12 sm:px-5 sm:pt-16 sm:pb-14 md:px-6 md:pt-20 md:pb-16 lg:pt-24 lg:pb-16 transition-colors dark:bg-slate-950"
        >
            <div className="pointer-events-none absolute inset-0">
                <motion.div
                    className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl"
                    animate={{ x: [0, 40, 0], y: [0, -25, 0] }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                <motion.div
                    className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-500/5 blur-3xl"
                    animate={{ x: [0, -35, 0], y: [0, 20, 0] }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>

            <div className="relative mx-auto w-full max-w-7xl px-1 sm:px-2 lg:px-4">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.1 },
                        },
                    }}
                    className="mb-10 md:mb-12"
                >
                    <motion.h2
                        variants={fade}
                        className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl md:text-4xl lg:text-5xl"
                    >
                        {t('landing.features.title_part1', undefined, 'Tuyển dụng.')}
                        <span className="text-slate-400 dark:text-slate-500">
                            {' '}
                            {t('landing.features.title_highlight', undefined, 'Nhưng thông minh hơn.')}
                        </span>
                    </motion.h2>

                    <motion.p
                        variants={fade}
                        className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-300 sm:text-base md:mt-4 md:text-lg"
                    >
                        {t('landing.features.subtitle', undefined, 'Hệ thống Verisem giúp tự động hóa quy trình tuyển dụng, đánh giá ứng viên khách quan và tiết kiệm đến 80% thời gian sàng lọc.')}
                    </motion.p>
                </motion.div>

                {/* Showcase */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-70px' }}
                    transition={{ duration: 0.6 }}
                    className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/30 sm:rounded-3xl lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]"
                >
                    {/* Left navigation */}
                    <div className="border-b border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50 lg:border-b-0 lg:border-r lg:p-4">
                        <div className="mb-3 px-2 py-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                                {t('landing.features.system_capabilities', undefined, 'Năng lực hệ thống')}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:flex-col">
                            {featuresList.map((feature) => {
                                const Icon = feature.icon;
                                const isActive = active.id === feature.id;
                                const itemStyles =
                                    colorMap[
                                    feature.color as keyof typeof colorMap
                                    ];

                                return (
                                    <button
                                        key={feature.id}
                                        onClick={() => setActiveId(feature.id)}
                                        className={`group relative flex w-full items-center gap-2 rounded-xl border p-2.5 text-left transition-all duration-300 sm:gap-3 sm:p-3 ${isActive
                                            ? itemStyles.active
                                            : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-white dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-900'
                                            }`}
                                    >
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300 sm:h-10 sm:w-10 ${isActive
                                                ? itemStyles.icon
                                                : 'bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500'
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold">
                                                {feature.title}
                                            </p>
                                            <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                                {feature.short}
                                            </p>
                                        </div>

                                        {isActive && (
                                            <motion.div
                                                layoutId="active-feature"
                                                className={`absolute bottom-0 left-0 top-0 hidden w-1 rounded-full lg:block ${itemStyles.glow}`}
                                                transition={{ backgroundColor: { duration: 0 } }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right content + animation */}
                    <div className="relative min-h-0 overflow-hidden sm:min-h-155 xl:min-h-130">
                        <div className="absolute inset-0 bg-linear-to-br from-slate-50/80 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20" />

                        <div className="relative grid h-full xl:grid-cols-[0.85fr_1.15fr]">
                            {/* Content */}
                            <div className="flex flex-col justify-center p-5 sm:p-7 md:p-9 xl:p-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={active.id}
                                        initial={{ opacity: 0, x: -18 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 18 }}
                                        transition={{ duration: 0.35 }}
                                    >
                                        <div
                                            className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}
                                        >
                                            <active.icon className="h-6 w-6" />
                                        </div>

                                        <p
                                            className={`mb-2 text-xs font-black uppercase tracking-widest ${styles.text}`}
                                        >
                                            {active.short}
                                        </p>

                                        <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
                                            {active.title}
                                        </h3>

                                        <p className="mt-4 max-w-md text-sm font-medium leading-7 text-slate-500 dark:text-slate-300 md:text-base">
                                            {active.desc}
                                        </p>

                                        <div className="mt-7 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                                            <Cpu className="h-4 w-4" />
                                            {t('landing.features.auto_ai_analysis', undefined, 'Phân tích tự động bằng AI')}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Animation */}
                            <div className="flex items-center justify-center border-t border-slate-200/70 px-4 py-6 dark:border-slate-800 sm:px-6 sm:py-8 xl:border-l xl:border-t-0 xl:p-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={active.id}
                                        initial={{ opacity: 0, scale: 0.94 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.03 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-full"
                                    >
                                        <FeatureAnimation id={active.id} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}