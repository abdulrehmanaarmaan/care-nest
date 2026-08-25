'use client'
import { CalendarCheck, ChevronDown, HeartHandshake, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import NavLink from './NavLink';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import useSignOutHandler from '../../../hooks/useSignOutHandler';
import Image from 'next/image';
import useUserData from '../../../hooks/useUserData';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { status } = useSession();
    const { user } = useUserData();
    const { name, profile_image, role } = user || {};

    const handleSignOut = useSignOutHandler();

    // Determine the user's primary dashboard entry point
    const getDashboardHref = () => {
        if (role === 'admin') return '/dashboard/admin';
        if (role === 'caregiver') return '/dashboard/caregiver';
        return '/dashboard';
    };

    // Trimmed essential dropdown items
    const quickLinks = [
        {
            name: 'Dashboard',
            href: getDashboardHref(),
            icon: <LayoutDashboard size={16} />,
        },

        ...(role === 'user'
            ? [
                {
                    name: 'My Bookings',
                    href: '/dashboard/my-bookings',
                    icon: <CalendarCheck size={16} />,
                },
            ]
            : []),

        {
            name: 'Profile',
            href: '/dashboard/profile',
            icon: <User size={16} />,
        },
    ];

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = (
        <>
            <li><NavLink href="/">Home</NavLink></li>
            <li><NavLink href="/caregivers">Find Caregivers</NavLink></li>
            <li><NavLink href="/services">Services</NavLink></li>
            <li><NavLink href="/become-a-caregiver">Become a Caregiver</NavLink></li>
            <li><NavLink href="/about">About</NavLink></li>
        </>
    );

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md select-none transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">

                {/* ================= LOGO SECTION ================= */}
                <Link
                    href="/"
                    className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.01] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-2xl"
                >
                    <div className="bg-teal-50 border border-teal-100/80 p-2.5 rounded-2xl group-hover:bg-teal-600 group-hover:border-teal-600 transition-all duration-300 shadow-xs">
                        <HeartHandshake className="text-teal-600 w-5 h-5 sm:w-6 sm:h-6 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        Care<span className="text-teal-600">Nest</span>
                    </h1>
                </Link>

                {/* ================= DESKTOP MAIN NAVIGATION ================= */}
                <ul className="hidden lg:flex items-center gap-2.5 xl:gap-10 text-sm font-bold text-slate-600">
                    {navLinks}
                </ul>

                {/* ================= DESKTOP AUTH SECTION ================= */}
                <div className="hidden lg:flex items-center gap-4 shrink-0">
                    {status === "loading" ? (
                        <div className="h-11 w-32 bg-slate-100 animate-pulse rounded-2xl" />
                    ) : status === "authenticated" ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-3 p-1.5 pl-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 active:scale-[0.98] shadow-xs"
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="true"
                            >
                                {profile_image ? (
                                    <Image
                                        src={profile_image}
                                        alt="User Avatar"
                                        width={36}
                                        height={36}
                                        className="rounded-xl object-cover ring-2 ring-white w-9 h-9 shrink-0 shadow-xs"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shrink-0 shadow-xs">
                                        {name ? name.charAt(0).toUpperCase() : <User size={18} />}
                                    </div>
                                )}
                                <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate">
                                    {name?.split(" ")[0]}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`text-slate-400 transition-transform duration-300 mr-1 ${isDropdownOpen ? "rotate-180 text-teal-600" : ""
                                        }`}
                                />
                            </button>

                            {/* Floating Profile Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-900/10 p-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                                    <div className="px-3.5 py-3 border-b border-slate-100 mb-1.5 bg-slate-50/70 rounded-2xl">
                                        <p className="text-xs font-extrabold text-slate-900 truncate">{name}</p>
                                        <span className="inline-block mt-0.5 text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                                            {role || 'User'} Account
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        {quickLinks.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50/80 hover:text-teal-700 transition-all duration-200"
                                            >
                                                <span className="text-teal-600">{item.icon}</span>
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-100 mt-2 pt-1.5">
                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                handleSignOut();
                                            }}
                                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-teal-600 text-white px-7 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-teal-600/25 hover:bg-teal-700 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* ================= MOBILE TOGGLE BUTTON ================= */}
                <div className="lg:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 hover:bg-slate-100 active:scale-[0.96] transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 min-h-44px min-w-44px flex items-center justify-center shadow-xs cursor-pointer"
                        aria-label="Toggle Navigation"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={22} className="text-teal-600" /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* ================= MOBILE MENU BACKDROP & DRAWER ================= */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs lg:hidden z-40 transition-opacity duration-300 touch-none"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Target Container Inserted Here */}
                    <div
                        className="absolute top-full left-0 right-0 w-full lg:hidden bg-white border-b border-slate-200/80 px-6 pt-5 pb-8 shadow-2xl rounded-b-[2.5rem] animate-in slide-in-from-top-2 duration-300 z-50 max-h-[calc(100dvh-4.5rem)] overflow-y-auto"
                        style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
                    >
                        {status === "authenticated" && (
                            <div className="flex items-center gap-4 p-4 mb-6 bg-slate-50 border border-slate-100 rounded-2xl shadow-xs">
                                {profile_image ? (
                                    <Image
                                        src={profile_image}
                                        alt="User Avatar"
                                        width={44}
                                        height={44}
                                        className="rounded-xl object-cover shrink-0 w-11 h-11 ring-2 ring-teal-500/20"
                                    />
                                ) : (
                                    <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0 ring-2 ring-teal-500/20">
                                        {name ? name.charAt(0).toUpperCase() : <User size={20} />}
                                    </div>
                                )}
                                <div className="overflow-hidden min-w-0">
                                    <p className="text-sm font-extrabold text-slate-900 truncate">{name}</p>
                                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                                        {role || 'User'} Account
                                    </span>
                                </div>
                            </div>
                        )}

                        <ul className="flex flex-col gap-2 font-bold text-slate-700">
                            {navLinks}
                        </ul>

                        <div className="flex flex-col gap-3 mt-6 border-t border-slate-100 pt-6">
                            {status === "authenticated" ? (
                                <>
                                    {quickLinks.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="w-full flex items-center justify-center gap-3 py-3.5 bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm border border-slate-100 hover:bg-slate-100 active:scale-[0.99] transition-all min-h-[48px]"
                                        >
                                            <span className="text-teal-600">{item.icon}</span>
                                            {item.name}
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleSignOut();
                                        }}
                                        className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-red-50 text-red-600 rounded-2xl font-bold text-sm border border-red-100 hover:bg-red-100 active:scale-[0.99] transition-all cursor-pointer min-h-[48px]"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center py-3.5 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 active:scale-[0.99] transition-all shadow-lg shadow-teal-600/25 min-h-[48px] flex items-center justify-center"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;