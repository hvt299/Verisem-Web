import { SalaryRange } from '@/types';

export const parseCurrency = (val: string): number => {
    const number = val.replace(/\D/g, '');
    return number ? Number(number) : 0;
};

export const formatCurrency = (val: number): string =>
    new Intl.NumberFormat('vi-VN').format(val);

export const formatSalaryRange = (salary?: SalaryRange, lang: 'VI' | 'EN' = 'VI'): string => {
    if (salary?.min_salary == null) return lang === 'EN' ? 'Negotiable' : 'Thỏa thuận';

    const symbols: Record<string, string> = {
        VND: '₫',
        USD: '$',
    };

    const formatShort = (value: number) => {
        if (lang === 'EN') {
            if (value >= 1_000_000_000)
                return `${Number((value / 1_000_000_000).toFixed(1))}B`;

            if (value >= 1_000_000)
                return `${Number((value / 1_000_000).toFixed(1))}M`;

            return formatCurrency(value);
        }

        if (value >= 1_000_000_000)
            return `${Number((value / 1_000_000_000).toFixed(1))}Tỷ`;

        if (value >= 1_000_000)
            return `${Number((value / 1_000_000).toFixed(1))}Tr`;

        return formatCurrency(value);
    };

    let min = salary.min_salary;
    let max = salary.max_salary;

    if (max != null && max < min) {
        [min, max] = [max, min];
    }

    const curr = symbols[salary.currency] ?? salary.currency;

    if (max == null) {
        return lang === 'EN' ? `From ${formatShort(min)}${curr}` : `Từ ${formatShort(min)}${curr}`;
    }

    if (min === max) {
        return `${formatShort(min)}${curr}`;
    }

    return `${formatShort(min)} - ${formatShort(max)}${curr}`;
};

export const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return 'Chưa cập nhật';

    const date = new Date(dateString);
    return Number.isNaN(date.getTime())
        ? 'Ngày không hợp lệ'
        : date.toLocaleDateString('vi-VN');
};

export const formatDateTimeGMT7 = (
    dateString?: string | Date
): string => {
    if (!dateString) return 'Chưa cập nhật';

    const value =
        dateString instanceof Date
            ? dateString
            : new Date(
                /Z$|[+-]\d{2}:\d{2}$/.test(dateString)
                    ? dateString
                    : `${dateString}Z`
            );

    if (Number.isNaN(value.getTime())) {
        return 'Ngày không hợp lệ';
    }

    return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(value);
};

export const formatOverviewDate = (date: Date): string =>
    date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

export const getPasswordStrength = (pass: string) => {
    let score = 0;

    if (!pass)
        return { score, color: 'bg-border dark:bg-slate-700', label: '' };

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1)
        return { score, color: 'bg-error-500', label: 'Yếu' };

    if (score === 2)
        return { score, color: 'bg-warning-500', label: 'Trung bình' };

    return { score, color: 'bg-success-500', label: 'Mạnh' };
};

export const getDeadlineCountdown = (deadline?: string | Date, lang: 'VI' | 'EN' = 'VI'): string => {
    if (!deadline) return lang === 'EN' ? 'No deadline' : 'Không thời hạn';

    const diff = new Date(deadline).getTime() - Date.now();
    if (diff < 0) return lang === 'EN' ? 'Expired' : 'Đã hết hạn';

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return lang === 'EN' ? 'Expires today' : 'Hết hạn hôm nay';
    return lang === 'EN' ? `${days} days left` : `Còn ${days} ngày`;
};

export const formatSubscriptionDate = (date?: string) => {
    if (!date) return 'Vĩnh viễn';

    return new Date(date).toLocaleDateString('vi-VN');
};