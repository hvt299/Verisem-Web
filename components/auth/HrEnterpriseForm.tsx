'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, MapPin, Users, AlignLeft } from 'lucide-react';
import Select from 'react-select';
import { GROUPED_INDUSTRIES, INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES } from '@/constants/company.constants';
import { companyService } from '@/features/company/company.service';
import { systemService, LocationUnit } from '@/features/system/system.service';
import { LocationDetail } from '@/types';
import toast from 'react-hot-toast';
import { useTranslation } from '@/store/useLanguageStore';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/shared/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-52 bg-input-bg border border-input-border animate-pulse rounded-button" />
});

export interface HrInfoState {
    companyName: string;
    taxCode: string;
    industries: string[];
    size: string;
    location: LocationDetail;
    website: string;
    description: string;
    license_file_url?: string;
}

export const DEFAULT_HR_INFO: HrInfoState = {
    companyName: '',
    taxCode: '',
    industries: [],
    size: '',
    website: '',
    description: '',
    location: {
        country: 'Việt Nam',
        version: 'new',
        province_code: '',
        district_code: '',
        ward_code: '',
        street_address: ''
    }
};

interface HrEnterpriseFormProps {
    hrInfo: HrInfoState;
    setHrInfo: React.Dispatch<React.SetStateAction<HrInfoState>>;
}

