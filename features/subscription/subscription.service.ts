import apiClient from '@/lib/api-client';

export const subscriptionService = {
    getMyPlan: async () => {
        const response = await apiClient.get('/subscriptions/my-plan');
        return response.data;
    },

    getPlans: async (target: 'hr' | 'applicant') => {
        const response = await apiClient.get(`/subscriptions/plans?target=${target}`);
        return response.data;
    },

    getTransactions: async () => {
        const response = await apiClient.get('/subscriptions/transactions');
        return response.data;
    },

    createCheckoutSession: async (planCode: string) => {
        const response = await apiClient.post(`/subscriptions/checkout/${planCode}`);
        return response.data;
    },

    getOrder: async (orderCode: string) => {
        const response = await apiClient.get(`/subscriptions/orders/${orderCode}`);
        return response.data;
    },

    getOrders: async () => {
        const response = await apiClient.get('/subscriptions/orders');
        return response.data;
    },

    // Chỉ hoạt động khi Backend bật ENABLE_PAYMENT_SIMULATION=true
    simulatePayment: async (orderCode: string) => {
        const response = await apiClient.post(`/subscriptions/dev/simulate-payment/${orderCode}`);
        return response.data;
    }
};