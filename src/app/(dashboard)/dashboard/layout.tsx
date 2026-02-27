import Link from 'next/link';
import React from 'react';
import '../../globals.css'

const Dashboard = ({ children }) => {

    const navItems = [];
    return (
        <body>
            <div className="flex min-h-screen bg-slate-50">
                {/* Fixed Sidebar for Desktop */}
                <aside className="hidden md:flex w-72 flex-col bg-white border-r border-slate-200">
                    <div className="p-8">
                        <Link href="/" className="text-2xl font-extrabold text-teal-600 tracking-tight">
                            Care Nest
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-4 py-3 text-sm font-semibold text-slate-600 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all duration-200 group"
                            >
                                <span className="mr-3 text-lg group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Quick Actions */}
                    <div className="p-4 border-t border-slate-100">
                        <button className="flex items-center w-full px-4 py-3 text-sm font-semibold text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                            <span className="mr-3 text-lg">🚪</span>
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Top Header / Navbar */}
                    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
                        <div className="md:hidden">
                            {/* Mobile Logo */}
                            <span className="text-xl font-bold text-teal-600">Care Nest</span>
                        </div>

                        <div className="hidden md:block">
                            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                                Dashboard / <span className="text-slate-900 capitalize">Internal Portal</span>
                            </h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900">User Name</p>
                                <p className="text-xs text-slate-500">Premium Member</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-teal-500 flex items-center justify-center text-teal-700 font-bold">
                                U
                            </div>
                        </div>
                    </header>

                    {/* Dynamic Page Content */}
                    <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
                        {children}
                    </main>
                </div>
            </div>
        </body>
    );
};

export default Dashboard;