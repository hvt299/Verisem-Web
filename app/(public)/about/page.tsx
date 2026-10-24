'use client';

import { useState, useEffect } from 'react';
import { Users, Target, Zap, ShieldCheck, TrendingUp, Award, Rocket, Code2, HeartHandshake } from 'lucide-react';
import Image from 'next/image';
import { systemService } from '@/features/system/system.service';

import PublicHeader from '@/components/layout/PublicHeader';
import Counter from '@/components/ui/Counter';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/store/useLanguageStore';

const getCoreValues = (t: (path: string, params?: any, fallback?: string) => string) => [
    {
        icon: Zap,
        title: t('public_pages.about.values.speed_title', undefined, 'Tốc độ & Thực tiễn'),
        description: t('public_pages.about.values.speed_desc', undefined, 'Tự động hóa bóc tách và sơ loại hồ sơ bằng thuật toán NLP, giúp nhà tuyển dụng tiết kiệm hàng chục giờ sàng lọc thủ công mỗi đợt tuyển.')
    },
    {
        icon: ShieldCheck,
        title: t('public_pages.about.values.transparent_title', undefined, 'Minh bạch & Có cơ sở'),
        description: t('public_pages.about.values.transparent_desc', undefined, 'Mọi điểm số tương đồng đều được phân tích dựa trên sự đối soát trực tiếp giữa từ vựng kỹ năng, kinh nghiệm trong CV và mô tả yêu cầu trong JD.')
    },
    {
        icon: Code2,
        title: t('public_pages.about.values.technical_title', undefined, 'Kỹ thuật Chính xác'),
        description: t('public_pages.about.values.technical_desc', undefined, 'Không thổi phồng công nghệ viễn vông. Chúng tôi tập trung tối ưu thuật toán Vector Cosine Similarity và bộ từ điển kỹ năng chuẩn mực cho từng ngành.')
    },
    {
        icon: Users,
        title: t('public_pages.about.values.user_first_title', undefined, 'Hỗ trợ Người dùng Thực'),
        description: t('public_pages.about.values.user_first_desc', undefined, 'Công nghệ đóng vai trò trợ lý đắc lực giúp ứng viên tự nhận diện lỗ hổng kỹ năng và giúp nhà tuyển dụng tìm thấy ứng viên tiềm năng một cách khách quan.')
    }
];

