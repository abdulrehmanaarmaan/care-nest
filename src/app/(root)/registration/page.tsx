'use client'
import React from 'react';
import Swal from 'sweetalert2';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { signUp } from '../../server/actions/auth';
import AuthButton from '../../components/auth/AuthButton';
import usePasswordState from '../../../hooks/usePasswordState';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';

interface RegistrationForm {
    email: string;
    name: string;
    password: string;
    phone: string
}

const Registration = () => {

    const { register, handleSubmit, setError, clearErrors, formState: { isSubmitting, errors } } = useForm<RegistrationForm>();

    const { showPassword, setShowPassword } = usePasswordState()

    const params = useSearchParams()

    const callbackUrl = params.get('callbackUrl') || '/'

    const router = useRouter()

    // const currentPath = usePathname()

    const { data } = useSession()
    const { name, email } = data?.user || {}

    // if (status === 'authenticated') {
    // Swal.fire({
    // title: 'Logged In!',
    // text: 'Successfully logged in',
    // icon: 'success'
    // router.replace('/')
    // }
    // }

    // if (status === 'authenticated') {
    // Swal.fire({
    // title: 'Logged In!',
    // text: 'Successfully logged in',
    // icon: 'success'
    // }).then(() => router.push(callbackURL))
    // }

    const createAccount = async (user: any) => {

        try {
            clearErrors()

            const serverResponse = await signUp(user);

            if (!serverResponse?.success) {
                setError(serverResponse?.field, {
                    type: "manual",
                    message: serverResponse.message
                }
                )
            }
            else {

                const authResponse: any = await signIn("credentials", { ...user, redirect: false })

                console.log(authResponse)

                if (authResponse?.ok) {
                    localStorage.setItem('userData', JSON.stringify({ name: name, email: email }))
                    Swal.fire({
                        title: "Welcome!",
                        text: "Account created successfully",
                        icon: "success"
                    })
                        .then(() => {
                            router.replace(callbackUrl)
                            // router.push(callbackUrl)
                            router.refresh()
                        })
                }
            }
        }
        catch {
            setError("root", {
                type: "server",
                message:
                    "We couldn't create your account right now. Please try again."
            });
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50/50">
            <div className="bg-white shadow-[0_20px_50px_rgba(13,148,136,0.05)] rounded-[2.5rem] p-8 md:p-14 w-full max-w-2xl border border-slate-100">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-teal-600 uppercase bg-teal-50 rounded-full">
                        Join our community
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                        Create Your <span className="text-teal-600">Care Nest</span> Account
                    </h2>
                    <p className="text-slate-500 text-base max-w-sm mx-auto">
                        Start your journey toward trusted care and professional support today.
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit(createAccount)}>
                    {/* Input Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Abdul Rehman"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-400"
                                {...register('name', { required: true })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-400
                                    ${errors.email
                                        ? "border-rose-300 bg-rose-50/40 focus:ring-rose-500/10 focus:border-rose-400"
                                        : "border-slate-200 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white"
                                    }`}
                                {...register('email', { required: true })}
                            />

                            {errors.email && (
                                <div className="mt-2 flex items-center gap-2 px-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />

                                    <p className="text-sm font-medium text-rose-700">
                                        {errors.email.message}
                                    </p>
                                </div>
                            )}

                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Contact Number</label>
                            <input
                                type="tel"
                                inputMode="tel"
                                pattern="[0-9+ ]*"
                                placeholder="+880 1XXX-XXXXXX"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-400"
                                {...register('phone', { required: true })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Create Password</label>
                            <div className='relative'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-400"
                                    {...register('password', { required: true })}
                                />
                                <button onClick={() => setShowPassword(!showPassword)} type='button' className='absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-lg cursor-pointer' aria-label={showPassword ? "Hide password" : "Show password"}>
                                    {!showPassword ? <FaEye className="text-lg" /> : <FaEyeSlash className="text-lg" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {errors.root && <div
                        className=" mt-1 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700"
                    >
                        <span className="mt-1 h-2 w-2 rounded-full bg-rose-500 shrink-0" />

                        <span>
                            {errors.root.message}
                        </span>
                    </div>}

                    {/* Action Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 active:scale-[0.99] transition-all duration-300 shadow-xl shadow-teal-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Processing...
                                </>
                            ) : 'Create Account'}
                        </button>
                    </div>
                </form>
                {/* Social Login Divider */}
                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200"></span>
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                        <span className="bg-white px-4 text-slate-400 font-medium tracking-widest">Or continue with</span>
                    </div>
                </div>
                {/* Google Login Button */}
                <AuthButton />
                {/* Footer Link */}
                <div className="mt-10 text-center">
                    <p className="text-slate-600 font-medium">
                        Already part of the nest?{' '}
                        <a href="/login" className="font-bold text-teal-600 hover:text-teal-700 underline-offset-8 hover:underline decoration-2 transition-all">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;

