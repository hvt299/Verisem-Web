'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, BriefcaseBusiness, TrendingUp } from 'lucide-react';

import Counter from '@/components/ui/Counter';
import { systemService } from '@/features/system/system.service';
import { useTranslation } from '@/store/useLanguageStore';

const STAT_ICONS = [ Users, Building2, BriefcaseBusiness, TrendingUp ];

export default function StatsSection() {
    const { t } = useTranslation();
    const [statsData, setStatsData] = useState({
        total_candidates: 0,
        total_companies: 0,
        total_jobs: 0,
        success_rate: 0,
    });

    useEffect(() => {
        systemService
            .getStatistics()
            .then((data) => {
                setStatsData({
                    total_candidates: data.total_candidates || 0,
                    total_companies: data.total_companies || 0,
                    total_jobs: data.total_jobs || 0,
                    success_rate: data.success_rate || 0,
                });
            })
            .catch(console.error);
    }, []);

    const stats = [
        {
            label: t('landing.stats.applications', undefined, 'Ứng viên hoạt động'),
            value: statsData.total_candidates,
            suffix: statsData.total_candidates > 10 ? '+' : '',
        },
        {
            label: t('landing.stats.verified_companies', undefined, 'Doanh nghiệp tin dùng'),
            value: statsData.total_companies,
            suffix: statsData.total_companies > 10 ? '+' : '',
        },
        {
            label: t('landing.stats.active_jobs', undefined, 'Việc làm đang mở'),
            value: statsData.total_jobs,
            suffix: statsData.total_jobs > 10 ? '+' : '',
        },
        {
            label: t('landing.stats.match_rate', undefined, 'Tỷ lệ kết nối thành công'),
            value: statsData.success_rate,
            suffix: '%',
        },
    ];

    return (
        <section className="border-y border-slate-200 bg-blue-50 py-8 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:py-9 md:py-10">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = STAT_ICONS[index];

                        return (
                            <motion.div
                                key={stat.label}
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                    margin: '-40px',
                                }}
                                transition={{
                                    duration: 0.35,
                                    delay: index * 0.07,
                                }}
                                className={`
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    px-3
                                    py-3
                                    text-center
                                    sm:px-5

                                    ${index % 2 !== 0
                                        ? 'border-l border-slate-200 dark:border-slate-800'
                                        : ''
                                    }

                                    ${index >= 2
                                        ? 'border-t border-slate-200 dark:border-slate-800 md:border-t-0'
                                        : ''
                                    }

                                    ${index !== 0
                                        ? 'md:border-l md:border-slate-200 md:dark:border-slate-800'
                                        : ''
                                    }
                                `}
                            >
                                <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                                    <Icon className="h-3.5 w-3.5" />
                                </div>

                                <div className="text-2xl font-black tracking-tight text-blue-700 dark:text-blue-400 sm:text-3xl md:text-4xl">
                                    <Counter
                                        value={stat.value}
                                        suffix={stat.suffix}
                                    />
                                </div>

                                <span className="mt-1 max-w-42.5 text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-slate-500 dark:text-slate-400 sm:text-xs">
                                    {stat.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}