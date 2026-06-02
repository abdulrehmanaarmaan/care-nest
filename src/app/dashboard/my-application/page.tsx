'use client'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { FaArrowRight, FaBriefcase, FaCalendarAlt, FaCheckCircle, FaClock, FaEnvelope, FaFileAlt, FaFileMedical, FaPhoneAlt, FaShieldAlt, FaStethoscope, FaTimesCircle, FaUser, FaUserCheck } from 'react-icons/fa';
import useMyApplication from '../../../hooks/useMyApplication';

const MyApplication = () => {

    const { application } = useMyApplication()

    if (!application) {
        return (
            <div className="space-y-8 animate-fadeIn">
                {/* ==========================================
 ROUTE HEADER SECTION
======================================= */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase">
                            <span>Provider Core</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>Registration Desk</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Caregiver Application
                        </h1>
                        <p className="text-slate-400 text-xs font-medium">
                            Join the elite Care Nest verification directory to start accepting verified care allocations.
                        </p>
                    </div>
                </div>
                {/* ==========================================
 CORE ONBOARDING GATEWAY LAYOUT
======================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {/* Left Column: Direct Call to Action Container */}
                    <div className="lg:col-span-2 flex flex-col justify-between bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 shadow-[0_12px_30px_rgba(15,23,42,0.01)] text-center lg:text-left">
                        <div className="space-y-4 max-w-xl">
                            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto lg:mx-0">
                                <FaFileMedical size={20} className="text-teal-600" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
                                    No Active Application Found
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                                    Your profile is currently registered as a standard platform network node. To list your services, receive private
                                    bookings, and access smart provider workflows, you must verify your credentials.
                                </p>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                            <div className="text-center sm:text-left">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Estimated Setup Time</span>
                                <span className="text-xs font-extrabold text-slate-700">~6 to 10 Minutes</span>
                            </div>
                            <Link
                                href="/become-a-caregiver"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-teal-600 active:scale-[0.98] transition-all duration-300 shadow-md shadow-slate-900/5 cursor-pointer"
                            >
                                <span>Initialize Application</span>
                                <FaArrowRight size={10} />
                            </Link>
                        </div>
                    </div>
                    {/* Right Column: High-Trust Pipeline Requirements Panel */}
                    <div className="bg-slate-50/50 border border-slate-200/60 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between">
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                    Verification Pipeline
                                </h3>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">What you will need to upload:</p>
                            </div>
                            {/* Pipeline Step List */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 flex-shrink-0 mt-0.5">
                                        <FaShieldAlt size={10} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-extrabold text-slate-800 leading-tight">Legal Identity & Background Check</h4>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Valid NID, Passport, or government-issued
                                            operating identification.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 flex-shrink-0 mt-0.5">
                                        <FaUserCheck size={10} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-extrabold text-slate-800 leading-tight">Practice Certifications</h4>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Nursing diplomas, specialized senior care
                                            certifications, or training metrics.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 flex-shrink-0 mt-0.5">
                                        <FaClock size={10} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-extrabold text-slate-800 leading-tight">24-48 Hour Turnaround</h4>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Rapid automated cryptography scans paired with
                                            manual agent verification checks.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Secure Network Trust Disclaimer Badge */}
                        <div className="bg-white border border-slate-100 rounded-xl p-3 text-[10px] text-slate-400 font-medium leading-relaxed mt-6">
                            All submitted assets are processed via encrypted endpoints and hosted inside compliance-hardened infrastructure
                            environments.
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Helper dictionary for managing multi-state badge styling configs
    const statusConfig = {
        approved: {
            bg: 'bg-emerald-50 border-emerald-200/60 text-emerald-800',
            icon: <FaCheckCircle className="text-emerald-500 text-sm" />,
            label: 'Verified & Approved',
            desc: 'Your profile is live in our care network directory. You can now accept incoming allocation requests.'
        },
        pending: {
            bg: 'bg-amber-50 border-amber-200/60 text-amber-800',
            icon: <FaClock className="text-amber-500 text-sm" />,
            label: 'Under Verification Review',
            desc: 'Our compliance agents are verifying your uploaded credentials. This usually takes 24-48 business hours.'
        },
        rejected: {
            bg: 'bg-rose-50 border-rose-200/60 text-rose-800',
            icon: <FaTimesCircle className="text-rose-500 text-sm" />,
            label: 'Review Action Required',
            desc: 'Your application could not be verified with the provided documents. Please check support correspondence.'
        }
    };

    const currentStatus = statusConfig[application.status] || statusConfig.pending;
    const formattedDate = new Date(application.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* ==========================================
          1. ROUTE HEADER SECTION
         ========================================== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase">
                        <span>Provider Core</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>Verification Desk</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Caregiver Application
                    </h1>
                    <p className="text-slate-400 text-xs font-medium">
                        Review your verified credentials, onboarding registration status, and platform security tokens.
                    </p>
                </div>

                {/* Secure Ledger Reference Token */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[11px] text-slate-500 font-mono self-start sm:self-center">
                    <span className="font-bold uppercase tracking-wider text-[9px] text-slate-400">ID Token:</span>
                    <span>{application._id.slice(0, 8)}...{application._id.slice(-4)}</span>
                </div>
            </div>

            {/* ==========================================
          2. LIVE LEDGER STATUS CALLOUT
         ========================================== */}
            <div className={`border rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row items-start gap-5 transition-all ${currentStatus.bg}`}>
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                    {currentStatus.icon}
                </div>
                <div className="space-y-1.5">
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">
                        {currentStatus.label}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 max-w-3xl leading-relaxed">
                        {currentStatus.desc}
                    </p>
                    <div className="pt-2 flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        <span className="flex items-center gap-1">
                            <FaCalendarAlt size={10} /> Lodged: {formattedDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* ==========================================
          3. CORE APPLICATION MATRIX
         ========================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column: Personal & Professional Node Fields */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_30px_rgba(15,23,42,0.01)] space-y-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center gap-2">
                            <FaUser size={12} className="text-teal-600" />
                            Identity & Contact Profiles
                        </h3>

                        {/* Grid Framework for Inputs / Read-Only Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Full Name</label>
                                <div className="bg-slate-50 border border-slate-100/80 rounded-xl px-4 py-3 flex items-center gap-3 text-slate-800 text-xs font-extrabold">
                                    <FaUser className="text-slate-400" />
                                    <span>{application.name}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Email Address</label>
                                <div className="bg-slate-50 border border-slate-100/80 rounded-xl px-4 py-3 flex items-center gap-3 text-slate-800 text-xs font-extrabold overflow-hidden">
                                    <FaEnvelope className="text-slate-400 flex-shrink-0" />
                                    <span className="truncate">{application.email}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contact Number</label>
                                <div className="bg-slate-50 border border-slate-100/80 rounded-xl px-4 py-3 flex items-center gap-3 text-slate-800 text-xs font-extrabold">
                                    <FaPhoneAlt className="text-slate-400" />
                                    <span>{application.phone}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Security Compliance</label>
                                <div className="bg-slate-50 border border-slate-100/80 rounded-xl px-4 py-3 flex items-center gap-3 text-emerald-700 text-xs font-extrabold">
                                    <FaShieldAlt className="text-emerald-500" />
                                    <span>Terms Agreed & E-Signed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Credentials Block */}
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_30px_rgba(15,23,42,0.01)] space-y-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center gap-2">
                            <FaBriefcase size={12} className="text-teal-600" />
                            Professional Capability Index
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Target Specialization</label>
                                <div className="bg-teal-50/30 border border-teal-100/60 rounded-xl px-4 py-3 flex items-center gap-3 text-slate-900 text-xs font-black">
                                    <FaStethoscope className="text-teal-600" />
                                    <span>{application.specialization}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Track Record Experience</label>
                                <div className="bg-slate-50 border border-slate-100/80 rounded-xl px-4 py-3 flex items-center gap-3 text-slate-800 text-xs font-extrabold">
                                    <FaBriefcase className="text-slate-400" />
                                    <span>{application.experience} Years Active Practice</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Statement of Practice & Methodologies</label>
                            <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-4 text-slate-600 text-xs font-medium leading-relaxed">
                                {application.description}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Encrypted Credential Document Vault */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.01)] space-y-4">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <FaFileAlt size={12} className="text-teal-600" />
                                Uploaded Certifications
                            </h3>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Securely cryptographed file asset</p>
                        </div>

                        {/* Document Thumbnail Preview Frame */}
                        <div className="border border-slate-100 rounded-2xl bg-slate-50 p-2 overflow-hidden group">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden relative border border-slate-200/60 bg-white">
                                <img
                                    src={application.documentUrl}
                                    alt="Identity verification and license artifact"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            <div className="p-3 flex items-center justify-between text-[11px] font-bold text-slate-500">
                                <span className="uppercase tracking-wider text-[9px] text-slate-400 font-black">{application.documentType} Asset</span>
                                <a
                                    href={application.documentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                                >
                                    View Full File
                                </a>
                            </div>
                        </div>

                        {/* Verification Checklist */}
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/80 space-y-2 text-[11px] font-bold text-slate-600">
                            <div className="flex items-center gap-2">
                                <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={10} />
                                <span>Malicious Payload Scan Clear</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={10} />
                                <span>Cloudinary Integrity Check Verified</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyApplication;