'use client'
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Caregivers = () => {

    const { data: caregivers = [] } = useQuery({
        queryKey: ['caregivers'],
        queryFn: async () => {
            const result = await fetch('/api/caregivers')
            return result.json()
        }
    })

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* ==========================================
            1. DYNAMIC HEADER HERO CARD
           ========================================== */}
                <section className="bg-white shadow-[0_20px_50px_rgba(13,148,136,0.04)] rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 md:p-12 mb-8 relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none" aria-hidden="true"></div>

                    <div className="relative z-10 space-y-2 max-w-2xl">
                        <span className="inline-flex items-center px-4 py-1.5 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase bg-teal-50 border border-teal-100/50 rounded-full">
                            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                            Verified Experts
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                            Find Expert Caregivers
                        </h1>
                        <p className="text-slate-500 font-medium text-xs sm:text-sm md:text-base max-w-xl">
                            Connect with background-checked, trusted nursing professionals tailored completely to your medical and personal preferences.
                        </p>
                    </div>

                    {/* Quick Stat Capsule */}
                    <div className="relative z-10 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-6 sm:self-center">
                        <div>
                            <span className="block text-xl sm:text-2xl font-black text-slate-900">{caregivers?.length || 0}</span>
                            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Available Carers</span>
                        </div>
                        <div className="w-px bg-slate-200"></div>
                        <div>
                            <span className="block text-xl sm:text-2xl font-black text-teal-600">99.4%</span>
                            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Satisfaction</span>
                        </div>
                    </div>
                </section>

                {/* ==========================================
            2. MAIN CONTENT SPLIT LAYOUT (BENTO SEARCH + CARDS)
           ========================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* ASIDE: BENTO CONTROL SIDEBAR */}
                    <aside className="lg:col-span-1 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(13,148,136,0.03)] rounded-[2rem] p-6 space-y-6 lg:sticky lg:top-6">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Filter Panel</h2>
                            <button className="text-[11px] font-bold text-teal-600 uppercase hover:underline cursor-pointer">Clear All</button>
                        </div>

                        {/* Sub-Bento Item: Omnisearch Input */}
                        <div className="space-y-2">
                            <label htmlFor="search" className="text-xs font-bold text-slate-700 ml-1 block">Search Specialist</label>
                            <div className="relative">
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="e.g., Senior Care, Nurse..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium text-sm"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Sub-Bento Item: Dropdown Selectors */}
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 ml-1 block">Specialization</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium text-sm appearance-none cursor-pointer">
                                    <option>All Specializations</option>
                                    <option>Senior Care</option>
                                    <option>Post-Op Care</option>
                                    <option>Pediatrics</option>
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN GRID: CARDS ELEMENT */}
                    <main className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {caregivers.map((caregiver) => (
                                <article
                                    key={caregiver._id}
                                    className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-[0_15px_40px_rgba(15,23,42,0.02)] hover:shadow-[0_20px_50px_rgba(13,148,136,0.06)] hover:border-teal-100/70 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
                                >
                                    {/* Premium Badging Layer */}
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-4">
                                            {/* Dynamic Avatar Handler */}
                                            <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-2xl border-2 border-slate-50 shadow-sm flex-shrink-0 group-hover:scale-[1.03] transition-transform duration-300 bg-slate-50">
                                                {caregiver.documentUrl && caregiver.documentType.startsWith('image/') ? (
                                                    <Image
                                                        src={caregiver.documentUrl}
                                                        alt={caregiver.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-700 font-black text-xl uppercase">
                                                        {caregiver.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Identity Specs */}
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <h3 className="font-black text-slate-900 tracking-tight text-base sm:text-lg group-hover:text-teal-600 transition-colors line-clamp-1">
                                                        {caregiver.name}
                                                    </h3>
                                                    {caregiver.status === 'verified' ? (
                                                        <span className="inline-flex items-center justify-center w-4 h-4 bg-teal-500 text-white rounded-full flex-shrink-0" title="Identity Verified">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-black uppercase tracking-wider rounded-md flex-shrink-0">
                                                            {caregiver.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-bold text-slate-400">{caregiver.email}</p>
                                                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{caregiver.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clean Description Section */}
                                    <div className="mb-4">
                                        <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed">
                                            {caregiver.description || "No bio description provided yet."}
                                        </p>
                                    </div>

                                    {/* Operational Capabilities Capsule */}
                                    <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-2xl p-3 mb-5 text-center">
                                        <div>
                                            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Experience</span>
                                            <span className="text-xs sm:text-sm font-black text-slate-900">{caregiver.experience} Years</span>
                                        </div>
                                        <div className="border-l border-slate-200">
                                            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Expertise</span>
                                            <span className="text-xs sm:text-sm font-black text-teal-600 truncate block px-1">{caregiver.specialization}</span>
                                        </div>
                                    </div>

                                    {/* Dynamic Single Specialized Core Tag */}
                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                        <span className="text-[10px] font-black tracking-wide uppercase text-teal-800/90 bg-teal-50/60 border border-teal-100/40 px-2.5 py-1 rounded-lg">
                                            #{caregiver.specialization.replace(/\s+/g, '')}
                                        </span>
                                        <span className="text-[10px] font-bold tracking-wide uppercase text-slate-400 bg-slate-100/50 px-2.5 py-1 rounded-lg">
                                            Joined {new Date(caregiver.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Interactive Booking Module Button */}
                                    <Link
                                        href={`/caregivers/${caregiver._id}`}
                                        type="button"
                                        className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-teal-700 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-600/10 group/btn"
                                    >
                                        <span>View Full Profile</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </main>

                </div>
            </div >
        </div >
    );
};

export default Caregivers;