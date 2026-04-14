'use client'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const AuthHandler = () => {
    const { status } = useSession()
    const router = useRouter()
    const params = useSearchParams()
    const currentPath = usePathname()

    const callbackURL = params.get('callbackURL')

    useEffect(() => {
        if (status !== 'authenticated') return

        // Prevent logged-in users from visiting login/registration
        if (currentPath === '/login') {
            router.push(`${callbackURL ? callbackURL : '/'}?login=success`) // replace to remove login from history
        } else if (currentPath === '/registration') {
            router.push(`${callbackURL ? callbackURL : '/'}?registration=success`) // replace to remove registration from history
        }
    }, [status, callbackURL, currentPath, router])

    return null
}

export default AuthHandler