'use client'
import Link from 'next/link';
import React, { useMemo } from 'react';
import { FaArrowRight, FaCalendarDay, FaChartLine, FaCircle, FaClipboardList, FaComments, FaExclamationTriangle, FaHistory, FaHourglassHalf, FaShieldAlt, FaSyncAlt, FaTools, FaUserCircle, FaUserNurse, FaUsers, FaWallet } from 'react-icons/fa';
import useUsersData from '../../../hooks/useUsersData';
import useApplicationsData from '../../../hooks/useApplicationsData';
import useWithdrawals from '../../../hooks/useWithdrawals';
import useBookingsData from '../../../hooks/useBookingsData';
import useAvailabilitySchedules from '../../../hooks/useAvailabilitySchedules';

const Admin = () => {

    const { applications: pendingApplications } = useApplicationsData('pending')

    const { withdrawals } = useWithdrawals()

    const pendingWithdrawals = withdrawals.filter(withdrawal => withdrawal?.status === 'Pending')

    const pendingWithdrawalAmount = pendingWithdrawals?.map(withdrawal => withdrawal?.amount).reduce((acc, curr) => acc + curr, 0)

    const paidWithdrawals = withdrawals.filter(withdrawal => withdrawal?.status === 'Paid')

    const paidWithdrawalAmount = paidWithdrawals.map(withdrawal => withdrawal?.amount).reduce((acc, curr) => acc + curr, 0)

    const now = new Date();

    const paidThisMonth = paidWithdrawals.filter(withdrawal => {
        const paidAt = new Date(withdrawal?.paid_at);
        return (
            paidAt.getFullYear() === now.getFullYear() &&
            paidAt.getMonth() === now.getMonth()
        );
    })

    const earnedThisMonth = useMemo(() => paidThisMonth.map(withdrawal => withdrawal?.amount).reduce((a, b) => a + b, 0), [paidThisMonth])

    const { bookings } = useBookingsData()

    const assignedBookings = bookings.filter(booking => booking?.status === 'Assigned')

    const { users } = useUsersData()

    const caregivers = users.filter(user => user?.role === 'caregiver')

    const { schedules } = useAvailabilitySchedules()

    const availableCaregivers = caregivers.filter(caregiver => schedules.find(schedule => schedule?.caregiver_id === caregiver?._id)?.status === 'Active')

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

        <div className="space-y-8 animate-fadeIn max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-[#fcfdfd]">

            {/* ================= SECTION 1 — HEADER CONTROL PANEL ================= */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-600">
                        <FaShieldAlt /> CareNest Governance Core
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        System Control Panel
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold">
                        Global monitoring, caregiver compliance, bookings oversight, and financial governance dashboards.
                    </p>
                </div>

                {/* Meta Diagnostics Blocks */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100/70 text-emerald-700 text-[10px] font-black uppercase tracking-wider shadow-sm">
                        <FaCircle className="text-[8px] animate-pulse text-emerald-500" />
                        Platform Status: Operational
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold shadow-sm">
                        <FaSyncAlt className="text-[9px] animate-spin-slow text-slate-400" />
                        Sync: 2m ago
                    </div>
                </div>
            </div>

            {/* ================= SECTION 2 — CRITICAL INCIDENT TRIAGE ALERTS ================= */}
            <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-rose-600 px-1 flex items-center gap-1.5">
                    <FaExclamationTriangle className="animate-bounce" /> Real-Time Operational Hazards
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { count: pendingApplications.length, msg: "Caregiver verification reviews pending", path: "/admin/compliance", color: "border-amber-100/80 bg-amber-50/40 text-amber-800" },
                        { count: 3, msg: "Unresolved client complaints awaiting triage", path: "/admin/complaints", color: "border-rose-100/80 bg-rose-50/40 text-rose-800" },
                        { count: pendingWithdrawals.length, msg: "Escalated cash withdrawals pending approval", path: "/admin/finance", color: "border-teal-100/80 bg-teal-50/40 text-teal-800" },
                        { count: assignedBookings.length, msg: "Active bookings require dispatcher rescue", path: "/admin/bookings", color: "border-purple-100/80 bg-purple-50/40 text-purple-800" }
                    ].map((alert, i) => (
                        <Link href={alert.path} key={i} className={`border rounded-2xl p-4 flex items-start gap-3 transition-all hover:scale-[1.01] hover:shadow-sm ${alert.color}`}>
                            <span className="text-xl font-black tracking-tight leading-none">{alert.count}</span>
                            <div className="space-y-0.5">
                                <p className="text-[11px] font-bold leading-tight">{alert.msg}</p>
                                <span className="text-[9px] font-black uppercase tracking-wider flex items-center gap-1 opacity-80">
                                    Intercept Now <FaArrowRight className="text-[7px]" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ================= MASTER OPERATIONS DOCK SPLIT GRID ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                {/* PRIMARY HUB CORES (LEFT 3 GRID COLUMNS) */}
                <div className="lg:col-span-3 space-y-6">

                    {/* ================= SECTION 3 — METRICS MATRIX INDEX ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-2">
                            KPI Telemetry Matrices
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { title: "Total Accounts", value: users.length, trend: "+6.2%", desc: "This billing month", icon: <FaUsers />, bg: "bg-slate-50 text-slate-600" },
                                { title: "On-Duty Medics", value: availableCaregivers.length, trend: "Live", desc: "Available to book", icon: <FaUserNurse />, bg: "bg-teal-50 text-teal-600" },
                                { title: "Today's Ledger", value: "243", trend: "Active", desc: "Scheduled intervals", icon: <FaCalendarDay />, bg: "bg-blue-50 text-blue-600" },
                                { title: "Gross Volume", value: "৳4.58M", trend: "+12.3%", desc: "vs baseline month", icon: <FaChartLine />, bg: "bg-emerald-50 text-emerald-600" }
                            ].map((kpi, i) => (
                                <div key={i} className="border border-slate-50 rounded-2xl p-4 bg-slate-50/30 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] uppercase font-black tracking-wider text-slate-400">{kpi.title}</p>
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${kpi.bg}`}>{kpi.trend}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{kpi.value}</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium leading-none">{kpi.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= SECTION 5 — QUICK ACTIONS CONTROL TERMINAL ================= */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 px-1">
                            Operational Dispatch Core
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { name: "Review Applications", count: pendingApplications.length, path: "/admin/compliance", icon: <FaClipboardList /> },
                                { name: "Manage Caregivers", count: caregivers.length, path: "/admin/caregivers", icon: <FaUserNurse /> },
                                { name: "Manage Users", count: users.length, path: "/admin/users", icon: <FaUsers /> },
                                { name: "Bookings Center", count: bookings.length, path: "/admin/bookings", icon: <FaCalendarDay /> },
                                { name: "Withdrawals Queue", count: pendingWithdrawals.length, path: "/admin/withdrawals", icon: <FaWallet /> },
                                { name: "Complaints Portal", count: 3, path: "/admin/complaints", icon: <FaComments /> },
                                { name: "Deep Analytics", count: null, path: "/admin/analytics", icon: <FaChartLine /> },
                                { name: "Platform Config", count: null, path: "/admin/settings", icon: <FaTools /> }
                            ].map((act, i) => (
                                <Link href={act.path} key={i} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-teal-500/30 transition-all group flex flex-col justify-between items-start h-28">
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors flex items-center justify-center text-xs border border-slate-100">
                                        {act.icon}
                                    </div>
                                    <div className="w-full space-y-0.5">
                                        <div className="flex items-center justify-between gap-1 w-full">
                                            <span className="text-[11px] font-black text-slate-800 tracking-tight leading-tight">{act.name}</span>
                                            <FaArrowRight className="text-[8px] text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                                        </div>
                                        {act.count !== null && (
                                            <span className="inline-block text-[9px] font-extrabold text-teal-600 bg-teal-50 px-1.5 py-0.2 rounded">
                                                {act.count} Actions
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ================= SECTION 6 — CAREGIVER COMPLIANCE COMPLIANCE QUEUE ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Credential Verification Queue</h3>
                                <p className="text-[10px] text-slate-400 font-medium">Top 5 incoming provider admissions requiring file audit checks.</p>
                            </div>
                            <Link href="/admin/compliance" className="text-[10px] font-black text-teal-600 uppercase tracking-wider hover:underline flex items-center gap-1">
                                Full Queue <FaArrowRight className="text-[8px]" />
                            </Link>
                        </div>

                        {/* Responsive Matrix Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 font-black uppercase tracking-wider text-[9px]">
                                        <th className="pb-3 pl-2">Medical Specialist</th>
                                        <th className="pb-3">Submission Lock</th>
                                        <th className="pb-3">Clinical Experience</th>
                                        <th className="pb-3">Compliance Status</th>
                                        <th className="pb-3 text-right pr-2">Audits</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                                    {pendingApplications.slice(0, 5).map((application) => (
                                        <tr key={application?._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-3.5 pl-2 flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 text-[10px]">
                                                    <FaUserCircle />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-800 text-[11px]">{application?.name}</span>
                                                    <span className="text-[9px] text-slate-400 font-medium">{application?.specialization}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 text-slate-400 font-mono text-[10px]">{application?.createdAt}</td>
                                            <td className="py-3.5 text-slate-700 font-bold">{application?.experience} years</td>
                                            <td className="py-3.5">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-black uppercase tracking-wider">
                                                    <FaHourglassHalf className="text-[8px]" /> {application?.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 text-right pr-2">
                                                <Link href="/admin/compliance/audit-id" className="px-2.5 py-1 bg-slate-900 hover:bg-teal-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
                                                    Review
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ================= SECTION 9 — COMPLAINT RESOLUTION CENTER ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <div className="border-b border-slate-50 pb-2">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Patient Escalation Board</h3>
                            <p className="text-[10px] text-slate-400 font-medium">Critical patient reports requiring direct platform mediation.</p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { title: "Patient family reported late arrival", details: "Booking #BK-3821 • Home Care Assistance Service", time: "Created 2h ago", badge: "Open Incident" }
                            ].map((complaint, i) => (
                                <div key={i} className="border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                            <h4 className="text-xs font-black text-slate-800 tracking-tight">{complaint.title}</h4>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-medium">{complaint.details}</p>
                                        <p className="text-[10px] text-slate-400 font-semibold">{complaint.time}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[9px] font-black uppercase tracking-wider border border-rose-100 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md">
                                            {complaint.badge}
                                        </span>
                                        <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm">
                                            Resolve
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* RIGHT SYSTEM CONTROL PANEL SIDEBAR (1 GRID COLUMN) */}
                <div className="space-y-6">

                    {/* ================= SECTION 7 — BOOKING OPERATIONS SNAPSHOT ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-2">
                            Today's Allocations
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Completed", count: 142, color: "bg-emerald-50 text-emerald-700 border-emerald-100/60" },
                                { label: "Dispatched", count: 56, color: "bg-teal-50 text-teal-700 border-teal-100/60" },
                                { label: "Pending", count: 21, color: "bg-amber-50 text-amber-700 border-amber-100/60" },
                                { label: "Cancelled", count: 24, color: "bg-rose-50 text-rose-700 border-rose-100/60" }
                            ].map((bStat, i) => (
                                <div key={i} className={`border p-3 rounded-2xl text-center space-y-1 ${bStat.color}`}>
                                    <p className="text-[9px] uppercase font-black tracking-wider opacity-80">{bStat.label}</p>
                                    <h4 className="text-xl font-black tracking-tight leading-none">{bStat.count}</h4>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= SECTION 8 — FINANCIAL SNAPSHOT METRIC BLOCK ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-2">
                            Financial Governance
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: "Revenue Today", val: "৳18,500", primary: true },
                                { label: "Revenue This Month", val: `৳${earnedThisMonth}`, primary: false },
                                { label: "Pending Payouts Queue", val: `৳${pendingWithdrawalAmount}`, primary: false },
                                { label: "Settled Payouts", val: `৳${paidWithdrawalAmount}`, primary: false },
                                { label: "Platform Comm. (Net)", val: "৳320,000", highlight: true }
                            ].map((fin, i) => (
                                <div key={i} className={`flex items-center justify-between text-xs p-2 rounded-xl ${fin.highlight ? 'bg-teal-50/50 border border-teal-100/50' : ''}`}>
                                    <span className="text-slate-400 font-bold text-[11px]">{fin.label}</span>
                                    <span className={`font-black ${fin.primary ? 'text-slate-900 text-sm' : fin.highlight ? 'text-teal-700' : 'text-slate-700'}`}>
                                        {fin.val}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= SECTION 4 — LOGGED PLATFORM ACTIVITY LOGS ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                <FaHistory className="text-slate-400 text-[10px]" /> Audit Trace Trail
                            </h4>
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        </div>

                        <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
                            {[
                                { time: "10:35 AM", text: "Caregiver Fatima Rahman credential file approved." },
                                { time: "10:12 AM", text: "Booking #BK-3821 flagged successfully completed." },
                                { time: "09:55 AM", text: "Withdrawal settlement request routed via escrow." },
                                { time: "09:42 AM", text: "Customer service intake incident created." }
                            ].map((log, i) => (
                                <div key={i} className="flex gap-3 items-start text-[11px] relative z-10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 border-4 border-white mt-1 shrink-0 ring-1 ring-slate-100" />
                                    <div className="space-y-0.5 min-w-0">
                                        <p className="text-slate-600 font-medium leading-tight">{log.text}</p>
                                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">{log.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= SECTION 11 — GROWTH ANALYTICS VELOCITY PREVIEW ================= */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-950 rounded-[2rem] p-6 text-white space-y-4 relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 text-white/5 text-8xl pointer-events-none font-black select-none tracking-tighter">
                            DATA
                        </div>
                        <div className="border-b border-white/10 pb-2 flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Velocity Indexes</h3>
                            <span className="text-[8px] font-black text-teal-400 uppercase bg-white/10 px-1.5 py-0.2 rounded">Monthly Metrics</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Client Intake", val: "+480" },
                                { label: "Provider Adds", val: "+36" },
                                { label: "Booking Growth", val: "+18%" },
                                { label: "Gross Lift", val: "+12%" }
                            ].map((gIndex, i) => (
                                <div key={i} className="space-y-0.5">
                                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider leading-none">{gIndex.label}</p>
                                    <p className="text-base font-black text-white tracking-tight">{gIndex.val}</p>
                                </div>
                            ))}
                        </div>

                        <Link href="/admin/analytics" className="pt-2 border-t border-white/10 text-[10px] font-black text-teal-400 uppercase tracking-wider hover:underline flex items-center gap-1 w-full justify-between group">
                            <span>Inspect Platform Graphs</span>
                            <FaArrowRight className="text-[8px] group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    {/* ================= SECTION 10 — SYSTEM INTEGRITY CLUSTER ================= */}
                    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <FaTools className="text-[9px]" /> Microservice Status
                        </h4>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-wider text-slate-600">
                            {[
                                { label: "Database Engine", status: "Healthy" },
                                { label: "SSL Payment Ports", status: "Active" },
                                { label: "Twilio Gateway", status: "Active" },
                                { label: "Core API Infrastructure", status: "Online" }
                            ].map((srv, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-white border border-slate-100/70 p-2 rounded-xl">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <div className="flex flex-col truncate">
                                        <span className="text-[8px] text-slate-400 font-bold truncate leading-tight">{srv.label}</span>
                                        <span className="text-slate-800 text-[9px] mt-0.5 leading-none">{srv.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Admin;