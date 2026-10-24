import { useState, useEffect, useCallback } from 'react';
import { applicationService } from './application.service';
import { Job, CV, Application, Notification, NotificationReadStatus } from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook quản lý Trang Khám phá Việc làm (Apply Page)
 */
export function useExploreJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [cvLibrary, setCvLibrary] = useState<CV[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState({
        locations: [] as string[], workModes: [] as string[], jobLevels: [] as string[],
        employmentTypes: [] as string[], skills: [] as string[], companies: [] as string[],
        industries: [] as string[], educations: [] as string[]
    });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [jobData, cvData] = await Promise.all([
                applicationService.getAvailableJobs(),
                applicationService.getMyCvLibrary()
            ]);
            setJobs(jobData);
            setCvLibrary(cvData);

            // Bóc tách filter options từ jobData
            const data = jobData;
            setFilterOptions({
                locations: [...new Set(data.map((j: any) => j.location?.city).filter(Boolean))] as string[],
                workModes: [...new Set(data.map((j: any) => j.work_mode).filter(Boolean))] as string[],
                jobLevels: [...new Set(data.map((j: any) => j.job_level).filter(Boolean))] as string[],
                employmentTypes: [...new Set(data.map((j: any) => j.employment_type).filter(Boolean))] as string[],
                skills: [...new Set(data.flatMap((j: any) => j.required_skills?.map((s: any) => typeof s === 'string' ? s : s.name) || []))] as string[],
                companies: [...new Set(data.map((j: any) => j.company_name).filter(Boolean))] as string[],
                industries: [...new Set(data.map((j: any) => j.industry).filter(Boolean))] as string[],
                educations: [...new Set(data.map((j: any) => j.education?.min_level).filter(Boolean))] as string[]
            });
        } catch (error) {
            toast.error('Không thể tải dữ liệu');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { jobs, cvLibrary, isLoading, filterOptions };
}

/**
 * Hook quản lý Lịch sử ứng tuyển và Thông báo (My Applications Page)
 */
export function useMyApplications() {
    const [apps, setApps] = useState<Application[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [appsData, notifData] = await Promise.all([
                applicationService.getMyApplications(),
                applicationService.getMyNotifications()
            ]);
            setApps(appsData);
            setNotifications(notifData);
        } catch (error) {
            toast.error('Không thể tải dữ liệu');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const markAsRead = async (id: string) => {
        try {
            await applicationService.markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: NotificationReadStatus.READ } : n));
        } catch {
            toast.error('Lỗi khi cập nhật thông báo');
        }
    };

    const removeNotification = async (id: string) => {
        try {
            await applicationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success('Đã xóa thông báo');
        } catch {
            toast.error('Lỗi khi xóa thông báo');
        }
    };

    return { apps, notifications, isLoading, markAsRead, removeNotification };
}

/**
 * Hook quản lý Thư viện CV cá nhân
 */
