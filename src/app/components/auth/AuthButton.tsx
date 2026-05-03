import { signIn, useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AuthButton = () => {

    const currentPath = usePathname()

    // const router = useRouter()

    const params = useSearchParams()

    const callbackUrl = params.get('callbackUrl') || '/'

    // const { status } = useSession()

    // consolele.log(status)

    // console.log(currentPath.slice(1))

    const googleLogin = async () => {
        signIn("google", { callbackUrl: callbackUrl })
        // console.log(authResponse)

        // if (authResponse?.error) {
        // Swal.fire({
        // title: 'Failed!',
        // text: 'Failed to login',
        // icon: 'error'
        // })
        // }

        // if (serverResponse?.user) {
        // Swal.fire({
        // title: 'Logged In!',
        // text: 'Successfully logged in',
        // icon: 'success'
        // }).then(() => { router.push(callbackURL) })
        // }
    }

    return (
        <button
            onClick={googleLogin}
            className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm active:scale-[0.99] cursor-pointer"
        >
            <FaGoogle className="text-2xl" />
            {currentPath === '/registration' ? 'Sign up with Google' : 'Continue with Google'}
        </button>
    );
};

export default AuthButton;