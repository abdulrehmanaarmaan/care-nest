import React from 'react';

const MyBookings = () => {

    const bookings = [];
    return (
        <div className="space-y-6"> {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
                    <p className="text-slate-500 text-sm">Manage and track your service history</p>
                </div>
                <button className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 text-sm"> + New Booking </button>
            </div>
            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">Service & ID</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">Duration</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">Location</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">Total Cost</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">Status</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bookings.map((booking) =>
                            (<tr key={booking.id} className="hover:bg-slate-50/30 transition-colors group"> <td className="px-6 py-5">
                                <p className="font-bold text-slate-800">{booking.service}</p>
                                <p className="text-xs text-teal-600 font-mono">#{booking.id}</p>
                            </td>
                                <td className="px-6 py-5 text-sm text-slate-600">{booking.duration}</td>
                                <td className="px-6 py-5 text-sm text-slate-600 truncate max-w-37.5"> {booking.location}
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-slate-900"> ৳ {booking.cost.toLocaleString()} </td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border`}> {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="View Details"> <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="商15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </button> {booking.status === 'Pending' && (<button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Cancel Booking"> <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> </button>)}
                                    </div>
                                </td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyBookings;