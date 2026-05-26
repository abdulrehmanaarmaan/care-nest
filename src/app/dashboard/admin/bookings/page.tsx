'use client'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaCheckCircle, FaClock, FaDollarSign, FaEye, FaSearch, FaTimesCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useUserData from '../../../../hooks/useUserData';

const Bookings = () => {

    const { data: bookings = [], refetch } = useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const result = await fetch('/api/bookings')
            return result.json()
        }
    })

    const approveBooking = async (id: number) => {

        Swal.fire({
            title: "Approve booking?",
            text: "The customer will be notified and service allocation may begin.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Approve Booking"
        }).then(async res => {
            if (res.isConfirmed) {

                const res = await fetch(`/api/bookings/${id}?status=Approved`, {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(status)
                })

                const result = await res.json()

                if (result?.success) {
                    refetch()
                    Swal.fire(
                        "Booking Approved",
                        "The customer has been notified and the booking moved to the next stage.",
                        "success"
                    )
                }
            }
        })
    }

    const rejectBooking = async (id: number) => {

        Swal.fire({
            title: "Reject booking?",
            text: "The customer will receive a rejection notification.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Reject Booking"
        }).then(async res => {
            if (res.isConfirmed) {

                const res = await fetch(`/api/bookings/${id}?status=Rejected`, {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(status)
                })

                const result = await res.json()

                if (result?.success) {
                    refetch()
                    Swal.fire(
                        "Booking Rejected",
                        "The booking was rejected and the customer has been notified.",
                        "success"
                    )
                }
            }
        })
    }

    const confirmBooking = async id => {

        const booking = bookings.find(booking => booking?._id === id)

        if (booking?.payment) {
            Swal.fire("Already Confirmed!", "This booking has already been marked as confirmed.", "info")
        }

        else {
            Swal.fire({
                title: "Confirm payment?",
                text: "This marks payment verification as completed.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm Payment"
            }).then(async res => {
                if (res.isConfirmed) {

                    const res = await fetch(`/api/bookings/${id}?status=Confirmed`, {
                        method: 'PATCH',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(status)
                    })

                    const result = await res.json()

                    if (result?.success) {
                        refetch()
                        Swal.fire(
                            "Booking Confirmed",
                            "Payment confirmation has been completed successfully.",
                            "success"
                        )
                    }
                }
            })
        }
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Global Bookings Master</h1>
                    <p className="text-slate-500 text-sm font-medium">Verify system allocations, balance financial streams, and route operations</p>
                </div>
                {/* Dynamic Operations Summary Data */}
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-2 rounded-xl text-xs font-bold text-slate-500">
                    <span className="px-3 py-1.5 bg-white shadow-sm border border-slate-200/50 rounded-lg flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        Active Ledger: <span className="text-slate-900 font-black">{bookings?.length || 0}</span>
                    </span>
                </div>
            </div>
            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Service Profile & Code</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Client Info</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Timeline / Scope</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Regional Node</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Financial Ledger</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Workflow Status</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400 text-right">Workflow Routing</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bookings && bookings.length > 0 ? (
                                bookings.map(booking => (
                                    <tr key={booking?._id} className="hover:bg-slate-50/30 transition-colors group">
                                        {/* Core Service Identifier Block */}
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-800 leading-tight">{booking?.service_name}</p>
                                            <p className="text-[10px] text-teal-600 font-mono mt-1 font-bold tracking-wider">
                                                #{booking?._id?.slice(-8).toUpperCase()}
                                            </p>
                                        </td>
                                        {/* Client Identification Node */}
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-slate-800">{booking?.customer?.name}</p>
                                            <p className="text-xs text-slate-400 font-medium">{booking?.customer?.email}</p>
                                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">UID: {booking?.customer?.id?.slice(-6)}</p>
                                        </td>
                                        {/* Allocation Duration Span */}
                                        <td className="px-6 py-5">
                                            <div className="text-sm text-slate-600 font-semibold flex items-center gap-1.5">
                                                <FaClock size={12} className="text-slate-400" />
                                                {booking?.pricing?.quantity} {booking?.pricing?.quantity === 1 ? booking?.pricing?.unit?.slice(0, -1)
                                                    : booking?.pricing?.unit}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium mt-1">
                                                Booked {booking?.booked_at ? new Date(booking.booked_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : 'N/A'}
                                            </p>
                                        </td>
                                        {/* Target Geo Node */}
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-slate-700 font-bold">{booking?.location?.district}</p>
                                            <p className="text-xs text-slate-400 truncate max-w-[130px]" title={booking?.location?.detailed_address}>
                                                {booking?.location?.division}
                                            </p>
                                        </td>
                                        {/* Financial Subsystem Badging */}
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="text-sm font-black text-slate-900">${booking?.pricing?.total_amount?.toLocaleString()}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${booking?.payment_status === 'Paid'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100/60'
                                                    : 'bg-amber-50 text-amber-700 border-amber-100/60'
                                                    }`}>
                                                    {booking?.payment_status}
                                                </span>
                                            </div>
                                        </td>
                                        {/* Operational State Pill Container */}
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${booking?.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                booking?.status === 'Approved' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                                    booking?.status === 'Completed' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                                                        'bg-rose-50 text-rose-700 border-rose-100'
                                                }`}>
                                                {booking?.status}
                                            </span>
                                        </td>
                                        {/* State Modulation Route Actions */}
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={`/dashboard/admin/bookings/${booking?._id}`}
                                                    className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                                                    title="Inspect Metadata Ledger"
                                                >
                                                    <FaEye size={16} />
                                                </Link>
                                                {/* Payment Required Notice */}
                                                {booking?.status === 'Pending Payment' &&
                                                    booking?.payment_status !== 'Paid' && (
                                                        <span
                                                            className=" inline-flex items-center px-3 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                                                        >
                                                            Awaiting Payment
                                                        </span>
                                                    )}

                                                {/* Admin Actions Only After Payment */}
                                                {(booking?.status === 'Pending Approval' && booking?.payment_status === 'Paid') && (
                                                    <>
                                                        <button
                                                            onClick={() => approveBooking(booking?._id)}
                                                            className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all cursor-pointer"
                                                            title="Approve Service Deployment"
                                                        >
                                                            <FaCheckCircle size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => rejectBooking(booking?._id)}
                                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                                            title="Reject Application Allocation"
                                                        >
                                                            <FaTimesCircle size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {booking?.status === 'Approved' && booking?.payment_status === 'Paid' && (
                                                    <button
                                                        onClick={() => confirmBooking(booking?._id)}
                                                        className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                                                        title="Settle Outstanding Balance"
                                                    >
                                                        <FaDollarSign size={16} />
                                                    </button>
                                                )}
                                                {booking?.status === "Confirmed" && (
                                                    <span
                                                        className=" inline-flex items-center px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                                                    >
                                                        Confirmed
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <FaSearch size={44} className="mb-4 opacity-20" />
                                            <p className="font-bold text-slate-500">No system records available</p>
                                            <p className="text-xs mt-1">There are no operational booking nodes cataloged across the system ledger.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Bookings;