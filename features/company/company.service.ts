import apiClient from '@/lib/api-client';

export const companyService = {
    lookupTax: async (taxCode: string) => {
        const response = await apiClient.get(`/companies/lookup-tax/${taxCode}`);
        return response.data;
    },

    getSettings: async () => {
        const response = await apiClient.get('/companies/settings');
        return response.data;
    },

    updateSettings: async (payload: any) => {
        const response = await apiClient.patch('/companies/settings', payload);
        return response.data;
    },

    getMembers: async () => {
        const response = await apiClient.get('/companies/members');
        return response.data;
    },

    getPublicCompanies: async (params?: { page?: number; page_size?: number; q?: string }) => {
        const response = await apiClient.get('/companies/public/list', { params });
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return response.data?.items || [];
    },

    inviteMember: async (email: string) => {
        const response = await apiClient.post('/companies/invite', { email });
        return response.data;
    },

    updateMemberRole: async (userId: string, role: string) => {
        const response = await apiClient.patch(`/companies/members/${userId}/role`, { role });
        return response.data;
    },

    removeMember: async (userId: string) => {
        const response = await apiClient.delete(`/companies/members/${userId}`);
        return response.data;
    },

    getAdminDashboard: async () => {
        const response = await apiClient.get('/admin/dashboard/metrics');
        return response.data.data;
    },

    getAdminAnalytics: async (days: number = 14) => {
        const response = await apiClient.get('/admin/analytics', { params: { days } });
        return response.data.data;
    },

    getAdminCompanies: async () => {
        const response = await apiClient.get('/admin/companies');
        return response.data;
    },

    verifyCompany: async (
        companyId: string,
        payload: {
            approve: boolean;
            rejection_reason: string | null;
        }
    ) => {
        const response = await apiClient.patch(
            `/admin/companies/${companyId}/verify`,
            payload
        );
        return response.data;
    },

    updateCompanyByAdmin: async (companyId: string, payload: any) => {
        const response = await apiClient.patch(
            `/admin/companies/${companyId}`,
            payload
        );
        return response.data;
    },

    getAdminUsers: async (params?: { role?: string; search?: string }) => {
        const response = await apiClient.get('/admin/users', { params });
        return response.data;
    },

    updateUserRole: async (userId: string, newRole: string) => {
        const response = await apiClient.patch(
            `/admin/users/${userId}/role`,
            { role: newRole }
        );
        return response.data;
    },

    updateUserStatus: async (userId: string, isActive: boolean) => {
        const response = await apiClient.patch(
            `/admin/users/${userId}/status`,
            { is_active: isActive }
        );
        return response.data;
    },

    getAuditLogs: async (params?: any) => {
        const response = await apiClient.get('/admin/audit-logs', { params });
        return response.data.data;
    },

    uploadFile: async (formData: FormData) => {
        const response = await apiClient.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};