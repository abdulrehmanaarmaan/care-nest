import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import { FaArrowLeft, FaCalendarCheck, FaClock, FaMapMarkerAlt, FaReceipt, FaUser } from 'react-icons/fa';
import { getBooking } from '../../../server/actions/bookings';
import { auth } from '../../../../lib/authOptions';

const BookingDetails = async ({ params }) => {

    const { id } = await params

    // const res = await fetch(`/api/bookings/${id}`)

    // if (!id) {
    // notFound()
    // }

    // if (!res.ok) {
    // notFound()
    // }

    const { user } = await auth()
    const booking = await getBooking(id)

    // const { id } = useParams()

    // const router = useRouter()

    // const { data: booking, isLoading } = useQuery({
    // queryKey: ['booking', id],
    // queryFn: async () => {
    // const result = await fetch(`/api/bookings/${id}`)
    // return result.json()
    // }
    // })

    // if (isLoading) {
    // return <span>Loading...</span>
    // }

    if (!booking) {
        notFound()
    }

    const { booked_at, service_name, pricing, location, status } = booking
    const { quantity, unit, base_price, total_amount } = pricing

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Top Navigation */}
                <Link
                    href='/dashboard/my-bookings'
                    className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold text-sm mb-8 transition-all group cursor-pointer"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Bookings
                </Link>
                {/* Main Content Card */}
                <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200 rounded-[2.5rem] overflow-hidden">
                    {/* Status Header */}
                    <div className="bg-slate-900 px-8 md:px-12 py-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <p className="text-teal-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Booking Reference</p>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">#{id?.toString().slice(-8)}</h1>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest ${status === 'Pending' ?
                                'bg-amber-500 text-white' :
                                status === 'Completed' ? 'bg-teal-500 text-white' : 'bg-blue-500 text-white'
                                }`}>
                                {status}
                            </span>
                            <p className="text-slate-400 text-[10px] mt-3 font-bold flex items-center gap-2 uppercase tracking-tighter">
                                <FaClock /> Booked on: {new Date(booked_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="p-8 md:p-12 space-y-12">
                        {/* Section 1: Service & Customer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-wider text-sm">
                                    <FaCalendarCheck className="text-teal-600" /> Service Requested
                                </h3>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-2xl font-black text-slate-800">{service_name}</p>
                                    <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest">
                                        Unit: {quantity} {quantity === 1 ? unit.slice(0, -1) : unit}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-wider text-sm">
                                    <FaUser className="text-teal-600" /> Customer Information
                                </h3>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-lg font-black text-slate-800">{user?.name}</p>
                                    <p className="text-slate-500 font-bold text-sm lowercase">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                        {/* Section 2: Location Details */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-wider text-sm">
                                <FaMapMarkerAlt className="text-teal-600" /> Service Address
                            </h3>
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start gap-4">
                                <div>
                                    <p className="text-slate-800 font-black text-lg">
                                        {location?.division}, {location?.district}
                                    </p>
                                    <p className="text-slate-500 font-medium mt-1">
                                        {location?.detailed_address}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Section 3: Billing Breakdown */}
                        <div className="pt-8 border-t border-slate-100">
                            <h3 className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-wider text-sm mb-6">
                                <FaReceipt className="text-teal-600" /> Payment Summary
                            </h3>
                            <div className="space-y-4 max-w-sm ml-auto">
                                <div className="flex justify-between text-slate-500 font-bold">
                                    <span>Base Price ({unit})</span>
                                    <span>${base_price}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-bold">
                                    <span>Quantity</span>
                                    <span>x {quantity}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                                    <span className="text-slate-900 font-black uppercase tracking-tighter text-lg">Total Paid</span>
                                    <span className="text-3xl font-black text-teal-600">${total_amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer Disclaimer */}
                <p className="mt-8 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                    Care Nest Protection Policy Applied
                </p>
            </div>
        </div>
    );
};

export default BookingDetails;