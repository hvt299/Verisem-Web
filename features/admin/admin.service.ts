import apiClient from '@/lib/api-client';

export const adminService = {
    async getJobs(params?: any) {
        const response = await apiClient.get('/admin/jobs', { params });
        return response.data;
    },
    async deleteJob(jobId: string) {
        const response = await apiClient.delete(`/admin/jobs/${jobId}`);
        return response.data;
    },
    async suspendJob(jobId: string, reason: string) {
        const response = await apiClient.patch(`/admin/moderation/jobs/${jobId}/suspend`, { reason });
        return response.data;
    },
    async unlockJob(jobId: string) {
        const response = await apiClient.patch(`/admin/moderation/jobs/${jobId}/unlock`);
        return response.data;
    },
    async getCVs(params?: any) {
        const response = await apiClient.get('/admin/cvs', { params });
        return response.data;
    },
    async deleteCV(cvId: string) {
        const response = await apiClient.delete(`/admin/cvs/${cvId}`);
        return response.data;
    },
    async getSkills(params?: any) {
        const response = await apiClient.get('/system/skills', { params });
        return response.data;
    },
    async createSkill(data: any) {
        const response = await apiClient.post('/admin/system/skills', data);
        return response.data;
    },
    async updateSkill(skillId: string, data: any) {
        const response = await apiClient.patch(`/admin/system/skills/${skillId}`, data);
        return response.data;
    },
    async deleteSkill(skillId: string) {
        const response = await apiClient.delete(`/admin/system/skills/${skillId}`);
        return response.data;
    },
    async getUnits(params?: any) {
        const response = await apiClient.get('/admin/system/locations', { params });
        return response.data;
    },
    async createUnit(data: any) {
        const response = await apiClient.post('/admin/system/locations', data);
        return response.data;
    },
    async updateUnit(unitId: string, data: any) {
        const response = await apiClient.patch(`/admin/system/locations/${unitId}`, data);
        return response.data;
    },
    async deleteUnit(unitId: string) {
        const response = await apiClient.delete(`/admin/system/locations/${unitId}`);
        return response.data;
    },
    async getSystemSettings() {
        const response = await apiClient.get('/admin/system/settings');
        return response.data;
    },
    async updateSystemSettings(data: any) {
        const response = await apiClient.patch('/admin/system-settings', data);
        return response.data;
    },
    async getAdminDashboardMetrics(days?: number) {
        const response = await apiClient.get('/admin/dashboard/metrics', { params: { days } });
        return response.data.data;
    },
    async getAdminAnalytics(days: number = 14) {
        const response = await apiClient.get('/admin/analytics', { params: { days } });
        return response.data.data;
    },
    async getSubscriptions(params?: any) {
        const response = await apiClient.get('/admin/subscriptions/plans', { params });
        return response.data;
    },
    async createSubscription(data: any) {
        const response = await apiClient.post('/admin/subscriptions/plans', data);
        return response.data;
    },
    async updateSubscription(planId: string, data: any) {
        const response = await apiClient.patch(`/admin/subscriptions/plans/${planId}`, data);
        return response.data;
    },
    async toggleSubscriptionStatus(planId: string, isActive: boolean) {
        const response = await apiClient.patch(`/admin/subscriptions/plans/${planId}/status`, { is_active: isActive });
        return response.data;
    },
    async deleteSubscription(planId: string) {
        const response = await apiClient.delete(`/admin/subscriptions/plans/${planId}`);
        return response.data;
    },
    async grantSubscription(data: { email: string; plan_code: string; days?: number | null; note?: string }) {
        const response = await apiClient.post('/admin/subscriptions/grant', data);
        return response.data;
    },
    async getBlogs() {
        const response = await apiClient.get('/admin/blogs');
        return response.data.data || [];
    },
    async getBlog(blogId: string) {
        const response = await apiClient.get(`/admin/blogs/${blogId}`);
        return response.data.data;
    },
    async createBlog(data: any) {
        const response = await apiClient.post('/admin/blogs', data);
        return response.data;
    },
    async updateBlog(blogId: string, data: any) {
        const response = await apiClient.patch(`/admin/blogs/${blogId}`, data);
        return response.data;
    },
    async deleteBlog(blogId: string) {
        const response = await apiClient.delete(`/admin/blogs/${blogId}`);
        return response.data;
    },
    async uploadBlogImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/admin/blogs/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.url;
    },
    async getCoverLetters(params?: any) {
        const response = await apiClient.get('/admin/cover-letters', { params });
        return response.data.data || response.data;
    },
    async deleteCoverLetter(id: string) {
        const response = await apiClient.delete(`/admin/cover-letters/${id}`);
        return response.data;
    },
};