export default function AboutPage() {
    const { isAuthenticated, user } = useAuthStore();
    const { t } = useTranslation();
    const coreValues = getCoreValues(t);
    const [isScrolled, setIsScrolled] = useState(false);
    const [sysStats, setSysStats] = useState({ candidates: 0, companies: 0, success_rate: 0 });

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        systemService.getStatistics().then(data => {
            setSysStats({
                candidates: data.total_candidates || 0,
                companies: data.total_companies || 0,
                success_rate: data.success_rate || 0
            });
        }).catch(console.error);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner Tích hợp Background Image & Glows */}
            <div className="relative pt-32 pb-24 md:pt-40 md:pb-32 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
                {/* Background image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/about-bg.jpg"
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
                        <Rocket className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        {t('public_pages.about.hero.title_prefix', undefined, 'Giới thiệu về')}{' '}<span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">{t('public_pages.about.hero.title_brand', undefined, 'Verisem')}</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('public_pages.about.hero.desc', undefined, 'Ứng dụng xử lý ngôn ngữ tự nhiên (NLP) và toán học vector vào tuyển dụng thực tế, kết nối ứng viên và doanh nghiệp một cách minh bạch, hiệu quả.')}
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 -mt-12 sm:-mt-14 relative z-10 space-y-20">

                {/* Section: Câu chuyện phát triển */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-bold">
                            <HeartHandshake className="w-3.5 h-3.5" />
                            <span>{t('public_pages.about.story.badge', undefined, 'Khởi nguồn dự án')}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {t('public_pages.about.story.title', undefined, 'Xây dựng từ bài toán thực tế của tuyển dụng')}
                        </h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm sm:text-base">
                            <p>{t('public_pages.about.story.p1', undefined, 'Trong thực tế tuyển dụng, các nhà tuyển dụng thường phải đối mặt với hàng trăm tệp CV ở đủ định dạng khác nhau. Việc lọc thủ công vừa tốn thời gian, vừa dễ bỏ sót các ứng viên tiềm năng chỉ vì từ ngữ mô tả không hoàn toàn khớp từng chữ với mô tả công việc (JD).')}</p>
                            <p>{t('public_pages.about.story.p2', undefined, 'Về phía người tìm việc, việc nộp hồ sơ mà không biết mức độ tương thích kỹ năng của bản thân với yêu cầu doanh nghiệp thường dẫn đến cảm giác mơ hồ và tỷ lệ phản hồi thấp.')}</p>
                            <p><strong className="text-slate-900 dark:text-white font-bold">Verisem</strong> {t('public_pages.about.story.p3', undefined, 'được xây dựng nhằm giải quyết bài toán này bằng công nghệ thực tế: trích xuất nội dung văn bản chính xác, chuẩn hóa thuật ngữ kỹ năng theo ngành nghề và tính toán độ tương đồng ngữ nghĩa bằng giải thuật toán học Cosine Similarity.')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 font-sans">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
                            <h3 className="text-3xl sm:text-4xl font-black text-primary-600 dark:text-primary-400 mb-2 flex items-center justify-center">
                                <Counter value={sysStats.success_rate || 92} suffix="%" />
                            </h3>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('public_pages.about.stats.match_rate', undefined, 'Tỷ lệ tương thích chuẩn')}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
                            <h3 className="text-3xl sm:text-4xl font-black text-primary-600 dark:text-primary-400 mb-2 flex items-center justify-center">
                                <Counter value={sysStats.candidates} suffix={sysStats.candidates > 10 ? '+' : ''} />
                            </h3>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('public_pages.about.stats.candidates', undefined, 'Hồ sơ ứng viên')}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
                            <h3 className="text-3xl sm:text-4xl font-black text-primary-600 dark:text-primary-400 mb-2 flex items-center justify-center">
                                <Counter value={sysStats.companies} suffix={sysStats.companies > 10 ? '+' : ''} />
                            </h3>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('public_pages.about.stats.companies', undefined, 'Doanh nghiệp tham gia')}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
                            <h3 className="text-3xl sm:text-4xl font-black text-primary-600 dark:text-primary-400 mb-2 flex items-center justify-center">
                                24/7
                            </h3>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('public_pages.about.stats.uptime', undefined, 'Hệ thống sẵn sàng')}</p>
                        </div>
                    </div>
                </div>

                {/* Section: Sứ mệnh & Mục tiêu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                    <div className="bg-blue-50/70 dark:bg-blue-950/30 p-8 md:p-10 rounded-3xl border border-blue-100 dark:border-blue-900/50">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm shadow-blue-500/20">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{t('public_pages.about.mission.title', undefined, 'Sứ mệnh')}</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm sm:text-base">
                            {t('public_pages.about.mission.desc', undefined, 'Cung cấp công cụ đánh giá hồ sơ khách quan, minh bạch và có cơ sở khoa học cho thị trường lao động. Giúp ứng viên tự tin cải thiện kỹ năng và giúp nhà tuyển dụng tối ưu chi phí, thời gian tuyển chọn.')}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="w-12 h-12 bg-slate-800 dark:bg-slate-800 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{t('public_pages.about.vision.title', undefined, 'Mục tiêu phát triển')}</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm sm:text-base">
                            {t('public_pages.about.vision.desc', undefined, 'Không ngừng hoàn thiện bộ từ điển chuẩn hóa kỹ năng và mô hình embedding ngữ nghĩa, hướng tới trở thành nền tảng hỗ trợ tuyển dụng thông minh đáng tin cậy cho cộng đồng công nghệ và các doanh nghiệp tại Việt Nam.')}
                        </p>
                    </div>
                </div>

                {/* Section: Giá trị cốt lõi */}
                <div className="font-sans">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{t('public_pages.about.values.title', undefined, 'Giá trị cốt lõi')}</h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium text-base">{t('public_pages.about.values.subtitle', undefined, 'Những nguyên tắc kỹ thuật và đạo đức định hướng toàn bộ quá trình xây dựng nền tảng Verisem.')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreValues.map((val, idx) => {
                            const Icon = val.icon;
                            return (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5 border border-blue-100 dark:border-blue-900/40">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">{val.title}</h4>
                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{val.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </main>

            <PublicFooter />
        </div>
    );
}