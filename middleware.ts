import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect /admin routes (basePath is handled automatically by Next.js in matcher, 
    // but request.nextUrl.pathname might or might not include it depending on context. 
    // Usually it DOES NOT include basePath in middleware).
    if (path.startsWith('/admin')) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: 'next-auth.session-token', // Explicitly look for this
        });

        console.log('Middleware Debug:', {
            path,
            hasToken: !!token,
            cookies: request.cookies.getAll().map(c => c.name),
            url: request.url
        });

        if (!token) {
            const url = new URL('/tienda/auth/signin', request.url);
            url.searchParams.set('callbackUrl', request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
};
