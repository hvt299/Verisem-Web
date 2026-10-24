import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { clearAllAuthData } from './auth-utils';
import { ROUTES } from '../constants/routes';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Tự động đính kèm token
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi toàn cục (Global Error Handling)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Bỏ qua nếu là request từ Server Side (Next.js)
        if (typeof window === 'undefined') return Promise.reject(error);

        const status = error.response?.status;
        const errorDetail = error.response?.data?.detail;

        // Trích xuất message an toàn từ FastAPI
        const errorMessage = typeof errorDetail === 'string'
            ? errorDetail
            : (Array.isArray(errorDetail) ? errorDetail[0]?.msg : null);

        if (status === 401) {
            clearAllAuthData();
            // Bỏ qua chuyển hướng nếu đang kiểm tra phiên (/auth/me) hoặc người dùng đang ở các trang công khai (public)
            const isAuthCheck = error.config?.url?.includes('/auth/me');
            const pathname = window.location.pathname;
            const isProtectedPage = pathname.startsWith('/admin') || pathname.startsWith('/hr') || pathname.startsWith('/applicant');

            if (!isAuthCheck && isProtectedPage && !pathname.includes(ROUTES.LOGIN)) {
                toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                window.location.href = ROUTES.LOGIN;
            }
        }
        else if (status === 403) {
            toast.error(errorMessage || 'Từ chối truy cập: Bạn không có quyền thực hiện thao tác này.');
        }
        else if (status === 402) {
            toast.error(errorMessage || 'Tài khoản không đủ Credit hoặc yêu cầu nâng cấp gói cước.');
        }
        else if (status === 429) {
            toast.error('Bạn thao tác quá nhanh. Vui lòng đợi một lát.');
        }
        else if (status >= 500) {
            toast.error('Lỗi máy chủ nội bộ. Vui lòng thử lại sau.');
        }
        else if (!error.response) {
            toast.error('Không thể kết nối đến máy chủ. Kiểm tra đường truyền mạng.');
        }

        return Promise.reject(error);
    }
);

export default apiClient;