'use client';

import { useState } from 'react';
import { X, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { companyService } from '@/features/company/company.service';

export default function CompanyGallery({ company, setCompany }: { company: any, setCompany: any }) {
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const currentGallery = company?.gallery_urls || [];
        if (currentGallery.length + files.length > 5) {
            return toast.error('Chỉ được tải lên tối đa 5 ảnh!');
        }

        setIsUploadingGallery(true);
        try {
            const uploadedUrls: string[] = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                const res = await companyService.uploadFile(formData);
                uploadedUrls.push(res.file_url || res.url);
            }
            setCompany((prev: any) => ({ ...prev, gallery_urls: [...(prev.gallery_urls || []), ...uploadedUrls] }));
            toast.success('Đã tải ảnh lên thư viện!');
        } catch (error) {
            toast.error('Lỗi khi tải ảnh lên');
        } finally {
            setIsUploadingGallery(false);
        }
    };

    const removeGalleryImage = (index: number) => {
        setCompany((prev: any) => ({
            ...prev,
            gallery_urls: prev.gallery_urls.filter((_: any, idx: number) => idx !== index)
        }));
    };

    return (
        <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Thư viện không gian làm việc (Tối đa 5 ảnh)</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(company.gallery_urls || []).filter((u: string) => Boolean(u && u.trim())).map((url: string, i: number) => (
                    <div key={i} className="aspect-square rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden relative group">
                        <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
                    </div>
                ))}

                {(company.gallery_urls || []).filter((u: string) => Boolean(u && u.trim())).length < 5 && (
                    <label className={`aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer ${isUploadingGallery ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                        {isUploadingGallery ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                        <span className="text-[10px] font-bold mt-2">Thêm ảnh</span>
                    </label>
                )}
            </div>
        </div>
    );
}