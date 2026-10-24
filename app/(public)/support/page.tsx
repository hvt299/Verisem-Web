'use client';

import { useState, useEffect } from 'react';
import { Headset, Mail, Phone, MapPin, Send, ChevronDown, MessageSquare, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/store/useLanguageStore';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';

const getFaqs = (t: (path: string, params?: any, fallback?: string) => string) => [
    {
        question: t('public_pages.support.faqs.0.q', undefined, 'Verisem chấm điểm CV như thế nào?'),
        answer: t('public_pages.support.faqs.0.a', undefined, 'Hệ thống sử dụng NLP (Xử lý ngôn ngữ tự nhiên) để đọc hiểu CV của bạn, sau đó chuyển đổi thành Vector. Thuật toán AI sẽ tính toán độ tương đồng (Cosine Similarity) giữa Vector của CV và Vector của mô tả công việc (JD) để đưa ra thang điểm chính xác nhất, không dựa trên việc đếm từ khóa cứng nhắc.')
    },
    {
        question: t('public_pages.support.faqs.1.q', undefined, 'Thông tin cá nhân của tôi có được bảo mật không?'),
        answer: t('public_pages.support.faqs.1.a', undefined, 'Hoàn toàn bảo mật. Dữ liệu của bạn được mã hóa và lưu trữ an toàn. Tệp CV chỉ được gửi đến Nhà tuyển dụng khi và chỉ khi bạn chủ động bấm nút "Ứng tuyển". Chúng tôi tuân thủ nghiêm ngặt Chính sách bảo mật đã công bố.')
    },
    {
        question: t('public_pages.support.faqs.2.q', undefined, 'Làm thế nào để tài khoản công ty được xác thực (KYC)?'),
        answer: t('public_pages.support.faqs.2.a', undefined, 'Doanh nghiệp cần cung cấp Mã số thuế hợp lệ và hình ảnh Giấy phép đăng ký kinh doanh trong phần Cài đặt Tài khoản. Đội ngũ kiểm duyệt của Verisem sẽ tiến hành đối chiếu với cổng thông tin quốc gia và xác duyệt trong vòng 2-4 giờ làm việc.')
    },
    {
        question: t('public_pages.support.faqs.3.q', undefined, 'Tôi có thể tải lên bao nhiêu CV trong thư viện?'),
        answer: t('public_pages.support.faqs.3.a', undefined, 'Đối với tài khoản ứng viên (Miễn phí), bạn có thể tải lên và lưu trữ tối đa 5 phiên bản CV khác nhau để linh hoạt ứng tuyển cho nhiều vị trí chuyên môn biệt lập.')
    }
];

export default function SupportPage() {
    const { isAuthenticated, user } = useAuthStore();
    const { t } = useTranslation();
    const FAQS = getFaqs(t);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const [isLoading, setIsLoading] = useState(false);
    const [successData, setSuccessData] = useState<{ ticket_number: string } | null>(null);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        category: '',
        subject: '',
        description: ''
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                full_name: user.full_name || (user as any).name || '',
                email: user.email || ''
            }));
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.full_name || !formData.email || !formData.category || !formData.subject || !formData.description) {
            toast.error(t('public_pages.support.form.error_required', undefined, 'Vui lòng điền đầy đủ các trường bắt buộc.'));
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                user_id: user?.id || null
            };
            const response = await apiClient.post('/system/support-tickets', payload);
            
            if (response.data?.status === 'success' && response.data?.data?.ticket_number) {
                setSuccessData({ ticket_number: response.data.data.ticket_number });
                toast.success(t('public_pages.support.form.success_toast', undefined, 'Gửi yêu cầu hỗ trợ thành công!'));
                setFormData({
                    full_name: user?.full_name || '',
                    email: user?.email || '',
                    category: '',
                    subject: '',
                    description: ''
                });
            } else {
                toast.error(t('public_pages.support.ticket_no_id_error', undefined, 'Gửi yêu cầu hỗ trợ thành công, nhưng không nhận được mã Ticket từ hệ thống.'));
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                toast.error(t('public_pages.support.form.error_invalid', undefined, 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại Email và các trường khác.'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner Tích hợp Background Image & Glows */}
            <div className="relative pt-32 pb-24 md:pt-40 md:pb-32 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
                {/* Background image - đồng bộ với HeroSection, jobs public, companies public */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/support-bg.jpg"
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xs border border-blue-100 dark:border-blue-900/50">
                        <Headset className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        {t('public_pages.support.hero.title_prefix', undefined, 'Trung tâm')}{' '}<span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">{t('public_pages.support.hero.title_highlight', undefined, 'Hỗ trợ')}</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg max-w-2xl mx-auto">
                        {t('public_pages.support.hero.desc', undefined, 'Tìm câu trả lời nhanh chóng hoặc gửi yêu cầu trực tiếp đến đội ngũ kỹ thuật của Verisem.')}
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 md:py-20 -mt-12 sm:-mt-14 relative z-10 space-y-16 font-sans">
                {/* Khu vực FAQ và Contact Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

                    {/* FAQ Accordion */}
                    <div className="order-2 lg:order-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('public_pages.support.faq_title', undefined, 'Câu hỏi thường gặp')}</h2>
                        </div>
                        <div className="space-y-4">
                            {FAQS.map((faq, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div
                                        key={index}
                                        className={`rounded-2xl border transition-all duration-300 ${isOpen
                                            ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-500/40 shadow-sm shadow-blue-500/5'
                                            : 'bg-white dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                            }`}
                                    >
                                        <button
                                            id={`faq-question-${index}`}
                                            onClick={() => setOpenFaq(isOpen ? null : index)}
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-answer-${index}`}
                                            className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                                        >
                                            <span className={`font-bold text-sm sm:text-base transition-colors ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {faq.question}
                                            </span>
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white rotate-180 shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                                                <ChevronDown className="w-4 h-4" />
                                            </span>
                                        </button>
                                        <div
                                            id={`faq-answer-${index}`}
                                            role="region"
                                            aria-labelledby={`faq-question-${index}`}
                                            inert={!isOpen}
                                            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="mx-6 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="order-1 lg:order-2 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

                        {!successData ? (
                            <>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t('public_pages.support.form.title', undefined, 'Gửi yêu cầu hỗ trợ')}</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-7">{t('public_pages.support.form.desc', undefined, 'Điền thông tin vào mẫu bên dưới, chuyên viên hỗ trợ sẽ phản hồi sớm nhất.')}</p>

                                <form className="space-y-4.5 relative z-10" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="full_name">{t('public_pages.support.form.full_name', undefined, 'Họ và tên')} <span className="text-red-500">*</span></label>
                                            <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required readOnly={isAuthenticated && !!user?.full_name} className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 ${isAuthenticated && !!user?.full_name ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 dark:text-white'}`} placeholder={t('auth.register.fullname_placeholder', undefined, 'Nguyễn Văn A')} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">{t('public_pages.support.form.email', undefined, 'Email')} <span className="text-red-500">*</span></label>
                                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required readOnly={isAuthenticated && !!user?.email} className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 ${isAuthenticated && !!user?.email ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 dark:text-white'}`} placeholder="name@email.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="category">{t('public_pages.support.form.category', undefined, 'Chủ đề')} <span className="text-red-500">*</span></label>
                                        <select id="category" name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors">
                                            <option value="">{t('public_pages.support.form.category_placeholder', undefined, '-- Chọn chủ đề hỗ trợ --')}</option>
                                            <option value="tech_bug">{t('public_pages.support.form.category_tech', undefined, 'Hỗ trợ kỹ thuật / Báo lỗi')}</option>
                                            <option value="billing">{t('public_pages.support.form.category_billing', undefined, 'Thanh toán & Gói cước')}</option>
                                            <option value="kyc">{t('public_pages.support.form.category_kyc', undefined, 'Xác thực doanh nghiệp (KYC)')}</option>
                                            <option value="other">{t('public_pages.support.form.category_other', undefined, 'Vấn đề khác')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="subject">{t('public_pages.support.form.subject', undefined, 'Tiêu đề')} <span className="text-red-500">*</span></label>
                                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors placeholder:text-slate-400" placeholder={t('public_pages.support.form.subject_placeholder', undefined, 'Tóm tắt vấn đề...')} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="description">{t('public_pages.support.form.description', undefined, 'Nội dung chi tiết')} <span className="text-red-500">*</span></label>
                                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors resize-none placeholder:text-slate-400" placeholder={t('public_pages.support.form.description_placeholder', undefined, 'Mô tả chi tiết vấn đề bạn đang gặp phải...')}></textarea>
                                    </div>
                                    <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 mt-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        {isLoading ? t('public_pages.support.form.submitting_btn', undefined, 'Đang gửi...') : t('public_pages.support.form.submit_btn', undefined, 'Gửi yêu cầu')} {!isLoading && <Send className="w-4 h-4" />}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-200 dark:border-emerald-800/50">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t('public_pages.support.form.success_title', undefined, 'Gửi yêu cầu thành công')}</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">
                                    {t('public_pages.support.form.ticket_number_label', undefined, 'Mã yêu cầu:')} <span className="font-bold text-blue-600 dark:text-blue-400 block mt-1 text-lg">#{successData.ticket_number}</span>
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-7 px-4">
                                    {t('public_pages.support.form.response_notice', undefined, 'Đội ngũ hỗ trợ sẽ kiểm tra và phản hồi qua email')} <br className="hidden sm:block" /> 
                                    <strong className="text-slate-800 dark:text-slate-200">{formData.email}</strong>.
                                </p>
                                <button 
                                    onClick={() => setSuccessData(null)}
                                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors cursor-pointer"
                                >
                                    {t('public_pages.support.form.new_ticket_btn', undefined, 'Gửi yêu cầu mới')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Thông tin liên hệ nhanh (3 Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 text-center shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100/80 dark:border-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xs">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{t('public_pages.support.cards.phone_title', undefined, 'Gọi cho chúng tôi')}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">{t('public_pages.support.cards.phone_desc', undefined, 'Hỗ trợ nhanh trong giờ hành chính')}</p>
                        <a href="tel:1900000000" className="text-blue-600 dark:text-blue-400 font-black text-xl hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">1900 000 000</a>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 text-center shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100/80 dark:border-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xs">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{t('public_pages.support.cards.email_title', undefined, 'Gửi Email')}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">{t('public_pages.support.cards.email_desc', undefined, 'Phản hồi trong vòng 24 giờ')}</p>
                        <a href="mailto:support@verisem.vn" className="text-blue-600 dark:text-blue-400 font-black text-lg hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">support@verisem.vn</a>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 text-center shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100/80 dark:border-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xs">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{t('public_pages.support.cards.office_title', undefined, 'Trụ sở chính')}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">{t('public_pages.support.cards.office_desc', undefined, 'Tầng 7, Tòa nhà Verisem Tower')}</p>
                        <p className="text-slate-800 dark:text-slate-200 font-bold text-sm">{t('public_pages.support.cards.office_city', undefined, 'Đà Nẵng, Việt Nam')}</p>
                    </div>
                </div>

            </main>

            <PublicFooter />
        </div>
    );
}