export function useMyCvLibrary() {
    const [cvs, setCvs] = useState<CV[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

    const fetchLibrary = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await applicationService.getMyCvLibrary();
            setCvs(data);
        } catch (error) {
            toast.error('Lỗi tải thư viện CV');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLibrary();
    }, [fetchLibrary]);

    const uploadFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const validFiles = Array.from(files).filter(file => file.size <= MAX_FILE_SIZE);

        if (validFiles.length < files.length) {
            toast.error(`Đã bỏ qua ${files.length - validFiles.length} file vì vượt quá giới hạn 5MB.`);
        }

        if (validFiles.length === 0) return;

        setIsUploading(true);
        setUploadProgress({ current: 0, total: validFiles.length });
        let successCount = 0;

        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('display_name', file.name.split('.')[0]);

            setUploadProgress(prev => ({ ...prev, current: i + 1 }));

            try {
                await applicationService.uploadMyCV(formData);
                successCount++;
            } catch (error: any) {
                toast.error(`Lỗi tải lên ${file.name}: ${error.response?.data?.detail || "Không rõ lỗi"}`);
            }
        }

        setIsUploading(false);
        if (successCount > 0) {
            toast.success(`Đã tải lên thành công ${successCount} CV!`);
            await fetchLibrary();
        }
    };

    const deleteCV = async (cvId: string, name: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa CV "${name}" khỏi thư viện? Các hồ sơ đã nộp bằng CV này sẽ KHÔNG bị ảnh hưởng.`)) return;

        try {
            await applicationService.deleteMyCV(cvId);
            toast.success("Đã xóa CV thành công!");
            setCvs(prev => prev.filter(cv => cv.id !== cvId));
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Lỗi khi xóa CV");
        }
    };

    const addCVUrl = async (url: string, display_name: string) => {
        setIsUploading(true);
        try {
            await applicationService.addMyCVViaUrl({ url, display_name });
            toast.success('Đã thêm CV từ URL!');
            await fetchLibrary();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Lỗi khi thêm CV");
        } finally {
            setIsUploading(false);
        }
    };

    return { cvs, isLoading, isUploading, uploadProgress, uploadFiles, deleteCV, addCVUrl };
}

/**
 * Hook quản lý Thư viện Thư giới thiệu (Cover Letter)
 */
export function useCoverLetterLibrary() {
    const [coverLetters, setCoverLetters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

    const fetchLibrary = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await applicationService.getMyCoverLetters();
            setCoverLetters(data);
        } catch (error) {
            toast.error('Lỗi tải thư viện Thư giới thiệu');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLibrary();
    }, [fetchLibrary]);

    const uploadFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const validFiles = Array.from(files).filter(file => file.size <= MAX_FILE_SIZE);

        if (validFiles.length < files.length) {
            toast.error(`Đã bỏ qua ${files.length - validFiles.length} file vì vượt quá giới hạn 5MB.`);
        }

        if (validFiles.length === 0) return;

        setIsUploading(true);
        setUploadProgress({ current: 0, total: validFiles.length });
        let successCount = 0;

        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('display_name', file.name.split('.')[0]);

            setUploadProgress(prev => ({ ...prev, current: i + 1 }));

            try {
                await applicationService.uploadCoverLetter(formData);
                successCount++;
            } catch (error: any) {
                toast.error(`Lỗi tải lên ${file.name}: ${error.response?.data?.detail || "Không rõ lỗi"}`);
            }
        }

        setIsUploading(false);
        if (successCount > 0) {
            toast.success(`Đã tải lên thành công ${successCount} Thư giới thiệu!`);
            await fetchLibrary();
        }
    };

    const addCoverLetterUrl = async (url: string, display_name: string) => {
        setIsUploading(true);
        try {
            await applicationService.addCoverLetterViaUrl({ url, display_name });
            toast.success('Đã thêm Thư giới thiệu từ URL!');
            await fetchLibrary();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Lỗi khi thêm");
        } finally {
            setIsUploading(false);
        }
    };

    const deleteCoverLetter = async (clId: string, name: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa Thư giới thiệu "${name}" khỏi thư viện? Các hồ sơ đã nộp sẽ KHÔNG bị ảnh hưởng.`)) return;

        try {
            await applicationService.deleteCoverLetter(clId);
            toast.success("Đã xóa Thư giới thiệu thành công!");
            setCoverLetters(prev => prev.filter(cl => cl.id !== clId));
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Lỗi khi xóa");
        }
    };

    return { coverLetters, isLoading, isUploading, uploadProgress, uploadFiles, deleteCoverLetter, addCoverLetterUrl };
}

/**
 * Hook quản lý Profile cá nhân
 */
export function useMyProfile() {
    const [profile, setProfile] = useState<any>({
        full_name: '', email: '', phone: '', address: '', github: '', linkedin: '', bio: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await applicationService.getMyProfile();
            setProfile(data);
        } catch (error) {
            toast.error('Không thể tải thông tin profile');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = async (newProfile: any, updateAuthContext: Function) => {
        setIsSaving(true);
        try {
            await applicationService.updateMyProfile(newProfile);
            toast.success('Cập nhật thông tin thành công!');
            updateAuthContext({ full_name: newProfile.full_name, avatar_url: newProfile.avatar_url || newProfile.avatar }); // Sync với Navbar
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Không thể cập nhật thông tin');
        } finally {
            setIsSaving(false);
        }
    };

    return { profile, setProfile, isLoading, isSaving, updateProfile };
}