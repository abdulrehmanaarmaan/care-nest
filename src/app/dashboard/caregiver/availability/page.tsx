'use client'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import useUnsavedChangesHandler from '../../../../hooks/useUnsavedChangesWarning';
import { usePathname } from 'next/navigation';

interface AvailabilitySchema {
    enabled: boolean;
    days: string[];
    start_time?: string;
    end_time?: string;
    accepts_emergency_requests: boolean;
    max_daily_assignments?: number;
}

const Availability = () => {

    const { data, status } = useSession()
    const { id } = data?.user || {}

    const { data: savedSchedule = {}, refetch } = useQuery({
        queryKey: ['saved_schedule', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await fetch(`/api/caregiver-schedules?caregiver_id=${id}`)
            return res.json()
        }
    })

    const { timezone, status: availability_status } = savedSchedule || {}

    const { handleSubmit, register, control, reset, setValue, formState: { isSubmitting, isDirty } } = useForm<AvailabilitySchema>({
        defaultValues: {
            enabled: false,
            days: [],
            accepts_emergency_requests: false,
        }
    })

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const availabilityInfo = useWatch({ control })

    const { enabled, accepts_emergency_requests } = availabilityInfo

    const storageKey = `caregiver-availability-draft-${id}`

    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        if (status !== 'authenticated' && !id && !isHydrated) return

        const timeout = setTimeout(() => {
            localStorage.setItem(
                storageKey,
                JSON.stringify(availabilityInfo)
            )
        }, 500)
        return () => clearTimeout(timeout)

    }, [status, id, storageKey, availabilityInfo, isHydrated])

    useEffect(() => {

        if (status !== 'authenticated' && !id && isHydrated) return

        const savedDraft = localStorage.getItem(storageKey)

        const parsedDraft = JSON.parse(savedDraft)

        if (savedDraft) {
            reset(parsedDraft)

            setTimeout(() => {
                setIsHydrated(true)
            }, 300)
        }

        else if (savedSchedule && Object.keys(savedSchedule).length > 0) {
            reset({
                enabled: savedSchedule?.enabled,
                days: savedSchedule?.days,
                start_time: savedSchedule?.start_time,
                end_time: savedSchedule?.end_time,
                accepts_emergency_requests: savedSchedule?.accepts_emergency_requests,
                max_daily_assignments: savedSchedule?.max_daily_assignments
            })
        }

        else {
            reset({ max_daily_assignments: 1 })
        }

        setTimeout(() => {
            setIsHydrated(true)
        }, 300)

    }, [status, id, storageKey, reset, savedSchedule, isHydrated])

    const hasUnsavedChanges = isDirty

    const pathname = usePathname()

    useUnsavedChangesHandler({ hasUnsavedChanges, pathname })

    const saveAvailability = async (data) => {

        const { enabled, days, start_time, end_time, accepts_emergency_requests, max_daily_assignments } = data

        const availability = {
            caregiver_id: id,
            enabled,
            days,
            start_time,
            end_time,
            timezone: "Asia/Dhaka",
            accepts_emergency_requests,
            max_daily_assignments,
            status: enabled ? 'Active' : 'Inactive',
        }

        if (savedSchedule && Object.keys(savedSchedule).length > 0) {
            const res = await fetch(`/api/caregiver-schedules?caregiver_id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(availability)
            })

            const result = await res.json()

            if (result?.success) {
                refetch()
                toast.success('Availability updated successfully')
                localStorage.removeItem(storageKey)
            }

            else {
                toast.info('No changes detected')
            }
        }

        else {
            const res = await fetch('/api/caregiver-schedules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(availability)
            })

            const result = await res.json()

            if (result?.success) {
                refetch()
                toast.success('Schedule saved successfully')
                localStorage.removeItem(storageKey)
            }
        }
    }

    return (
        <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50/20">
            {/* ==========================================
                1. ROUTE HEADER
               ========================================== */}
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
                    <p className="text-slate-500 text-xs font-medium max-w-2xl">
                        Manage your profile's directory discovery visibility, operational shifts, capacity thresholds, and structural timezone matrix synchronizations.
                    </p>
                </div>
            </div>

            {/* ==========================================
                2. CORE CONTROLS LAYOUT SPLIT
               ========================================== */}
            <form onSubmit={handleSubmit(saveAvailability)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Form Control Interface block */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_35px_rgba(15,23,42,0.01)] space-y-8">

                        {/* TOGGLE VISIBILITY CAPABILITY ROUTER */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/80 border border-slate-100 p-5 rounded-2xl">
                            <div className="space-y-1 text-left">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                    Available for Allocations
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-md">
                                    When deactivated, your directory node drops out of matching queues to block incoming assignment booking streams.
                                </p>
                            </div>
                            {/* Handcrafted accessible and responsive switch component */}
                            <Controller
                                name='enabled'
                                control={control}
                                render={({ field }) => (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const nextEnabled = !field.value
                                            field.onChange(nextEnabled)
                                            if (!nextEnabled) {
                                                setValue('days', [])
                                                setValue('start_time', '')
                                                setValue('end_time', '')
                                                setValue('accepts_emergency_requests', false)
                                            }
                                        }}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out outline-none ${enabled ? 'bg-teal-600' :
                                            'bg-slate-200'
                                            }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-full w-5 transform rounded-full bg-white shadow-sm transition duration-300 ease-in-out absolute ${enabled ? 'right-0' : 'right-full'
                                                }`}
                                        />
                                    </button>
                                )}
                            />
                        </div>

                        {/* WORKING DAYS CHECKBOX LOOP */}
                        <div className={`space-y-4 transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none select-none'}`}>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Authorized Operational Days
                            </h3>
                            <Controller
                                name='days'
                                control={control}
                                render={({ field }) => (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {weekDays.map((day) => {
                                            const isChecked = field?.value?.includes(day)
                                            return (
                                                <label
                                                    key={day}
                                                    className={`border rounded-xl px-4 py-3 flex items-center gap-3 text-xs font-extrabold cursor-pointer transition-all duration-200 ${isChecked
                                                        ? 'bg-teal-50/30 border-teal-200 text-slate-900 shadow-sm'
                                                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={!!isChecked}
                                                        disabled={!enabled}
                                                        onChange={() => isChecked ? field.onChange(field?.value?.filter(value => value !== day)) : field.onChange([...field.value, day])}
                                                        className="w-4 h-4 accent-teal-600 border-slate-300 rounded cursor-pointer transition-transform active:scale-90"
                                                    />
                                                    <span>{day.slice(0, 3)}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            />
                        </div>

                        {/* TIME RANGE CONTROLS ROW */}
                        <div className={`space-y-4 transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none select-none'}`}>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Operational Shift Boundaries
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Shift Commences</label>
                                    <input
                                        type="time"
                                        // value={availability.start_time}
                                        disabled={!enabled}
                                        // onChange={(e) => setAvailability(prev => ({ ...prev, start_time: e.target.value }))}
                                        {...register('start_time')}
                                        required={enabled}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-xs font-extrabold focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Shift Concludes</label>
                                    <input
                                        type="time"
                                        // value={availability.end_time}
                                        disabled={!enabled}
                                        // onChange={(e) => setAvailability(prev => ({ ...prev, end_time: e.target.value }))}
                                        {...register('end_time')}
                                        required={enabled}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-xs font-extrabold focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ADVANCED MONGO CONTROLS: ALLOCATIONS MATRIX & CRISIS RADAR */}
                        <div className={`space-y-5 border-t border-slate-100 pt-6 transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none select-none'}`}>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Advanced Node Dispatch Thresholds
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Max Concurrent Daily Load</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        // value={availability.max_daily_assignments || 3}
                                        disabled={!enabled}
                                        // onChange={(e) => setAvailability(prev => ({ ...prev, max_daily_assignments: parseInt(e.target.value) || 1 }))}
                                        {...register('max_daily_assignments')}
                                        required={enabled}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-xs font-extrabold focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-4 border border-slate-100 rounded-xl px-4 py-2 bg-slate-50/40">
                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider block">Emergency Dispatch</span>
                                        <span className="text-[10px] text-slate-400 font-medium block">Accept flash booking requests</span>
                                    </div>
                                    <Controller
                                        name='accepts_emergency_requests'
                                        control={control}
                                        render={({ field }) => (
                                            < button
                                                type="button"
                                                disabled={!enabled}
                                                onClick={() => field.onChange(!field.value)}
                                                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${accepts_emergency_requests && enabled ? 'bg-rose-500' : 'bg-slate-200'}`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-full w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out absolute ${accepts_emergency_requests && enabled ? 'right-0' : 'right-full'}`}
                                                />
                                            </button>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Explanatory Status Insight Box */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-[0_12px_35px_rgba(15,23,42,0.01)] flex flex-col justify-between min-h-[340px]">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                </svg>
                                Engine Diagnostics
                            </h3>

                            {enabled ? (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 text-emerald-800 animate-fadeIn">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    <div className="text-[11px] font-semibold space-y-1">
                                        <span className="block font-black uppercase tracking-wider text-[9px] text-emerald-800">
                                            Node Cluster Status: {availability_status || 'Inactive'}
                                        </span>
                                        <p className="leading-relaxed text-emerald-700/90">
                                            Your profile matrix is verified, globalized, and visible to incoming service-seeker calculations.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-slate-600 animate-fadeIn">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                    <div className="text-[11px] font-semibold space-y-1">
                                        <span className="block font-black uppercase tracking-wider text-[9px] text-slate-500">Node Hidden</span>
                                        <p className="leading-relaxed text-slate-400">
                                            Active indexing is bypassed. Client interfaces will pass over your availability coordinates entirely.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* TIMEZONE INDEX METADATA */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1.5 text-xs text-slate-600">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">Active Timezone</span>
                                    <span className="font-mono font-bold text-slate-800 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                                        {timezone || "Asia/Dhaka"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-50">
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className={`w-full px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-sm ${isSubmitting ? `bg-slate-300 text-slate-500 cursor-not-allowed opacity-80` : `bg-slate-900 text-white hover:bg-teal-600 active:scale-[0.98] cursor-pointer`}`}
                            >
                                {isSubmitting && (
                                    <span className="w-3.5 h-3.5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                                )}
                                {isSubmitting ? 'Saving Changes...' : 'Sync Engine Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    );
};

export default Availability;