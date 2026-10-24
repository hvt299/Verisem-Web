import Image from 'next/image';

export default function AuthPageBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Background image mờ như ở ngoài trang chủ */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero-bg.jpg"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center opacity-[0.22] dark:opacity-[0.22]"
                />

                {/* Light mode overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-slate-50/45 via-slate-50/70 to-slate-50/95 dark:hidden" />

                {/* Dark mode overlay */}
                <div className="absolute inset-0 hidden bg-linear-to-b from-[#020617]/55 dark:block" />

                {/* Dark mode color tint */}
                <div className="absolute inset-0 hidden bg-blue-950/20 mix-blend-multiply dark:block" />
            </div>

            {/* Primary glow */}
            <div className="absolute left-1/2 top-[-12%] h-130 w-205 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px] dark:bg-blue-500/10 pointer-events-none" />

            {/* Soft side glows */}
            <div className="absolute left-[-15%] top-[20%] h-105 w-105 rounded-full bg-blue-400/4.5 blur-[120px] dark:bg-blue-500/6 pointer-events-none" />
            <div className="absolute right-[-15%] top-[30%] h-105 w-105 rounded-full bg-cyan-300/4 blur-[120px] dark:bg-cyan-500/5 pointer-events-none" />

            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-slate-50 via-slate-50/65 to-transparent dark:from-slate-950 dark:via-slate-950/65 pointer-events-none" />
        </div>
    );
}
