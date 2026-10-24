'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckSquare, Layers, UserCheck, Shield, AlertTriangle, ChevronRight, CreditCard } from 'lucide-react';
import Image from 'next/image';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/store/useLanguageStore';

const getSections = (t: (path: string, params?: any, fallback?: string) => string) => [
    { id: 'acceptance', title: t('public_pages.terms.s1.title', undefined, '1. Chấp nhận Điều khoản'), icon: CheckSquare },
    { id: 'services', title: t('public_pages.terms.s2.title', undefined, '2. Mô tả Dịch vụ & Công nghệ'), icon: Layers },
    { id: 'responsibilities', title: t('public_pages.terms.s3.title', undefined, '3. Trách nhiệm Người dùng'), icon: UserCheck },
    { id: 'billing', title: t('public_pages.terms.s4.title', undefined, '4. Gói cước & Credit AI'), icon: CreditCard },
    { id: 'ip', title: t('public_pages.terms.s5.title', undefined, '5. Sở hữu Trí tuệ'), icon: Shield },
    { id: 'liability', title: t('public_pages.terms.s6.title', undefined, '6. Giới hạn Trách nhiệm'), icon: AlertTriangle },
];

export default function TermsPage() {
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
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        {t('public_pages.terms.hero.title_prefix', undefined, 'Điều khoản')}{' '}<span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">{t('public_pages.terms.hero.title_highlight', undefined, 'Dịch vụ')}</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('public_pages.terms.hero.desc', undefined, 'Các quy định và thỏa thuận khi sử dụng nền tảng hỗ trợ tuyển dụng và phân tích hồ sơ Verisem.')}
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 -mt-12 sm:-mt-14 relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
                {/* Mục lục bám dính (Sidebar) */}
                <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-28">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
                        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{t('public_pages.terms.toc_title', undefined, 'Mục lục tài liệu')}</h3>
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

                    <section id="acceptance" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50"><CheckSquare className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.terms.s1.title', undefined, '1. Chấp nhận Điều khoản')}</h2>
                        </div>
                        <div className="space-y-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            <p>{t('public_pages.terms.s1.p1', undefined, 'Bằng việc đăng ký tài khoản, truy cập và sử dụng bất kỳ tính năng nào của hệ thống Verisem, bạn xác nhận đã đọc, hiểu rõ và đồng ý chịu sự ràng buộc bởi các Điều khoản dịch vụ này.')}</p>
                            <p>{t('public_pages.terms.s1.p2', undefined, 'Nếu bạn không đồng ý với bất kỳ nội dung nào trong bản điều khoản, vui lòng ngưng sử dụng dịch vụ và liên hệ với chúng tôi nếu cần giải đáp.')}</p>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="services" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50"><Layers className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.terms.s2.title', undefined, '2. Mô tả Dịch vụ & Công nghệ')}</h2>
                        </div>
                        <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            <p>{t('public_pages.terms.s2.intro', undefined, 'Verisem cung cấp nền tảng hỗ trợ tuyển dụng ứng dụng xử lý ngôn ngữ tự nhiên (NLP) và thuật toán toán học so khớp vector (Cosine Similarity). Hệ thống phục vụ 2 nhóm người dùng chính:')}</p>
                            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                    <p><strong className="text-slate-900 dark:text-white font-bold">{t('public_pages.terms.s2.applicant_label', undefined, 'Đối với Ứng viên:')}</strong> {t('public_pages.terms.s2.applicant_desc', undefined, 'Cung cấp không gian quản lý thư viện CV cá nhân, tìm kiếm việc làm theo địa phương (tỉnh/huyện chuẩn), và tính năng tự chấm điểm thử (Self-Scoring) để nhận diện các kỹ năng đã khớp hoặc còn thiếu so với JD công việc cụ thể.')}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                    <p><strong className="text-slate-900 dark:text-white font-bold">{t('public_pages.terms.s2.employer_label', undefined, 'Đối với Doanh nghiệp:')}</strong> {t('public_pages.terms.s2.employer_desc', undefined, 'Cung cấp giao diện đăng tin tuyển dụng, tiếp nhận hồ sơ ứng tuyển, sắp xếp ứng viên theo pipeline tuyển dụng và hiển thị điểm số tương đồng ngữ nghĩa phục vụ việc sàng lọc hồ sơ ban đầu nhanh chóng.')}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="responsibilities" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50"><UserCheck className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.terms.s3.title', undefined, '3. Trách nhiệm của Người dùng')}</h2>
                        </div>
                        <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{t('public_pages.terms.s3.sub1_title', undefined, '3.1. Tính trung thực của thông tin')}</h3>
                                <p>{t('public_pages.terms.s3.sub1_desc', undefined, 'Ứng viên cam kết mọi thông tin trong CV (kinh nghiệm, kỹ năng, văn bằng) là chính xác và trung thực. Doanh nghiệp cam kết các tin đăng tuyển dụng phản ánh đúng nhu cầu tuyển dụng thực tế, không chứa nội dung lừa đảo hoặc vi phạm quy định pháp luật lao động.')}</p>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{t('public_pages.terms.s3.sub2_title', undefined, '3.2. Bảo mật thông tin đăng nhập')}</h3>
                                <p>{t('public_pages.terms.s3.sub2_desc', undefined, 'Người dùng chịu trách nhiệm bảo vệ mật khẩu và phiên đăng nhập của mình. Không chia sẻ tài khoản cho bên thứ ba trái phép.')}</p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="billing" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50"><CreditCard className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.terms.s4.title', undefined, '4. Gói cước, Hạn ngạch & Thanh toán')}</h2>
                        </div>
                        <div className="space-y-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            <p>{t('public_pages.terms.s4.p1', undefined, 'Hệ thống cung cấp các gói dịch vụ theo chu kỳ (Tháng / Năm) và các gói nạp lẻ Credit AI. Thanh toán được thực hiện qua hình thức chuyển khoản quét mã VietQR tự động qua SePay.')}</p>
                            <p>{t('public_pages.terms.s4.p2', undefined, 'Khi gói cước hiện tại của người dùng vẫn còn thời hạn sử dụng, hệ thống áp dụng cơ chế bảo vệ quyền lợi: người dùng có thể nâng cấp lên gói cao hơn hoặc nạp thêm Credit, nhưng không thể hạ cấp xuống gói có cấp bậc thấp hơn cho đến khi gói cũ hết hiệu lực.')}</p>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="ip" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50"><Shield className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.terms.s5.title', undefined, '5. Quyền Sở hữu Trí tuệ')}</h2>
                        </div>
                        <div className="space-y-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            <p>{t('public_pages.terms.s5.p1', undefined, 'Người dùng giữ toàn quyền sở hữu đối với nội dung hồ sơ và CV cá nhân tải lên hệ thống. Verisem được người dùng cấp quyền đọc và phân tích văn bản phục vụ mục đích trích xuất kỹ năng và tính toán điểm phù hợp.')}</p>
                            <p>{t('public_pages.terms.s5.p2', undefined, 'Mã nguồn, thuật toán chấm điểm, bộ từ điển chuẩn hóa ngành nghề, thiết kế giao diện và thương hiệu Verisem thuộc quyền sở hữu của đơn vị phát triển nền tảng.')}</p>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="liability" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50"><AlertTriangle className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.terms.s6.title', undefined, '6. Giới hạn Trách nhiệm')}</h2>
                        </div>
                        <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            <div className="p-5 border-l-4 border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 text-slate-700 dark:text-slate-300 rounded-r-2xl text-sm leading-relaxed">
                                <strong className="text-blue-600 dark:text-blue-400 font-bold block mb-1">{t('public_pages.terms.s6.note_title', undefined, 'Tính chất tham khảo của Điểm số AI:')}</strong>
                                {t('public_pages.terms.s6.note_desc', undefined, 'Điểm số tương thích do thuật toán Verisem đưa ra là chỉ số toán học ước lượng dựa trên dữ liệu văn bản đối soát. Chỉ số này mang tính chất hỗ trợ sàng lọc ban đầu, không mang tính khẳng định tuyệt đối về năng lực chuyên môn hay kết quả trúng tuyển thực tế. Quyết định tuyển dụng cuối cùng thuộc về các vòng phỏng vấn chuyên môn giữa Doanh nghiệp và Ứng viên.')}
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <PublicFooter />
        </div>
    );
}