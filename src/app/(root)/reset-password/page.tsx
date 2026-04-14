'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaCheckCircle, FaEye, FaEyeSlash, FaLock, FaShieldAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import usePasswordState from '../../../hooks/usePasswordState';

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

export default function ResetPassword() {
    const params = useSearchParams();
    const router = useRouter();
    const token = params.get('token');
    const { showPassword, setShowPassword } = usePasswordState()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<ResetPasswordFormData>();

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            Swal.fire({
                title: 'Invalid Link!',
                text: 'Reset token is missing or invalid.',
                icon: 'error',
            });
            return;
        }

        if (data.password !== data.confirmPassword) {
            Swal.fire({
                title: 'Error!',
                text: 'Passwords do not match.',
                icon: 'error',
            });
            return;
        }

        try {
            const res = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: data.password,
                }),
            });

            const result = await res.json();

            Swal.fire({
                title: result.success ? 'Success!' : 'Error!',
                text: result.message,
                icon: result.success ? 'success' : 'error',
            }).then(() => {
                if (result.success) {
                    router.push('/login');
                }
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong. Please try again.',
                icon: 'error',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50/50">
            <div className="bg-white shadow-[0_25px_60px_rgba(13,148,136,0.06)] rounded-[3rem] p-8 md:p-14 w-full max-w-lg border border-slate-100">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <FaShieldAlt className="text-2xl" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        Secure <span className="text-teal-600 italic">Reset</span>
                    </h2>
                    <p className="text-slate-500 mt-3 text-base font-medium">
                        Almost there! Create a strong new password for your account.
                    </p>
                </div>
                {/* Form Section */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                            <FaLock className="text-[10px]" /> New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Minimum 6 characters required' }
                                })}
                                className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-5 focus:bg-white outline-none transition-all duration-300 font-bold text-slate-700 ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-slate-100 focus:border-teal-500'}`}
                            />

                            <button onClick={() => setShowPassword(!showPassword)} type='button'
                                className='absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-lg cursor-pointer' aria-label=
                                {showPassword ? "Hide password" : "Show password"}>
                                {!showPassword ? <FaEye className="text-lg" /> : <FaEyeSlash
                                    className="text-lg" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs font-bold ml-2 animate-pulse">{errors.password.message as string}</p>}
                    </div>
                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                            <FaCheckCircle className="text-[10px]" /> Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (val: string) => {
                                    if (watch('password') !== val) {
                                        return "Passwords do not match";
                                    }
                                },
                            })}
                            className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-5 focus:bg-white outline-none transition-all duration-300 font-bold text-slate-700 ${errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-slate-100 focus:border-teal-500'}`}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs font-bold ml-2 animate-pulse">{errors.confirmPassword.message as string}</p>}
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-teal-700 active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-slate-900/20 mt-4 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Updating...
                            </>
                        ) : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}