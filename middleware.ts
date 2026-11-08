import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from '@/types';

function decodeJWT(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const authRoutes = ['/login', '/register', '/reset-password', '/forgot-password', '/verify'];

    const isAuthRoute = authRoutes.some(r => pathname === r || pathname.startsWith(`${r}?`));
    const isAdminRoute = pathname.startsWith('/admin');
    const isHrRoute = pathname.startsWith('/hr');
    const isApplicantRoute = pathname.startsWith('/applicant');

    const isProtected = isAdminRoute || isHrRoute || isApplicantRoute;

    const payload = token ? decodeJWT(token) : null;
    const isTokenValid = !!payload && (!payload.exp || payload.exp * 1000 > Date.now());

    // Token hỏng hoặc hết hạn: xoá cookie và coi như chưa đăng nhập,
    // tránh vào trang bảo vệ rồi mới bị API trả 401 liên tục
    if (token && !isTokenValid) {
        const response = isProtected
            ? NextResponse.redirect(new URL('/login', request.url))
            : NextResponse.next();
        response.cookies.delete('token');
        return response;
    }

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token) {
        const role = payload?.role || UserRole.APPLICANT;

        if (isAuthRoute) {
            if (role === UserRole.ADMIN) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            if (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) return NextResponse.redirect(new URL('/hr/dashboard', request.url));
            return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
        }

        if (role === UserRole.ADMIN) {
            if (isHrRoute || isApplicantRoute) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.next();
        }

        if (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) {
            if (isAdminRoute || isApplicantRoute) {
                return NextResponse.redirect(new URL('/hr/dashboard', request.url));
            }
            return NextResponse.next();
        }

        if (role === UserRole.APPLICANT) {
            if (isAdminRoute || isHrRoute) {
                return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
            }
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};