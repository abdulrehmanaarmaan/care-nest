'use client'
import React, { useState } from 'react';
import { FaBookmark, FaFileAlt } from 'react-icons/fa';

const Terms = () => {

    const [selectedSection, setSelectedSection] = useState('sec-1');

    const termsData = [
        { id: 'sec-1', label: '01. Framework', title: 'Ecosystem Framework Agreement', text: 'By instantiating a verified user account layer inside the Care Nest architecture, you authenticate that you explicitly comply with all operational metrics and screening criteria set forth within this deployment ledger. Continuous algorithmic checks run on every account creation to enforce system criteria rules.' },
        { id: 'sec-2', label: '02. Accounts', title: 'Onboarding & Integrity Metrics', text: 'Ecosystem workspace profiles are strictly bound to individual verified identities. Users are uniquely responsible for safe-keeping cryptographic hash parameters and preventing secondary sessions. Care Nest maintains real-time monitoring locks to isolate irregular system authentication spikes.' },
        { id: 'sec-3', label: '03. Logistics', title: 'Service Matchmaking Rules', text: 'Care Nest manages an automated interface routing caregiver credentials to matching client configurations. While we process deep background verifications, the performance layer of individual physical contracts is managed directly between the client and the allocated provider asset.' },
        { id: 'sec-4', label: '04. Ledgers', title: 'Financial Settle Operations', text: 'Service charges are itemized based on pricing arrays parsed at booking initialization (calculated per day, hour, or quantity). Platform transactional components are fully upfront. Cancellations trigger system rules that return processing tokens dynamically based on admin approvals.' }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
            {/* Page Heading Anchor */}
            <div className="border-b border-slate-100 pb-5 space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-black tracking-wider text-slate-400 uppercase">
                    <FaFileAlt />
                    <span>Regulatory Architecture</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>Revision 2026.2</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
                <p className="text-slate-400 text-xs font-medium">Please parse through these platform constraints carefully before invoking operational loops.</p>
            </div>

            {/* Responsive Structural Sidebar Layout Wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Navigation Deck Sidebar */}
                <nav className="md:col-span-4 space-y-1.5 bg-white border border-slate-200 p-4 rounded-[2rem] shadow-sm sticky top-6">
                    <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block px-2 mb-2">Document Indices</span>
                    {termsData.map((section) => (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => {
                                setSelectedSection(section.id);
                                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${selectedSection === section.id
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <span>{section.label}</span>
                            {selectedSection === section.id && <FaBookmark size={10} className="text-teal-400" />}
                        </button>
                    ))}
                </nav>

                {/* Content Flow Window */}
                <div className="md:col-span-8 space-y-6">
                    {termsData.map((section) => (
                        <section
                            key={section.id}
                            id={section.id}
                            onClick={() => setSelectedSection(section.id)}
                            className={`p-6 sm:p-8 bg-white border rounded-[2rem] transition-all duration-300 space-y-3 scroll-mt-6 ${selectedSection === section.id
                                ? 'border-teal-200 shadow-md shadow-teal-600/[0.01]'
                                : 'border-slate-200'
                                }`}
                        >
                            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                                {section.title}
                            </h2>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                                {section.text}
                            </p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Terms;