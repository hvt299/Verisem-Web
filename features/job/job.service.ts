import apiClient from '@/lib/api-client';
import { Job, JobPayload } from '@/types';

export const jobService = {
    async assignJob(jobId: string, hrUserIds: string[]): Promise<{ status: string; message: string }> {
        const response = await apiClient.put(`/jobs/${jobId}/assign`, { hr_user_ids: hrUserIds });
        return response.data;
    },

    /**
     * Lấy danh sách tất cả chiến dịch tuyển dụng
     */
    async getJobs(): Promise<Job[]> {
        const response = await apiClient.get<Job[]>('/jobs');
        return response.data;
    },

    /**
     * Lấy chi tiết một chiến dịch tuyển dụng theo ID
     */
    async getJobById(jobId: string): Promise<Job> {
        const response = await apiClient.get<Job>(`/jobs/${jobId}`);
        return response.data;
    },

    /**
     * Tạo mới một chiến dịch tuyển dụng
     */
    async createJob(payload: JobPayload): Promise<{ message: string; job_id: string }> {
        const response = await apiClient.post('/jobs/', payload);
        return response.data;
    },

    /**
     * Cập nhật thông tin chiến dịch tuyển dụng
     */
    async updateJob(jobId: string, payload: JobPayload): Promise<{ status: string; message: string }> {
        const response = await apiClient.put(`/jobs/${jobId}`, payload);
        return response.data;
    },

    /**
     * Xóa chiến dịch tuyển dụng
     */
    async deleteJob(jobId: string): Promise<{ status: string; message: string }> {
        const response = await apiClient.delete(`/jobs/${jobId}`);
        return response.data;
    },

    /**
     * Lấy danh sách Bảng xếp hạng ứng viên (Ranking/Leaderboard) của Job
     */
    async getJobRanking(jobId: string): Promise<{
        job_info: Job;
        company_info: any;
        total_candidates: number;
        leaderboard: any[];
    }> {
        const response = await apiClient.get(`/jobs/${jobId}/ranking`);
        return response.data;
    },

    /**
     * [PUBLIC] Lấy danh sách việc làm cho Khách vãng lai
     */
    async getPublicJobs(params?: { page?: number; page_size?: number; q?: string }): Promise<Job[]> {
        const response = await apiClient.get<any>('/jobs/public/list', { params });
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return response.data?.items || [];
    },

    /**
     * [PUBLIC] Lấy chi tiết một việc làm cho Khách vãng lai
     */
    async getPublicJobById(jobId: string): Promise<Job> {
        const response = await apiClient.get<Job>(`/jobs/public/${jobId}`);
        return response.data;
    },
};