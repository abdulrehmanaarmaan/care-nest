'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaArrowLeft, FaExclamationTriangle, FaHome } from 'react-icons/fa';
import '../app/globals.css'
import Navbar from './components/navbar/Navbar';
import Footer from './components/Footer';
import NextAuthProvider from '../providers/NextAuthProvider';

const NotFound = () => {

    const router = useRouter()

    return (
        <NextAuthProvider>
            <Navbar />
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-24 bg-slate-50/30">
                <div className="max-w-xl w-full text-center">
                    {/* Visual Element */}
                    <div className="relative mb-12">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[12rem] md:text-[16rem] font-black text-slate-100 select-none">
                                404
                            </span>
                        </div>
                        <div className="relative pt-12">
                            <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-600/5 border border-teal-100 animate-bounce">
                                <FaExclamationTriangle className="text-4xl" />
                            </div>
                        </div>
                    </div>
                    {/* Content Section */}
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                            Page <span className="text-teal-600 italic">Not Found</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-md mx-auto leading-relaxed mb-10">
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-black rounded-2xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.97] transition-all duration-300 shadow-sm group cursor-pointer"
                            >
                                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                                Go Back
                            </button>
                            <Link
                                href="/"
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-teal-700 active:scale-[0.97] transition-all duration-300 shadow-xl shadow-slate-900/10 group"
                            >
                                <FaHome className="text-lg" />
                                Return Home
                            </Link>
                        </div>
                    </div>
                    {/* Subtle Branding */}
                    <div className="mt-16 pt-8 border-t border-slate-200/60 max-w-[200px] mx-auto">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                            Care Nest Support
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </NextAuthProvider>
    );
};

export default NotFound;