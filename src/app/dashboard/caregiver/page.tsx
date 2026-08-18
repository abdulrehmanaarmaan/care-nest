'use client'
import React, { useMemo } from 'react';
import { FaArrowRight, FaBell, FaBriefcase, FaCalendarCheck, FaCheckCircle, FaClock, FaHistory, FaSlidersH, FaStar, FaUser, FaWallet } from 'react-icons/fa';
import useUserData from '../../../hooks/useUserData';
import useMySchedule from '../../../hooks/useMySchedule';
import useMyJobs from '../../../hooks/useMyJobs';
import useBookingsData from '../../../hooks/useBookingsData';
import useWithdrawals from '../../../hooks/useWithdrawals';
import { formatDistanceToNow } from 'date-fns';
import useBankAccount from '../../../hooks/useBankAccount';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import useMyReviews from '../../../hooks/useMyReviews';
import useMyNotifications from '../../../hooks/useMyNotifications';

const Caregiver = () => {

    const { user, isLoading } = useUserData()
    const { _id } = user || {}

    const { reviews } = useMyReviews(_id)

    const { notifications } = useMyNotifications(_id)

    const { savedSchedule, isLoading: loadingSchedule } = useMySchedule()

    const { jobs } = useMyJobs()

    const { bookings, isLoading: loadingBookings } = useBookingsData(null, _id)

    const { withdrawals } = useWithdrawals(_id)

    const completedJobs = jobs.filter(job => job?.status === 'completed')

    const upcomingVisits = bookings
        ?.filter(
            booking =>
                booking?.status === 'Confirmed' ||
                booking?.status === 'Assigned'
        )
        ?.sort(
            (a, b) =>
                new Date(a?.visit_date).getTime() -
                new Date(b?.visit_date).getTime()
        );

    const nextVisit = upcomingVisits[0]

    const { customer, service_name, visit_date, visit_start_time, pricing, location } = nextVisit || {}
    const { quantity, unit } = pricing || {}

    const paidWithdrawals = withdrawals.filter(withdrawal => withdrawal?.status === 'Paid')

    const pendingPayout = useMemo(() => withdrawals.filter(withdrawal => withdrawal?.status === 'Approved').map(withdrawal => withdrawal?.pricing?.total_amount).reduce((a, b) => a + b, 0), [withdrawals])

    const earnings = useMemo(() => paidWithdrawals.map(withdrawal => withdrawal?.amount).reduce((a, b) => a + b, 0), [paidWithdrawals])

    const now = new Date();

    const paidThisMonth = paidWithdrawals.filter(withdrawal => {
        const paidAt = new Date(withdrawal?.paid_at);
        return (
            paidAt.getFullYear() === now.getFullYear() &&
            paidAt.getMonth() === now.getMonth()
        );
    })

    const earnedThisMonth = useMemo(() => paidThisMonth.map(withdrawal => withdrawal?.amount).reduce((a, b) => a + b, 0), [paidThisMonth])

    const ratings = reviews.map(review => review?.rating)

    const averageRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length * 100 : 0;

    const { bankAccount } = useBankAccount(_id)

    if (isLoading || loadingSchedule || loadingBookings) {
        return <>Loading...</>
    }

    const { name, profile_image, phone, is_verified, address } = user || {}
    const { division, district, street_address } = address || {}

    const { enabled, days } = savedSchedule || {}

    const activities = [
        ...completedJobs.map(job => ({
            message: `Completed ${bookings.find(booking => booking?._id === job?.booking_id)?.service_name} assignment`,
            created_at: job?.completed_at,
        })),
        ...withdrawals.map(withdrawal => ({
            message: `Requested withdrawal of ৳${withdrawal?.amount}`,
            created_at: withdrawal?.requested_at,
        })),
    ]
        .sort(
            (a, b) => (b?.requested_at || b?.created_at) - (a?.requested_at || a?.created_at)
        )
        .slice(0, 5);

    const profileChecks = [
        Boolean(name),
        Boolean(profile_image),
        Boolean(phone),
        Boolean(is_verified),
        Boolean(division),
        Boolean(district),
        Boolean(street_address),
        Boolean(bankAccount?._id),
        Boolean(enabled || days?.length),
    ];

    const completedItems = profileChecks.filter(Boolean).length

    const profileProgress = Math.round((completedItems / profileChecks.length) * 100)

    return (
        <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* 1. WELCOME HEADER CONTAINER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                    {profile_image ? (
                        <Image
                            src={profile_image}
                            alt={name}
                            width={56}
                            height={56}
                            className="w-14 h-14 rounded-full object-cover border-2 border-teal-500/20 shadow-sm"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <FaUser className="text-xl" />
                        </div>
                    )}
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Welcome Back, {name?.split(' ')[0] || 'Abdul'}
                        </h1>
                        <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                            Ready for your next scheduled health care delivery session.
                        </p>
                    </div>
                </div>

                {/* Verification Badge Status */}
                {is_verified ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-100/70 text-teal-700 text-[10px] font-black uppercase tracking-wider self-start md:self-center shadow-sm">
                        <FaCheckCircle className="text-xs" />
                        Verified Caregiver
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100/70 text-amber-700 text-[10px] font-black uppercase tracking-wider self-start md:self-center shadow-sm animate-pulse">
                        <FaClock className="text-xs" />
                        Verification Pending
                    </div>
                )}
            </div>

            {/* 2. QUICK STATS CARDS GRID MATRIX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Upcoming Visits */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Upcoming Visits</p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{upcomingVisits.length}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100/40 flex items-center justify-center">
                        <FaCalendarCheck className="text-sm" />
                    </div>
                </div>

                {/* Completed Jobs */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Completed Jobs</p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{completedJobs.length}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-500 border border-slate-100 flex items-center justify-center">
                        <FaBriefcase className="text-sm" />
                    </div>
                </div>

                {/* Monthly Earnings */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">This Month Earnings</p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">৳{earnedThisMonth.toLocaleString()}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/40 flex items-center justify-center">
                        <span className="text-sm font-black">৳</span>
                    </div>
                </div>

                {/* Rating Matrix */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Rating Profile</p>
                        <div className="flex items-baseline gap-1.5 mt-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{averageRating || 0}</h2>
                            <span className="text-amber-500 text-xs">★</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold">{reviews.length} {reviews.length > 1 ? 'client reviews' : 'client review'}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100/40 flex items-center justify-center">
                        <FaStar className="text-sm" />
                    </div>
                </div>
            </div>

            {/* DASHBOARD MASTER CONTROL LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* LEFT 2 COLUMNS: PRIMARY PIPELINE OPERATORS */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 4. NEXT UPCOMING VISIT PANEL */}
                    {nextVisit ? (<div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black mb-1"> Client </p>
                                <p className="font-black text-white text-lg"> {customer?.name} </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black mb-1"> Service Type </p>
                                <p className="font-bold text-teal-400"> {service_name} </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black mb-1"> Date </p>
                                <p className="font-bold text-white"> {visit_date} </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black mb-1"> Start Time </p>
                                <p className="font-bold text-white"> {visit_start_time} </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black mb-1"> Duration </p> <p className="font-bold text-white"> {quantity} {unit} </p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black mb-1"> Location </p>
                            <p className="text-sm font-medium text-slate-200 leading-relaxed"> {location?.detailed_address} </p>
                        </div>
                    </div>) : (
                        <div className="py-10 flex flex-col items-center justify-center text-center animate-fadeIn">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                                <FaCalendarCheck className="text-xl text-teal-400/80" />
                            </div>
                            <h4 className="font-black text-white text-sm">No Active Care Slots</h4>
                            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                                You have no scheduled patient home visits left for today. New allocations appear here automatically.
                            </p>
                        </div>
                    )}

                    {/* 9. QUICK ACTIONS ROUTER LINK CARDS */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 px-1">
                            Quick Actions
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                                { name: 'Assigned Jobs', icon: <FaBriefcase />, path: '/dashboard/caregiver/jobs' },
                                { name: 'Availability', icon: <FaSlidersH />, path: '/dashboard/caregiver/availability' },
                                { name: 'Earnings Log', icon: <FaWallet />, path: '/dashboard/caregiver/earnings' },
                                { name: 'My Profile', icon: <FaUser />, path: '/dashboard/caregiver/profile' },
                                { name: 'Client Reviews', icon: <FaStar />, path: '/dashboard/caregiver/reviews' },
                                { name: 'Notifications', icon: <FaBell />, path: '/dashboard/caregiver/notifications' }
                            ].map((action, i) => (
                                <Link
                                    href={action.path}
                                    key={i}
                                    className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-teal-500/30 transition-all group flex flex-col justify-between items-start gap-4"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors flex items-center justify-center text-xs border border-slate-100">
                                        {action.icon}
                                    </div>
                                    <div className="w-full flex items-center justify-between gap-1">
                                        <span className="text-xs font-black text-slate-800 tracking-tight">{action.name}</span>
                                        <FaArrowRight className="text-[9px] text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 8. RECENT REVIEWS FEED CARD */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Latest Client Feedback</h3>
                                <p className="text-[11px] text-slate-400 font-medium">Your absolute recent performance valuations.</p>
                            </div>
                        </div>

                        <div className="space-y-4 divide-y divide-slate-50">
                            {reviews.length ? reviews.slice(0, 3).map((review) => (
                                <div key={review?._id} className={`${review?._id > 0 ? 'pt-4' : ''} space-y-1.5`}>
                                    <div className="flex text-amber-500 text-[10px] tracking-tight">
                                        {Array.from({ length: review?.rating || 5 }).map((_, i) => <span key={i}>★</span>)}
                                    </div>
                                    <p className="text-xs font-medium text-slate-700 italic leading-relaxed">
                                        {review?.review_text}
                                    </p>
                                </div>
                            )) : (
                                <div className="py-8 flex flex-col items-center justify-center text-center animate-fadeIn">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 text-slate-400">
                                        <FaStar className="text-sm" />
                                    </div>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">No Review Records Found</h4>
                                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs px-2 leading-relaxed">
                                        Completed bookings generate reviews. Patient metrics and performance stars will reflect here after your incoming sessions.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* RIGHT SIDEBAR PANEL: METRICS, STATUSES & TRACKERS */}
                <div className="space-y-6">

                    {/* 3. AVAILABILITY COMPACT STATUS CARD */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between group">
                        <div className="space-y-1">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Availability Status</h3>
                            <p className="text-[10px] text-slate-400 font-medium">Visible to clients looking for immediate dispatch.</p>
                        </div>
                        {enabled ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-[10px] font-black uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                Available
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-100/50 text-[10px] font-black uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                Unavailable
                            </span>
                        )}
                    </div>

                    {/* 7. PROFILE COMPLETION METER BLOCK */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Profile Completion</h3>
                                <p className="text-[10px] text-slate-400 font-medium">Required for matching parameters algorithm.</p>
                            </div>
                            <span className="text-xs font-black text-teal-600 bg-teal-50 border border-teal-100/30 px-2 py-0.5 rounded-md">
                                {profileProgress || '85'}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${profileProgress || 85}%` }}
                            />
                        </div>
                    </div>

                    {/* 6. EARNINGS SUMMARY SNAPSHOT CONTAINER */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-2">
                            Earnings Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pending Payout</p>
                                <p className="text-base font-black text-amber-600">৳{pendingPayout?.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1 border-l border-slate-100 pl-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Lifetime Gross</p>
                                <p className="text-base font-black text-slate-800">৳{earnings?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* 10. LIVE NOTIFICATIONS FEED DRAWER */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Notifications</h3>
                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                        </div>
                        <div className="space-y-3">
                            {notifications.length ? notifications.slice(0, 3).map((notification) => (
                                <div key={notification?._id} className="flex gap-3 items-start text-xs text-slate-600 font-medium leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                    <p>{notification?.message}</p>
                                </div>
                            )) : (
                                <div className="py-6 flex flex-col items-center justify-center text-center animate-fadeIn">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-2.5 text-slate-400">
                                        <FaBell className="text-xs" />
                                    </div>
                                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700">Inbox is Clear</h4>
                                    <p className="text-[10px] text-slate-400 mt-0.5 max-w-[200px] leading-relaxed">
                                        There are no new active general account announcements right now.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 5. RECENT OPERATIONS ACTIVITY LOGS */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100/40 border border-slate-100 rounded-[2rem] p-6 space-y-4">
                        <div className="flex items-center gap-2 text-slate-900">
                            <FaHistory className="text-xs shrink-0 text-slate-400" />
                            <h4 className="text-xs font-black uppercase tracking-wider">Recent Activity</h4>
                        </div>
                        <div className="space-y-3 text-[11px] font-semibold text-slate-600">
                            {activities.length ? (
                                activities.map((log, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <span className="text-emerald-600 mt-2px">✓</span>
                                        <div className="flex flex-col">
                                            <span>{log?.message}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {formatDistanceToNow(new Date(log?.requested_at || log?.created_at), {
                                                    addSuffix: true,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-4 flex flex-col items-center justify-center text-center animate-fadeIn">
                                    <p className="text-[11px] text-slate-400 font-medium max-w-xs leading-relaxed">
                                        No operations actions recorded inside this active dashboard monitoring bracket.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Caregiver;