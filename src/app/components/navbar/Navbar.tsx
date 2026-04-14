'use client'
import { HeartHandshake, LogOut, Menu, User, X } from 'lucide-react';
import React, { useState } from 'react';
import NavLink from './NavLink';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';


const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const { status, data } = useSession()

    console.log(data)

    const navLinks =
        <>
            <li><NavLink href='/dashboard/my-bookings'>My Bookings</NavLink></li>
        </>

    return (
        <nav className="w-full bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group transition-all">
                    <div className="bg-teal-50 p-1.5 rounded-lg group-hover:bg-teal-100 transition-colors">
                        <HeartHandshake className="text-teal-600" size={28} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Care<span className="text-teal-600">Nest</span>
                    </h1>
                </Link>
                {/* Desktop Menu */}
                <ul className="hidden lg:flex items-center gap-8">
                    {navLinks}
                </ul>
                {/* Auth Section */}
                <div className="hidden md:flex items-center gap-6">
                    {status === "loading" ? (
                        <div className="h-8 w-20 bg-slate-100 animate-pulse rounded-lg"></div>
                    ) : status === 'authenticated' ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                                {data ? (
                                    <img
                                        src={data?.user?.image}
                                        alt="User"
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <User size={18} className="text-slate-500" />
                                )}
                                <span className="text-xs font-bold text-slate-700">{data?.user?.name?.split(' ')[0]}</span>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition cursor-pointer"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-600/10"
                        >
                            Login
                        </Link>
                    )}
                </div>
                {/* Mobile icon */}
                <div className="lg:hidden cursor-pointer text-slate-700" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                </div>
            </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-8 absolute w-full left-0 animate-in slide-in-from-top duration-300">
                    <ul className="flex flex-col gap-6 text-center">
                        {navLinks}
                    </ul>
                    <div className="flex flex-col gap-4 mt-8 border-t border-slate-50 pt-8">
                        {status === 'authenticated' ? (
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full text-center py-4 bg-red-50 text-red-600 rounded-2xl font-bold"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="w-full text-center py-4 bg-teal-600 text-white rounded-2xl font-bold"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;