'use client';

import { ROUTES } from '@/constants/routes';
import { Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/store/useLanguageStore';

interface CompanyMarqueeProps {
    companies: any[];
    onSelectCompany?: (companyName: string) => void;
}

export default function CompanyMarquee({
    companies,
    onSelectCompany,
}: CompanyMarqueeProps) {
    const router = useRouter();
    const { t } = useTranslation();
    const [shuffled, setShuffled] = useState<any[]>([]);

    useEffect(() => {
        if (!companies || companies.length === 0) return;
        // Random vị trí mỗi lần render
        const shuffledArray = [...companies].sort(() => Math.random() - 0.5);
        // Đảm bảo list đủ dài để chạy mượt (nếu ít công ty thì nhân bản lên)
        let displayList = shuffledArray;
        while (displayList.length < 8) {
            displayList = [...displayList, ...shuffledArray];
        }
        setShuffled(displayList);
    }, [companies]);

    // Không render nếu chưa mount xong (tránh hydration mismatch vì Math.random)
    if (shuffled.length === 0) return null;

    const renderCompany = (company: any, index: number) => {
        const companyId = company?.id || null;
        const companyName = company?.name || t('companies.anonymous', undefined, 'Công ty');
        const logoUrl = company?.logo_url || null;

        return (
            <button
                key={`${companyId || 'company'}-${index}-${Math.random()}`}
                type="button"
                title={companyName}
                aria-label={companyName}
                onClick={() => {
                    if (companyId) {
                        router.push(ROUTES.PUBLIC_COMPANY_DETAIL(companyId));
                    } else if (onSelectCompany) {
                        onSelectCompany(companyName);
                    }
                }}
                className="group w-32 h-20 md:w-40 md:h-24 flex shrink-0 items-center justify-center rounded-xl opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-105"
            >
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt={companyName}
                        title={companyName}
                        className="max-w-full max-h-full w-auto h-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div
                        title={companyName}
                        className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500"
                    >
                        <Building2 className="w-7 h-7" />
                    </div>
                )}
            </button>
        );
    };

    return (
        <section className="py-10 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 transition-colors overflow-hidden">
            <div className="max-w-full mx-auto flex flex-col items-center">
                {/* Tiêu đề */}
                <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-8">
                    {t('landing.marquee.trusted_by', undefined, 'Được tin dùng bởi các doanh nghiệp')}
                </p>

                {/* Danh sách logo trượt */}
                <div className="relative w-full flex overflow-hidden group">
                    {/* Gradient fade effects ở 2 bên */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-[rgba(15,23,42,0.3)] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-[rgba(15,23,42,0.3)] to-transparent z-10 pointer-events-none" />

                    <motion.div
                        className="flex w-max"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{
                            ease: 'linear',
                            duration: 35,
                            repeat: Infinity,
                        }}
                    >
                        {/* Render 2 lần để loop mượt mà */}
                        <div className="flex gap-8 md:gap-16 shrink-0 px-4 md:px-8">
                            {shuffled.map((company, index) => renderCompany(company, index))}
                        </div>
                        <div className="flex gap-8 md:gap-16 shrink-0 px-4 md:px-8">
                            {shuffled.map((company, index) => renderCompany(company, index))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}