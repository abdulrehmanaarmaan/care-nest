'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaEnvelope, FaKey } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();

    const sendResetEmail = async (data: any) => {
        const res = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        Swal.fire({
            title: result.success ? 'Success!' : 'Error!',
            text: result.message,
            icon: result.success ? 'success' : 'error',
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50/50">
            <div className="bg-white shadow-[0_25px_60px_rgba(13,148,136,0.06)] rounded-[3rem] p-8 md:p-14 w-full max-w-lg border border-slate-100">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <FaKey className="text-2xl" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        Forgot <span className="text-teal-600 italic">Password?</span>
                    </h2>
                    <p className="text-slate-500 mt-3 text-base font-medium">
                        No worries! Enter your email and we'll send you a recovery link.
                    </p>
                </div>
                {/* Form Section */}
                <form onSubmit={handleSubmit(sendResetEmail)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                            <FaEnvelope className="text-[10px]" /> Recovery Email
                        </label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            {...register('email', { required: true })}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-300 font-bold text-slate-700"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-teal-700 active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-slate-900/20 mt-4 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Sending Link...
                            </>
                        ) : 'Send Reset Instructions'}
                    </button>
                </form>
                {/* Footer Section */}
                <div className="mt-12 text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 font-black text-slate-400 hover:text-teal-600 transition-all group"
                    >
                        <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}