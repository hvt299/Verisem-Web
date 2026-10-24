import { create } from 'zustand';
import Cookies from 'js-cookie';
import apiClient from '@/lib/api-client';
import { clearAllAuthData } from '@/lib/auth-utils';
import { User, UserRole } from '@/types';
import { ROUTES } from '@/constants/routes';

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    savedJobIds: string[];
    savedCompanyIds: string[];
    savedProfileIds: string[];
    setSavedItems: (jobs: string[], companies: string[], profiles?: string[]) => void;
    toggleSavedJob: (jobId: string) => void;
    toggleSavedCompany: (companyId: string) => void;
    toggleSavedProfile: (profileId: string) => void;
    initAuth: () => Promise<void>;
    login: (token: string, router: any) => Promise<void>;
    logout: (router: any) => void;
    updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    user: null,
    loading: true,
    savedJobIds: [],
    savedCompanyIds: [],
    savedProfileIds: [],

    setSavedItems: (jobs: string[], companies: string[], profiles: string[] = []) => {
        set({ savedJobIds: jobs, savedCompanyIds: companies, savedProfileIds: profiles });
    },

    toggleSavedJob: (jobId: string) => {
        const { savedJobIds } = get();
        if (savedJobIds.includes(jobId)) {
            set({ savedJobIds: savedJobIds.filter(id => id !== jobId) });
        } else {
            set({ savedJobIds: [...savedJobIds, jobId] });
        }
    },

    toggleSavedCompany: (companyId: string) => {
        const { savedCompanyIds } = get();
        if (savedCompanyIds.includes(companyId)) {
            set({ savedCompanyIds: savedCompanyIds.filter(id => id !== companyId) });
        } else {
            set({ savedCompanyIds: [...savedCompanyIds, companyId] });
        }
    },

    toggleSavedProfile: (profileId: string) => {
        const { savedProfileIds } = get();
        if (savedProfileIds.includes(profileId)) {
            set({ savedProfileIds: savedProfileIds.filter(id => id !== profileId) });
        } else {
            set({ savedProfileIds: [...savedProfileIds, profileId] });
        }
    },

    initAuth: async () => {
        try {
            const res = await apiClient.get('/auth/me');
            const fetchedUser = res.data;
            set({ isAuthenticated: true, user: fetchedUser, loading: false });

            // Fetch saved items based on role
            if (fetchedUser.role === UserRole.APPLICANT) {
                try {
                    const [savedJobsRes, savedCompaniesRes] = await Promise.all([
                        apiClient.get('/apply/saved-jobs/list'),
                        apiClient.get('/apply/saved-companies/list')
                    ]);
                    const jobs = (savedJobsRes.data.data || savedJobsRes.data || []).map((item: any) => item.id || item._id);
                    const companies = (savedCompaniesRes.data.data || savedCompaniesRes.data || []).map((item: any) => item.id || item._id);
                    get().setSavedItems(jobs, companies);
                } catch (e) {
                    console.error('Error fetching saved items', e);
                }
            } else if (fetchedUser.role === UserRole.HR_OWNER || fetchedUser.role === UserRole.HR_MEMBER) {
                try {
                    const savedProfilesRes = await apiClient.get('/cv/talent-pool/bookmarked');
                    const profiles = (savedProfilesRes.data.data || savedProfilesRes.data || []).map((item: any) => item.applicant_user_id || item.id || item._id);
                    set({ savedProfileIds: profiles });
                } catch (e) {
                    console.error('Error fetching saved profiles', e);
                }
            }
        } catch {
            set({ isAuthenticated: false, user: null, loading: false });
        }
    },

    login: async (token: string, router: any) => {
        set({ loading: true });
        // Fallback for non-HttpOnly client side
        Cookies.set('token', token, { expires: 1, path: '/' });

        try {
            const res = await apiClient.get('/auth/me');
            const fetchedUser: User = res.data;

            set({ isAuthenticated: true, user: fetchedUser, loading: false });

            // Fetch saved items if APPLICANT
            if (fetchedUser.role === UserRole.APPLICANT) {
                try {
                    const [savedJobsRes, savedCompaniesRes] = await Promise.all([
                        apiClient.get('/apply/saved-jobs/list'),
                        apiClient.get('/apply/saved-companies/list')
                    ]);
                    const jobs = (savedJobsRes.data.data || savedJobsRes.data || []).map((item: any) => item.id || item._id);
                    const companies = (savedCompaniesRes.data.data || savedCompaniesRes.data || []).map((item: any) => item.id || item._id);
                    get().setSavedItems(jobs, companies);
                } catch (e) {
                    console.error('Error fetching saved items', e);
                }
            }

            switch (fetchedUser.role) {
                case UserRole.APPLICANT:
                    router.push(ROUTES.APPLICANT_DASHBOARD);
                    break;
                case UserRole.HR_OWNER:
                case UserRole.HR_MEMBER:
                    router.push(ROUTES.HR_DASHBOARD);
                    break;
                case UserRole.ADMIN:
                    router.push(ROUTES.ADMIN_DASHBOARD);
                    break;
                default:
                    console.error('Unknown user role:', fetchedUser.role);
                    router.push(ROUTES.APPLICANT_DASHBOARD);
                    break;
            }
        } catch (error) {
            clearAllAuthData();
            set({ isAuthenticated: false, user: null, loading: false });
            router.push(ROUTES.LOGIN);
        }
    },

    logout: async (router: any) => {
        try {
            await apiClient.post('/auth/logout');
        } catch (e) {
            // ignore network/session error on logout
        }
        clearAllAuthData();
        set({ isAuthenticated: false, user: null });
        router.push(ROUTES.LOGIN);
    },

    updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
            set({ user: { ...user, ...userData } });
        }
    },
}));