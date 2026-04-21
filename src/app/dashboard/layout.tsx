'use client'
import Link from 'next/link';
import React, { Suspense, useState } from 'react';
import { signOut } from 'next-auth/react';
import { FaBars, FaChevronLeft, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import UserMenu from '../components/UserMenu';
import QueryProvider from '../../providers/QueryProvider';
import DashboardLoader from './loading';
import useSignOutHandler from '../../hooks/useSignOutHandler';

const Dashboard = ({ children }) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = useSignOutHandler()

    const navItems = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'My Bookings', href: '/dashboard/my-bookings', icon: <FaClipboardList /> },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                            fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
                            md:relative md:translate-x-0
                            ${isSidebarOpen ? 'w-72' : 'w-20'}
                            ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full'}
                        `}>
                {/* Sidebar Header */}
                <div className={`p-6 mb-4 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
                    <Link href="/" className={`text-2xl font-black text-slate-900 tracking-tighter ${!isSidebarOpen && 'hidden'}`}>
                        Care<span className='text-teal-600'>Nest</span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="hidden md:flex p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
                    >
                        <FaChevronLeft className={`transition-transform duration-300 ${!isSidebarOpen && 'rotate-180'}`} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-3.5 text-sm font-bold text-slate-500 rounded-2xl hover:bg-teal-50 hover:text-teal-600 transition-all group relative"
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform">
                                {item.icon}
                            </span>
                            <span className={`ml-4 transition-opacity duration-200 ${!isSidebarOpen && 'md:hidden'}`}>
                                {item.name}
                            </span>
                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] rounded hidden group-hover:block whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Logout Section */}
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleSignOut}
                        className={`flex items-center w-full px-4 py-3.5 text-sm font-bold text-rose-500 rounded-2xl hover:bg-rose-50 transition-all cursor-pointer ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <FaSignOutAlt className="text-lg" />
                        <span className={`ml-4 ${!isSidebarOpen && 'md:hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-600"
                    >
                        <FaBars />
                    </button>

                    <div className="hidden md:block">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Portal / <span className="text-teal-600">Overview</span>
                        </h2>
                    </div>

                    {/* User Profile Info */}
                    <UserMenu />
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-10">
                    <div className="max-w-6xl mx-auto">
                        <QueryProvider>
                            <Suspense fallback={<DashboardLoader />}>
                                {children}
                            </Suspense>
                        </QueryProvider>
                    </div>
                </main>
            </div>
            {/* <Suspense fallback={null}> */}
            {/* <AuthAlert /> */}
            {/* </Suspense> */}
        </div>
    );
};

export default Dashboard;