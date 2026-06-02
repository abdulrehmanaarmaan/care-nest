'use client'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Jobs = () => {

    const { data } = useSession()
    const { id } = data?.user || {}

    const [jobStatus, setJobStatus] = useState('all')

    const { data: jobs = [], isLoading, refetch } = useQuery({
        queryKey: ['jobs', id, jobStatus],
        queryFn: async () => {
            const res = await fetch(`/api/jobs?caregiver_id=${id}&status=${jobStatus}`)
            return res.json()
        }
    })

    const [expandedNotes, setExpandedNotes] = useState({});

    if (isLoading) return <>Loading...</>

    const responseStyles = {
        pending: "bg-amber-50 border-amber-200 text-amber-700",
        accepted: "bg-teal-50 border-teal-200 text-teal-700",
        declined: "bg-rose-50 border-rose-200 text-rose-700",
        completed: "bg-emerald-50 border-emerald-200 text-emerald-700"
    };

    const toggleNotes = (id) => {
        setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const acceptJob = async id => {
        Swal.fire({
            title: "Accept Assignment?",
            text: "You are confirming availability for this care assignment.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0f766e",
            cancelButtonColor: "#d33",
            confirmButtonText: "Accept Assignment"
        }).then(async res => {
            if (res.isConfirmed) {
                const res = await fetch(`/api/jobs/${id}?status=accepted`, {
                    method: 'PATCH'
                })

                const result = await res.json()

                if (result?.success) {
                    refetch().then(async () => await updateBookingStatus(id, 'accepted'))
                }
            }
        }
        )
    }

    const rejectJob = async id => {
        Swal.fire({
            title: "Decline Assignment?",
            text: "This assignment will be removed from your active queue.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#64748b",
            cancelButtonColor: "#d33",
            confirmButtonText: "Decline Assignment"
        }).then(async res => {
            if (res.isConfirmed) {
                const res = await fetch(`/api/jobs/${id}?status=declined`, {
                    method: 'PATCH'
                })

                const result = await res.json()

                if (result?.success) {
                    refetch().then(async () => await updateBookingStatus(id, 'declined'))
                }
            }
        })
    }

    const completeJob = async id => {
        Swal.fire({
            title: "Complete Assignment?",
            text: "This will mark the care session as completed.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#059669",
            cancelButtonColor: "#d33",
            confirmButtonText: "Complete Assignment"
        }).then(async res => {
            if (res.isConfirmed) {

                const res = await fetch(`/api/jobs/${id}?status=completed`, {
                    method: 'PATCH',
                })

                const result = await res.json()

                if (result?.success) {
                    refetch().then(async () => await updateBookingStatus(id, 'completed'))
                }
            }
        })
    }

    const updateBookingStatus = async (id, status) => {
        const job = jobs.find(job => job?._id === id)

        const { booking_id } = job
        const bookingRes = await fetch(`/api/bookings/${booking_id}?status=${status === 'accepted' ? 'In Progress' : status === 'declined' ? 'Pending Reassignment' : 'Completed'}`, {
            method: 'PATCH'
        })

        const result = await bookingRes.json()

        if (result?.success) {
            if (status === 'accepted') {
                return Swal.fire(
                    "Assignment Accepted",
                    "The assignment has been added to your active care schedule.",
                    "success"
                )
            }

            else if (status === 'declined') {
                return Swal.fire(
                    "Assignment Declined",
                    "The assignment has been removed from your schedule.",
                    "success"
                )
            }

            else {
                return Swal.fire(
                    "Assignment Completed",
                    "The care session has been successfully completed.",
                    "success"
                )
            }
        }

    }


    return (
        <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50/30">

            {/* ==========================================
                1. ROUTE HEADER
               ========================================== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase">
                        <span>Operational Console</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>Allocations</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Assigned Care Jobs
                    </h1>
                    <p className="text-slate-500 text-xs font-medium max-w-xl">
                        Manage your incoming requests, live shift configurations, and historical administrative schedules.
                    </p>
                </div>
            </div>

            {/* ==========================================
                2. STATE SUB-FILTERING NAVIGATION
               ========================================== */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/40 p-1.5 rounded-2xl overflow-x-auto scrollbar-none shadow-inner">
                {(['all', 'pending', 'accepted', 'completed']).map(tab => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => {
                            // setActiveTab(tab)
                            setJobStatus(tab)
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wide capitalize transition-all duration-300 cursor-pointer whitespace-nowrap ${jobStatus === tab
                            ? 'bg-white text-teal-900 shadow-sm border border-slate-200/60 font-black scale-[1.02]'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
                            }`}
                    >
                        {tab} {tab === 'all' ? 'Assignments' : tab === 'pending' ? 'Requests' : 'Roster'}
                    </button>
                ))}
            </div>

            {/* ==========================================
                3. JOB MATRIX CONTROLLER FLOW
               ========================================== */}
            {jobs.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {jobs.map((job) => {
                        const customer = job.customer || {};
                        const pricing = job.pricing || {};
                        const location = job.location || {};
                        const responseStatus = job.caregiver_response || 'pending';
                        const assignmentNote = job.assignment_note || '';

                        return (
                            <div
                                key={job._id}
                                className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_12px_35px_rgba(15,23,42,0.01)] hover:shadow-[0_25px_50px_rgba(13,148,136,0.04)] transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                            >
                                {/* Card Body Details Layout */}
                                <div className="p-6 sm:p-8 space-y-5 flex-1">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className={`text-[10px] font-black tracking-wider uppercase border px-2.5 py-1 rounded-lg ${responseStyles[responseStatus]}`}>
                                            {responseStatus === 'pending' ? 'Action Required' : responseStatus}
                                        </span>
                                        <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                            Ref: #{job._id?.substring(0, 8).toUpperCase() || 'JOB-N/A'}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-teal-600 block">
                                            {job.service_name || 'General Care'}
                                        </span>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            {customer.name || 'Anonymous Client'}
                                        </h3>
                                    </div>

                                    {/* Logistics Metadata Rows */}
                                    <div className="space-y-3.5 border-t border-slate-50 pt-4 text-xs font-bold text-slate-600">
                                        <div className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div className="space-y-0.5">
                                                <span className="block text-slate-900">
                                                    {job.booked_at ? new Date(job.booked_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Pending Date'}
                                                </span>
                                                <span className="text-[10px] font-medium text-slate-400 block">
                                                    Assigned to you: {job.assigned_at ? new Date(job.assigned_at).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div className="space-y-0.5">
                                                <span className="line-clamp-1 text-slate-800" title={location.detailed_address}>
                                                    {location.detailed_address || 'Address on file'}
                                                </span>
                                                <span className="text-[10px] font-medium text-slate-400 block">
                                                    Region: {location.district || 'N/A'} Division, {location.division || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Optional Section: Admin Note Toggle Area */}
                                    {assignmentNote && (
                                        <div className="border-t border-slate-50 pt-3">
                                            <button
                                                type="button"
                                                onClick={() => toggleNotes(job._id)}
                                                className="text-[11px] font-black text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                                <span>{expandedNotes[job._id] ? 'Hide' : 'Review'} Administrative Instructions</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transform transition-transform duration-200 ${expandedNotes[job._id] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {expandedNotes[job._id] && (
                                                <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium leading-relaxed animate-fadeIn">
                                                    {assignmentNote}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Functional Actions Module Box */}
                                <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-slate-50 bg-slate-50/40 flex items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                            Payout Earnings ({pricing.quantity || 1} {pricing.quantity > 1 ? pricing.unit : pricing.unit.slice(0, -1)})
                                        </span>
                                        <span className="text-base font-black text-slate-900">
                                            ${pricing.total_amount || 0}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* State Scenario A: Pending System Invocation */}
                                        {responseStatus === 'pending' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => acceptJob(job?._id)}
                                                    className="bg-slate-900 text-white hover:bg-teal-600 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md shadow-slate-950/5 active:scale-95"
                                                >
                                                    Accept Job
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => rejectJob(job?._id)}
                                                    className="bg-white text-rose-600 border border-slate-200 hover:bg-rose-50 hover:border-rose-100 px-3 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95"
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        )}

                                        {/* State Scenario B: Active Accepted Shift */}
                                        {responseStatus === 'accepted' && (
                                            <button
                                                type="button"
                                                onClick={() => completeJob(job?._id)}
                                                className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-95"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Complete Shift</span>
                                            </button>
                                        )}

                                        {/* State Scenario C: Final Archive Settled States */}
                                        {responseStatus === 'completed' && (
                                            <span className="text-[11px] text-emerald-600 font-black tracking-wide uppercase flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Completed
                                            </span>
                                        )}

                                        {/* State Scenario D: Operational Administrative Voiding */}
                                        {responseStatus === 'declined' && (
                                            <span className="text-[11px] text-slate-400 font-black tracking-wide uppercase flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/30">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Declined
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Empty Ledger State Fallback Block */
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 sm:p-16 text-center max-w-md mx-auto shadow-[0_15px_40px_rgba(15,23,42,0.01)] border border-slate-100">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="font-black text-slate-900 text-base tracking-tight">No Allocated Shifts</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed">
                        There are no shift parameters matching this operational stage in your roster matrix right now.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Jobs;