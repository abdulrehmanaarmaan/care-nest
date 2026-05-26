'use client'
import Link from 'next/link';
import React from 'react';
import { FaArrowRight, FaBookmark, FaCoins, FaExclamationCircle, FaFileSignature, FaHandshake, FaShieldAlt, FaTasks, FaUsers } from 'react-icons/fa';
import useUsersData from '../../../hooks/useUsersData';
import useCaregiversData from '../../../hooks/useCaregiversData';
import { useQuery } from '@tanstack/react-query';

const Admin = () => {

    const { users } = useUsersData()

    const { caregivers } = useCaregiversData()

    const { data: applications = [] } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await fetch('/api/applications?status=pending')
            return res.json()
        }
    })

    // Aggregated ledger stats tracking the database state instances
    const adminStats = {
        totalUsers: 2350,
        totalCaregivers: 130,
        pendingApplications: 18,
        todaysBookings: 42,
        revenueBDT: 450000,
        openComplaints: 3
    };

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* ROUTE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.15em] text-rose-700 uppercase">
                        <span>Root Administration</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>Platform Terminal</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        System Control Panel
                    </h1>
                    <p className="text-slate-400 text-xs font-medium">
                        Global monitoring matrix, governance tools, and core system state configurations.
                    </p>
                </div>
            </div>

            {/* METRICS INDEX GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
                {[
                    { label: 'Total Users', value: users.length, icon: <FaUsers />, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Caregivers', value: caregivers.length, icon: <FaHandshake />, color: 'text-teal-600 bg-teal-50' },
                    { label: 'Pending Apps', value: applications.length, icon: <FaFileSignature />, color: 'text-amber-600 bg-amber-50', highlight: true },
                    { label: "Today's Jobs", value: adminStats.todaysBookings, icon: <FaBookmark />, color: 'text-indigo-600 bg-indigo-50' },
                    { label: 'Revenue BDT', value: `৳${adminStats.revenueBDT.toLocaleString()}`, icon: <FaCoins />, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Complaints', value: adminStats.openComplaints, icon: <FaExclamationCircle />, color: 'text-rose-600 bg-rose-50' },
                ].map((stat, i) => (
                    <div key={i} className={`bg-white border border-slate-200 rounded-3xl p-5 shadow-[0_12px_30px_rgba(15,23,42,0.01)] flex flex-col justify-between relative overflow-hidden ${stat.highlight ? 'ring-2 ring-amber-500/20 border-amber-200' : ''}`}>
                        <div className={`w-7 h-7 rounded-lg ${stat.color} flex items-center justify-center text-xs font-bold`}>
                            {stat.icon}
                        </div>
                        <div className="mt-4 space-y-0.5">
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* PRIMARY ADMINISTRATIVE ROUTERS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Management Gateways Module */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_30px_rgba(15,23,42,0.01)] space-y-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center gap-2">
                        <FaTasks size={12} className="text-teal-600" /> Administrative Gateway Routers
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { title: 'Review Applications', path: '/dashboard/admin/caregiver-applications', desc: 'Process structural onboarding credentials.' },
                            { title: 'Manage Caregivers', path: '/dashboard/admin/caregivers', desc: 'Handle verification, suspension, & edits.' },
                            { title: 'Booking Logs', path: '/dashboard/admin/bookings', desc: 'Audit state flows of scheduling pipelines.' },
                            { title: 'System Reports', path: '/dashboard/admin/analytics', desc: 'View growth factors and revenue channels.' }
                        ].map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.path}
                                className="group border border-slate-100 bg-slate-50/50 hover:bg-slate-900 hover:border-slate-900 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between text-left cursor-pointer"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-black text-slate-800 group-hover:text-white transition-colors">{link.title}</span>
                                    <FaArrowRight size={8} className="text-slate-400 group-hover:text-teal-400 transition-colors" />
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium mt-1 leading-normal group-hover:text-slate-300 transition-colors">{link.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Real-time System Directives / Security Guardrails */}
                <div className="bg-slate-900 text-white rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4 max-w-md">
                        <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-teal-400">
                            <FaShieldAlt size={14} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-black tracking-tight">Active Platform Directive</h3>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed">
                                There are currently {applications.length} profiles inside the compliance queues awaiting verification validation. Unresolved high-priority logs may impact availability calculations.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Security Layer Token V2</span>
                        <span className="text-emerald-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Cluster Active
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Admin;