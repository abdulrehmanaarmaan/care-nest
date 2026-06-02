'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { FaArrowLeft, FaBriefcase, FaCheckCircle, FaClock, FaDownload, FaEnvelope, FaFileAlt, FaPhone, FaShieldAlt, FaStethoscope, FaTimesCircle, FaUser } from 'react-icons/fa';
import useCaregiversData from '../../../../../hooks/useCaregiversData';
import useCaregiverDetails from '../../../../../hooks/useCaregiverDetails';
import Swal from 'sweetalert2';

const ApplicationDetails = () => {

    const { id } = useParams()

    const { application, isLoading, refetch } = useCaregiverDetails(id)

    if (isLoading) {
        return <>Loading...</>
    }

    const { _id, createdAt, name, email, phone, userId, specialization, experience, description, documentType, documentUrl, agreedToTerms } = application

    const approveApplication = async id => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, approve it!"
        }).then(async res => {
            if (res.isConfirmed) {

                const approvedStatus = { status: "approved" }

                const response = await fetch(`/api/caregiver-applications/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(approvedStatus)
                })

                const result = await response.json()

                if (result?.success) {
                    refetch().then(() => reassignRole())
                }
            }
        })
    }

    const reassignRole = async () => {

        const res = await fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'caregiver' })
        })

        const result = await res.json()

        if (result?.success) {
            Swal.fire('Approved!', 'You had approved the application.', 'success')
        }
    }

    const rejectApplication = async id => {

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, reject it!"
        }).then(async res => {
            if (res.isConfirmed) {

                const rejectedStatus = { status: "rejected" }

                const response = await fetch(`/api/caregiver-applications/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(rejectedStatus)
                })
                const result = await response.json()

                if (result?.success) {
                    refetch().then(() => Swal.fire('Rejected!', 'You had rejected the application.', 'success'))
                }
            }
        })
    }

    // Dynamic status badge color matrix mapped exactly to your schema values
    const statusConfig = {
        pending: {
            bg: 'bg-amber-50 border-amber-100 text-amber-700',
            icon: FaClock,
            label: 'Under Review'
        },
        approved: {
            bg: 'bg-teal-50 border-teal-100 text-teal-700',
            icon: FaCheckCircle,
            label: 'Approved'
        },
        rejected: {
            bg: 'bg-rose-50 border-rose-100 text-rose-700',
            icon: FaTimesCircle,
            label: 'Rejected'
        }
    };

    const currentStatus = statusConfig[application?.status] || statusConfig.pending;
    const StatusIcon = currentStatus.icon;

    return (
        <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8 space-y-8">

            {/* TOP NAVIGATION & ACTION HEADER */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <Link
                        href="/dashboard/admin/caregiver-applications"
                        className="inline-flex items-center gap-2 text-xs font-black text-teal-600 hover:text-teal-700 uppercase tracking-widest group transition-colors mb-1 cursor-pointer"
                    >
                        <FaArrowLeft className="text-[10px] group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back To Queue</span>
                    </Link>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 flex-wrap">
                        Application Dossier
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black border px-2.5 py-1 rounded-lg uppercase tracking-wider ${currentStatus.bg}`}>
                            <StatusIcon className="text-[9px]" /> {currentStatus.label}
                        </span>
                    </h1>
                    <p className="text-slate-400 text-xs font-semibold">
                        ID: <span className="font-mono text-slate-500">#{_id.slice(-6).toUpperCase()}</span> • Submitted on {createdAt ? new Date(createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </p>
                </div>

                {/* ACTION TRIGGER BUTTONS */}
                {application?.status === 'pending' && (
                    <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                            // disabled={isUpdating}
                            onClick={() => rejectApplication(_id)}
                            className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-rose-600 font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                        >
                            Reject Account
                        </button>
                        <button
                            // disabled={isUpdating}
                            onClick={() => approveApplication(_id)}
                            className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm shadow-teal-600/10 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                        >
                            Approve Provider
                        </button>
                    </div>
                )}
            </div>

            {/* MAIN TWO-COLUMN BALANCED LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* COLUMN 1 & 2: VETTED PROFILE DETAILS */}
                <div className="lg:col-span-2 space-y-6">

                    {/* CORE APPLICANT IDENTITY CARD */}
                    <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <div>
                            <h3 className="font-black text-lg text-slate-900 tracking-tight">Personal & Professional Credentials</h3>
                            <p className="text-slate-400 text-xs font-semibold">Verified contact communication details and background markers.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Full Legal Name */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                                    <FaUser className="text-sm" />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Full Legal Name</span>
                                    <span className="text-sm font-bold text-slate-800 block">{name}</span>
                                </div>
                            </div>

                            {/* Email Profile */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                                    <FaEnvelope className="text-sm" />
                                </div>
                                <div className="space-y-0.5 truncate w-full">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Email Address</span>
                                    <a href={`mailto:${email}`} className="text-sm font-bold text-teal-600 hover:underline block truncate">
                                        {email}
                                    </a>
                                </div>
                            </div>

                            {/* Phone Vector */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                                    <FaPhone className="text-sm" />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Phone Number</span>
                                    <a href={`tel:${phone}`} className="text-sm font-bold text-slate-800 hover:text-teal-600 block">
                                        {phone}
                                    </a>
                                </div>
                            </div>

                            {/* System User Reference Link */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                                    <FaShieldAlt className="text-sm" />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">System Account ID</span>
                                    <span className="text-xs font-mono font-semibold text-slate-500 block">{userId}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EXPERTISE & DESCRIPTION BLOCK */}
                    <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <div>
                            <h3 className="font-black text-lg text-slate-900 tracking-tight">Statement of Purpose & Experience</h3>
                            <p className="text-slate-400 text-xs font-semibold">Self-submitted professional background profile and deployment scope.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Specialization Target */}
                            <div className="p-5 bg-gradient-to-br from-teal-50/30 to-teal-50/10 border border-teal-100/40 rounded-2xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-white border border-teal-100/40 rounded-xl shadow-sm flex items-center justify-center text-teal-600">
                                    <FaStethoscope className="text-lg" />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider block">Target Specialization</span>
                                    <span className="text-base font-black text-slate-900 block">{specialization}</span>
                                </div>
                            </div>

                            {/* Years Experience Metric */}
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-500">
                                    <FaBriefcase className="text-lg" />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Professional Experience</span>
                                    <span className="text-base font-black text-slate-900 block">
                                        {experience} {Number(experience) === 1 ? 'Year' : 'Years'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Statement Description Box */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Applicant Personal Statement</span>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {description || "No customized bio description provided by the applicant."}
                            </div>
                        </div>
                    </div>

                </div>

                {/* COLUMN 3: ATTACHED VERIFICATION ATTACHMENT SHELF */}
                <div className="space-y-6">

                    {/* UPLOADED LEGAL DOCUMENT ATTACHMENT FRAME */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                        <div>
                            <h3 className="font-black text-base text-slate-900 tracking-tight">Verification Document</h3>
                            <p className="text-slate-400 text-[11px] font-semibold">Legal certification or identification file proof.</p>
                        </div>

                        {/* Document Detail Meta Metadata */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/60 flex items-center justify-between text-[11px] font-bold text-slate-600">
                            <span className="flex items-center gap-1.5 truncate pr-2">
                                <FaFileAlt className="text-slate-400 text-xs shrink-0" />
                                <span className="truncate">{documentType || 'File Asset'}</span>
                            </span>
                            <a
                                href={documentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-teal-600 hover:text-teal-700 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider shrink-0 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm"
                            >
                                <FaDownload className="text-[9px]" /> Save File
                            </a>
                        </div>

                        {/* RENDER EMBED PREVIEW SAFELY ACCORDING TO DOCUMENT TYPE */}
                        <div className="w-full aspect-[4/5] rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden flex items-center justify-center relative group">
                            {documentType.startsWith('image/') ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={documentUrl}
                                    alt="Caregiver Verification Document Asset"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="text-center p-6 space-y-2">
                                    <FaFileAlt className="text-4xl text-slate-300 mx-auto" />
                                    <span className="text-xs font-bold text-slate-700 block">PDF / Document Asset Standard</span>
                                    <a
                                        href={documentUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[11px] font-black text-teal-600 hover:underline block"
                                    >
                                        Open Document in New Tab
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ECOSYSTEM PRIVACY & LEGAL CHECK COMPLIANCE CARD */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                        <div>
                            <h3 className="font-black text-base text-slate-900 tracking-tight">Legal Consents</h3>
                            <p className="text-slate-400 text-[11px] font-semibold">Terms declaration check verified during onboarding submit.</p>
                        </div>

                        <div className="p-4 bg-emerald-50/40 border border-emerald-100/60 rounded-2xl flex items-start gap-3">
                            <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                                <span className="text-xs font-bold text-emerald-950 block">Agreed to Platform Terms</span>
                                <p className="text-[11px] text-emerald-700/80 font-medium leading-normal">
                                    Applicant confirmed legal compliance checkbox option state (`agreedToTerms: {String(agreedToTerms)}`).
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ApplicationDetails;