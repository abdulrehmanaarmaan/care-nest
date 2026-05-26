'use client'
import React, { useState } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaHeart, FaMapMarkerAlt, FaTimesCircle } from 'react-icons/fa';

// Strict interface reflecting the bookings collection schema with UI extensions
interface CaregiverJob {
    _id: string; // bookingId
    caregiverId: string;
    patientName: string;
    serviceType: string; // e.g., "Senior Care", "Infant Care"
    scheduledDate: string;
    scheduledTime: string;
    location: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    hourlyRate: number;
    totalHours: number;
}

const Jobs = () => {

    const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

    // Live database mock data mapping to the bookings schema requirements
    const [jobs, setJobs] = useState<CaregiverJob[]>([
        {
            _id: "b-90112",
            caregiverId: "6a002f38bf58a0d969558632",
            patientName: "Rahim Uddin",
            serviceType: "Senior Care",
            scheduledDate: "Jun 12, 2026",
            scheduledTime: "09:00 AM - 01:00 PM",
            location: "Gulshan-2, Dhaka",
            status: "upcoming",
            hourlyRate: 30,
            totalHours: 4
        },
        {
            _id: "b-90084",
            caregiverId: "6a002f38bf58a0d969558632",
            patientName: "Mrs. Sufia Begum",
            serviceType: "Medical Companion",
            scheduledDate: "May 23, 2026",
            scheduledTime: "02:00 PM - 06:00 PM",
            location: "Dhanmondi, Dhaka",
            status: "ongoing",
            hourlyRate: 35,
            totalHours: 4
        },
        {
            _id: "b-89871",
            caregiverId: "6a002f38bf58a0d969558632",
            patientName: "Zayan Ahmed",
            serviceType: "Infant Care",
            scheduledDate: "May 19, 2026",
            scheduledTime: "10:00 AM - 04:00 PM",
            location: "Uttara Sector 4, Dhaka",
            status: "completed",
            hourlyRate: 28,
            totalHours: 6
        }
    ]);

    const handleStatusChange = (id: string, newStatus: 'ongoing' | 'completed' | 'cancelled') => {
        setJobs(jobs.map(job => job._id === id ? { ...job, status: newStatus } : job));
    };

    const filteredJobs = activeTab === 'all' ? jobs : jobs.filter(job => job.status === activeTab);

    // Status utility style map
    const statusStyles = {
        upcoming: 'bg-blue-50 border-blue-100 text-blue-700',
        ongoing: 'bg-amber-50 border-amber-100 text-amber-700 animate-pulse',
        completed: 'bg-emerald-50 border-emerald-100 text-emerald-700',
        cancelled: 'bg-slate-50 border-slate-100 text-slate-400',
    };

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* 1. ROUTE HEADER */}
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
                    <p className="text-slate-400 text-xs font-medium">
                        Manage your incoming requests, live shift check-ins, and historic allocation schedules.
                    </p>
                </div>
            </div>

            {/* 2. STATE SUB-FILTERING NAVIGATION */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 p-1.5 rounded-2xl overflow-x-auto scrollbar-none">
                {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide capitalize transition-all cursor-pointer whitespace-nowrap ${activeTab === tab
                            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                            : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        {tab} Assignments
                    </button>
                ))}
            </div>

            {/* 3. JOB MATRIX CONTROLLER FLOW */}
            {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => (
                        <div
                            key={job._id}
                            className="bg-white border border-slate-200 rounded-[2rem] shadow-[0_12px_30px_rgba(15,23,42,0.01)] hover:shadow-[0_20px_40px_rgba(13,148,136,0.03)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
                        >
                            {/* Card Meta Content Header */}
                            <div className="p-6 space-y-4 flex-1">
                                <div className="flex items-center justify-between gap-4">
                                    <span className={`text-[10px] font-black tracking-wider uppercase border px-2.5 py-1 rounded-lg ${statusStyles[job.status]}`}>
                                        {job.status}
                                    </span>
                                    <span className="text-[11px] font-mono font-bold text-slate-400">Ref: #{job._id.split('-')[1]}</span>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-teal-600 block">{job.serviceType}</span>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                        <FaHeart className="text-slate-300" size={14} />
                                        {job.patientName}
                                    </h3>
                                </div>

                                {/* Logistics Metadata Rows */}
                                <div className="space-y-2.5 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-600">
                                    <div className="flex items-center gap-2.5">
                                        <FaCalendarAlt className="text-slate-400 flex-shrink-0" size={12} />
                                        <span>{job.scheduledDate} <span className="text-slate-300 font-normal">|</span> {job.scheduledTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <FaMapMarkerAlt className="text-slate-400 flex-shrink-0" size={12} />
                                        <span className="line-clamp-1">{job.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Functional Actions Module Box */}
                            <div className="px-6 pb-6 pt-4 border-t border-slate-50 bg-slate-50/40 flex items-center justify-between gap-4">
                                <div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Fee</span>
                                    <span className="text-base font-black text-slate-900">${job.hourlyRate * job.totalHours}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {job.status === 'upcoming' && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleStatusChange(job._id, 'ongoing')}
                                                className="bg-slate-900 text-white hover:bg-teal-600 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleStatusChange(job._id, 'cancelled')}
                                                className="bg-white text-rose-600 border border-slate-200 hover:bg-rose-50 hover:border-rose-100 px-3 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}

                                    {job.status === 'ongoing' && (
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange(job._id, 'completed')}
                                            className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                                        >
                                            <FaCheckCircle size={10} />
                                            <span>Mark Completed</span>
                                        </button>
                                    )}

                                    {job.status === 'completed' && (
                                        <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                                            <FaCheckCircle className="text-emerald-500" /> Settled
                                        </span>
                                    )}

                                    {job.status === 'cancelled' && (
                                        <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                                            <FaTimesCircle className="text-rose-400" /> Voided
                                        </span>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                /* Empty Ledger State fallback */
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 text-center max-w-md mx-auto shadow-sm">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                        <FaClock size={16} />
                    </div>
                    <h3 className="font-black text-slate-900 text-base tracking-tight">No Active Assignments</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                        There are no allocations inside this state scope matrix currently.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Jobs;