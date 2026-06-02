'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import useAllServices from '../../../hooks/useAllServices';

const Services = () => {

    const { services } = useAllServices()

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* ==========================================
            1. PUBLIC CATALOG HEADER
           ========================================== */}
                <section className="bg-white shadow-[0_20px_50px_rgba(13,148,136,0.04)] rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none" aria-hidden="true"></div>
                    <div className="relative z-10 space-y-2 max-w-2xl">
                        <span className="inline-flex items-center px-4 py-1.5 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase bg-teal-50 border border-teal-100/50 rounded-full">
                            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                            Ecosystem Programs
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                            Our Specialized Services
                        </h1>
                        <p className="text-slate-500 font-medium text-xs sm:text-sm md:text-base max-w-xl">
                            Explore clinical, background-checked assistance options built to secure health metrics and support family wellness.
                        </p>
                    </div>
                    {/* Context Total Counter Badge */}
                    <div className="relative z-10 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-2xl p-4 md:self-center">
                        <span className="block text-2xl font-black text-slate-900">{services?.length || 0}</span>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Active Options</span>
                    </div>
                </section>

                {/* ==========================================
            2. SERVICES INTERACTION GRID
           ========================================== */}
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {services && services.length > 0 ? (
                        services.map((service) => (
                            <article
                                key={service?._id}
                                className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_15px_40px_rgba(15,23,42,0.02)] hover:shadow-[0_20px_50px_rgba(13,148,136,0.06)] hover:border-teal-100/70 transition-all duration-300 group flex flex-col h-full overflow-hidden"
                            >
                                {/* Image Header Block */}
                                <div className="h-48 w-full bg-slate-100 relative overflow-hidden flex-shrink-0">
                                    {service?.image_url ? (
                                        <img
                                            src={service.image_url}
                                            alt={service.service_name}
                                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-700 font-black text-xl uppercase">
                                            {service?.service_name?.charAt(0)}
                                        </div>
                                    )}
                                    {/* Category Tag overlay */}
                                    <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md">
                                        {service?.category}
                                    </span>
                                </div>

                                {/* Content Shell wrapper to fill heights cleanly */}
                                <div className="p-6 flex flex-col justify-between flex-grow space-y-5">
                                    <div className="space-y-3">
                                        {/* Title and Quality Rating Layer */}
                                        <div className="flex items-start justify-between gap-2">
                                            <h2 className="font-black text-slate-900 tracking-tight text-xl group-hover:text-teal-600 transition-colors line-clamp-1">
                                                {service?.service_name}
                                            </h2>
                                            <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-[10px] font-black text-amber-700">{service?.rating?.toFixed(1)}</span>
                                            </div>
                                        </div>

                                        {/* Dynamic Professional Authorization Meta Tag */}
                                        <p className="text-xs font-bold text-slate-400 tracking-wide line-clamp-1">
                                            Provider Track: <span className="text-slate-600">{service?.professional_status}</span>
                                        </p>

                                        {/* Description Paragraph */}
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
                                            {service?.description}
                                        </p>

                                        <div className="w-full h-px bg-slate-100 pt-1" />

                                        {/* Feature Array Mapping Area */}
                                        <div className="space-y-1.5">
                                            <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block mb-2">Program Inclusions</span>
                                            {service?.features?.slice(0, 4).map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-semibold">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="line-clamp-1">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Operational Bottom Metrics Module */}
                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-baseline justify-between bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rate Card</span>
                                            <div className="text-right">
                                                <span className="text-xl font-black text-slate-900">${service?.price}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">/ {service?.duration_label}</span>
                                            </div>
                                        </div>

                                        {/* View Details routing action button */}
                                        <Link
                                            href={`/service/${service?._id}`}
                                            className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-teal-700 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-600/10 group/btn"
                                        >
                                            <span>Initiate Allocation</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full bg-white border border-slate-100 rounded-[2rem] p-16 text-center shadow-sm">
                            <p className="font-bold text-slate-500 text-lg">No services discovered</p>
                            <p className="text-xs text-slate-400 mt-1">There are no operational programs cataloged across the system database right now.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Services;