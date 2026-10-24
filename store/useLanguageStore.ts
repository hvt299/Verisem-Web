'use client';

import { create } from 'zustand';

import viCommon from '../locales/vi/common.json';
import enCommon from '../locales/en/common.json';
import viLanding from '../locales/vi/landing.json';
import enLanding from '../locales/en/landing.json';
import viJobs from '../locales/vi/jobs.json';
import enJobs from '../locales/en/jobs.json';
import viCompanies from '../locales/vi/companies.json';
import enCompanies from '../locales/en/companies.json';
import viAuth from '../locales/vi/auth.json';
import enAuth from '../locales/en/auth.json';
import viDashboard from '../locales/vi/dashboard.json';
import enDashboard from '../locales/en/dashboard.json';
import viPublicPages from '../locales/vi/public_pages.json';
import enPublicPages from '../locales/en/public_pages.json';

export type LanguageCode = 'VI' | 'EN';

const dictionaries: Record<LanguageCode, Record<string, any>> = {
    VI: {
        common: viCommon,
        landing: viLanding,
        jobs: viJobs,
        companies: viCompanies,
        auth: viAuth,
        dashboard: viDashboard,
        public_pages: viPublicPages,
    },
    EN: {
        common: enCommon,
        landing: enLanding,
        jobs: enJobs,
        companies: enCompanies,
        auth: enAuth,
        dashboard: enDashboard,
        public_pages: enPublicPages,
    },
};

interface LanguageState {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    t: (path: string, params?: Record<string, string | number>, fallback?: string) => string;
}

const getInitialLanguage = (): LanguageCode => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('verisem_locale') as LanguageCode;
        if (stored === 'VI' || stored === 'EN') return stored;
    }
    return 'VI';
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
    language: typeof window !== 'undefined' ? getInitialLanguage() : 'VI',

    setLanguage: (lang: LanguageCode) => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('verisem_locale', lang);
                document.cookie = `NEXT_LOCALE=${lang.toLowerCase()}; path=/; max-age=31536000; SameSite=Lax`;
            } catch (e) {
                console.warn('Could not persist language choice', e);
            }
        }
        set({ language: lang });
    },

    t: (path: string, params?: Record<string, string | number>, fallback?: string): string => {
        const currentLang = get().language;
        const dict = dictionaries[currentLang] || dictionaries.VI;

        const keys = path.split('.');
        let current: any = dict;

        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                current = undefined;
                break;
            }
        }

        // If not found in current language, fallback to VI
        if (current === undefined && currentLang !== 'VI') {
            let viDict: any = dictionaries.VI;
            for (const k of keys) {
                if (viDict && typeof viDict === 'object' && k in viDict) {
                    viDict = viDict[k];
                } else {
                    viDict = undefined;
                    break;
                }
            }
            current = viDict;
        }

        if (typeof current !== 'string') {
            return fallback !== undefined ? fallback : path;
        }

        if (params) {
            return Object.entries(params).reduce((acc, [paramKey, val]) => {
                return acc.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
            }, current);
        }

        return current;
    },
}));

/**
 * Convenient React hook to consume language & translations
 */
export function useTranslation() {
    const language = useLanguageStore((state) => state.language);
    const setLanguage = useLanguageStore((state) => state.setLanguage);
    const t = useLanguageStore((state) => state.t);

    return {
        language,
        setLanguage,
        t,
        isVietnamese: language === 'VI',
        isEnglish: language === 'EN',
    };
}
