'use client'
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';

const CaregiverDetails = () => {

    const { id } = useParams()

    const { data: caregiver, isLoading } = useQuery({
        queryKey: ['caregiver', id],
        queryFn: async () => {
            const result = await fetch(`/api/caregivers/${id}`)
            return result.json()
        }
    })

    if (isLoading) return <span>Loading...</span>

    const { documentUrl, documentType, name, status, phone, email, experience, specialization, description, createdAt } = caregiver || {}

    const formattedJoinDate = new Date(createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* BACK NAVIGATION ANCHOR */}
                <nav className="mb-6" aria-label="Back navigation">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Caregivers
                    </button>
                </nav>
                {/* ==========================================
    1. MASTER PROFILE HERO CARD
   ========================================== */}
                <section className="bg-white shadow-[0_20px_50px_rgba(13,148,136,0.04)] rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 md:p-12 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none"
                        aria-hidden="true"></div>
                    {/* Avatar System — Utilizing secure Cloudinary upload fallback logic */}
                    <div className="relative z-10 flex-shrink-0">
                        <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-[5px] border-white bg-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.12)] flex items-center justify-center">
                            {documentUrl && documentType.startsWith('image/') ? (
                                <Image
                                    src={documentUrl}
                                    alt={`${name}'s profile verification asset`}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-700 font-black text-4xl uppercase">
                                    {name}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Identity Specs */}
                    <div className="text-center md:text-left z-10 md:pt-2 flex-grow">
                        {/* Dynamic Status Capsule Row */}
                        <div className="flex justify-center md:justify-start mb-3">
                            {status === 'verified' || status === 'approved' ? (
                                <span className="inline-flex items-center px-4 py-1.5 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase bg-teal-50 border border-teal-100/50 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                                    Active Care Specialist
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-4 py-1.5 text-[10px] font-black tracking-[0.15em] text-amber-700 uppercase bg-amber-50 border border-amber-100/50 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                                    Verification Pending
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 justify-center md:justify-start mb-1">
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                {name}
                            </h1>
                            {(status === 'verified' || status === 'approved') && (
                                <span className="inline-flex self-center items-center justify-center w-5 h-5 bg-teal-500 text-white rounded-full text-xs flex-shrink-0" title="Verified Provider">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                            )}
                        </div>
                        <p className="text-teal-600 font-black text-xs sm:text-sm tracking-widest uppercase mb-4">{specialization}
                            Consultant</p>
                        {/* Minimalist Contact Ribbon */}
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {phone}
                            </span>
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {email}
                            </span>
                        </div>
                    </div>
                </section>
                {/* ==========================================
    2. CORE BENTO-GRID SPLIT CONTENT
   ========================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* COLUMN LEFT: OPERATIONAL CAPSULE */}
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-slate-100 shadow-[0_20px_50px_rgba(13,148,136,0.02)] rounded-[2rem] p-6 sm:p-8 space-y-6">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50 pb-4">
                                Deployment Parameters
                            </h2>
                            {/* Core Schema Metadata Fields */}
                            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400 uppercase text-[11px] tracking-wider">Experience Level</span>
                                    <span className="font-black text-slate-900 text-base">{experience} Years Active</span>
                                </div>
                                <div className="h-px bg-slate-200/60"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400 uppercase text-[11px] tracking-wider">Main Focus</span>
                                    <span className="font-black text-teal-600 bg-teal-50 border border-teal-100/50 rounded-lg px-2 py-0.5 text-xs">
                                        {specialization}
                                    </span>
                                </div>
                                <div className="h-px bg-slate-200/60"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400 uppercase text-[11px] tracking-wider">Registered Since</span>
                                    <span className="font-semibold text-slate-700 text-xs">{formattedJoinDate}</span>
                                </div>
                            </div>
                            {/* Booking CTA trigger */}
                            <button
                                type="button"
                                disabled={status === 'pending'}
                                className="w-full bg-teal-600 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed py-4 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-teal-700 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-teal-600/10 flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                <span>{status === 'pending' ? 'Verification Ongoing' : 'Initiate Interview'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </aside>
                    {/* COLUMN RIGHT: VERIFIED BIO & PHYSICAL CREDENTIAL DOCUMENTS */}
                    <main className="lg:col-span-2 space-y-8">
                        {/* Bento Inner Module: About Statement Description */}
                        <div className="bg-white border border-slate-100 shadow-[0_20px_50px_rgba(13,148,136,0.02)] rounded-[2rem] p-6 sm:p-8 space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Care Description & Clinical
                                Mission</h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap">
                                {description || "No professional overview summary listed for this caregiver profile account yet."}
                            </p>
                        </div>
                        {/* Bento Inner Module: Verification Documentation Block */}
                        <div className="bg-teal-50/40 border border-teal-100/70 p-6 sm:p-8 rounded-[2rem] space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 tracking-wider uppercase text-xs sm:text-sm">Verified Onboarding
                                        Artifact</h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Type: {documentType}</p>
                                </div>
                            </div>
                            {/* Secure interactive container tracking the physical background check token asset */}
                            <div className="pt-2">
                                {documentUrl ? (
                                    <div className="group relative border border-teal-100 bg-white rounded-2xl p-4 flex items-center justify-between overflow-hidden transition-all duration-300 hover:border-teal-300/80">
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <span className="block text-xs font-black text-slate-800 uppercase tracking-wide truncate">Legal_Verification_License</span>
                                                <span className="block text-[11px] font-semibold text-teal-600/80 truncate mt-0.5">Cloudinary
                                                    Resource Secure Node</span>
                                            </div>
                                        </div>
                                        <a
                                            href={documentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-teal-600 transition-colors duration-200 cursor-pointer flex-shrink-0 ml-4 shadow-sm"
                                        >
                                            Inspect File
                                        </a>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        No legal onboarding file attached to this record profile.
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Terms Consensus Flag Module */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-3.5 shadow-xs">
                            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-slate-500 font-semibold text-xs leading-none">
                                Consensual alignment confirmed with platform system terms of service regulations.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CaregiverDetails;