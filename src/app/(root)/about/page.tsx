'use client'
import React, { useState } from 'react';
import { FaClock, FaFingerprint, FaHeartbeat } from 'react-icons/fa';

const About = () => {

    const [activeValueTab, setActiveValueTab] = useState(0);

    const stats = [
        { value: '4.9/5', label: 'Ecosystem Rating', desc: 'Verified client reviews' },
        { value: '12K+', label: 'Allocations Routed', desc: 'Successful matchings' },
        { value: '100%', label: 'Credential Checked', desc: 'Multi-layer screening' },
    ];

    const valueDetails = [
        { id: 0, title: 'Uncompromised Cryptographic Security', icon: <FaFingerprint />, text: 'All continuous tracking cycles, medical records, and location structures are fully isolated behind distributed cryptographic firewalls.' },
        { id: 1, title: 'Real-Time Telemetry & Matching', icon: <FaClock />, text: 'Our platform matches family requirements with specialist care matrices instantaneously using criteria-weight tracking metrics.' },
        { id: 2, title: 'Absolute Ledger Transparency', icon: <FaHeartbeat />, text: 'No hidden premiums or processing markups. Operational statements are upfront, crystal clear, and cleanly itemized.' },
    ];

    return (
        <div className="min-h-screen bg-slate-50/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-16">
            {/* Dynamic Floating Hero Header Element */}
            <section className="max-w-5xl mx-auto text-center space-y-4 relative bg-white border border-slate-100 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(15,23,42,0.01)] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/40 rounded-bl-full pointer-events-none" />
                <span className="inline-flex items-center px-3 py-1 text-[10px] font-black tracking-[0.15em] text-teal-700 bg-teal-50 border border-teal-100/60 rounded-md uppercase">
                    Ecosystem Identity
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
                    Redefining Specialized Care Networks Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Absolute Trust.</span>
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto">
                    Care Nest is engineered to bridge the trust layer between specialized care providers and families. We mix modern verification workflows with deep human empathy.
                </p>

                {/* Scaled Core Metric Tickers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-3xl mx-auto">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                            <p className="text-[11px] font-extrabold text-slate-800 tracking-wide mt-0.5">{stat.label}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{stat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Asymmetric Core Interface Block with Interactive Switcher */}
            <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-6">
                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase block">Ecosystem Manifesto</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                        Built on validation frameworks.
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                        Finding certified professionals for your loved ones should never feel like a blind search. Every provider instance matches exact system validation parameters before account status changes to active.
                    </p>

                    {/* Dynamic Tab Switcher List */}
                    <div className="space-y-2">
                        {valueDetails.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveValueTab(item.id)}
                                className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${activeValueTab === item.id
                                    ? 'bg-white border-teal-200 shadow-md shadow-slate-100'
                                    : 'bg-transparent border-transparent hover:bg-slate-100/50'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg text-xs ${activeValueTab === item.id ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {item.icon}
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-slate-800">{item.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Value Visualization Panel */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-10 shadow-sm relative min-h-[260px] flex flex-col justify-center overflow-hidden">
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-slate-50 rounded-full pointer-events-none" />
                    <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center text-teal-600 font-bold">
                            {valueDetails[activeValueTab].icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                            {valueDetails[activeValueTab].title}
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                            {valueDetails[activeValueTab].text}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;