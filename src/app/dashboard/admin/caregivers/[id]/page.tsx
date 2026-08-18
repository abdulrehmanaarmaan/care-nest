'use client'
import React from 'react';
import { FaArrowLeft, FaBan, FaBriefcase, FaCalendarAlt, FaCheckCircle, FaClock, FaDollarSign, FaDownload, FaEdit, FaEye, FaIdCard, FaListUl, FaLock, FaNotesMedical, FaRegEnvelope, FaStar, FaTrashAlt, FaUserNurse, FaUserShield } from 'react-icons/fa';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const Caregiver = ({ params }) => {

    const performanceData = [
        { month: 'Jan', earnings: 45000, jobs: 12 },
        { month: 'Feb', earnings: 52000, jobs: 15 },
        { month: 'Mar', earnings: 49000, jobs: 14 },
        { month: 'Apr', earnings: 63000, jobs: 18 },
        { month: 'May', earnings: 58000, jobs: 16 },
        { month: 'Jun', earnings: 71000, jobs: 20 },
    ];

    return (
        <div className="space-y-8 animate-fadeIn max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-[#fcfdfd]">

            {/* BACK NAVIGATION ACTION BAR */}
            <div className="flex items-center justify-between">
                <button className="text-xs font-black text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 group">
                    <FaArrowLeft className="group-hover:-translate-x-0.5 transition-transform" /> Back to Registry Console
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Caregiver ID: {params?.id || 'CG-2026-904X'}
                </span>
            </div>

            {/* ================= SECTION 1 — HEADER (EXECUTIVE SUMMARY) ================= */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Pro profile image anchor */}
                    <div className="relative group shrink-0">
                        <div className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-slate-200 shadow-sm overflow-hidden font-black text-slate-400 flex items-center justify-center text-3xl">
                            A
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 border-2 border-white rounded-full" title="System Status: Online" />
                    </div>

                    {/* Identity Stack */}
                    <div className="space-y-2 text-center sm:text-left">
                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Abdul Rehman Aarmaan</h1>
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-teal-50 border border-teal-100 text-teal-700">
                                <FaCheckCircle className="text-[10px]" /> Verified Specialist
                            </div>
                        </div>

                        <p className="text-xs font-black text-teal-600 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                            <FaUserNurse /> Senior Care Specialist
                        </p>

                        {/* Badges Dispatch Row */}
                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 pt-1">
                            <span className="px-2 py-0.5 bg-slate-900 text-white rounded-md text-[9px] font-black uppercase tracking-wider">
                                Active Status
                            </span>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[9px] font-black uppercase tracking-wider">
                                Application Approved
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 ml-1">
                                <FaCalendarAlt /> Joined June 2026
                            </span>
                        </div>
                    </div>
                </div>

                {/* Global Administrative Command Bar */}
                <div className="flex flex-wrap sm:justify-end items-center gap-2 border-t border-slate-50 xl:border-none pt-4 xl:pt-0">
                    <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5">
                        <FaEdit className="text-[11px]" /> Edit Demographics
                    </button>
                    <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm shadow-amber-500/10">
                        <FaBan className="text-[11px]" /> Suspend Account
                    </button>
                    <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm shadow-teal-600/10">
                        <FaRegEnvelope className="text-[11px]" /> Send Mesh Mail
                    </button>
                    <button className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl transition-all" title="Download Full Blueprint">
                        <FaDownload className="text-xs" />
                    </button>
                </div>
            </div>

            {/* ================= SECTION 2 — OPERATIONS SUMMARY CARDS ================= */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {[
                    { label: "Completed Jobs", value: "148", color: "text-slate-900" },
                    { label: "Current Tasks", value: "2 Active", color: "text-blue-600" },
                    { label: "Average Rating", value: "4.9 ★", color: "text-amber-500" },
                    { label: "Gross Income", value: "৳284k", color: "text-teal-600" },
                    { label: "Awaiting Clear", value: "৳14,500", color: "text-purple-600" },
                    { label: "Response Rate", value: "98.4%", color: "text-emerald-600" },
                    { label: "Breach Rate", value: "0.8%", color: "text-rose-600" },
                    { label: "Availability Feed", value: "Online", color: "text-teal-600" }
                ].map((kpi, idx) => (
                    <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-tight">{kpi.label}</p>
                        <h3 className={`text-xl font-black tracking-tight ${kpi.color}`}>{kpi.value}</h3>
                    </div>
                ))}
            </div>

            {/* CORE 2-COLUMN STRUCTURE (MAIN METRICS LEFT / LIVE TRACKING TIMELINES RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* DATA PANELS PACK (LEFT 2 COLUMNS) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* ================= SECTION 3 & 4 — PERSONAL & PROFESSIONAL INFORMATION ================= */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal Core Blueprint */}
                        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                    <FaClock className="text-slate-400" /> Personal Identity Records
                                </h3>
                                <button className="text-[10px] font-black text-teal-600 hover:underline">Update</button>
                            </div>
                            <div className="space-y-3 text-xs">
                                <div className="grid grid-cols-3 border-b border-slate-50 pb-2"><span className="text-slate-400 font-semibold">Email Anchor</span> <span className="col-span-2 font-bold text-slate-800">abdulrehman@carenest.org</span></div>
                                <div className="grid grid-cols-3 border-b border-slate-50 pb-2"><span className="text-slate-400 font-semibold">Phone Contact</span> <span className="col-span-2 font-bold text-slate-800">+880 1712-345678</span></div>
                                <div className="grid grid-cols-3 border-b border-slate-50 pb-2"><span className="text-slate-400 font-semibold">Date of Birth</span> <span className="col-span-2 font-bold text-slate-800">October 14, 1998</span></div>
                                <div className="grid grid-cols-3 border-b border-slate-50 pb-2"><span className="text-slate-400 font-semibold">Gender Node</span> <span className="col-span-2 font-bold text-slate-800">Male</span></div>
                                <div className="grid grid-cols-3 border-b border-slate-50 pb-2"><span className="text-slate-400 font-semibold">Geo Address</span> <span className="col-span-2 font-bold text-slate-800">Halishahar, Chittagong, BD</span></div>
                                <div className="grid grid-cols-3 border-b border-slate-50 pb-2"><span className="text-slate-400 font-semibold">Emergency Node</span> <span className="col-span-2 font-bold text-slate-800">Jane Doe (Spouse) - +880 1911-XXXXXX</span></div>
                                <div className="space-y-1">
                                    <span className="text-slate-400 font-semibold block">Biography Narrative</span>
                                    <p className="text-[11px] leading-relaxed text-slate-500 font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                        Dedicated clinical caregiver specializing in advanced geriatric assistance and surgical rehabilitation workflows with over half a decade of fieldwork.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Professional Framework Node */}
                        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                    <FaBriefcase className="text-slate-400" /> Clinical Matrix Deployment
                                </h3>
                                <span className="text-[9px] font-black text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Expert Tier</span>
                            </div>
                            <div className="space-y-3 text-xs">
                                <div className="grid grid-cols-3 border-b border-slate-50 pb-2"><span className="text-slate-400 font-semibold">Specialization</span> <span className="col-span-2 font-black text-slate-800">Senior Neuro-Geriatric Care</span></div>
                                <div className="grid grid-cols-3 border-b border-slate-50 pb-2"><span className="text-slate-400 font-semibold">Field Experience</span> <span className="col-span-2 font-bold text-slate-800">8 Years Active Fieldwork</span></div>
                                <div className="grid grid-cols-3 border-b border-slate-50 pb-2"><span className="text-slate-400 font-semibold">Dispatch Date</span> <span className="col-span-2 font-bold text-slate-800">June 02, 2026</span></div>
                                <div className="grid grid-cols-3 border-b border-slate-50 pb-2"><span className="text-slate-400 font-semibold">Platform Status</span> <span className="col-span-2 font-black text-emerald-600">Verified Clearing Passed</span></div>
                                <div className="space-y-1">
                                    <span className="text-slate-400 font-semibold block">Professional Description</span>
                                    <p className="text-[11px] leading-relaxed text-slate-500 font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                        Experienced in handling post-operative trauma care protocols, neurological therapeutic monitoring, and comprehensive mobility layouts within private home networks.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= SECTION 5 — IDENTITY & VERIFICATION (COMPLIANCE STACK) ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-50 pb-3">
                            <FaIdCard className="text-teal-600" /> Healthcare Compliance Documents & Node Integrity Verification
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { name: "Government NID Core", desc: "Smart NID Card Scan Verified", status: "Verified" },
                                { name: "BMDC Professional License", desc: "Reg No: #MD-2024-9081", status: "Verified" },
                                { name: "Criminal Record Clearance", desc: "Chittagong Police HQ Clearance Pass", status: "Verified" }
                            ].map((doc, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[11px] font-black text-slate-800">{doc.name}</h4>
                                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-semibold leading-tight">{doc.desc}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <button className="py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1">
                                            <FaEye className="text-[9px]" /> Preview
                                        </button>
                                        <button className="py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1">
                                            <FaDownload className="text-[9px]" /> Fetch
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= SECTION 6 — AVAILABILITY INFORMATION ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-50 pb-3">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                <FaClock className="text-slate-400" /> System Availability Engine Live Feed
                            </h3>
                            <span className="text-[10px] text-slate-400 font-semibold">Telemetry Verified: Just Now</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div className="p-3 bg-teal-50/30 border border-teal-100/50 rounded-2xl"><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Feed Status</p><p className="text-xs font-black text-teal-700 uppercase">Available Now</p></div>
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl"><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Shift Scope</p><p className="text-xs font-black text-slate-800">08:00 AM - 06:00 PM</p></div>
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl"><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Weekly Target</p><p className="text-xs font-black text-slate-800">Mon, Tue, Wed, Thu, Fri</p></div>
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl"><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Current Match</p><p className="text-xs font-black text-blue-600">Assigned Out</p></div>
                        </div>
                    </div>

                    {/* ================= SECTION 7 — PERFORMANCE ANALYTICS (RECHARTS INTERFACES) ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-50 pb-3">
                            <FaDollarSign className="text-slate-400" /> Core Clinical Deployment & Real-Time Earning Analytics
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Earnings Timeline Sheet */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Gross Income Curve (2026)</p>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={performanceData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="earnings" stroke="#0d9488" fillOpacity={0.06} fill="#0d9488" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Volume Load Analysis */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Monthly Completed Patient Deployments</p>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={performanceData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <Tooltip />
                                            <Bar dataKey="jobs" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= SECTION 8 — BOOKING HISTORY ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-3">
                            Patient Booking Ledger Snapshots
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 font-black uppercase tracking-wider text-[9px]">
                                        <th className="pb-3 pl-2">Booking Token</th>
                                        <th className="pb-3">Client Target</th>
                                        <th className="pb-3">Assigned Care Architecture</th>
                                        <th className="pb-3">Date Range</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3 text-right pr-2">Gross Tariff</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                                    {[
                                        { id: "BK-9021", client: "Zayan Rahman", service: "Post-Stroke Care", date: "Jul 10, 2026", status: "Settled", price: "৳18,500" },
                                        { id: "BK-8841", client: "Tahmina Khan", service: "Dementia Support", date: "Jun 24, 2026", status: "Settled", price: "৳32,000" },
                                        { id: "BK-8110", client: "Arif Chowdhury", service: "Mobility Assistance", date: "Jun 12, 2026", status: "Settled", price: "৳12,000" }
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="py-3.5 pl-2 font-black text-slate-900">{row.id}</td>
                                            <td className="py-3.5 font-bold text-slate-700">{row.client}</td>
                                            <td className="py-3.5 text-slate-500 font-semibold">{row.service}</td>
                                            <td className="py-3.5 text-slate-400 font-semibold">{row.date}</td>
                                            <td className="py-3.5">
                                                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-md text-[9px] font-black uppercase tracking-wider">
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 text-right pr-2 font-black text-slate-800">{row.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ================= SECTION 9 — REVIEWS ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                <FaStar className="text-amber-500" /> Patient Feedback & Evaluation Stream
                            </h3>
                            <span className="text-xs font-black text-slate-800">Aggregate Score: 4.9 / 5.0</span>
                        </div>
                        <div className="space-y-4 divide-y divide-slate-50">
                            {[
                                { author: "K. Rahman", stars: 5, text: "Excellent clinical expertise during post-operative support. Very punctual and attentive to emergency parameters.", date: "July 12, 2026" },
                                { author: "S. Chowdhury", stars: 4, text: "Extremely professional caregiver. Handled difficult clinical setups seamlessly. Highly recommended.", date: "June 20, 2026" }
                            ].map((rev, idx) => (
                                <div key={idx} className={`text-xs space-y-1.5 ${idx > 0 ? 'pt-4' : ''}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-slate-800">{rev.author}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{rev.date}</span>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-amber-400 text-[10px]">
                                        {[...Array(rev.stars)].map((_, i) => <FaStar key={i} />)}
                                    </div>
                                    <p className="text-slate-500 font-medium leading-relaxed bg-slate-50/30 p-3 rounded-xl border border-slate-50">
                                        "{rev.text}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= SECTION 10 — EARNINGS & WITHDRAWALS ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-3">
                            Financial Clearance Log & Payout Frameworks
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 font-black uppercase tracking-wider text-[9px]">
                                        <th className="pb-3 pl-2">Amount Tranche</th>
                                        <th className="pb-3">Settlement Channel</th>
                                        <th className="pb-3">Status Badge</th>
                                        <th className="pb-3">Request Clock</th>
                                        <th className="pb-3 text-right pr-2">Clearing Execution</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                                    {[
                                        { amt: "৳24,000", method: "bKash Professional Node", status: "Disbursed", req: "June 20, 2026", cleared: "June 22, 2026" },
                                        { amt: "৳45,000", method: "City Bank Direct Mesh", status: "Disbursed", req: "May 15, 2026", cleared: "May 17, 2026" }
                                    ].map((w, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="py-3.5 pl-2 font-black text-slate-900">{w.amt}</td>
                                            <td className="py-3.5 font-bold text-slate-500">{w.method}</td>
                                            <td className="py-3.5">
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[9px] font-black uppercase tracking-wider">
                                                    {w.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 text-slate-400 font-semibold">{w.req}</td>
                                            <td className="py-3.5 text-right pr-2 text-slate-400 font-bold">{w.cleared}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* OPERATIONS CONSOLE / CHRONO TIMELINES (RIGHT 1 COLUMN) */}
                <div className="space-y-6">

                    {/* ================= SECTION 11 — ACCOUNT TIMELINE ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-2">
                            Lifecycle Milestone Blueprint
                        </h3>
                        <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {[
                                { date: "June 22, 2026", title: "Withdrawal Requested Cleared", desc: "৳24,000 routed to mobile account node." },
                                { date: "June 12, 2026", title: "First Platform Deployment", desc: "Dispatched into Patient Session ID #BK-8110." },
                                { date: "June 07, 2026", title: "Credential Verification Pass", desc: "Background and active licenses locked and cleared." },
                                { date: "June 02, 2026", title: "Account Node Created", desc: "Core database registry deployment initialization completed." }
                            ].map((ev, idx) => (
                                <div key={idx} className="flex gap-3 items-start text-xs relative z-10">
                                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 border-4 border-white ring-1 ring-teal-500/20 mt-1 shrink-0" />
                                    <div className="space-y-0.5 min-w-0">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{ev.date}</span>
                                        <h4 className="text-[11px] font-black text-slate-800 leading-tight">{ev.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium leading-normal">{ev.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= SECTION 13 — INTERNAL NOTES (ENTERPRISE ONLY) ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                <FaNotesMedical className="text-amber-500" /> Administrative Security Notes
                            </h3>
                            <span className="text-[8px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-1.5 rounded">Admin Eyes Only</span>
                        </div>
                        <div className="space-y-2 text-[11px] font-medium text-slate-600">
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 leading-relaxed">
                                • Verified physical license against BMDC live API terminal manually on June 7.
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 leading-relaxed">
                                • Passed local background triage check with zero compliance discrepancies.
                            </div>
                            <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors">
                                Append Internal Administrative Note
                            </button>
                        </div>
                    </div>

                    {/* ================= SECTION 14 — RECENT ACTIVITY FEED ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-2 flex items-center gap-1.5">
                            <FaListUl className="text-slate-400" /> Operational System Log Stream
                        </h3>
                        <div className="space-y-3">
                            {[
                                "Completed patient routing #BK-9021",
                                "Acquired 5-star validation score feedback",
                                "Updated shift availability calendar metrics",
                                "Triggered ledger withdrawal initialization pipeline"
                            ].map((act, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[11px] font-medium text-slate-600 border-b border-slate-50/60 pb-2 last:border-none last:pb-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                    <p className="truncate" title={act}>{act}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= SECTION 12 — ADMINISTRATIVE ACTIONS (DANGER ZONE) ================= */}
                    <div className="bg-white border border-rose-100 rounded-[2rem] p-5 shadow-sm space-y-4 bg-rose-50/10">
                        <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 border-b border-rose-100/50 pb-2 flex items-center gap-1.5">
                            <FaUserShield /> Administrative Critical Danger Zone
                        </h3>
                        <div className="space-y-2">
                            <button className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5">
                                <FaLock className="text-[10px]" /> Reset Password Link
                            </button>
                            <button className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5">
                                <FaBan className="text-[10px]" /> Emergency Freeze Account Node
                            </button>
                            <button className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/10">
                                <FaTrashAlt className="text-[10px]" /> Delete Record from Registry
                            </button>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Caregiver;