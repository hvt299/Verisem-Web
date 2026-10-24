'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Database, Cpu, Share2, Server, UserCog, ChevronRight } from 'lucide-react';
import Image from 'next/image';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/store/useLanguageStore';

const getSections = (t: (path: string, params?: any, fallback?: string) => string) => [
    { id: 'collection', title: t('public_pages.privacy.s1.title', undefined, '1. Thu thập Dữ liệu'), icon: Database },
    { id: 'usage', title: t('public_pages.privacy.s2.title', undefined, '2. Xử lý Dữ liệu & Thuật toán NLP'), icon: Cpu },
    { id: 'sharing', title: t('public_pages.privacy.s3.title', undefined, '3. Cơ chế Chia sẻ Thông tin'), icon: Share2 },
    { id: 'storage', title: t('public_pages.privacy.s4.title', undefined, '4. Lưu trữ & Bảo vệ Dữ liệu'), icon: Server },
    { id: 'rights', title: t('public_pages.privacy.s5.title', undefined, '5. Quyền Kiểm soát của Người dùng'), icon: UserCog },
];

export default function PrivacyPolicyPage() {
    const { isAuthenticated, user } = useAuthStore();
    const { t } = useTranslation();
    const SECTIONS = getSections(t);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cập nhật mục lục khi cuộn trang
    useEffect(() => {
        const handleSpy = () => {
            const sections = SECTIONS.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 200;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(SECTIONS[i].id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleSpy);
        return () => window.removeEventListener('scroll', handleSpy);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 120,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner Tích hợp Background Image & Glows */}
            <div className="relative pt-32 pb-24 md:pt-40 md:pb-32 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
                {/* Background image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/job-bg.jpg"
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
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        {t('public_pages.privacy.hero.title_prefix', undefined, 'Chính sách')}{' '}<span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">{t('public_pages.privacy.hero.title_highlight', undefined, 'Bảo mật')}</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('public_pages.privacy.hero.desc', undefined, 'Cam kết minh bạch và bảo vệ tối đa dữ liệu hồ sơ cá nhân của người dùng trên nền tảng Verisem.')}
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 -mt-12 sm:-mt-14 relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
                {/* Mục lục bám dính */}
                <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-28">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
                        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{t('public_pages.privacy.toc_title', undefined, 'Mục lục tài liệu')}</h3>
                        <nav className="space-y-1">
                            {SECTIONS.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${isActive
                                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 shadow-2xs'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white border border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                                            <span>{section.title}</span>
                                        </div>
                                        {isActive && <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Nội dung chi tiết */}
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xs space-y-16 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">

                    <section id="collection" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50"><Database className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.privacy.s1.title', undefined, '1. Thu thập Dữ liệu')}</h2>
                        </div>
                        <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            <p>{t('public_pages.privacy.s1.intro', undefined, 'Chúng tôi chỉ thu thập các thông tin thực sự cần thiết nhằm phục vụ hoạt động cốt lõi của nền tảng:')}</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>{t('public_pages.privacy.s1.item1_label', undefined, 'Tài khoản cá nhân:')}</strong> {t('public_pages.privacy.s1.item1_desc', undefined, 'Họ tên, Địa chỉ Email đăng nhập, Mật khẩu được mã hóa an toàn.')}</li>
                                <li><strong>{t('public_pages.privacy.s1.item2_label', undefined, 'Hồ sơ Ứng viên:')}</strong> {t('public_pages.privacy.s1.item2_desc', undefined, 'Tệp tài liệu CV định dạng PDF hoặc DOCX do chính ứng viên tải lên thư viện cá nhân.')}</li>
                                <li><strong>{t('public_pages.privacy.s1.item3_label', undefined, 'Tài khoản Doanh nghiệp:')}</strong> {t('public_pages.privacy.s1.item3_desc', undefined, 'Tên công ty, Mã số thuế, Website, Logo và Nội dung tin tuyển dụng (JD).')}</li>
                                <li><strong>{t('public_pages.privacy.s1.item4_label', undefined, 'Dữ liệu giao dịch:')}</strong> {t('public_pages.privacy.s1.item4_desc', undefined, 'Mã đơn hàng và lịch sử giao dịch chuyển khoản VietQR hỗ trợ đối soát thanh toán.')}</li>
                            </ul>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="usage" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50"><Cpu className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.privacy.s2.title', undefined, '2. Xử lý Dữ liệu & Thuật toán NLP')}</h2>
                        </div>
                        <div className="space-y-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            <p>{t('public_pages.privacy.s2.p1', undefined, 'Tệp CV của người dùng được xử lý bởi thuật toán trích xuất văn bản (Text Extraction) nhằm xác định các phần học vấn, kinh nghiệm và kỹ năng.')}</p>
                            <p>{t('public_pages.privacy.s2.p2', undefined, 'Nội dung sau đó được chuyển đổi thành các Vector đặc trưng để tính khoảng cách Cosine Similarity với Vector của mô tả công việc (JD). Quá trình này được thực hiện bảo mật trên máy chủ nội bộ của Verisem và tuyệt đối không chia sẻ hoặc bán dữ liệu hồ sơ cho bên thứ ba.')}</p>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="sharing" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50"><Share2 className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.privacy.s3.title', undefined, '3. Cơ chế Chia sẻ Thông tin Minh bạch')}</h2>
                        </div>
                        <div className="space-y-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            <div className="p-5 border-l-4 border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 text-slate-700 dark:text-slate-300 rounded-r-2xl text-sm leading-relaxed">
                                <strong className="text-blue-600 dark:text-blue-400 font-bold block mb-1">{t('public_pages.privacy.s3.note_title', undefined, 'Nguyên tắc chủ động ứng tuyển:')}</strong>
                                {t('public_pages.privacy.s3.note_desc', undefined, 'Tệp CV và thông tin liên hệ của Ứng viên chỉ được chuyển giao tới Nhà tuyển dụng khi Ứng viên chủ động bấm nút "Ứng tuyển" vào vị trí cụ thể của doanh nghiệp đó. Khi chưa ứng tuyển, không doanh nghiệp nào có thể tự ý tra cứu hoặc tải tệp CV riêng tư của bạn từ thư viện.')}
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="storage" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50"><Server className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.privacy.s4.title', undefined, '4. Lưu trữ & Bảo vệ Dữ liệu')}</h2>
                        </div>
                        <div className="space-y-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            <p>{t('public_pages.privacy.s4.p1', undefined, 'Mật khẩu người dùng được băm mã hóa một chiều qua thuật toán bcrypt trước khi lưu trữ. Toàn bộ kết nối giữa trình duyệt và máy chủ được mã hóa qua giao thức HTTPS an toàn.')}</p>
                            <p>{t('public_pages.privacy.s4.p2', undefined, 'Hệ thống phân quyền truy cập nghiêm ngặt theo vai trò (Role-Based Access Control) đảm bảo người dùng chỉ truy cập được dữ liệu thuộc thẩm quyền của mình.')}</p>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="rights" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50"><UserCog className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.privacy.s5.title', undefined, '5. Quyền Kiểm soát của Người dùng')}</h2>
                        </div>
                        <div className="space-y-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            <p>{t('public_pages.privacy.s5.intro', undefined, 'Bạn có toàn quyền quản lý dữ liệu của mình trên Verisem:')}</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>{t('public_pages.privacy.s5.item1', undefined, 'Chỉnh sửa hoặc xóa các phiên bản CV trong Thư viện hồ sơ cá nhân bất cứ lúc nào.')}</li>
                                <li>{t('public_pages.privacy.s5.item2', undefined, 'Yêu cầu cập nhật hoặc đính chính thông tin tài khoản qua trang Cài đặt hoặc kênh Hỗ trợ trực tuyến.')}</li>
                                <li>{t('public_pages.privacy.s5.item3', undefined, 'Rút lại đơn ứng tuyển hoặc yêu cầu hỗ trợ kỹ thuật trực tiếp thông qua trang Trung tâm Hỗ trợ.')}</li>
                            </ul>
                        </div>
                    </section>

                </div>
            </main>

            <PublicFooter />
        </div>
    );
}