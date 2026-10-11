'use client';

import { useState, useEffect } from 'react';
import { Headset, Mail, Phone, MapPin, Send, ChevronDown, MessageSquare, CheckCircle2 } from 'lucide-react';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';

const FAQS = [
    {
        question: 'ATS System chấm điểm CV như thế nào?',
        answer: 'Hệ thống sử dụng NLP (Xử lý ngôn ngữ tự nhiên) để đọc hiểu CV của bạn, sau đó chuyển đổi thành Vector. Thuật toán AI sẽ tính toán độ tương đồng (Cosine Similarity) giữa Vector của CV và Vector của mô tả công việc (JD) để đưa ra thang điểm chính xác nhất, không dựa trên việc đếm từ khóa cứng nhắc.'
    },
    {
        question: 'Thông tin cá nhân của tôi có được bảo mật không?',
        answer: 'Hoàn toàn bảo mật. Dữ liệu của bạn được mã hóa và lưu trữ an toàn. Tệp CV chỉ được gửi đến Nhà tuyển dụng khi và chỉ khi bạn chủ động bấm nút "Ứng tuyển". Chúng tôi tuân thủ nghiêm ngặt Chính sách bảo mật đã công bố.'
    },
    {
        question: 'Làm thế nào để tài khoản công ty được xác thực (KYC)?',
        answer: 'Doanh nghiệp cần cung cấp Mã số thuế hợp lệ và hình ảnh Giấy phép đăng ký kinh doanh trong phần Cài đặt Tài khoản. Đội ngũ kiểm duyệt của ATS System sẽ tiến hành đối chiếu với cổng thông tin quốc gia và xác duyệt trong vòng 2-4 giờ làm việc.'
    },
    {
        question: 'Tôi có thể tải lên bao nhiêu CV trong thư viện?',
        answer: 'Đối với tài khoản ứng viên (Miễn phí), bạn có thể tải lên và lưu trữ tối đa 5 phiên bản CV khác nhau để linh hoạt ứng tuyển cho nhiều vị trí chuyên môn biệt lập.'
    }
];

export default function SupportPage() {
    const { isAuthenticated, user } = useAuthStore();
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
            toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
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
                toast.success('Gửi yêu cầu hỗ trợ thành công!');
                setFormData({
                    full_name: user?.full_name || '',
                    email: user?.email || '',
                    category: '',
                    subject: '',
                    description: ''
                });
            } else {
                toast.error('Gửi yêu cầu hỗ trợ thành công, nhưng không nhận được mã Ticket từ hệ thống.');
            }
        } catch (error: any) {
            // Note: apiClient already handles generic error toasts, 
            // but we can add specific handling here if needed.
            if (error.response?.status === 422) {
                toast.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại Email và các trường khác.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner */}
            <div className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <Headset className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Trung tâm <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">Hỗ trợ</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        Tìm câu trả lời nhanh hoặc gửi yêu cầu đến đội ngũ hỗ trợ của chúng tôi.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 md:py-24 space-y-20 font-sans">
                {/* Khu vực FAQ và Contact Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* FAQ Accordion */}
                    <div className="order-2 lg:order-1">
                        <div className="flex items-center gap-3 mb-8">
                            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Câu hỏi thường gặp</h2>
                        </div>
                        <div className="space-y-4">
                            {FAQS.map((faq, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div
                                        key={index}
                                        className={`rounded-2xl border transition-all duration-300 ${isOpen
                                            ? 'bg-white dark:bg-slate-900/60 border-blue-200 dark:border-blue-500/30 shadow-md shadow-blue-500/5'
                                            : 'bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                            }`}
                                    >
                                        <button
                                            id={`faq-question-${index}`}
                                            onClick={() => setOpenFaq(isOpen ? null : index)}
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-answer-${index}`}
                                            className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                        >
                                            <span className={`font-bold transition-colors ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {faq.question}
                                            </span>
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
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
                                                <p className="mx-6 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm leading-7 font-medium">
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
                    <div className="order-1 lg:order-2 bg-white dark:bg-slate-900/50 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

                        {!successData ? (
                            <>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Gửi yêu cầu hỗ trợ</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8">Điền thông tin vào mẫu bên dưới, chuyên viên hỗ trợ sẽ liên hệ lại với bạn.</p>

                                <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="full_name">Họ và tên <span className="text-red-500">*</span></label>
                                            <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required readOnly={isAuthenticated && !!user?.full_name} className={`w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 ${isAuthenticated && !!user?.full_name ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-white'}`} placeholder="Nguyễn Văn A" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">Email <span className="text-red-500">*</span></label>
                                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required readOnly={isAuthenticated && !!user?.email} className={`w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 ${isAuthenticated && !!user?.email ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-white'}`} placeholder="name@email.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="category">Chủ đề <span className="text-red-500">*</span></label>
                                        <select id="category" name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors">
                                            <option value="">-- Chọn chủ đề hỗ trợ --</option>
                                            <option value="tech_bug">Hỗ trợ kỹ thuật / Báo lỗi</option>
                                            <option value="billing">Thanh toán & Gói cước</option>
                                            <option value="kyc">Xác thực doanh nghiệp (KYC)</option>
                                            <option value="other">Vấn đề khác</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="subject">Tiêu đề <span className="text-red-500">*</span></label>
                                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors placeholder:text-slate-400" placeholder="Tóm tắt vấn đề..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="description">Nội dung chi tiết <span className="text-red-500">*</span></label>
                                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors resize-none placeholder:text-slate-400" placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."></textarea>
                                    </div>
                                    <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-500/20 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
                                        {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'} {!isLoading && <Send className="w-4 h-4" />}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Gửi yêu cầu thành công</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
                                    Mã yêu cầu: <span className="font-bold text-blue-600 dark:text-blue-400 block mt-1 text-lg">#{successData.ticket_number}</span>
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 px-4">
                                    Đội ngũ hỗ trợ sẽ kiểm tra và phản hồi qua email <br className="hidden sm:block" /> 
                                    <strong className="text-slate-700 dark:text-slate-300">{formData.email}</strong>.
                                </p>
                                <button 
                                    onClick={() => setSuccessData(null)}
                                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                                >
                                    Gửi yêu cầu mới
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Thông tin liên hệ nhanh (3 Cards) - Đưa xuống dưới */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Gọi cho chúng tôi</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">Hỗ trợ nhanh trong giờ hành chính</p>
                        <a href="tel:1900000000" className="text-blue-600 dark:text-blue-400 font-black text-xl hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">1900 000 000</a>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Gửi Email</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">Phản hồi trong vòng 24 giờ</p>
                        <a href="mailto:support@atssystem.vn" className="text-blue-600 dark:text-blue-400 font-black text-lg hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">support@atssystem.vn</a>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Trụ sở chính</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">Tầng 7, Tòa nhà ATSSYSTEM Tower</p>
                        <p className="text-slate-800 dark:text-slate-200 font-bold text-sm">Đà Nẵng, Việt Nam</p>
                    </div>
                </div>

            </main>

            <PublicFooter />
        </div>
    );
}