import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const privateRoutes = ['/booking', '/dashboard/my-bookings']

const authRoutes = ['/login', '/registration', '/forgot-password', '/reset-password']

export default async function proxy(req) {

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    })

    const currentRoute = req.nextUrl.pathname

    const isAuthenticated = Boolean(token)

    const isPrivateRoute = privateRoutes.some(route => currentRoute.startsWith(route))

    const isAuthRoute = authRoutes.some(route => currentRoute.startsWith(route))

    if (!isAuthenticated && isPrivateRoute) {
        return NextResponse.redirect(new URL(`/login?callbackUrl=${currentRoute}`, req.url))
    }
    console.log(isAuthenticated, 'auth validator', isAuthRoute)
    if (isAuthenticated && isAuthRoute) {
        // const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/'
        const destination = new URL('/', req.url)
        return NextResponse.redirect(destination)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/booking/:path*', '/dashboard/my-bookings/:path*', '/login', '/registration', '/forgot-password', '/reset-password'],
}