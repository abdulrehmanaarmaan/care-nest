import Link from 'next/link';
import React from 'react';
import { FaDatabase, FaShieldAlt, FaTrashAlt, FaUserCheck } from 'react-icons/fa';

const Privacy = () => {

    const complianceLayers = [
        {
            title: '1. Isolation of Personal Nodes',
            icon: <FaDatabase className="text-teal-600" />,
            text: 'We isolate data processing layers across strictly cataloged metrics. Your location districts, detailed addresses, and emergency contact details are locked down using secure access keys to block unauthorized database lookups.'
        },
        {
            title: '2. Transparent Transaction Tokens',
            icon: <FaUserCheck className="text-emerald-600" />,
            text: 'Financial data models and account logs balance directly through protected API channels. Care Nest never logs raw payment values inside local platform arrays; all telemetry passes via encrypted transaction payloads.'
        },
        {
            title: '3. Full Right to Account Purge',
            icon: <FaTrashAlt className="text-rose-600" />,
            text: 'Under data safety rules, users keep absolute authority over their registered variables. You can invoke a cascade deletion request through your account administration dashboard, which purges all matching server records within 48 hours.'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
            {/* Header Panel */}
            <div className="border-b border-slate-100 pb-5 space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-black tracking-wider text-slate-400 uppercase">
                    <FaShieldAlt />
                    <span>System Privacy Matrix</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>Updated May 2026</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Architecture</h1>
                <p className="text-slate-400 text-xs font-medium">How Care Nest monitors, maps, and safeguards active ecosystem telemetry parameters.</p>
            </div>
            {/* Absolute Dynamic Compliance Callout Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[2rem] p-6 sm:p-8 relative overflow-hidden shadow-lg border border-slate-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-full pointer-events-none" />
                <div className="relative z-10 space-y-2 max-w-xl">
                    <span className="text-[9px] font-black tracking-widest text-teal-400 uppercase bg-teal-950/80 border border-teal-900/60 px-2.5 py-1 rounded-md inline-block">
                        Zero Broker Protocol
                    </span>
                    <h2 className="text-xl font-black tracking-tight">Your data matrices are never commercialized.</h2>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">
                        Medical configurations, provider interactions, and matching request histories stay inside the system framework. Care Nest is
                        engineered to prevent external parsing dependencies.
                    </p>
                </div>
            </div>
            {/* Structural Interactive Feature Blocks */}
            <div className="space-y-4">
                {complianceLayers.map((layer, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-5 sm:p-6 rounded-[2rem] shadow-[0_10px_30px_rgba(15,23,42,0.005)] flex flex-col sm:flex-row gap-4 items-start">
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex-shrink-0">
                            {layer.icon}
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                                {layer.title}
                            </h3>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                                {layer.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Operational Backlink Router Action */}
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div>
                    <p className="text-xs font-black text-slate-800">Have deep inquiries regarding cryptography or security layers?</p>
                    <p className="text-[11px] text-slate-400 font-medium">Connect directly with our security compliance unit.</p>
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-slate-900 border border-slate-200 font-black text-[10px] tracking-wider uppercase px-4 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                    <span>Open Compliance Route</span>
                </Link>
            </div>
        </div>
    );
};

export default Privacy;