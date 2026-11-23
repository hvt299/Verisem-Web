// Key test của Cloudflare (luôn cho qua) chỉ được dùng khi chạy dev, production bắt buộc phải cấu hình key thật
export const TURNSTILE_SITE_KEY =
    process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY ||
    (process.env.NODE_ENV === 'development' ? '1x00000000000000000000AA' : '');
