'use client'
import React, { useState } from 'react';
import { FaCheck, FaEnvelope, FaHeadphones, FaPaperPlane, FaPhoneAlt } from 'react-icons/fa';

const Contact = () => {

    const [formState, setFormState] = useState({ name: '', email: '', topic: 'General Support', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.name || !formState.email || !formState.message) return;
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormState({ name: '', email: '', topic: 'General Support', message: '' });
        }, 4000);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="inline-flex items-center px-3 py-1 text-[10px] font-black tracking-[0.15em] text-slate-500 bg-slate-100 border border-slate-200 rounded-md uppercase">
                    Support Interface
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Connect With Our Helpdesk</h1>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">Have queries regarding administrative verification, provider deployment,
                    or billing tracks?</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Help channels column */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-[0_10px_30px_rgba(15,23,42,0.01)] relative overflow-hidden flex gap-4 items-start group hover:border-teal-100 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-teal-50/30 rounded-bl-full pointer-events-none" />
                        <div className="p-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-100 flex-shrink-0 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                            <FaEnvelope size={16} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">E-Mail Operations</h3>
                            <p className="text-teal-600 font-bold text-sm mt-1">support@carenest.com</p>
                            <p className="text-slate-400 text-[11px] font-medium mt-0.5">Response timeframe within 12 system hours.</p>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-[0_10px_30px_rgba(15,23,42,0.01)] relative overflow-hidden flex gap-4 items-start group hover:border-emerald-100 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50/30 rounded-bl-full pointer-events-none" />
                        <div className="p-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-100 flex-shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <FaPhoneAlt size={15} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">Direct System Line</h3>
                            <p className="text-slate-800 font-black text-sm mt-1">+880 1725 348534</p>
                            <p className="text-slate-400 text-[11px] font-medium mt-0.5">Mon - Fri, 9:00 AM to 6:00 PM (GMT+6)</p>
                        </div>
                    </div>
                    <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-sm relative overflow-hidden space-y-3">
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
                        <div className="flex items-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest">
                            <FaHeadphones />
                            <span>Live Assistance</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                            Need immediate help adjusting an ongoing provider booking? Our administrative agents monitor support routes actively.
                        </p>
                        <button type="button" className="inline-flex items-center gap-2 bg-white text-slate-900 font-black text-[10px] tracking-wider uppercase px-4 py-2.5 rounded-xl hover:bg-teal-400 transition-all cursor-pointer">
                            Open Telemetry Chat
                        </button>
                    </div>
                </div>
                {/* Dynamic State Form Panel */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-8 shadow-sm relative">
                    {isSubmitted ? (
                        <div className="py-16 text-center space-y-4 animate-fadeIn">
                            <div className="w-12 h-12 bg-teal-50 border border-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <FaCheck size={16} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">Signal Received Successfully</h3>
                                <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
                                    Your inquiry regarding <span className="text-slate-800 font-bold">{formState.topic}</span> has been indexed. Check
                                    your inbox for verification confirmation shortly.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formState.name}
                                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                        placeholder="Abdul Rehman"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white bg-slate-50/40 transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formState.email}
                                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                        placeholder="abdul@gmail.com"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white bg-slate-50/40 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Inquiry Topic</label>
                                <select
                                    value={formState.topic}
                                    onChange={(e) => setFormState({ ...formState, topic: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-500 bg-slate-50/40 transition-all appearance-none"
                                >
                                    <option>General Account Assistance</option>
                                    <option>Provider Verification Processing</option>
                                    <option>Billing & Transaction Discrepancies</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Detailed Message</label>
                                <textarea
                                    rows={4}
                                    required
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    placeholder="Detail your inquiry context clearly..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white bg-slate-50/40 transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-teal-600 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-900/5"
                            >
                                <FaPaperPlane size={11} />
                                <span>Dispatch Support Signal</span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;