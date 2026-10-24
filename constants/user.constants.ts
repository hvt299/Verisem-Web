import { UserRole } from '@/types';

export const ROLES = [
    {
        value: UserRole.APPLICANT,
        label: 'Ứng viên',
        color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    {
        value: UserRole.HR_OWNER,
        label: 'HR Owner',
        color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    {
        value: UserRole.HR_MEMBER,
        label: 'HR Member',
        color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
    {
        value: UserRole.ADMIN,
        label: 'Admin',
        color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    },
];
