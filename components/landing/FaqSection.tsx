'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from '@/store/useLanguageStore';

export default function FaqSection() {
    const { t } = useTranslation();
    const [activeFaq, setActiveFaq] = useState<number | null>(0);

    const faqs = [
        {
            q: t('landing.faq.q1', undefined, 'Hệ thống AI chấm điểm dựa trên tiêu chí nào?'),
            a: t('landing.faq.a1', undefined, 'AI của chúng tôi phân tích dựa trên 4 trọng số: Kỹ năng chuyên môn, Ngữ nghĩa văn cảnh (NLP), Kinh nghiệm làm việc và Trình độ học vấn.'),
        },
        {
            q: t('landing.faq.q2', undefined, 'Dữ liệu CV của tôi có được bảo mật không?'),
            a: t('landing.faq.a2', undefined, 'Tuyệt đối. Chúng tôi sử dụng mã hóa AES-256 cho dữ liệu lưu trữ và TLS 1.3 cho dữ liệu truyền tải. Hồ sơ chỉ được chia sẻ khi bạn ứng tuyển.'),
        },
        {
            q: t('landing.faq.q3', undefined, 'Làm sao để đăng ký tài khoản Doanh nghiệp?'),
            a: t('landing.faq.a3', undefined, 'Doanh nghiệp cần cung cấp Mã số thuế và Giấy phép kinh doanh. Đội ngũ Admin sẽ kiểm duyệt (KYC) trong vòng 24h làm việc.'),
        },
    ];

    return (
        <section
            id="faq"
            className="relative scroll-mt-20 overflow-hidden border-y border-slate-200 bg-surface px-4 py-20 transition-colors dark:border-slate-800 sm:px-6 sm:py-24 md:py-28"
        >
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-64 w-175 -translate-x-1/2 rounded-full bg-primary-500/2.5 blur-3xl dark:bg-primary-500/4" />

                <div
                    className="absolute inset-0 opacity-[0.018] dark:opacity-[0.025]"
                    style={{
                        backgroundImage:
                            'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
            </div>

            <div className="relative mx-auto w-full max-w-4xl">
                {/* Header */}
                <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400"
                    >
                        <HelpCircle className="h-3.5 w-3.5 text-primary-500" />
                        {t('landing.faq.badge', undefined, 'Giải đáp thắc mắc')}
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl"
                    >
                        {t('landing.faq.title', undefined, 'Câu hỏi thường gặp')}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                        className="mx-auto mt-4 max-w-xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400 sm:text-base"
                    >
                        {t('landing.faq.subtitle', undefined, 'Những thông tin quan trọng về AI, bảo mật dữ liệu và quy trình sử dụng hệ thống.')}
                    </motion.p>
                </div>

                {/* FAQ list */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.08,
                            },
                        },
                    }}
                    className="space-y-3"
                >
                    {faqs.map((faq, i) => {
                        const isActive = activeFaq === i;

                        return (
                            <motion.div
                                key={faq.q}
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                        y: 15,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                    },
                                }}
                                transition={{ duration: 0.4 }}
                                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isActive
                                        ? 'border-primary-200 bg-white shadow-md shadow-primary-500/6 dark:border-primary-500/30 dark:bg-slate-900 dark:shadow-black/20'
                                        : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700'
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveFaq(
                                            isActive ? null : i,
                                        )
                                    }
                                    aria-expanded={isActive}
                                    className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                                >
                                    {/* Number */}
                                    <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black transition-colors ${isActive
                                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
                                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                                            }`}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </span>

                                    {/* Question */}
                                    <span
                                        className={`flex-1 pr-2 text-sm font-bold transition-colors sm:text-base ${isActive
                                                ? 'text-slate-900 dark:text-white'
                                                : 'text-slate-700 dark:text-slate-200'
                                            }`}
                                    >
                                        {faq.q}
                                    </span>

                                    {/* Chevron */}
                                    <motion.span
                                        animate={{
                                            rotate: isActive ? 180 : 0,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                        }}
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isActive
                                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
                                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                                            }`}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </motion.span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isActive && (
                                        <motion.div
                                            initial={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            animate={{
                                                height: 'auto',
                                                opacity: 1,
                                            }}
                                            exit={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            transition={{
                                                height: {
                                                    duration: 0.3,
                                                    ease: 'easeOut',
                                                },
                                                opacity: {
                                                    duration: 0.2,
                                                },
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                                                <div className="ml-12 border-l border-primary-100 pl-4 dark:border-primary-500/20 sm:pl-5">
                                                    <p className="text-sm font-medium leading-7 text-slate-500 dark:text-slate-400 sm:text-[15px]">
                                                        {faq.a}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Small footer hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="mt-8 text-center text-xs font-medium text-slate-400 dark:text-slate-500"
                >
                    {t('landing.faq.hint', undefined, 'Chưa tìm thấy câu trả lời bạn cần? Đội ngũ hỗ trợ luôn sẵn sàng giải đáp.')}
                </motion.p>
            </div>
        </section>
    );
}