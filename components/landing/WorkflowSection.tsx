'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/store/useLanguageStore';
import { BriefcaseBusiness, BrainCircuit, CalendarCheck, CheckCircle2, ArrowRight } from 'lucide-react';

const colorStyles = {
    blue: {
        solid: '#3b82f6',
        text: 'text-blue-600 dark:text-blue-400',
        soft: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-200 dark:border-blue-500/30',
        shadow: 'rgba(59,130,246,0.42)',
    },
    violet: {
        solid: '#8b5cf6',
        text: 'text-violet-600 dark:text-violet-400',
        soft: 'bg-violet-50 dark:bg-violet-500/10',
        border: 'border-violet-200 dark:border-violet-500/30',
        shadow: 'rgba(139,92,246,0.42)',
    },
    emerald: {
        solid: '#10b981',
        text: 'text-emerald-600 dark:text-emerald-400',
        soft: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-200 dark:border-emerald-500/30',
        shadow: 'rgba(16,185,129,0.42)',
    },
} as const;

export default function WorkflowSection() {
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            step: '01',
            title: t('landing.workflow.step1_title', undefined, 'Tạo chiến dịch'),
            desc: t('landing.workflow.step1_desc', undefined, 'HR tạo vị trí tuyển dụng, nhập yêu cầu công việc và thiết lập các tiêu chí đánh giá phù hợp.'),
            icon: BriefcaseBusiness,
            color: 'blue' as const,
            stats: [
                t('landing.workflow.step1_stat1', undefined, 'Mô tả công việc'),
                t('landing.workflow.step1_stat2', undefined, 'Yêu cầu kỹ năng'),
                t('landing.workflow.step1_stat3', undefined, 'Tiêu chí tuyển dụng'),
            ],
        },
        {
            step: '02',
            title: t('landing.workflow.step2_title', undefined, 'AI phân tích'),
            desc: t('landing.workflow.step2_desc', undefined, 'CV được tự động bóc tách, đối chiếu với JD và chấm điểm theo các tiêu chí đã thiết lập.'),
            icon: BrainCircuit,
            color: 'violet' as const,
            stats: [
                t('landing.workflow.step2_stat1', undefined, 'Bóc tách CV'),
                t('landing.workflow.step2_stat2', undefined, 'Đối chiếu JD'),
                t('landing.workflow.step2_stat3', undefined, 'Chấm điểm AI'),
            ],
        },
        {
            step: '03',
            title: t('landing.workflow.step3_title', undefined, 'Kết nối ứng viên'),
            desc: t('landing.workflow.step3_desc', undefined, 'HR nhanh chóng xác định ứng viên nổi bật, gửi lời mời và lên lịch phỏng vấn.'),
            icon: CalendarCheck,
            color: 'emerald' as const,
            stats: [
                t('landing.workflow.step3_stat1', undefined, 'Xếp hạng ứng viên'),
                t('landing.workflow.step3_stat2', undefined, 'Mời phỏng vấn'),
                t('landing.workflow.step3_stat3', undefined, 'Theo dõi tiến trình'),
            ],
        },
    ];
    const [allActive, setAllActive] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (!allActive) {
            timer = setTimeout(() => {
                if (activeStep < steps.length - 1) {
                    setActiveStep((prev) => prev + 1);
                } else {
                    setAllActive(true);
                }
            }, 1800);
        } else {
            timer = setTimeout(() => {
                setAllActive(false);
                setActiveStep(0);
            }, 2200);
        }

        return () => clearTimeout(timer);
    }, [activeStep, allActive]);

    return (
        <section
            id="workflow"
            className="relative scroll-mt-20 overflow-hidden border-y border-slate-200 bg-slate-50 py-20 transition-colors dark:border-slate-800 dark:bg-slate-950 sm:py-24 md:py-32"
        >
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Center glow */}
                <div className="absolute left-1/2 -top-30 h-125 w-225 -translate-x-1/2 rounded-full bg-blue-500/[0.035] blur-3xl dark:bg-blue-500/4.5" />

                {/* Left ambient */}
                <motion.div
                    className="absolute -left-48 top-1/4 h-96 w-96 rounded-full bg-blue-500/[0.035] blur-3xl"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        opacity: [0.35, 0.65, 0.35],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Right ambient */}
                <motion.div
                    className="absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-violet-500/[0.035] blur-3xl"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 20, 0],
                        opacity: [0.35, 0.65, 0.35],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.022] dark:opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
            </div>

            <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 md:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.55,
                            ease: 'easeOut',
                        }}
                        className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl"
                    >
                        {t('landing.workflow.title_part1', undefined, 'Từ CV đến ứng viên phù hợp.')}
                        <br className="hidden sm:block" />
                        <span className="text-blue-600 dark:text-blue-400">
                            {' '}
                            {t('landing.workflow.title_highlight', undefined, 'Nhanh hơn. Chính xác hơn.')}
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                        }}
                        className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-500 dark:text-slate-400 sm:text-base md:text-lg"
                    >
                        {t('landing.workflow.subtitle', undefined, 'Một quy trình liền mạch giúp đội ngũ tuyển dụng giảm thao tác thủ công và tập trung vào những ứng viên thực sự tiềm năng.')}
                    </motion.p>
                </div>

                {/* Workflow */}
                <div className="relative">
                    {/* Desktop connector */}
                    <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-13.75 hidden md:block">
                        {/* Base */}
                        <div className="h-0.5 rounded-full bg-slate-200 dark:bg-slate-800" />

                        {/* Step 1 → Step 2 → Step 3 light */}
                        <motion.div
                            className="absolute left-0 top-0 h-0.5 rounded-full"
                            animate={{
                                width: allActive
                                    ? '100%'
                                    : `${(activeStep / 2) * 100}%`,
                                opacity: allActive || activeStep > 0 ? 1 : 0,
                            }}
                            transition={{
                                duration: 0.65,
                                ease: 'easeInOut',
                            }}
                            style={{
                                background:
                                    'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)',
                            }}
                        />

                        {/* Moving beam */}
                        <motion.div
                            className="absolute -top-1.25 h-3 w-20 rounded-full blur-md"
                            animate={{
                                left: allActive
                                    ? ['0%', '100%']
                                    : `${(activeStep / 2) * 100}%`,
                                opacity: allActive ? [0, 1, 0] : 0,
                            }}
                            transition={{
                                duration: allActive ? 1.8 : 0.3,
                                ease: 'easeInOut',
                            }}
                            style={{
                                background:
                                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)',
                            }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-6">
                        {steps.map((item, index) => {
                            const Icon = item.icon;

                            const styles =
                                colorStyles[
                                item.color as keyof typeof colorStyles
                                ];

                            const isActive =
                                allActive || activeStep === index;

                            return (
                                <WorkflowStep
                                    key={item.step}
                                    item={item}
                                    index={index}
                                    Icon={Icon}
                                    styles={styles}
                                    isActive={isActive}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

interface WorkflowStepItem {
    step: string;
    title: string;
    desc: string;
    icon: React.ElementType;
    color: 'blue' | 'violet' | 'emerald';
    stats: string[];
}

function WorkflowStep({
    item,
    index,
    Icon,
    styles,
    isActive,
}: {
    item: WorkflowStepItem;
    index: number;
    Icon: React.ElementType;
    styles: (typeof colorStyles)[keyof typeof colorStyles];
    isActive: boolean;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 30,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                margin: '-80px',
            }}
            transition={{
                duration: 0.55,
                delay: index * 0.12,
            }}
            className="group relative"
        >
            {/* Node */}
            <div className="relative z-10 mx-auto mb-8 flex w-fit items-center justify-center">
                {/* Glow */}
                <motion.div
                    className="absolute h-42.5 w-42.5 rounded-full blur-3xl"
                    animate={{
                        opacity: isActive ? 0.45 : 0,
                        scale: isActive ? 1 : 0.75,
                    }}
                    transition={{
                        duration: 0.55,
                        ease: 'easeOut',
                    }}
                    style={{
                        background: styles.shadow,
                    }}
                />

                {/* Outer ring */}
                <motion.div
                    className="absolute -inset-3 rounded-full border"
                    animate={{
                        borderColor: isActive
                            ? styles.solid
                            : 'rgba(148,163,184,0.18)',
                        opacity: isActive ? 0.8 : 0.35,
                        scale: isActive ? 1.05 : 0.94,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeOut',
                    }}
                />

                {/* Main circle */}
                <motion.div
                    className="relative flex h-27.5 w-27.5 items-center justify-center rounded-full border bg-white dark:bg-slate-950"
                    animate={{
                        borderColor: isActive
                            ? styles.solid
                            : 'rgba(203,213,225,0.8)',
                        boxShadow: isActive
                            ? `0 15px 50px ${styles.shadow}`
                            : '0 6px 20px rgba(15,23,42,0.045)',
                    }}
                    transition={{
                        duration: 0.55,
                        ease: 'easeOut',
                    }}
                >
                    {/* Icon background */}
                    <motion.div
                        className={`flex h-16 w-16 items-center justify-center rounded-full ${isActive
                            ? styles.soft
                            : 'bg-slate-100 dark:bg-slate-800'
                            }`}
                        animate={{
                            scale: isActive ? 1.08 : 1,
                            opacity: isActive ? 1 : 0.55,
                        }}
                        transition={{
                            duration: 0.45,
                            ease: 'easeOut',
                        }}
                    >
                        <motion.div
                            animate={{
                                color: isActive
                                    ? styles.solid
                                    : '#94a3b8',
                            }}
                            transition={{
                                duration: 0.45,
                            }}
                        >
                            <Icon className="h-7 w-7" />
                        </motion.div>
                    </motion.div>

                    {/* Number */}
                    <motion.span
                        className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black text-white"
                        animate={{
                            backgroundColor: isActive
                                ? styles.solid
                                : '#94a3b8',
                            scale: isActive ? 1.1 : 0.95,
                            boxShadow: isActive
                                ? `0 5px 18px ${styles.shadow}`
                                : 'none',
                        }}
                        transition={{
                            duration: 0.45,
                        }}
                    >
                        {item.step}
                    </motion.span>
                </motion.div>
            </div>

            {/* Card */}
            <motion.div
                className="relative rounded-2xl border bg-white p-6 dark:bg-slate-900"
                animate={{
                    borderColor: isActive
                        ? styles.solid
                        : 'rgba(226,232,240,0.9)',
                    boxShadow: isActive
                        ? `0 18px 45px ${styles.shadow}`
                        : '0 4px 16px rgba(15,23,42,0.025)',
                    opacity: isActive ? 1 : 0.68,
                    y: isActive ? -3 : 0,
                }}
                transition={{
                    duration: 0.55,
                    ease: 'easeOut',
                }}
            >
                {/* Active top line */}
                <motion.div
                    className="absolute left-6 right-6 top-0 h-0.5 rounded-full"
                    animate={{
                        backgroundColor: isActive
                            ? styles.solid
                            : '#cbd5e1',
                        opacity: isActive ? 1 : 0.35,
                        scaleX: isActive ? 1 : 0.35,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                />

                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <motion.p
                            className="mb-1 text-[10px] font-black uppercase tracking-[0.18em]"
                            animate={{
                                color: isActive
                                    ? styles.solid
                                    : '#94a3b8',
                            }}
                            transition={{
                                duration: 0.45,
                            }}
                        >
                            {useTranslation().t('landing.workflow.step_prefix', undefined, 'Bước')} {item.step}
                        </motion.p>

                        <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                            {item.title}
                        </h3>
                    </div>

                    {index < 2 && (
                        <motion.div
                            animate={{
                                color: isActive
                                    ? styles.solid
                                    : '#cbd5e1',
                                opacity: isActive ? 0.8 : 0.3,
                            }}
                            transition={{
                                duration: 0.45,
                            }}
                        >
                            <ArrowRight className="hidden h-5 w-5 shrink-0 md:block" />
                        </motion.div>
                    )}
                </div>

                <p className="text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                    {item.desc}
                </p>

                {/* Stats */}
                <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 dark:border-slate-800">
                    {item.stats.map((stat) => (
                        <motion.div
                            key={stat}
                            className="flex items-center gap-2 text-xs font-bold"
                            animate={{
                                color: isActive
                                    ? undefined
                                    : '#94a3b8',
                                opacity: isActive ? 1 : 0.55,
                            }}
                            transition={{
                                duration: 0.45,
                            }}
                        >
                            <motion.div
                                animate={{
                                    color: isActive
                                        ? styles.solid
                                        : '#94a3b8',
                                }}
                                transition={{
                                    duration: 0.45,
                                }}
                            >
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                            </motion.div>

                            <span className="text-slate-500 dark:text-slate-400">
                                {stat}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Mobile connector */}
            {index < 2 && (
                <div className="absolute -bottom-12 left-1/2 flex h-12 -translate-x-1/2 flex-col items-center md:hidden">
                    <motion.div
                        className="h-full w-px origin-top"
                        animate={{
                            backgroundColor: isActive
                                ? styles.solid
                                : '#cbd5e1',
                            opacity: isActive ? 0.7 : 0.35,
                        }}
                        transition={{
                            duration: 0.45,
                        }}
                    />

                    <motion.div
                        className="absolute h-5 w-1 rounded-full blur-[2px]"
                        animate={{
                            y: [-42, 30],
                            opacity: isActive ? [0, 1, 0] : 0,
                        }}
                        transition={{
                            duration: 1.4,
                            repeat: isActive ? Infinity : 0,
                            ease: 'easeInOut',
                        }}
                        style={{
                            backgroundColor: styles.solid,
                        }}
                    />
                </div>
            )}
        </motion.div>
    );
}