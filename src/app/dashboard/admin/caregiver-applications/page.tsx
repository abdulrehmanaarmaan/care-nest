'use client'
import Link from 'next/link';
import React from 'react';
import { FaCheck, FaEye, FaFileAlt, FaInbox, FaTimes, FaUser, FaUserCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useApplicationsData from '../../../../hooks/useApplicationsData';

const CaregiverApplications = () => {

    const { applications, refetch } = useApplicationsData()

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
                    refetch().then(() => reassignRole(id))
                }
            }
        })
    }

    const reassignRole = async id => {

        const caregiver = applications.find(application => application?._id === id)

        const res = await fetch(`/api/users/${caregiver?.userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'caregiver' })
        })

        const result = await res.json()

        if (result?.success) {
            Swal.fire('Approved!', 'You had approved the application.', 'success')

            const notification = {
                recipient_id: caregiver?.userId,
                recipient_role: 'caregiver',
                type: 'verification_approved',
                title: "Verification Approved",
                message: `Your caregiver profile has been successfully verified.`,
                reference_type: "profile",
                reference_id: result?.success,
                is_read: false,
            }
            await fetch('/api/caregiver-notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notification)
            })
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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Caregiver Applications</h1>
                    <p className="text-slate-500 text-sm font-medium">Review and verify incoming professional provider onboarding registrations</p>
                </div>
                {/* Metric Badge */}
                <div className="inline-flex self-start md:self-auto items-center gap-2 bg-teal-50 border border-teal-100/80 text-teal-800 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider">
                    <FaUserCheck className="text-teal-600" size={14} />
                    Pending Action: {applications.filter(app => app.status === 'pending').length}
                </div>
            </div>

            {/* Main Table / Adaptive Grid Container */}
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto hidden sm:block">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Applicant Details</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Specialization & Experience</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Verification Artifact</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Status</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {applications.length > 0 ? (
                                applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-slate-50/30 transition-colors group">
                                        {/* Applicant Identity info */}
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 leading-tight block">{app.name}</span>
                                                <span className="text-xs text-slate-400 mt-0.5">{app.email}</span>
                                                <span className="text-[10px] text-teal-600 font-mono mt-1 font-bold tracking-wide uppercase">
                                                    ID: #{app._id.slice(-8)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Technical Competencies */}
                                        <td className="px-6 py-5">
                                            <div className="text-sm">
                                                <span className="font-bold text-slate-700 block">{app.specialization}</span>
                                                <span className="text-xs text-slate-400 font-medium mt-0.5 block">{app.experience} Years Practice</span>
                                            </div>
                                        </td>

                                        {/* Document Safe-Link Assets */}
                                        <td className="px-6 py-5">
                                            {app.documentUrl ? (
                                                <a
                                                    href={app.documentUrl}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-600 bg-slate-50 border border-slate-100 hover:border-teal-100 px-3 py-1.5 rounded-xl transition-all"
                                                >
                                                    <FaFileAlt className="text-slate-400 group-hover:text-teal-500 transition-colors" size={12} />
                                                    <span>View Attachment</span>
                                                </a>
                                            ) : (
                                                <span className="text-xs font-semibold text-slate-400 italic">No document file</span>
                                            )}
                                        </td>

                                        {/* Conditional Status System */}
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${app.status === 'approved' || app.status === 'verified'
                                                ? 'bg-teal-50 border-teal-100 text-teal-700'
                                                : 'bg-amber-50 border-amber-100 text-amber-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>

                                        {/* Operational Action Rigging */}
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1">
                                                {
                                                    app?.status !== 'rejected' && <Link
                                                        href={`/dashboard/admin/caregiver-applications/${app?._id}`}
                                                        className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                                                        title="Inspect Detailed Profile"
                                                    >
                                                        <FaEye size={16} />
                                                    </Link>
                                                }
                                                {
                                                    app?.status === 'approved' && <Link
                                                        href={`/caregivers/${app?._id}`}
                                                        className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                                                        title="Inspect Detailed Profile"
                                                    >
                                                        <FaUser size={16} />
                                                    </Link>
                                                }
                                                {app?.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => approveApplication(app._id)}
                                                            // onClick={() => onApprove(app._id)}
                                                            className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                                                            title="Approve Application"
                                                        >
                                                            <FaCheck size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => rejectApplication(app._id)}
                                                            // onClick={() => onReject(app._id)}
                                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                                            title="Reject Application"
                                                        >
                                                            <FaTimes size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <EmptyStateFallback />
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ==========================================
            MOBILE VIEWPORT CONTAINER CARD GRID (xs to sm)
           ========================================== */}
                <div className="block sm:hidden divide-y divide-slate-100">
                    {applications.length > 0 ? (
                        applications.map((app) => (
                            <div key={app._id} className="p-5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-black text-slate-900 leading-snug">{app.name}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">{app.email}</p>
                                        <span className="text-[9px] text-teal-600 font-mono mt-1 font-bold block tracking-wider uppercase">ID: #{app._id.slice(-8)}</span>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${app.status === 'approved' || app.status === 'verified'
                                        ? 'bg-teal-50 border-teal-100 text-teal-700'
                                        : 'bg-amber-50 border-amber-100 text-amber-700'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Focus Field</span>
                                        <span className="font-bold text-slate-700 block mt-0.5 truncate">{app.specialization}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Experience</span>
                                        <span className="font-bold text-slate-700 block mt-0.5">{app.experience} Years Active</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-1">
                                    {app.documentUrl ? (
                                        <a
                                            href={app.documentUrl}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 hover:underline"
                                        >
                                            <FaFileAlt size={11} />
                                            <span>Review Artifact</span>
                                        </a>
                                    ) : (
                                        <span className="text-xs font-semibold text-slate-400 italic">No document file</span>
                                    )}

                                    <div className="flex gap-1.5">
                                        {app?.status !== 'rejected' &&
                                            <Link
                                                href={`/dashboard/admin/caregiver-applications/${app?._id}`}
                                                className="p-2 text-slate-500 bg-slate-100 rounded-lg hover:text-teal-600 hover:bg-teal-50 transition-all"
                                            >
                                                <FaEye size={12} />
                                            </Link>
                                        }
                                        {
                                            app?.status === 'approved' &&
                                            <Link
                                                href={`/caregivers/${app?._id}`}
                                                className="p-2 text-slate-500 bg-slate-100 rounded-lg hover:text-teal-600 hover:bg-teal-50 transition-all"
                                            >
                                                <FaUser size={12} />
                                            </Link>
                                        }
                                        {app.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => approveApplication(app._id)}
                                                    className="p-2 text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-all cursor-pointer"
                                                >
                                                    <FaCheck size={12} />
                                                </button>
                                                <button
                                                    onClick={() => rejectApplication(app._id)}
                                                    className="p-2 text-rose-600 bg-rose-50 rounded-lg border border-rose-100 hover:bg-rose-100 transition-all cursor-pointer"
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8"><EmptyStateFallback flexLayout={true} /></div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* Reusable isolated local component layout for empty conditions */
function EmptyStateFallback({ flexLayout = false }: { flexLayout?: boolean }) {
    const content = (
        <div className="flex flex-col items-center justify-center text-slate-400">
            <FaInbox size={48} className="mb-4 opacity-20" />
            <p className="font-bold text-slate-500">No applications found</p>
            <p className="text-xs mt-1">There are no incoming caregiver registrations queued for approval at this moment.</p>
        </div>
    );

    if (flexLayout) return content;

    return (
        <tr>
            <td colSpan={5} className="px-6 py-20 text-center">
                {content}
            </td>
        </tr>
    );
}

export default CaregiverApplications;