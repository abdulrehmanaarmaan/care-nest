'use client'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { FaBoxOpen, FaEye, FaPlus, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import DashboardLoader from '../loading';

const MyBookings = () => {

    const { data } = useSession();

    console.log(data)

    const { email } = data?.user || {}

    const { data: bookings = [], isLoading, refetch } = useQuery({
        queryKey: ['bookings', email],
        enabled: !!email,
        queryFn: async () => {
            const result = await fetch(`/api/bookings?email=${email}`)
            return result.json()
        }
    })

    if (isLoading) {
        return <DashboardLoader></DashboardLoader>
    }

    const cancelBooking = async id => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then(async res => {
            if (res.isConfirmed) {

                const response = await fetch(`/api/bookings/${id}`, {
                    method: 'PATCH'
                })

                const result = await response.json()
                if (result?.success) {
                    refetch()
                        .then(() => {
                            Swal.fire({
                                title: 'Cancelled!',
                                text: 'Booking cancelled',
                                icon: "success"
                            })
                        })
                }
            }
        });
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage and track your service history</p>
                </div>
                <button className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 text-sm active:scale-95">
                    <FaPlus size={12} /> New Booking
                </button>
            </div>
            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Service & ID</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Duration/Qty</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Location</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Total Amount</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Status</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bookings.length > 0 ? (
                                bookings.map(booking => (
                                    <tr key={booking?._id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-800 leading-tight">{booking?.service_name}</p>
                                            <p className="text-[10px] text-teal-600 font-mono mt-1 font-bold">#{booking?._id.slice(-8).
                                                toUpperCase()}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm text-slate-600 font-semibold">
                                                {booking?.pricing?.quantity} {booking?.pricing?.quantity === 1 ? booking?.pricing?.unit.slice(0, -1) : booking?.pricing?.unit}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-slate-700 font-bold">{booking?.location?.district}</p>
                                            <p className="text-xs text-slate-400 truncate max-w-[150px]">{booking?.location?.division}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-slate-900">${booking?.pricing?.total_amount?.
                                                toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border`}>
                                                {booking?.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={`/dashboard/my-bookings/${booking?._id}`} className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all" title="View Details">
                                                    <FaEye size={16} />
                                                </Link>
                                                {booking?.status !== 'Cancelled' && (
                                                    <button onClick={() => cancelBooking(booking?._id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer" title="Cancel Booking">
                                                        <FaTimes size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <FaBoxOpen size={48} className="mb-4 opacity-20" />
                                            <p className="font-bold text-slate-500">No bookings found</p>
                                            <p className="text-xs mt-1">You haven't booked any services yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default MyBookings;