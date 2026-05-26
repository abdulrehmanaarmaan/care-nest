'use client'
import React, { useState } from 'react';
import { FaCalendar, FaEyeSlash, FaGlobe, FaRegClock, FaSlidersH } from 'react-icons/fa';

interface AvailabilitySchema {
    enabled: boolean;
    days: string[];
    startTime: string;
    endTime: string;
}

const Availability = () => {

    // State infrastructure mapping exact requested schema values
    const [availability, setAvailability] = useState<AvailabilitySchema>({
        enabled: true,
        days: ['Sunday', 'Monday'],
        startTime: '09:00',
        endTime: '17:00'
    });

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const toggleAvailabilityState = () => {
        setAvailability(prev => ({ ...prev, enabled: !prev.enabled }));
    };

    const handleDayCheckboxChange = (day: string) => {
        setAvailability(prev => {
            const isSelected = prev.days.includes(day);
            const updatedDays = isSelected
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day];
            return { ...prev, days: updatedDays };
        });
    };

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* ROUTE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase">
                        <span>Provider Core</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>Search Parameters</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Availability Controls
                    </h1>
                    <p className="text-slate-400 text-xs font-medium">
                        Manage your network index presence, active duty days, and structural synchronization frames.
                    </p>
                </div>
            </div>

            {/* CORE CONTROLS LAYOUT SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Form Control Interface block */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_30px_rgba(15,23,42,0.01)] space-y-8">

                        {/* TOGGLE VISIBILITY CAPABILITY ROUTER */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 border border-slate-100/80 p-5 rounded-2xl">
                            <div className="space-y-1 text-left">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                    Available for Allocations
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-md">
                                    When deactivated, your directory node will immediately drop out of active search results to stop incoming reservation requests.
                                </p>
                            </div>

                            {/* Responsive Custom Toggle Key */}
                            <button
                                type="button"
                                onClick={toggleAvailabilityState}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none relative ${availability.enabled ? 'bg-teal-600' : 'bg-slate-200'
                                    }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out absolute ${!availability.enabled ? 'right-full' : 'right-0'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* WORKING DAYS CHECKBOX LOOP */}
                        <div className={`space-y-4 transition-opacity duration-300 ${availability.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <FaCalendar size={12} className="text-teal-600" /> Authorized Operational Days
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {weekDays.map((day) => {
                                    const isChecked = availability.days.includes(day);
                                    return (
                                        <label
                                            key={day}
                                            className={`border rounded-xl px-4 py-3 flex items-center gap-3 text-xs font-extrabold cursor-pointer transition-all ${isChecked
                                                ? 'bg-teal-50/20 border-teal-200 text-slate-900'
                                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                disabled={!availability.enabled}
                                                onChange={() => handleDayCheckboxChange(day)}
                                                className="w-3.5 h-3.5 accent-teal-600 border-slate-300 rounded cursor-pointer"
                                            />
                                            <span>{day.slice(0, 3)}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* TIME RANGE CONTROLS ROW */}
                        <div className={`space-y-4 transition-opacity duration-300 ${availability.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <FaRegClock size={12} className="text-teal-600" /> Operational Shift Boundaries
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Shift Commences</label>
                                    <input
                                        type="time"
                                        value={availability.startTime}
                                        disabled={!availability.enabled}
                                        onChange={(e) => setAvailability(prev => ({ ...prev, startTime: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-xs font-extrabold focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Shift Concludes</label>
                                    <input
                                        type="time"
                                        value={availability.endTime}
                                        disabled={!availability.enabled}
                                        onChange={(e) => setAvailability(prev => ({ ...prev, endTime: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-xs font-extrabold focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Explanatory Status Insight Box */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.01)] flex flex-col justify-between">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <FaSlidersH size={11} className="text-teal-600" /> Engine Diagnostics
                            </h3>

                            {availability.enabled ? (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 text-emerald-800">
                                    <FaGlobe className="text-emerald-500 mt-0.5 flex-shrink-0" size={14} />
                                    <div className="text-[11px] font-semibold space-y-1">
                                        <span className="block font-black uppercase tracking-wider text-[9px]">Node Active & Indexable</span>
                                        <p className="leading-relaxed text-emerald-700/90">
                                            Your profile is visible to care seekers matching availability filter matrices.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-slate-600">
                                    <FaEyeSlash className="text-slate-400 mt-0.5 flex-shrink-0" size={14} />
                                    <div className="text-[11px] font-semibold space-y-1">
                                        <span className="block font-black uppercase tracking-wider text-[9px] text-slate-500">Node Hidden</span>
                                        <p className="leading-relaxed text-slate-400">
                                            Database configurations are skipping your node profile. No incoming booking payloads will arrive.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-50">
                            <button
                                type="button"
                                className="w-full bg-slate-900 text-white hover:bg-teal-600 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm shadow-slate-900/5"
                            >
                                Sync Engine Settings
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Availability;