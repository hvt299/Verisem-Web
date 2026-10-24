import { useQueryClient } from '@tanstack/react-query';
import { useSubscription } from '@/hooks/useSubscription';
import toast from 'react-hot-toast';

export function useCredits() {
    const queryClient = useQueryClient();

    const { data: rawData, isLoading } = useSubscription();

    // Chuẩn hóa dữ liệu: tương thích cả raw response { status, data } và payload data thuần túy
    const subscription = rawData?.data ?? rawData;

    // Trạm kiểm soát Client-side: Chặn bấm nút nếu không đủ tiền
    const checkCredits = (cost: number, actionName: string = "Tính năng này") => {
        if (!subscription) return false;

        // Bỏ qua check cho Admin
        if (subscription.entity_type === 'admin') return true;

        if ((subscription.credits_remaining ?? 0) < cost) {
            toast.error(`${actionName} yêu cầu ${cost} Credit AI. Số dư hiện tại không đủ, vui lòng nạp thêm!`, { duration: 4000 });
            return false;
        }
        return true;
    };

    // Gọi sau khi trừ tiền thành công để UI tự update Header tức thì
    const invalidateCredits = () => {
        queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
    };

    // Trích xuất thông tin gói để khóa UI (ProFeatureLock)
    const isPro = Boolean(
        subscription?.current_plan_code &&
        subscription.current_plan_code !== 'hr_free' &&
        subscription.current_plan_code !== 'app_free'
    );

    // Feature flag cụ thể cho AI Mentor
    const canUseAiCvReview = subscription?.features?.can_use_ai_cv_review === true;

    return { subscription, isLoading, checkCredits, invalidateCredits, isPro, canUseAiCvReview };
}
