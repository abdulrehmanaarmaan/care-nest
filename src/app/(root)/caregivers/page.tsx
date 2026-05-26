'use client'
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import useCaregiversData from '../../../hooks/useCaregiversData';

const Caregivers = () => {

    const { caregivers, search, setSearch, specialization, setSpecialization } = useCaregiversData()

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* ==========================================
    1. DYNAMIC HEADER HERO CARD
   ========================================== */}
                <section className="bg-white shadow-[0_20px_50px_rgba(13,148,136,0.04)] rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 md:p-12 mb-8 relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none"
                        aria-hidden="true"></div>
                    <div className="relative z-10 space-y-2 max-w-2xl">
                        <span className="inline-flex items-center px-4 py-1.5 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase bg-teal-50 border border-teal-100/50 rounded-full">
                            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                            Verified Experts
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                            Find Expert Caregivers
                        </h1>
                        <p className="text-slate-500 font-medium text-xs sm:text-sm md:text-base max-w-xl">
                            Connect with background-checked, trusted nursing professionals tailored completely to your medical and personal
                            preferences.
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
    2. MAIN CONTENT SPLIT LAYOUT (DYNAMIC CARDS & CONTROLS)
   ========================================== */}
                <div className={`grid grid-cols-1 gap-8 items-start ${(caregivers.length > 0 || search.trim() !== '' || specialization !== '')
                    ? 'lg:grid-cols-4'
                    : 'grid-cols-1'
                    }`}>
                    {/* ASIDE: BENTO CONTROL SIDEBAR (Hidden if database is absolutely empty and no active query parameters exist) */}
                    {(caregivers.length > 0 || search.trim() !== '' || specialization !== '') && (
                        <aside className="lg:col-span-1 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(13,148,136,0.03)] rounded-[2rem] p-6 space-y-6 lg:sticky lg:top-6">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Filter Panel</h2>
                                <button onClick={() => {
                                    setSearch('')
                                    setSpecialization('')
                                }} className="text-[11px] font-bold text-teal-600 uppercase hover:underline cursor-pointer">Clear All</button>
                            </div>
                            {/* Sub-Bento Item: Omnisearch Input */}
                            <div className="space-y-2">
                                <label htmlFor="search" className="text-xs font-bold text-slate-700 ml-1 block">Search Specialist</label>
                                <div className="relative">
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
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
                                    <select
                                        value={specialization}
                                        onChange={(e) => setSpecialization(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="">All Specializations</option>
                                        <option value="Baby Care">Baby Care</option>
                                        <option value="Senior Care">Senior Care</option>
                                        <option value="Memory Care">Memory Care</option>
                                        <option value="Patient Care">Patient Care</option>
                                        <option value="Recovery Care">Recovery Care</option>
                                        <option value="Disability Care">Disability Care</option>
                                    </select>
                                </div>
                            </div>
                        </aside>
                    )}
                    {/* MAIN SYSTEM CONTAINER WRAPPER */}
                    <main className={(caregivers.length > 0 || search.trim() !== '' || specialization !== '') ? 'lg:col-span-3' : 'w-full'}>
                        {caregivers.length > 0 ? (
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
                                                    {caregiver.documentUrl && caregiver.documentType?.startsWith('image/') ? (
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
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none"
                                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-black uppercase tracking-wider rounded-md flex-shrink-0">
                                                                {caregiver.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-400 truncate max-w-[180px] sm:max-w-[240px]">
                                                        {caregiver.email}</p>
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
                                                <span className="text-xs sm:text-sm font-black text-teal-600 truncate block px-1">{caregiver.
                                                    specialization}</span>
                                            </div>
                                        </div>
                                        {/* Dynamic Single Specialized Core Tag */}
                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            <span className="text-[10px] font-black tracking-wide uppercase text-teal-800/90 bg-teal-50/60 border-teal-100/40 px-2.5 py-1 rounded-lg">
                                                #{caregiver.specialization.replace(/\s+/g, '')}
                                            </span>
                                            <span className="text-[10px] font-bold tracking-wide uppercase text-slate-400 bg-slate-100/50 px-2.5 py-1 rounded-lg">
                                                Joined {new Date(caregiver.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short', year:
                                                        'numeric'
                                                })}
                                            </span>
                                        </div>
                                        {/* Interactive Booking Module Button */}
                                        < Link
                                            href={`/caregivers/${caregiver._id}`}
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
                        ) : (search !== '' || specialization !== '') ? (
                            /* CASE A: Filtered State with Zero Results */
                            <div className="w-full bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-12 md:p-16 text-center shadow-[0_15px_40px_rgba(15,23,42,0.01)] relative overflow-hidden flex flex-col items-center justify-center min-h-[450px]">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/30 rounded-bl-full pointer-events-none"
                                    aria-hidden="true" />
                                <div className="w-16 h-16 bg-slate-50 border border-slate-100/80 rounded-2xl flex items-center justify-center mb-6 text-slate-400 relative">
                                    <span className="absolute inline-flex h-2 w-2 rounded-full bg-teal-400/60 top-3 right-3 animate-ping" />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 4h.01" />
                                    </svg>
                                </div>
                                <div className="space-y-2 max-w-sm mb-6">
                                    <span className="inline-flex items-center px-3 py-1 text-[9px] font-black tracking-[0.15em] text-slate-500 uppercase bg-slate-50 border border-slate-100 rounded-md">
                                        No Results Found
                                    </span>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                        No Matching Caregivers
                                    </h3>
                                    <p className="text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">
                                        We couldn't find any approved specialists matching your search or active filter selections. Try
                                        relaxing your filters or typing a different keyword.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSearch('');
                                        setSpecialization('');
                                    }}
                                    type="button"
                                    className="px-6 py-3 bg-slate-900 text-white hover:bg-teal-600 rounded-xl font-black text-xs uppercase tracking-wider active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-900/5 hover:shadow-teal-600/10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                                    </svg>
                                    <span>Reset Filter Criteria</span>
                                </button>
                            </div>
                        ) : (
                            /* CASE B: Absolute Empty State (Database has zero collections verified) */
                            <div className="w-full bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-12 md:p-16 text-center shadow-[0_15px_40px_rgba(15,23,42,0.01)] relative overflow-hidden flex flex-col items-center justify-center min-h-[450px]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none" aria-hidden="true" />
                                <div className="w-16 h-16 bg-teal-50 border border-teal-100/70 rounded-2xl flex items-center justify-center mb-6 text-teal-600 relative group-hover:scale-105 transition-transform duration-300">
                                    <span className="absolute inline-flex h-2 w-2 rounded-full bg-teal-500/30 top-3 right-3 animate-pulse" />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="space-y-3 max-w-md mb-8 text-center">
                                    <span className="inline-flex items-center px-4 py-1.5 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase bg-teal-50 border border-teal-100/50 rounded-full">
                                        Welcome to Care Nest
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                        Network Undergoing Verification
                                    </h3>
                                    <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                                        Our medical specialist roster is currently undergoing strict background and certification checks.
                                        Approved profiles will appear here shortly.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-md justify-center relative z-10">
                                    <button
                                        onClick={() => window.location.reload()}
                                        type="button"
                                        className="w-full sm:w-auto px-5 py-3 bg-slate-900 text-white hover:bg-teal-600 rounded-xl font-black text-xs uppercase tracking-wider active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-900/5 hover:shadow-teal-600/10"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/xl" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                                        </svg>
                                        <span>Refresh Roster</span>
                                    </button>
                                    <Link
                                        href="/become-a-caregiver"
                                        className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-black text-xs uppercase tracking-wider active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <span>Join as Caregiver</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div >
        </div >
    );
};

export default Caregivers;