export default function HrEnterpriseForm({ hrInfo, setHrInfo }: HrEnterpriseFormProps) {
    const { t } = useTranslation();
    const [allProvinces, setAllProvinces] = useState<LocationUnit[]>([]);
    const domesticVersion = hrInfo.location?.version || 'new';
    const displayedProvinces = allProvinces.filter(p => p.version === domesticVersion);
    const [districts, setDistricts] = useState<LocationUnit[]>([]);
    const [wards, setWards] = useState<LocationUnit[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        systemService.getLocations().then(res => setAllProvinces(res)).catch(console.error);
    }, []);

    useEffect(() => {
        const loadInitialSubLocations = async () => {
            const currentCountry = hrInfo.location?.country || 'Việt Nam';
            if (currentCountry === 'Việt Nam' && hrInfo.location?.province_code) {
                if (domesticVersion === 'new') {
                    const wds = await systemService.getSubLocations(hrInfo.location.province_code);
                    setWards(wds.filter(item => item.version === 'new'));
                    setDistricts([]);
                } else {
                    const dists = await systemService.getSubLocations(hrInfo.location.province_code);
                    setDistricts(dists.filter(item => item.version === 'old'));

                    if (hrInfo.location?.district_code) {
                        const wds = await systemService.getSubLocations(hrInfo.location.district_code);
                        setWards(wds.filter(item => item.version === 'old'));
                    } else {
                        setWards([]);
                    }
                }
            }
        };
        if (hrInfo.location) loadInitialSubLocations();
    }, [hrInfo.location?.province_code, domesticVersion, hrInfo.location?.country]);

    const handleVersionChange = (ver: 'new' | 'old') => {
        setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, version: ver } }));
    };

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const prov = displayedProvinces.find(p => p.code === code);
        setHrInfo((prev: any) => ({
            ...prev,
            location: {
                ...prev.location, province_code: code, province_name: prov?.name || '', version: domesticVersion,
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
        setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, district_code: code, district_name: dist?.name || '', ward_code: '', ward_name: '', full_address_snapshot: '' } }));
        const wds = await systemService.getSubLocations(code);
        setWards(wds.filter(item => item.version === 'old'));
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const ward = wards.find(w => w.code === code);
        setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, ward_code: code, ward_name: ward?.name || '' } }));
    };

    const handleLookupTax = async () => {
        if (!hrInfo.taxCode.trim()) return toast.error("Vui lòng nhập Mã số thuế");
        const loadingToast = toast.loading("Đang tra cứu dữ liệu...");
        try {
            const res = await companyService.lookupTax(hrInfo.taxCode);
            const actualData = res?.data?.data || res?.data || res;

            const companyName = actualData.company_name || actualData.name || '';
            const rawAddress = actualData.address || '';

            if (!companyName) throw new Error("Mã số thuế hợp lệ nhưng không tải được tên công ty.");

            let newLocation = { ...hrInfo.location, street_address: rawAddress };

            if (actualData.structured_location) {
                newLocation = {
                    ...hrInfo.location,
                    ...actualData.structured_location,
                    country: 'Việt Nam'
                };
            }

            setHrInfo(prev => ({
                ...prev,
                companyName: companyName,
                location: newLocation
            }));

            toast.success("Đã tìm thấy và tự động điền địa chỉ!", { id: loadingToast });
        } catch (e: any) {
            toast.error(e.message || e.response?.data?.detail || "Không tìm thấy dữ liệu doanh nghiệp", { id: loadingToast });
        }
    };

    const customSelectStyles = {
        control: (base: any, state: any) => ({ ...base, backgroundColor: isDarkMode ? 'var(--color-input-bg)' : 'var(--color-input-bg)', borderColor: state.isFocused ? 'var(--color-input-focus)' : 'var(--color-input-border)', borderRadius: '0.75rem', minHeight: '42px', padding: '0 4px', boxShadow: state.isFocused ? '0 0 0 1px var(--color-input-focus)' : 'none', transition: 'all 0.2s' }),
        input: (base: any) => ({ ...base, color: isDarkMode ? 'var(--color-text)' : 'var(--color-text)' }),
        singleValue: (base: any) => ({ ...base, color: isDarkMode ? 'var(--color-text)' : 'var(--color-text)' }),
        placeholder: (base: any) => ({ ...base, color: 'var(--color-text-subtle)' }),
        menu: (base: any) => ({ ...base, zIndex: 9999, backgroundColor: isDarkMode ? 'var(--color-surface-hover)' : 'var(--color-surface)', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid var(--color-border)' }),
        menuList: (base: any) => ({ ...base, backgroundColor: isDarkMode ? 'var(--color-surface-hover)' : 'var(--color-surface)' }),
        option: (base: any, state: any) => ({ ...base, backgroundColor: state.isSelected ? 'var(--color-primary-600)' : state.isFocused ? 'var(--color-background)' : 'transparent', color: state.isSelected ? '#fff' : 'var(--color-text)', cursor: 'pointer' }),
        multiValue: (base: any) => ({ ...base, backgroundColor: 'var(--color-background)', borderRadius: '0.5rem' }),
        multiValueLabel: (base: any) => ({ ...base, color: 'var(--color-text)', fontWeight: 'bold' }),
        multiValueRemove: (base: any) => ({ ...base, ':hover': { backgroundColor: 'var(--color-error-500)', color: 'white', borderRadius: '0 0.5rem 0.5rem 0' } }),
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.hr_form.tax_code', undefined, 'Mã số thuế')} <span className="text-error-500">*</span></label>
                    <div className="flex gap-2">
                        <input
                            type="text" required
                            value={hrInfo.taxCode}
                            onChange={e => setHrInfo({ ...hrInfo, taxCode: e.target.value })}
                            className="min-w-0 flex-1 px-4 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all placeholder-text-subtle"
                            placeholder="VD: 0312..."
                        />
                        <button
                            type="button"
                            onClick={handleLookupTax}
                            className="px-4 bg-button-primary-bg hover:bg-button-primary-hover text-button-primary-text rounded-button shrink-0 transition-colors shadow-sm flex items-center justify-center"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.hr_form.company_name', undefined, 'Tên Công ty')} <span className="text-error-500">*</span></label>
                    <input
                        type="text" required
                        value={hrInfo.companyName}
                        onChange={e => setHrInfo({ ...hrInfo, companyName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all placeholder-text-subtle"
                        placeholder={t('auth.hr_form.company_name_placeholder', undefined, 'Tên doanh nghiệp')}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.hr_form.industry_label', undefined, 'Ngành nghề (Tối đa 3)')} <span className="text-error-500">*</span></label>
                    <Select
                        isMulti
                        options={GROUPED_INDUSTRIES}
                        styles={customSelectStyles}
                        placeholder={t('auth.hr_form.industry_placeholder', undefined, 'Chọn lĩnh vực...')}
                        noOptionsMessage={() => "Không tìm thấy"}
                        value={(hrInfo.industries || []).map((val: string) => {
                            const ind = INDUSTRIES.find(i => i.value === val);
                            return ind ? { value: ind.value, label: ind.label } : null;
                        }).filter(Boolean)}
                        onChange={(selected: any) => {
                            if (selected && selected.length > 3) {
                                return toast.error(t('auth.hr_form.industry_max_error', undefined, 'Chỉ được chọn tối đa 3 ngành nghề!'));
                            }
                            setHrInfo({ ...hrInfo, industries: selected ? selected.map((s: any) => s.value) : [] });
                        }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.hr_form.size_label', undefined, 'Quy mô')} <span className="text-error-500">*</span></label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle w-4 h-4" />
                        <select
                            value={hrInfo.size}
                            onChange={e => setHrInfo({ ...hrInfo, size: e.target.value })}
                            className="w-full pl-9 pr-3 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text appearance-none transition-all cursor-pointer"
                        >
                            <option value="">{t('auth.hr_form.size_placeholder', undefined, 'Chọn quy mô')}</option>
                            {COMPANY_SIZES.map(size => (
                                <option key={size.value} value={size.value}>{size.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* MODULE ĐỊA ĐIỂM CHUẨN */}
            <div className="space-y-3 pt-4 mt-2 border-t border-border">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-text">{t('auth.hr_form.location_label', undefined, 'Trụ sở kinh doanh')}</label>
                    {(hrInfo.location?.country || 'Việt Nam') === 'Việt Nam' && (
                        <div className="flex bg-background p-1 rounded-lg border border-border">
                            <button type="button" onClick={() => handleVersionChange('new')} className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'new' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-sm' : 'text-text-muted hover:text-text'}`}>{t('auth.hr_form.domestic_new', undefined, 'Mới')}</button>
                            <button type="button" onClick={() => handleVersionChange('old')} className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'old' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-sm' : 'text-text-muted hover:text-text'}`}>{t('auth.hr_form.domestic_old', undefined, 'Cũ')}</button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                        className="w-full px-3 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all cursor-pointer"
                        value={hrInfo.location?.country || 'Việt Nam'}
                        onChange={e => setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, country: e.target.value, province_code: '', district_code: '', ward_code: '' } }))}
                    >
                        <option value="Việt Nam">{t('auth.hr_form.country_vietnam', undefined, 'Việt Nam')}</option>
                        <option value="Nước ngoài">{t('auth.hr_form.country_foreign', undefined, 'Nước ngoài')}</option>
                    </select>

                    {(hrInfo.location?.country || 'Việt Nam') === 'Việt Nam' ? (
                        <>
                            <select className="w-full px-3 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all cursor-pointer" value={hrInfo.location?.province_code || ''} onChange={handleProvinceChange}>
                                <option value="" disabled>{t('auth.hr_form.province', undefined, 'Tỉnh/Thành phố')}</option>
                                {displayedProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                            </select>

                            {domesticVersion === 'old' && (
                                <select className="w-full px-3 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all cursor-pointer disabled:opacity-50" value={hrInfo.location?.district_code || ''} onChange={handleDistrictChange} disabled={!hrInfo.location?.province_code}>
                                    <option value="" disabled>{t('auth.hr_form.district', undefined, 'Quận/Huyện')}</option>
                                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                </select>
                            )}

                            <select className="w-full px-3 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all cursor-pointer disabled:opacity-50" value={hrInfo.location?.ward_code || ''} onChange={handleWardChange} disabled={domesticVersion === 'new' ? !hrInfo.location?.province_code : !hrInfo.location?.district_code}>
                                <option value="" disabled>{t('auth.hr_form.ward', undefined, 'Phường/Xã')}</option>
                                {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                            </select>

                            <div className={`relative mt-1 ${domesticVersion === 'old' ? 'col-span-1 md:col-span-4' : 'col-span-1 md:col-span-2'}`}>
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder={t('auth.hr_form.address_placeholder_vn', undefined, 'Số nhà, tên đường (Hoặc địa chỉ tự điền từ Tra cứu MST)')}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all placeholder-text-subtle"
                                    value={hrInfo.location?.street_address || ''}
                                    onChange={e => setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, street_address: e.target.value } }))}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="col-span-1 md:col-span-3 relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle w-4 h-4" />
                            <input
                                type="text"
                                placeholder={t('auth.hr_form.address_placeholder_foreign', undefined, 'VD: 123 Orchard Road, Singapore')}
                                className="w-full pl-9 pr-3 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all placeholder-text-subtle"
                                value={hrInfo.location?.street_address || ''}
                                onChange={e => setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, street_address: e.target.value } }))}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.hr_form.website_label', undefined, 'Website (Tùy chọn)')}</label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle w-4 h-4" />
                        <input
                            type="url"
                            value={hrInfo.website}
                            onChange={e => setHrInfo({ ...hrInfo, website: e.target.value })}
                            className="w-full pl-9 pr-3 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all placeholder-text-subtle"
                            placeholder="https://www.company.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.hr_form.license_label', undefined, 'Giấy phép kinh doanh (Tùy chọn)')}</label>
                    <input
                        type="text"
                        value={hrInfo.license_file_url || ''}
                        onChange={e => setHrInfo({ ...hrInfo, license_file_url: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-button bg-input-bg border border-input-border text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-text transition-all placeholder-text-subtle"
                        placeholder={t('auth.hr_form.license_placeholder', undefined, 'Link tới Giấy ĐKKD hoặc tài liệu xác minh...')}
                    />
                    <p className="text-xs text-text-subtle mt-1.5">{t('auth.hr_form.license_hint', undefined, 'Cung cấp tài liệu giúp Admin duyệt tài khoản nhanh hơn.')}</p>
                </div>
            </div>

            <div className="mt-4">
                <label className="block text-sm font-semibold text-text mb-1.5">{t('auth.hr_form.description_label', undefined, 'Mô tả tổng quan (Tùy chọn)')}</label>
                <div className="rounded-button overflow-hidden border border-input-border">
                    <RichTextEditor
                        value={hrInfo.description}
                        onChange={val => setHrInfo({ ...hrInfo, description: val })}
                        placeholder={t('auth.hr_form.description_placeholder', undefined, 'Mô tả tóm tắt về tầm nhìn, sứ mệnh...')}
                    />
                </div>
            </div>
        </div>
    );
}