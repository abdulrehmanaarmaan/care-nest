'use client'
import { useParams } from 'next/navigation';
import useBookingDetails from '../../../../../hooks/useBookingDetails';
import useCaregiversData from '../../../../../hooks/useCaregiversData';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import useUsersData from '../../../../../hooks/useUsersData';
import useAvailabilitySchedules from '../../../../../hooks/useAvailabilitySchedules';

const BookingAllocationConsole = () => {

    const { id } = useParams()

    const { booking, isLoading, refetch } = useBookingDetails(id)

    const { caregivers } = useCaregiversData()

    const { schedules } = useAvailabilitySchedules('Active')

    const { data: bookings = [] } = useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const res = await fetch('/api/bookings')
            return res.json()
        }
    })

    const { register, handleSubmit } = useForm()

    const { data } = useSession()
    const { id: adminId } = data?.user || {}

    const { users } = useUsersData()

    const activeCaregivers = users.filter(user => user?.role === 'caregiver' && user?.account_status !== 'deactivated')

    if (isLoading) {
        return <>Loading...</>
    }

    const { _id, status, service_name, booked_at, location, pricing, customer, payment_status, payment_intent, paid_at, approved_at, caregiver_id, allocation_notes, is_emergency } = booking
    const { district, division, detailed_address } = location

    const basedOnRequest = schedules.filter(schedule => schedule?.accepts_emergency_requests === is_emergency)

    const possibleCaregivers = caregivers.filter(caregiver => {

        const schedule = basedOnRequest.find(
            s => s?.caregiver_id === caregiver?.userId
        )

        const caregiverUser = activeCaregivers.find(
            user => user?._id === caregiver?.userId
        )

        const assignedBookingsCount = bookings.filter(
            booking => booking?.caregiver_id === caregiver?.userId
        ).length

        return (
            caregiver?.specialization === service_name &&
            schedule &&
            assignedBookingsCount < schedule?.max_daily_assignments &&
            caregiverUser?.address?.division === division &&
            caregiverUser?.address?.district === district
        )
    })

    console.log(possibleCaregivers)

    const { quantity, unit, total_amount } = pricing
    const { id: customerId, email, name } = customer
    const bookingCustomer = users.find(user => user?._id === customerId)
    const { phone } = bookingCustomer || {}

    const assignToCaregiver = async data => {

        const { caregiver_id, allocation_notes } = data

        console.log(allocation_notes)

        const assignedBooking = {
            status: "Assigned",
            caregiver_id: caregiver_id,

            assigned_by: adminId,

            assigned_at: new Date(),

            allocation_notes,
        }

        const bookingRes = await fetch(`/api/bookings/${id}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignedBooking)
        })

        const bookingResult = await bookingRes.json()

        if (bookingResult?.success) {

            refetch()

            const job = {
                customer_id: customerId,
                caregiver_id,
                assigned_by: adminId,
                assigned_at: new Date(),
                status: 'pending',
                caregiver_response: 'pending',
                pricing: {
                    quantity,
                    unit,
                    total_amount
                },
                customer: {
                    name,
                    email,
                    phone
                },
                location: {
                    division,
                    district,
                    detailed_address
                },
                booking_id: _id,
                booked_at,
                assignment_note: allocation_notes,
                payment_status,
                payout_status: "pending",
                is_active: true,
                is_archived: false,
                created_at: new Date(),
                updated_at: new Date()
            }

            const jobRes = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(job)
            })

            const jobResult = await jobRes.json()

            if (jobResult?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Caregiver Assigned',
                    text: 'The booking has been assigned successfully.',
                    timer: 2000,
                    showConfirmButton: false
                })
            }
        }
    }

    const isAssigned = status === 'Assigned' || status === 'In Progress' || status === 'Completed'

    const selectedCaregiver = possibleCaregivers.find(caregiver => caregiver?.userId === caregiver_id)
    const { userId: caregiverId } = selectedCaregiver || {}

    const responseBadgeConfig = {
        Confirmed: "bg-amber-50 border-amber-200 text-amber-700",
        'In Progress': "bg-teal-50 border-teal-200 text-teal-700",
        'Pending Reassignment': "bg-rose-50 border-rose-200 text-rose-700"
    };

    return (
        <main className="min-h-screen bg-slate-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ==========================================
                    1. BENTO HERO HEADER BANNER
                   ========================================== */}
                <section className="bg-white shadow-[0_20px_50px_rgba(13,148,136,0.03)] rounded-[2rem] border border-slate-100 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/40 rounded-bl-full -mr-16 -mt-16 pointer-events-none" aria-hidden="true" />

                    <div className="space-y-2 relative z-10">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-black tracking-wider text-slate-400 uppercase">
                            <span>Operations</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-teal-600">Booking Management</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Booking Allocation Console
                        </h1>
                        <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-xl">
                            Verify client parameters, inspect transactional clearings, and delegate an available healthcare specialist.
                        </p>
                    </div>

                    {/* Operational Badges */}
                    <div className="flex flex-row md:flex-col lg:flex-row items-center gap-3 bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl flex-shrink-0 self-start md:self-center">
                        <div className="text-left">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booking ID</span>
                            <code className="text-xs sm:text-sm font-black text-slate-900 bg-slate-200/60 px-2 py-0.5 rounded md:block md:mt-0.5">
                                #{_id?.substring(0, 8).toUpperCase() || 'BK-93201'}
                            </code>
                        </div>
                        <div className="w-px h-8 bg-slate-200 md:hidden lg:block" />
                        <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">System Status</span>
                            <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${isAssigned
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                : status === 'Approved'
                                    ? 'bg-teal-50 border-teal-200 text-teal-700'
                                    : 'bg-amber-50 border-amber-200 text-amber-700'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status ? 'bg-indigo-500' : status === 'Approved' ? 'bg-teal-500' : 'bg-amber-500'}`} />
                                {isAssigned ? 'Caregiver Assigned' : (status || 'Approved')}
                            </span>
                        </div>
                    </div>
                </section>

                {/* ==========================================
                    2. PRIMARY INTERACTIVE DATA ARCHITECTURE
                   ========================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT / CENTER COLUMN: CORE CONTEXT METRICS (2/3 Grid Width) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* CARD A: CASE DOSSIER METRICS */}
                        <article className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_15px_40px_rgba(15,23,42,0.01)] space-y-6">
                            <header className="border-b border-slate-50 pb-4 flex items-center gap-3">
                                <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Booking Details</h2>
                            </header>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1 bg-slate-50/60 p-4 rounded-2xl border border-slate-100/50">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Requested Service</span>
                                    <p className="text-sm font-black text-slate-900">{service_name || 'Senior Care'}</p>
                                </div>
                                <div className="space-y-1 bg-slate-50/60 p-4 rounded-2xl border border-slate-100/50">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Allocation Target Date</span>
                                    <p className="text-sm font-black text-slate-900">
                                        {booked_at ? new Date(booked_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'May 28, 2026'}
                                    </p>
                                </div>
                                <div className="space-y-1 bg-slate-50/60 p-4 rounded-2xl border border-slate-100/50">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration Allotment</span>
                                    <p className="text-sm font-black text-slate-900">
                                        {quantity || 1} {quantity > 1 ? (unit || 'days') : (unit?.replace(/s$/, '') || 'day')}
                                    </p>
                                </div>
                                <div className="space-y-1 bg-slate-50/60 p-4 rounded-2xl border border-slate-100/50">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deployment Address</span>
                                    <p className="text-sm font-black text-slate-900 truncate" title={location.detailed_address}>
                                        {detailed_address || 'Barguna, Barisal, Bangladesh'}
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* CARD B: CUSTOMER IDENTITY INSIGHT */}
                        <article className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_15px_40px_rgba(15,23,42,0.01)] space-y-6">
                            <header className="border-b border-slate-50 pb-4 flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-xl text-teal-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Customer Information</h2>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Legal Name</span>
                                    <p className="text-sm font-black text-slate-800">{name || 'Abdul Rehman Aarmaan'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                                    <p className="text-sm font-bold text-teal-600 truncate">{email || 'abdulrehmanaarmaan@gmail.com'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Communication Line</span>
                                    <p className="text-sm font-semibold text-slate-800">{bookingCustomer?.phone || '017XXXXXXXX'}</p>
                                </div>
                            </div>
                        </article>

                        {/* CARD C: FINANCIAL AUDITING CONTEXT */}
                        <article className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_15px_40px_rgba(15,23,42,0.01)] space-y-6">
                            <header className="border-b border-slate-50 pb-4 flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-xl text-teal-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Payment Summary</h2>
                            </header>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 items-center">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gateway Status</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                        }`}>
                                        {payment_status || 'Paid'}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Ledger Amount</span>
                                    <p className="text-lg font-black text-slate-900">${total_amount || '130'}</p>
                                </div>
                                <div className="space-y-0.5 col-span-2 md:col-span-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clearing Protocol</span>
                                    <p className="text-sm font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full inline-block" />
                                        {payment_intent ? 'Stripe Secure' : 'Stripe Platform'}
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* RIGHT COLUMN: ACTION CONTROLS & COMPLIANCE TIMELINE (1/3 Grid Width) */}
                    <aside className="space-y-6 lg:sticky lg:top-6">

                        {/* CONTROL BLOCK B: DISPATCH ASSIGNMENT FORM */}
                        <article className="bg-white border border-slate-100 shadow-[0_20px_50px_rgba(13,148,136,0.03)] rounded-[2rem] p-6 space-y-5">
                            <header className="border-b border-slate-50 pb-3">
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Assign Specialist</h2>
                            </header>

                            <form onSubmit={handleSubmit(assignToCaregiver)} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1 block">Select Active Carer</label>
                                    <div className="relative">
                                        <select
                                            defaultValue={isAssigned ? caregiverId : ''}
                                            disabled={isAssigned && caregiverId}
                                            {...register('caregiver_id')}
                                            required
                                            className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium text-sm appearance-none text-slate-800 ${isAssigned ? 'cursor-not-allowed text-slate-400 bg-slate-100' : 'cursor-pointer'
                                                }`}
                                        >
                                            <option value="">Select available medical staff...</option>
                                            {possibleCaregivers.map(c => (
                                                <option key={c?._id} value={c?.userId}>{c?.name} ({c?.specialization})</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1 block">Internal Assignment Notes</label>
                                    <textarea
                                        defaultValue={isAssigned ? allocation_notes : ''}
                                        disabled={isAssigned}
                                        {...register('allocation_notes')}
                                        required
                                        rows={3}
                                        placeholder="Input administrative guidelines, operational criteria or specific patient constraints here..."
                                        className={`w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium text-xs sm:text-sm text-slate-800 resize-none leading-relaxed ${caregiver_id ? 'cursor-not-allowed text-slate-400 bg-slate-100' : ''
                                            }`} />
                                </div>

                                <button
                                    disabled={isAssigned}
                                    type="submit"
                                    className={`w-full text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wide active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-teal-600/10 group ${isAssigned
                                        ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                        : 'bg-teal-600 hover:bg-teal-700 cursor-pointer'
                                        }`}
                                >
                                    <span>{isAssigned ? 'Allocation Lodged' : 'Deploy Assignment'}</span>
                                    {!isAssigned && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        </article>

                        {/* CONTROL BLOCK C: CURRENT LIVE DELEGATION ROSTER */}
                        <article className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4">
                            <header className="border-b border-slate-50 pb-3">
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Allocation Manifest</h2>
                            </header>
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100/60">
                                <div className="space-y-0.5">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Staff</span>
                                    <span className="text-xs font-black text-slate-800 block">
                                        {isAssigned ? (selectedCaregiver?.name || 'Staff Asset Assigned') : 'Not Delegated'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    {
                                        <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider border ${(status === 'Assigned' || status === 'Completed') ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                            {status}
                                        </span>
                                    }
                                </div>
                            </div>
                        </article>

                        {/* CONTROL BLOCK D: COMPLIANCE SYSTEMS AUDIT TRAIL */}
                        <article className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4">
                            <header className="border-b border-slate-50 pb-3">
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Audit Registry</h2>
                            </header>
                            <ul className="space-y-4 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                <li className="relative before:absolute before:-left-[17px] before:top-1 before:w-2.5 before:h-2.5 before:bg-teal-500 before:rounded-full before:border-2 before:border-white text-xs font-bold text-slate-700">
                                    Booking Schema Provisioned
                                    <span className="block text-[10px] font-medium text-slate-400 mt-0.5">
                                        {booked_at ? new Date(booked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:45 AM'}
                                    </span>
                                </li>
                                <li className="relative before:absolute before:-left-[17px] before:top-1 before:w-2.5 before:h-2.5 before:bg-indigo-500 before:rounded-full before:border-2 before:border-white text-xs font-bold text-slate-700">
                                    Transaction Confirmed via intent
                                    <span className="block text-[10px] font-medium text-slate-400 mt-0.5">
                                        {paid_at ? new Date(paid_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:45 AM'}
                                    </span>
                                </li>
                                <li className="relative before:absolute before:-left-[17px] before:top-1 before:w-2.5 before:h-2.5 before:bg-emerald-500 before:rounded-full before:border-2 before:border-white text-xs font-bold text-slate-700">
                                    Operational Pipeline Approved
                                    <span className="block text-[10px] font-medium text-slate-400 mt-0.5">
                                        {approved_at ? new Date(approved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:47 AM'}
                                    </span>
                                </li>
                            </ul>
                        </article>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default BookingAllocationConsole;