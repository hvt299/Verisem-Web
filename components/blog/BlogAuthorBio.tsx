'use client';

import { ShieldCheck, Mail, Globe, Award } from 'lucide-react';
import { BlogAuthor } from '@/features/blog/blog.service';

interface BlogAuthorBioProps {
    author: BlogAuthor;
}

export default function BlogAuthorBio({ author }: BlogAuthorBioProps) {
    return (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-7 shadow-xs backdrop-blur-md font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative shrink-0">
                    <img
                        src={author.avatar_url}
                        alt={author.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md"
                    />
                    <span
                        className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-blue-600 text-white shadow-xs"
                        title="Tác giả được xác thực"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                </div>

                <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                            {author.name}
                        </h4>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-[11px] font-bold border border-blue-200/60 dark:border-blue-800/60">
                            <Award className="w-3 h-3" />
                            {author.role}
                        </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        {author.bio}
                    </p>
                </div>
            </div>
        </div>
    );
}
