'use client';

import { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { companyService } from '@/features/company/company.service';
import Image from 'next/image';

interface AvatarUploadProps {
    value?: string;
    onChange: (url: string) => void;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    fallbackName?: string;
}

const SIZE_MAP = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
};

export default function AvatarUpload({ value, onChange, size = 'xl', className = '', fallbackName }: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
            toast.error('Vui lòng chọn ảnh định dạng JPG, PNG hoặc WEBP.');
            e.target.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Dung lượng ảnh tối đa là 5MB.');
            e.target.value = '';
            return;
        }

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await companyService.uploadFile(uploadData);
            const url = res.file_url || res.url;
            if (url) {
                onChange(url);
                toast.success('Cập nhật ảnh đại diện thành công.');
            }
        } catch (error) {
            toast.error('Lỗi khi tải ảnh lên');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const containerSize = SIZE_MAP[size];
    const displayAvatar = value || (fallbackName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=0284c7&color=fff&bold=true` : undefined);

    return (
        <div className={`relative group inline-block ${containerSize} ${className}`}>
            <div className={`relative w-full h-full rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${isUploading ? 'opacity-60' : ''}`}>
                {displayAvatar ? (
                    <Image
                        src={displayAvatar}
                        alt="Avatar"
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                    />
                ) : (
                    <Camera className="w-1/3 h-1/3 text-slate-400" />
                )}
            </div>

            <label className="absolute inset-0 rounded-full flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10">
                {isUploading ? (
                    <Loader2 className="w-1/3 h-1/3 text-white animate-spin" />
                ) : (
                    <>
                        <Camera className="w-1/3 h-1/3 text-white mb-1" />
                        <span className="text-[10px] text-white font-medium">Thay đổi</span>
                    </>
                )}
                <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
            </label>
        </div>
    );
}
