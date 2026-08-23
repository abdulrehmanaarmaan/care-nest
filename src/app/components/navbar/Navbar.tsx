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
        <nav className="relative w-full bg-white border-b border-slate-100 sticky top-0 z-50 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">

                {/* Logo Section */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
                >
                    <div className="bg-teal-50 p-2 rounded-xl group-hover:bg-teal-100/80 transition-colors">
                        <HeartHandshake className="text-teal-600 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                        Care<span className="text-teal-600">Nest</span>
                    </h1>
                </Link>

                {/* Desktop Main Navigation */}
                <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-600">
                    {navLinks}
                </ul>

                {/* Desktop Auth Section */}
                <div className="hidden lg:flex items-center gap-4 shrink-0">
                    {status === "loading" ? (
                        <div className="h-10 w-28 bg-slate-100 animate-pulse rounded-full" />
                    ) : status === "authenticated" ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-3 p-1.5 pl-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 active:scale-[0.98]"
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="true"
                            >
                                {profile_image ? (
                                    <Image
                                        src={profile_image}
                                        alt="User Avatar"
                                        width={32}
                                        height={32}
                                        className="rounded-full object-cover ring-2 ring-white w-8 h-8 shrink-0"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs ring-2 ring-white shrink-0">
                                        {name ? name.charAt(0).toUpperCase() : <User size={16} />}
                                    </div>
                                )}
                                <span className="text-xs font-bold text-slate-700 max-w-[110px] truncate">
                                    {name?.split(" ")[0]}
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* Floating Profile Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                                        <p className="text-xs font-bold text-slate-900 truncate">{name}</p>
                                        <p className="text-[11px] font-medium text-slate-400 capitalize">{role || 'User'} Account</p>
                                    </div>

                                    <div className="space-y-0.5">
                                        {quickLinks.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50/70 hover:text-teal-600 transition-colors"
                                            >
                                                {item.icon}
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                handleSignOut();
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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
                            className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-700 active:scale-[0.98] transition-all shadow-md shadow-teal-600/15"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle Button */}
                <div className="lg:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Toggle Navigation"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Backdrop & Drawer */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-900/60 lg:hidden z-40 transition-opacity duration-200 touch-none"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    <div
                        className="absolute top-full left-0 right-0 w-full lg:hidden bg-white border-b border-slate-200/90 px-5 pt-4 pb-8 shadow-2xl rounded-b-3xl animate-in slide-in-from-top-2 duration-200 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto"
                        style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
                    >
                        {status === "authenticated" && (
                            <div className="flex items-center gap-3.5 p-3.5 mb-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                {profile_image ? (
                                    <Image
                                        src={profile_image}
                                        alt="User Avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover shrink-0 w-10 h-10 ring-2 ring-teal-500/20"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0 ring-2 ring-teal-500/20">
                                        {name ? name.charAt(0).toUpperCase() : <User size={20} />}
                                    </div>
                                )}
                                <div className="overflow-hidden min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
                                    <p className="text-xs text-slate-500 font-medium capitalize">{role || 'User'} Account</p>
                                </div>
                            </div>
                        )}

                        <ul className="flex flex-col gap-1 text-center font-semibold text-slate-700">
                            {navLinks}
                        </ul>

                        <div className="flex flex-col gap-3 mt-5 border-t border-slate-100 pt-5">
                            {status === "authenticated" ? (
                                <>
                                    {quickLinks.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 active:scale-[0.99] transition-all min-h-[44px]"
                                        >
                                            {item.icon}
                                            {item.name}
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleSignOut();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 active:scale-[0.99] transition-all cursor-pointer min-h-[44px]"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 active:scale-[0.99] transition-all shadow-md shadow-teal-600/15 min-h-[44px] flex items-center justify-center"
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