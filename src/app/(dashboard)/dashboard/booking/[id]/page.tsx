import React from 'react';

const Booking = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */} <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Complete Your Booking</h1>
                        <p className="text-slate-600 mt-2">Service ID: <span className="font-mono font-bold text-teal-600"></span>
                        </p>
                    </div>
                    <div className="hidden md:block text-right">
                        <span className="text-sm text-slate-500 block uppercase tracking-widest font-semibold">Total Cost</span>
                        <span className="text-2xl font-bold text-teal-600">৳ </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white shadow-sm border border-slate-200 rounded-3xl p-6 md:p-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                                Select Duration
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <label className="block text-sm font-semibold text-slate-700">How many hours/days do you need?</label>
                                <input type="number" min="1" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all" />
                                <p className="text-xs text-slate-400 italic">* Rate: ৳/unit</p>
                            </div>
                        </section>
                        <section className="bg-white shadow-sm border border-slate-200 rounded-3xl p-6 md:p-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mr-3 text-sm">2</span> Service Location </h3> <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Division</label>
                                    <select className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 outline-none bg-white"> <option>Select Division</option>
                                        <option>Dhaka</option>
                                        <option>Chittagong</option>
                                    </select> </div>
                                <div> <label className="block text-sm font-semibold text-slate-700 mb-1">District</label>
                                    <select className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 outline-none bg-white"> <option>Select District</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2"> <label className="block text-sm font-semibold text-slate-700 mb-1">Detailed Address / Area</label> <textarea placeholder="House no, Street name, Landmark..." className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all" >
                                </textarea>
                                </div>
                            </div>
                        </section>
                    </div> {/* Sticky Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow-xl shadow-teal-900/5 border border-slate-200 rounded-3xl p-6 sticky top-8"> <h3 className="text-xl font-bold text-slate-900 mb-4">Booking Summary</h3> <div className="space-y-3 pb-6 border-bottom border-slate-100"> <div className="flex justify-between text-slate-600 text-sm"> <span>Service Charge</span> <span>৳</span> </div> <div className="flex justify-between text-slate-600 text-sm"> <span>Duration</span> <span>x</span> </div> <hr className="border-slate-100" />
                            <div className="flex justify-between items-center pt-2"> <span className="font-bold text-slate-900">Total</span> <span className="text-xl font-extrabold text-teal-600">৳</span>
                            </div>
                        </div>
                            <button className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 active:transform active:scale-[0.98] transition-all shadow-lg shadow-teal-600/20 mt-4" onClick={() => alert("Booking Saved with Status: Pending")} > Confirm Booking </button>
                            <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-tighter"> By confirming, you agree to our terms of service
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Booking;