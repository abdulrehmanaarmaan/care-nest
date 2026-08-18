import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { auth } from './lib/authOptions';

const privateRoutes = ['/booking', '/dashboard']

const authRoutes = ['/login', '/registration', '/forgot-password', '/reset-password']

export default auth(async (req) => {

    const { searchParams } = new URL(req.url)

    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    })

    console.log({
        token,
        secretExists: !!process.env.NEXTAUTH_SECRET,
    })

    const currentRoute = req.nextUrl.pathname

    const isAuthenticated = !!req.auth

    const isPrivateRoute = privateRoutes.some(route => currentRoute.startsWith(route))

    const isAuthRoute = authRoutes.some(route => currentRoute.startsWith(route))

    if (!isAuthenticated && isPrivateRoute) {
        return NextResponse.redirect(new URL(`/login?callbackUrl=${currentRoute}`, req.url))
    }
    console.log(isAuthenticated, 'auth validator', isAuthRoute)
    if (isAuthenticated && isAuthRoute) {
        // const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/'
        const destination = new URL(callbackUrl, req.url)
        return NextResponse.redirect(destination)
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/booking/:path*', '/dashboard/:path*', '/login', '/registration', '/forgot-password', '/reset-password'],
}