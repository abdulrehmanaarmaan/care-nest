'use client'
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthButton from '../../components/auth/AuthButton';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import usePasswordState from '../../../hooks/usePasswordState';
import { login } from '../../server/actions/auth';

interface LoginForm {
    email: string;
    password: string;
};

const Login = () => {

    const { handleSubmit, register, setError, clearErrors, formState: { isSubmitting, errors } } = useForm<LoginForm>();

    const params = useSearchParams()

    const callbackUrl = params.get('callbackUrl') || '/'

    const { showPassword, setShowPassword } = usePasswordState()

    // const currentPath = usePathname()

    const router = useRouter()

    const { status, data } = useSession()
    const { name, email } = data?.user || {}

    useEffect(() => {
        if (status === "authenticated") {
            // Use REPLACE, not PUSH. This overwrites the 'Login' entry 
            // in the browser history with the 'Home' entry.
            router.replace('/');
        }
    }, [status, router]);

    // const [setError, errors] = useState({})

    // 1. If loading, show NOTHING or a SKELETON
    if (status === "loading") {
        return <div className="min-h-screen bg-slate-50" />;
    }

    // 2. If authenticated, return null so the form never flashes
    if (status === "authenticated") {
        return null;
    }

    const loginWithCredentials = async user => {

        try {
            clearErrors()

            const result = await login(user);

            if (!result.success) {
                setError(result.field, {
                    type: "manual",
                    message: result.message
                });
                return;
            }

            else {

                const response: any = await signIn("credentials", { ...user, redirect: false, callbackUrl: callbackUrl })

                if (!response.error) {

                    localStorage.setItem('userData', JSON.stringify({ name: name, email: email }))

                    Swal.fire({
                        title: "Logged In!",
                        text: "Welcome back.",
                        icon: "success",
                        timer: 1400,
                    })
                        .then(() => {
                            router.replace(callbackUrl)
                            router.refresh()
                            // router.refresh()
                        })
                }
            }
        }
        catch {
            setError("root", {
                type: "manual",
                message: "Invalid credentials"
            });
        }
    }
    // router.replace(`${callbackURL}?login=success`)
    // router.replace(currentPath) // clean URL after dismiss
    // sessionStorage.setItem()
    // router.push(`${callbackURL ? callbackURL : '/'}?login=success`)


    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50/50">
            <div className="bg-white shadow-[0_25px_60px_rgba(13,148,136,0.06)] rounded-[3rem] p-8 md:p-14 w-full max-w-lg border border-slate-100">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <FaLock className="text-2xl" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        Welcome <span className="text-teal-600 italic">Back</span>
                    </h2>
                    <p className="text-slate-500 mt-3 text-base font-medium">
                        Access your secure Care Nest dashboard
                    </p>
                </div>
                {/* Social Login Button */}
                <div className="mb-8">
                    <AuthButton />
                </div>
                {/* Modern Divider */}
                <div className="relative flex items-center mb-10">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                        Or Secure Sign In
                    </span>
                    <div className="flex-grow border-t border-slate-100"></div>
                </div>
                {/* Form Section */}
                <form className="space-y-6" onSubmit={handleSubmit(loginWithCredentials)}>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                            <FaEnvelope className="text-[10px]" /> Email Address
                        </label>
                        <input
                            type="email"
                            autoComplete="email"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-300 font-bold text-slate-700"
                            placeholder="name@example.com"
                            {...register('email', { required: true })}
                        />

                        {errors.email && (
                            <div className="mt-2 ml-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                <p className="text-xs font-semibold text-rose-600">
                                    {errors.email.message}
                                </p>
                            </div>
                        )}

                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FaLock className="text-[10px]" /> Password
                            </label>
                            <Link href="/forgot-password" className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors underline-offset-4 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                        <div className='relative'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-300 font-bold text-slate-700"
                                placeholder="••••••••"
                                {...register('password', { required: true })}
                            />

                            {errors.password && (
                                <div className="mt-2 ml-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                    <p className="text-xs font-semibold text-rose-600">
                                        {errors.password.message}
                                    </p>
                                </div>
                            )}

                            <button onClick={() => setShowPassword(!showPassword)} type='button' className='absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-lg cursor-pointer' aria-label={showPassword ? "Hide password" : "Show password"}>
                                {!showPassword ? <FaEye className="text-lg" /> : <FaEyeSlash className="text-lg" />}
                            </button>
                        </div>
                    </div>

                    {errors.root && (
                        <div className="mb-2 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700 flex items-start gap-2">
                            <span className="mt-1 w-2 h-2 rounded-full bg-rose-500"></span>
                            <span>{errors.root.message}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-teal-700 active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-slate-900/20 mt-4 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Verifying...
                            </>
                        ) : 'Sign In to Account'}
                    </button>
                </form>
                {/* Footer Section */}
                <div className="mt-12 text-center">
                    <p className="text-slate-600 font-bold">
                        New to Care Nest?{' '}
                        <Link
                            href={`/registration${callbackUrl ? `?callbackUrl=${callbackUrl}` : '/'}`}
                            className="font-black text-teal-600 hover:text-teal-700 underline-offset-8 hover:underline decoration-2 transition-all"
                        >
                            Create Free Account
                        </Link>
                    </p>
                </div>
            </div >
        </div >
    );
}


export default Login;