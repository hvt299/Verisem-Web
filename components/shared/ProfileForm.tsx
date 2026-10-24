'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Globe, Link, Save, Briefcase, Camera, Loader2, DollarSign, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyProfile } from '@/features/application/useApplication';
import { UserRole } from '@/types';
import apiClient from '@/lib/api-client';
import { systemService, LocationUnit } from '@/features/system/system.service';
import AvatarUpload from '@/components/shared/AvatarUpload';

export default function ProfileForm() {
    const { user, updateUser } = useAuthStore();
    const { profile, setProfile, isLoading, isSaving, updateProfile } = useMyProfile();

    const [allProvinces, setAllProvinces] = useState<LocationUnit[]>([]);
    const domesticVersion = profile?.current_location?.version || 'new';
    const displayedProvinces = allProvinces.filter(p => p.version === domesticVersion);
    const [districts, setDistricts] = useState<LocationUnit[]>([]);
    const [wards, setWards] = useState<LocationUnit[]>([]);

    useEffect(() => {
        systemService.getLocations().then(res => setAllProvinces(res)).catch(console.error);
    }, []);

    useEffect(() => {
        const loadInitialSubLocations = async () => {
            const currentCountry = profile?.current_location?.country || 'Việt Nam';
            if (currentCountry === 'Việt Nam' && profile?.current_location?.province_code) {
                if (domesticVersion === 'new') {
                    const wds = await systemService.getSubLocations(profile.current_location.province_code);
                    setWards(wds.filter(item => item.version === 'new'));
                    setDistricts([]);
                } else {
                    const dists = await systemService.getSubLocations(profile.current_location.province_code);
                    setDistricts(dists.filter(item => item.version === 'old'));

                    if (profile.current_location?.district_code) {
                        const wds = await systemService.getSubLocations(profile.current_location.district_code);
                        setWards(wds.filter(item => item.version === 'old'));
                    } else {
                        setWards([]);
                    }
                }
            }
        };
        if (profile) loadInitialSubLocations();
    }, [profile?.current_location?.province_code, domesticVersion, profile?.current_location?.country]);

    const handleVersionChange = (ver: 'new' | 'old') => {
        setProfile((prev: any) => ({ ...prev, current_location: { ...prev.current_location, version: ver } }));
    };

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const prov = displayedProvinces.find(p => p.code === code);
        setProfile((prev: any) => ({
            ...prev,
            current_location: {
                ...prev.current_location, province_code: code, province_name: prov?.name || '', version: domesticVersion,
                district_code: '', district_name: '', ward_code: '', ward_name: '', full_address_snapshot: ''
            }
        }));

        if (domesticVersion === 'new') {
            const wds = await systemService.getSubLocations(code);
            setWards(wds.filter(item => item.version === 'new'));
            setDistricts([]);
        } else {
            const dists = await systemService.getSubLocations(code);
            setDistricts(dists.filter(item => item.version === 'old'));
            setWards([]);
        }
    };

    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const dist = districts.find(d => d.code === code);
        setProfile((prev: any) => ({ ...prev, current_location: { ...prev.current_location, district_code: code, district_name: dist?.name || '', ward_code: '', ward_name: '', full_address_snapshot: '' } }));
        const wds = await systemService.getSubLocations(code);
        setWards(wds.filter(item => item.version === 'old'));
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const ward = wards.find(w => w.code === code);
        setProfile((prev: any) => ({ ...prev, current_location: { ...prev.current_location, ward_code: code, ward_name: ward?.name || '' } }));
    };

    if (isLoading || !user) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600" />
            </div>
        );
    }

    const isApplicant = user.role === UserRole.APPLICANT;
    const isHR = user.role === UserRole.HR_OWNER || user.role === UserRole.HR_MEMBER;

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (updateUser) {
            await updateProfile({
                ...profile,
                avatar: profile.avatar_url || profile.avatar || user?.avatar_url,
                avatar_url: profile.avatar_url || profile.avatar || user?.avatar_url
            }, updateUser);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">

                {/* Khu vực Avatar */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
                    <AvatarUpload
                        value={profile.avatar_url || profile.avatar || user?.avatar_url}
                        fallbackName={profile?.full_name || user?.full_name || 'User'}
                        onChange={(url) => {
                            setProfile((prev: any) => ({ ...prev, avatar_url: url, avatar: url }));
                            if (updateUser) {
                                updateUser({ ...user, avatar_url: url });
                            }
                        }}
                        size="lg"
                    />
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white mb-1">Ảnh đại diện</h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">JPG, PNG tối đa 5MB. Ảnh sẽ hiển thị công khai trên nền tảng.</p>
                    </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    {/* THÔNG TIN CHUNG (Ai cũng có) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Họ và tên <span className="text-error-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text" required
                                    value={profile.full_name || ''}
                                    onChange={(e) => setProfile((prev: any) => ({ ...prev, full_name: e.target.value }))}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email" disabled
                                    value={profile.email || ''}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Số điện thoại</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="tel"
                                    value={profile.phone || ''}
                                    onChange={(e) => setProfile((prev: any) => ({ ...prev, phone: e.target.value }))}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="0912..."
                                />
                            </div>
                        </div>

                        {/* BLOCK DÀNH RIÊNG CHO HR */}
                        {isHR && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Số máy lẻ (Tùy chọn)</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={profile.extension_phone || ''}
                                        onChange={(e) => setProfile((prev: any) => ({ ...prev, extension_phone: e.target.value }))}
                                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        placeholder="Ext: 101"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* BLOCK DÀNH RIÊNG CHO HR (Chức danh nội bộ) */}
                    {isHR && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Chức danh / Vai trò nội bộ</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={profile.job_title_internal || ''}
                                    onChange={(e) => setProfile((prev: any) => ({ ...prev, job_title_internal: e.target.value }))}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="VD: Trưởng phòng Tuyển dụng, Chuyên viên Nhân sự..."
                                />
                            </div>
                        </div>
                    )}

                    {/* BLOCK DÀNH RIÊNG CHO APPLICANT */}
                    {isApplicant && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    Tiêu đề hồ sơ (Headline) <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary-100 text-primary-700">SEO CV</span>
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={profile.headline || ''}
                                        onChange={(e) => setProfile((prev: any) => ({ ...prev, headline: e.target.value }))}
                                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        placeholder="VD: Senior React Developer với 5 năm kinh nghiệm..."
                                    />
                                </div>
                            </div>

                            {/* KHU VỰC ĐỊA ĐIỂM (UI ĐỒNG BỘ) */}
                            <div className="md:col-span-2 space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        Khu vực sinh sống
                                    </label>
                                    {(profile.current_location?.country || 'Việt Nam') === 'Việt Nam' && (
                                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                            <button type="button" onClick={() => handleVersionChange('new')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'new' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Mới (Hiện tại)</button>
                                            <button type="button" onClick={() => handleVersionChange('old')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'old' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Cũ (Trước 1/7/2025)</button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <select
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                                        value={profile.current_location?.country || 'Việt Nam'}
                                        onChange={e => setProfile((prev: any) => ({ ...prev, current_location: { ...prev.current_location, country: e.target.value, province_code: '', district_code: '', ward_code: '' } }))}
                                    >
                                        <option value="Việt Nam">Việt Nam</option>
                                        <option value="Nước ngoài">Nước ngoài</option>
                                    </select>

                                    {(profile.current_location?.country || 'Việt Nam') === 'Việt Nam' ? (
                                        <>
                                            <select className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer" value={profile.current_location?.province_code || ''} onChange={handleProvinceChange}>
                                                <option value="" disabled>Tỉnh/Thành phố</option>
                                                {displayedProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                            </select>

                                            {domesticVersion === 'old' && (
                                                <select className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer disabled:opacity-50" value={profile.current_location?.district_code || ''} onChange={handleDistrictChange} disabled={!profile.current_location?.province_code}>
                                                    <option value="" disabled>Quận/Huyện</option>
                                                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                                </select>
                                            )}

                                            <select className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer disabled:opacity-50" value={profile.current_location?.ward_code || ''} onChange={handleWardChange} disabled={domesticVersion === 'new' ? !profile.current_location?.province_code : !profile.current_location?.district_code}>
                                                <option value="" disabled>Phường/Xã</option>
                                                {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                            </select>

                                            {/* Input địa chỉ */}
                                            <div className="col-span-1 md:col-span-4 relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Số nhà, tên đường, thôn, xóm..."
                                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                                    value={profile.current_location?.street_address || ''}
                                                    onChange={e => setProfile((prev: any) => ({ ...prev, current_location: { ...prev.current_location, street_address: e.target.value } }))}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="VD: 123 Orchard Road, Singapore"
                                                className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                                value={profile.current_location?.street_address || ''}
                                                onChange={e => setProfile((prev: any) => ({ ...prev, current_location: { ...prev.current_location, street_address: e.target.value } }))}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Lương mong muốn */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Lương mong muốn tối thiểu (VND)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        value={profile.expected_salary_min || ''}
                                        onChange={(e) => setProfile((prev: any) => ({ ...prev, expected_salary_min: Number(e.target.value) }))}
                                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        placeholder="15000000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Liên kết cá nhân (Portfolio, GitHub...)</label>
                                    {(profile.portfolio || []).map((url: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 mb-2">
                                            <div className="relative flex-1">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={url}
                                                    onChange={(e) => {
                                                        const newPortfolio = [...(profile.portfolio || [])];
                                                        newPortfolio[idx] = e.target.value;
                                                        setProfile((prev: any) => ({ ...prev, portfolio: newPortfolio }));
                                                    }}
                                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                                    placeholder="github.com/..."
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const newPortfolio = [...(profile.portfolio || [])];
                                                    newPortfolio.splice(idx, 1);
                                                    setProfile((prev: any) => ({ ...prev, portfolio: newPortfolio }));
                                                }} 
                                                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                                                title="Xóa liên kết"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setProfile((prev: any) => ({ ...prev, portfolio: [...(prev.portfolio || []), ''] }));
                                        }} 
                                        className="text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
                                    >
                                        + Thêm liên kết
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">LinkedIn</label>
                                    <div className="relative">
                                        <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={profile.linkedin || ''}
                                            onChange={(e) => setProfile((prev: any) => ({ ...prev, linkedin: e.target.value }))}
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                            placeholder="linkedin.com/in/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* BIO */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Giới thiệu bản thân</label>
                        <textarea
                            value={profile.bio || ''}
                            onChange={(e) => setProfile((prev: any) => ({ ...prev, bio: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                            placeholder={isApplicant ? "Viết vài dòng giới thiệu về bản thân, kỹ năng và định hướng..." : "Giới thiệu ngắn về bạn..."}
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-2xl transition-all shadow-md shadow-primary-500/20 disabled:shadow-none flex items-center justify-center gap-2 mt-4"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}