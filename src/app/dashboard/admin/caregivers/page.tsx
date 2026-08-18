'use client'
import React, { useMemo, useState } from 'react';
import { FaArrowUp, FaBan, FaChevronDown, FaCircle, FaDownload, FaEdit, FaExclamationTriangle, FaEye, FaIdCard, FaRegEnvelope, FaSearch, FaStar, FaUniversity, FaUserNurse } from 'react-icons/fa';
import useUsersData from '../../../../hooks/useUsersData';
import useAvailabilitySchedules from '../../../../hooks/useAvailabilitySchedules';
import { useQuery } from '@tanstack/react-query';
import useCaregiversData from '../../../../hooks/useCaregiversData';
import useWithdrawals from '../../../../hooks/useWithdrawals';
import useAllServices from '../../../../hooks/useAllServices';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

const Caregivers = () => {

    const { handleSubmit, register, setError, clearErrors, formState: { isSubmitting, errors } } = useForm()

    const { data } = useSession()

    const { id: myId } = data?.user || {}

    const { users, refetch, isLoading } = useUsersData()

    const { schedules } = useAvailabilitySchedules()

    const { caregivers: caregiverProfiles } = useCaregiversData()

    const { withdrawals } = useWithdrawals()

    const paidWithdrawals = withdrawals.filter(withdrawal => withdrawal?.status === "Paid")

    const activeSchedules = schedules.filter(schedule => schedule?.status === "Active")

    const { data: caregiverJobs = [] } = useQuery({
        queryKey: ['caregiver-jobs'],
        queryFn: async () => {
            const res = await fetch('/api/jobs')
            return res.json()
        }
    })

    const { data: caregiverReviews = [] } = useQuery({
        queryKey: ['caregiver-reviews'],
        queryFn: async () => {
            const res = await fetch('/api/caregiver-reviews')
            return res.json()
        }
    })

    const { services, isLoading: loadingServices } = useAllServices()

    const incompleteJobStatuses = ['assigned', 'accepted']

    const incompleteJobs = caregiverJobs.filter(job => incompleteJobStatuses.includes(job?.status))

    const completedJobs = caregiverJobs.filter(job => job?.status === "completed")

    const assignedCaregivers = useMemo(() => [...new Set(incompleteJobs.map(job => job?.caregiver_id))], [incompleteJobs])

    const now = useMemo(() => new Date(), []);

    const completedThisMonth = useMemo(() => [...new Set(
        completedJobs
            .filter(job => {
                const completedDate = new Date(job?.completed_at);

                return (
                    completedDate.getMonth() === now.getMonth() &&
                    completedDate.getFullYear() === now.getFullYear()
                );
            })
            .map(job => job?.caregiver_id)
    )], [completedJobs, now]);

    const caregivers = users.filter(user => user?.role === "caregiver")

    const activeCaregivers = caregivers.filter(user => user?.account_status === "active")

    const inactiveCaregivers = caregivers.filter(user => user?.account_status === "deactivated")

    const [selectedIds, setSelectedIds] = useState([]);

    // Search and Filtering States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [availFilter, setAvailFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');

    // Drawer / Modal focused caregiver for detailed snapshot (Section 9)
    const [activeDetailProvider, setActiveDetailProvider] = useState(null);
    const [activeEditProvider, setActiveEditProvider] = useState(null);

    // ================= SECTION 2 — METRICS ENGINE =================
    const stats = useMemo(() => {
        const total = activeCaregivers.length;
        const available = activeSchedules.length;
        const busy = assignedCaregivers.length;
        const suspended = inactiveCaregivers.length;
        const avgRating = (caregiverReviews.reduce((acc, c) => acc + c?.rating, 0) / caregiverReviews.length || 0).toFixed(1);
        const activeThisMonth = completedThisMonth.length;

        return { total, available, busy, suspended, avgRating, activeThisMonth };
    }, [caregivers, activeSchedules, assignedCaregivers, inactiveCaregivers, caregiverReviews, completedThisMonth]);

    const scheduleMap = useMemo(() => {
        return schedules.reduce((acc, schedule) => {
            acc[schedule?.caregiver_id] = schedule;
            return acc;
        }, {});
    }, [schedules]);

    const profileMap = useMemo(() => {
        return caregiverProfiles.reduce((acc, profile) => {
            acc[profile?.userId] = profile;
            return acc;
        }, {});
    }, [caregiverProfiles]);

    const reviewMap = useMemo(() => {
        const map = {};
        caregiverReviews.forEach(review => {
            if (!map[review?.caregiver_id]) {
                map[review?.caregiver_id] = {
                    total: 0,
                    count: 0,
                    average: 0,
                };
            }
            map[review?.caregiver_id].total += review?.rating;
            map[review?.caregiver_id].count++;
            map[review?.caregiver_id].average =
                map[review?.caregiver_id].total / map[review?.caregiver_id].count;
        });
        return map;
    }, [caregiverReviews]);

    const completedJobMap = useMemo(() => {
        const map = {};
        completedJobs.forEach(job => {
            if (!map[job?.caregiver_id]) {
                map[job?.caregiver_id] = 0;
            }
            map[job?.caregiver_id]++;
        });
        return map;
    }, [completedJobs]);

    // ================= PIPELINE QUERY FILTERING =================
    const filteredCaregivers = useMemo(() => {
        return caregivers.filter(c => {

            const search = searchTerm.toLowerCase()
            const matchesSearch = c?.name.toLowerCase().includes(search) ||
                c?.email.toLowerCase().includes(search) ||
                c?.phone?.includes(search) || searchTerm === "";
            const matchesStatus = c?.account_status === statusFilter || statusFilter === "all";
            const matchesAvail = scheduleMap[c?._id]?.status === availFilter || availFilter === "busy" && assignedCaregivers.includes(c?._id) || availFilter === "all";
            const matchesService = profileMap[c?._id]?.specialization === serviceFilter || serviceFilter === "all";
            const matchesRating = reviewMap[c?._id]?.average >= Number(ratingFilter) || ratingFilter === "all";

            return matchesSearch && matchesStatus && matchesAvail && matchesService && matchesRating;
        });
    }, [caregivers, searchTerm, statusFilter, availFilter, assignedCaregivers, serviceFilter, ratingFilter, scheduleMap, profileMap, reviewMap]);

    // Leaderboards & WatchLists Computations (Sections 5 & 6)
    const leaderboard = useMemo(() => {
        return caregivers
            .map(caregiver => {
                const completed = completedJobMap[caregiver?._id] ?? 0;

                const earnings = paidWithdrawals
                    .filter(w => w?.caregiver_id === caregiver?._id)
                    .reduce((sum, w) => sum + w?.amount, 0);

                return {
                    ...caregiver,
                    completed,
                    earnings
                };
            })
            .sort((a, b) => b?.completed - a?.completed)
            .slice(0, 3);
    }, [caregivers, completedJobMap, paidWithdrawals]);

    const watchList = useMemo(() => {
        return caregivers.filter(caregiver => {

            const avgRating = reviewMap[caregiver?._id]?.average

            const incomplete =
                incompleteJobs.filter(
                    job =>
                        job?.caregiver_id === caregiver?._id
                ).length;

            return (avgRating ?? 0) < 3 || incomplete >= 5;
        });
    }, [caregivers, reviewMap, incompleteJobs]);

    const timeline = useMemo(() => {
        return [...caregiverJobs]
            .sort(
                (a, b) =>
                    new Date(b?.updated_at).getTime() - new Date(a?.updated_at).getTime()
            )
            .slice(0, 5);
    }, [caregiverJobs]);

    const lifetime = useMemo(() => completedJobs
        .filter(job => job?.caregiver_id === activeDetailProvider?._id)
        .reduce(
            (sum, job) => sum + job?.pricing?.total_amount,
            0
        ), [completedJobs, activeDetailProvider?._id]);

    const thisMonthEarnings = useMemo(() =>
        completedJobs
            .filter(job => {

                const completed = new Date(job?.completed_at);

                return (
                    job?.caregiver_id === activeDetailProvider?._id &&
                    completed.getMonth() === now.getMonth() &&
                    completed.getFullYear() === now.getFullYear()
                )

            })
            .reduce((sum, job) => sum + job?.pricing?.total_amount, 0)
        , [activeDetailProvider?._id, completedJobs, now])

    const pendingWithdrawals = useMemo(() => withdrawals
        .filter(
            w =>
                w?.caregiver_id === activeDetailProvider?._id &&
                w.status === "Pending"
        )
        .reduce((sum, w) => sum + w?.amount, 0), [activeDetailProvider?._id, withdrawals]);

    // Bulk Handling Matrix Operations (Section 10)
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredCaregivers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredCaregivers.map(c => c._id));
        }
    };

    const toggleSelectOne: any = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const selectedCaregivers = selectedIds.length > 1

    const handleBulkStatusUpdate = async (status, id = null) => {
        // setActiveDetailProvider(prev => prev.map(c => selectedIds.includes(c._id) ? { ...c, account_status: newStatus } : c));

        if (status === "deactivated") {
            Swal.fire({
                title: `Suspend Selected ${selectedCaregivers ? 'Caregivers' : 'Caregiver'}?`,
                text: `The selected ${selectedCaregivers ? 'caregivers' : 'caregiver'} will no longer receive new service assignments until their accounts are reactivated.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: `Suspend ${selectedCaregivers ? 'Caregivers' : 'Caregiver'}`,
                cancelButtonText: "Cancel",
                confirmButtonColor: "#e11d48",
                cancelButtonColor: "#64748b",
                reverseButtons: true,
                focusCancel: true
            })
                .then(async (res) => {
                    if (res?.isConfirmed) {
                        await handleUpdateResult(status, id)
                    }

                    else {
                        setSelectedIds([])
                    }
                })
        }
        else {
            await handleUpdateResult(status)
        }
    };

    const handleUpdateResult = async (status, id = null) => {

        const url = id ? `/api/users/${id}` : `/api/users?account_status=${status}`

        const payload = status === "deactivated" ? { account_status: "deactivated", deactivated_at: new Date(), deactivated_by: myId } : { account_status: "active" }

        const res = await fetch(url, {
            method: "PATCH",
            body: JSON.stringify(selectedIds?.length ? selectedIds : payload),
            headers: { "Content-Type": "application/json" }
        })

        const result = await res.json()

        const updatedStatuses = result?.success > 1

        if (result?.success) {

            Swal.fire({
                icon: "success",
                title: status === "deactivated"
                    ? `${updatedStatuses ? 'Caregivers' : 'Caregiver'} Suspended`
                    : `${updatedStatuses ? 'Caregivers' : 'Caregiver'} Activated`,
                text: status === "deactivated"
                    ? `The selected caregiver ${updatedStatuses ? 'accounts' : 'account'} have been suspended successfully.`
                    : `The selected caregiver ${updatedStatuses ? 'accounts' : 'account'} have been activated successfully.`,
                confirmButtonText: "Done"
            })
            refetch()
            setSelectedIds([])
        }

        else {
            Swal.fire({
                icon: "info",
                title: "No Changes Applied",
                text:
                    `The selected caregiver ${selectedCaregivers ? 'accounts were' : 'account was'} already in the requested status. No updates were required.`,
                confirmButtonText: "OK"
            });
        }
    }
    // const getVerificationIcon = (status) => {
    // switch (status) {
    // case 'verified': return <FaCheckCircle className="text-emerald-500" title="Verified" />;
    // case 'pending': return <FaClock className="text-amber-500" title="Pending" />;
    // case 'expired': return <FaExclamationTriangle className="text-rose-500" title="Expired" />;
    // default: return <FaTimesCircle className="text-slate-300" title="Unverified/Rejected" />;
    // }
    // };

    if (isLoading || loadingServices) {
        return <>Loading...</>
    }

    return (
        <div className="space-y-8 animate-fadeIn max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-[#fcfdfd]">

            {/* ================= SECTION 1 — HEADER ================= */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-600">
                        <FaUserNurse /> Platform Provider Registry
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Caregiver Operations Center
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold">
                        Monitor provider availability, real-time clinical performance metrics, verification checkpoints, and service quality parameters.
                    </p>
                </div>
            </div>

            {/* ================= SECTION 2 — KPI GRID ================= */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                    { label: "Total Active", value: stats.total, color: "text-slate-900", bg: "bg-white" },
                    { label: "Available Now", value: stats.available, color: "text-teal-600", bg: "bg-teal-50/30 border-teal-100/50" },
                    { label: "On Assignment", value: stats.busy, color: "text-blue-600", bg: "bg-blue-50/30 border-blue-100/50" },
                    { label: "Suspended", value: stats.suspended, color: "text-rose-600", bg: "bg-rose-50/30 border-rose-100/50" },
                    { label: "Aggregate Rating", value: `${stats.avgRating} ★`, color: "text-amber-500", bg: "bg-amber-50/30 border-amber-100/50" },
                    { label: "Active This Month", value: stats.activeThisMonth, color: "text-purple-600", bg: "bg-purple-50/30 border-purple-100/50" }
                ].map((kpi, idx) => (
                    <div key={idx} className={`p-4 border border-slate-100 rounded-2xl shadow-sm space-y-1 ${kpi.bg}`}>
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{kpi.label}</p>
                        <h3 className={`text-2xl font-black tracking-tight ${kpi.color}`}>{kpi.value}</h3>
                    </div>
                ))}
            </div>

            {/* ================= SECTION 3 — SEARCH & FILTERS CONTROLS ================= */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    {/* Text Field Search */}
                    <div className="relative lg:col-span-1">
                        <FaSearch className="absolute right-4 mt-3 text-xs text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search name, email, phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-500/30 focus:bg-white transition-all"
                        />
                    </div>
                    {/* Status Select */}
                    <div className="relative">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 appearance-none focus:outline-none cursor-pointer">
                            <option value="all">All Administrative Statuses</option>
                            <option value="active">Active Status</option>
                            <option value="deactivated">Suspended Status</option>
                            <option value="blocked">Blocked Status</option>
                        </select>
                        <FaChevronDown className="absolute right-4 top-4 text-[9px] text-slate-400 pointer-events-none" />
                    </div>
                    {/* Availability Select */}
                    <div className="relative">
                        <select value={availFilter} onChange={(e) => setAvailFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 appearance-none focus:outline-none cursor-pointer">
                            <option value="all">All Availability Feeds</option>
                            <option value="Active">Available Now</option>
                            <option value="busy">Busy / On Assignment</option>
                            <option value="Inactive">Offline</option>
                        </select>
                        <FaChevronDown className="absolute right-4 top-4 text-[9px] text-slate-400 pointer-events-none" />
                    </div>
                    {/* Service Category Type Select */}
                    <div className="relative">
                        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 appearance-none focus:outline-none cursor-pointer">
                            <option value="all">All Medical Frameworks</option>
                            {services.map(service => (
                                <option key={service?._id} value={service?.service_name}>{service?.service_name}</option>
                            ))}
                        </select>
                        <FaChevronDown className="absolute right-4 top-4 text-[9px] text-slate-400 pointer-events-none" />
                    </div>
                    {/* Rating Threshold Filter */}
                    <div className="relative">
                        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 appearance-none focus:outline-none cursor-pointer">
                            <option value="all">All Rating Thresholds</option>
                            <option value="4">4.0+ Stars Rating</option>
                            <option value="3">3.0+ Stars Rating</option>
                            <option value="2">2.0+ Stars Rating</option>
                        </select>
                        <FaChevronDown className="absolute right-4 top-4 text-[9px] text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* ================= SECTION 10 — BULK BATCH ACTIONS TERMINAL ================= */}
                {selectedIds.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl animate-slideUp">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                            {selectedIds.length} {selectedIds.length > 1 ? 'Providers' : 'Provider'} Selected for Global Execution
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                            <button onClick={() => handleBulkStatusUpdate('active')} className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer">
                                Mass Activate
                            </button>
                            <button onClick={() => handleBulkStatusUpdate('deactivated')} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer">
                                Mass Suspend
                            </button>
                            <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all">
                                Audit Verify Files
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ================= SPLIT CONSOLE INTERFACE VIEW ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                {/* PRIMARY PROVIDER DATA MASTER (LEFT 3 COLUMNS) */}
                <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                        <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                            Operational Caregivers Registry ({filteredCaregivers.length})
                        </h2>
                        <button className="text-[10px] font-black text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 transition-all flex items-center gap-1">
                            <FaDownload className="text-[9px]" /> Export Core CSV
                        </button>
                    </div>

                    {/* ================= SECTION 4 — CAREGIVER DATA TABLE ================= */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-black uppercase tracking-wider text-[9px]">
                                    <th className="pb-3 pl-2"><input type="checkbox" checked={selectedIds.length === filteredCaregivers.length && filteredCaregivers.length > 0} onChange={toggleSelectAll} className="rounded accent-teal-600 cursor-pointer" /></th>
                                    <th className="pb-3 pl-2">Specialist</th>
                                    <th className="pb-3">Service Matrix</th>
                                    <th className="pb-3">Rating Status</th>
                                    <th className="pb-3">Bookings</th>
                                    <th className="pb-3">Availability</th>
                                    {/* <th className="pb-3">Clearance Check</th> */}
                                    <th className="pb-3 text-right pr-2">Command Matrix</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                                {filteredCaregivers.length > 0 ? filteredCaregivers.map((caregiver) => (
                                    <tr key={caregiver?._id} className="hover:bg-slate-50/40 transition-colors group">
                                        <td className="py-4 pl-2">
                                            <input type="checkbox" checked={selectedIds.includes(caregiver?._id)} onChange={() => toggleSelectOne(caregiver?._id)} className="rounded accent-teal-600 cursor-pointer" />
                                        </td>
                                        <td className="py-4 pl-2 flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs border border-slate-200 shrink-0 font-black">
                                                {caregiver?.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-800 text-[11px] tracking-tight leading-tight">{caregiver?.name}</span>
                                                <span className="text-[9px] text-slate-400 font-semibold">{caregiver?.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 font-bold text-slate-700 text-[11px]">{profileMap[caregiver?._id]?.specialization}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-1 text-[11px] font-black text-slate-800">
                                                <FaStar className="text-amber-400 text-[10px]" /> {(reviewMap[caregiver?._id]?.average ?? 0).toFixed(1)}
                                            </div>
                                        </td>
                                        <td className="py-4 font-bold text-slate-500">{completedJobMap[caregiver?._id] ?? 0} jobs</td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${scheduleMap[caregiver?._id]?.status === 'Active' ? 'bg-teal-50 text-teal-700 border-teal-100/50' :
                                                assignedCaregivers.includes(caregiver?._id) ? 'bg-blue-50 text-blue-700 border-blue-100/50' : 'bg-slate-50 text-slate-500'
                                                }`}>
                                                <FaCircle className="text-[6px]" /> {scheduleMap[caregiver?._id]?.status}
                                            </span>
                                        </td>
                                        {/* <td className="py-4"> */}
                                        {/* SECTION 7 — INTEGRATED VERIFICATION DISPATCH BADGES */}
                                        {/* <div className="flex items-center gap-2 text-xs"> */}
                                        {/* <span className="flex items-center" title="Identity Matrix">{getVerificationIcon(caregiver.verification.identity)}</span> */}
                                        {/* <span className="flex items-center" title="License Verification">{getVerificationIcon(caregiver.verification.license)}</span> */}
                                        {/* <span className="flex items-center" title="Bank Node Verification">{getVerificationIcon(caregiver.verification.bank)}</span> */}
                                        {/* </div> */}
                                        {/* </td> */}
                                        <td className="py-4 text-right pr-2 whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/dashboard/admin/caregivers/${caregiver?._id}`} title="View Ledger Snapshot" className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
                                                    <FaEye className="text-xs" />
                                                </Link>
                                                <button onClick={() => setActiveEditProvider(caregiver?._id)} title="Edit Demographics" className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                                    <FaEdit className="text-xs" />
                                                </button>
                                                <button onClick={() => handleBulkStatusUpdate("deactivated", caregiver?._id)} title="Emergency Suspend" className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                                    <FaBan className="text-xs" />
                                                </button>
                                                <button title="Direct Mesh Message" className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                                    <FaRegEnvelope className="text-xs" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="py-20 px-6">
                                            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">

                                                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                    <FaSearch className="text-xl text-slate-400" />
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="text-sm font-black tracking-tight text-slate-800">
                                                        No Caregivers Found
                                                    </h3>

                                                    <p className="text-xs font-medium leading-relaxed text-slate-400">
                                                        No caregiver records match your current search and filtering criteria.
                                                        Adjust one or more filters to view additional providers.
                                                    </p>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SIDEBAR METRICS DOCK (RIGHT 1 COLUMN) */}
                <div className="space-y-6">

                    {/* ================= SECTION 5 — PERFORMANCE LEADERBOARD ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-2 flex items-center gap-1.5">
                            <FaArrowUp className="text-teal-600 text-[10px]" /> Performance Champions
                        </h3>
                        <div className="space-y-3">
                            {leaderboard.map((caregiver) => (
                                <div key={caregiver?._id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/40 border border-slate-50">
                                    <div className="min-w-0">
                                        <h4 className="text-[11px] font-black text-slate-800 tracking-tight truncate">{caregiver?.name}</h4>
                                        <p className="text-[9px] text-slate-400 font-bold">{caregiver?.completed} Deployments</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">৳{(caregiver?.earnings / 1000).toFixed(0)}k gross</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= SECTION 6 — LOW PERFORMANCE RISK WATCHLIST ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 border-b border-slate-50 pb-2 flex items-center gap-1.5">
                            <FaExclamationTriangle className="animate-pulse" /> Risk Triage Watchlist
                        </h3>
                        {watchList.length === 0 ? (
                            <p className="text-[10px] text-slate-400 font-bold">No performance anomalies detected system-wide.</p>
                        ) : (
                            <div className="space-y-3">
                                {watchList.map((provider) => (
                                    <div key={provider?._id} className="p-3 rounded-2xl bg-rose-50/20 border border-rose-100/50 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-black text-slate-900 tracking-tight">{provider?.name}</span>
                                            <span className="text-[8px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 px-1.5 rounded-md">Needs Review</span>
                                        </div>
                                        {/* <div className="flex items-center justify-between text-[9px] font-bold text-slate-400"> */}
                                        {/* <span>Rating: <strong className="text-rose-600">{provider?.rating}</strong></span> */}
                                        {/* <span>Cancellations: <strong>{provider.cancellation_rate}%</strong></span> */}
                                        {/* <span>Complaints: <strong>{provider.complaints_count}</strong></span> */}
                                        {/* </div> */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ================= SECTION 8 — RECENT PROVIDER LOG ACTIVITY TIMELINE ================= */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-2">
                            Provider Registry Stream
                        </h3>
                        <div className="space-y-3.5 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
                            {timeline.map((log) => (
                                <div key={log?._id} className="flex gap-2.5 items-start text-[11px] relative z-10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 border-2 border-white mt-1 shrink-0" />
                                    <div className="space-y-0.5 min-w-0">
                                        <p className="text-slate-600 font-medium leading-tight">{log?.status}</p>
                                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">{log?.customer?.name}</span>
                                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">{new Date(log?.updated_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div >

            {/* ================= SECTION 9 — DETAILED SPECIFIC EARNINGS DRAWERS / DETAILS DIALOG ================= */}
            {
                activeDetailProvider && (
                    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex justify-end animate-fadeIn">
                        <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 space-y-6 flex flex-col justify-between animate-slideLeft rounded-l-[2rem]">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div className="space-y-0.5">
                                        <h3 className="text-base font-black text-slate-900 tracking-tight">{activeDetailProvider?.name}</h3>
                                        <p className="text-xs text-slate-400 font-semibold">{profileMap[activeDetailProvider?._id]?.specialization} Financial Blueprint</p>
                                    </div>
                                    <button onClick={() => setActiveDetailProvider(null)} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center font-black">×</button>
                                </div>

                                {/* Section 7 - Detailed Compliance Stack */}
                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1"><FaIdCard /> Verification Audit Integrity</h4>
                                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black uppercase tracking-tight">
                                        <div className="bg-white border p-2 rounded-xl space-y-1">
                                            <p className="text-slate-400 text-[8px]">Govt ID</p>
                                            {/* <span className="capitalize text-slate-700 flex justify-center gap-1">{activeDetailProvider.verification.identity}</span> */}
                                        </div>
                                        <div className="bg-white border p-2 rounded-xl space-y-1">
                                            <p className="text-slate-400 text-[8px]">Licence</p>
                                            {/* <span className="capitalize text-slate-700 flex justify-center gap-1">{activeDetailProvider.verification.license}</span> */}
                                        </div>
                                        <div className="bg-white border p-2 rounded-xl space-y-1">
                                            <p className="text-slate-400 text-[8px]">Bank Sett</p>
                                            {/* <span className="capitalize text-slate-700 flex justify-center gap-1">{activeDetailProvider.verification.bank}</span> */}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 9 Financial Matrix View */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1"><FaUniversity /> Direct Ledger Balances</h4>
                                    <div className="space-y-2.5">
                                        <div className="flex justify-between items-center bg-teal-50/30 border border-teal-100/50 p-3.5 rounded-xl">
                                            <span className="text-xs font-bold text-slate-500">This Month Net Inflow</span>
                                            <span className="text-sm font-black text-teal-700">৳{thisMonthEarnings.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl">
                                            <span className="text-xs font-bold text-slate-500">Awaiting Safe Withdrawal</span>
                                            <span className="text-sm font-black text-amber-600">৳{pendingWithdrawals.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl">
                                            <span className="text-xs font-bold text-slate-500">Gross Account Inflow</span>
                                            <span className="text-sm font-black text-slate-800">৳{lifetime?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setActiveDetailProvider(null)} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm">
                                Commit Metrics & Clear View
                            </button>
                        </div>
                    </div>
                )
            }

            {
                activeEditProvider && (
                    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
                        {/* Drawer container: full screen mobile, slides out up to max-md on desktop */}
                        <form
                            // onSubmit={handleSubmit()}
                            className="bg-white w-full max-w-md h-full shadow-2xl p-5 sm:p-6 flex flex-col justify-between animate-slideLeft rounded-none sm:rounded-l-[2rem]">

                            {/* SCROLLABLE FORM BODY CONTAINER */}
                            <div className="flex flex-col h-full space-y-6 overflow-y-auto pr-1 select-none">

                                {/* Drawer Header Component */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                                            <FaEdit className="text-teal-600 text-xs sm:text-sm" /> Edit Provider Operations
                                        </h3>
                                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold truncate max-w-[250px] sm:max-w-none">
                                            Updating credentials for {activeEditProvider?.email}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveEditProvider(null)}
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center font-black transition-colors cursor-pointer"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Section 1: Identity & Contact Frame */}
                                <div className="space-y-3">
                                    <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Identity & Contact</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                // value={formData.name}
                                                // onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                                            <input
                                                type="text"
                                                required
                                                // value={formData.phone}
                                                // onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Professional Profile Parameters */}
                                <div className="space-y-3">
                                    <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Context</h4>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <label className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1">Specialization Matrix</label>
                                            <select
                                                // value={formData.specialization}
                                                // onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                                className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 appearance-none focus:outline-none cursor-pointer"
                                            >
                                                {services.map(s => <option key={s._id} value={s.service_name}>{s.service_name}</option>)}
                                            </select>
                                            <FaChevronDown className="absolute right-4 bottom-3 text-[8px] text-slate-400 pointer-events-none" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1">Experience (Years)</label>
                                                <input
                                                    type="number"
                                                    // value={formData.experience}
                                                    // onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                                    className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1">Languages</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Bangla, English"
                                                    // value={formData.languages}
                                                    // onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                                                    className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase mb-1">Professional Bio</label>
                                            <textarea
                                                rows={3}
                                                // value={formData.bio}
                                                // onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold resize-none leading-relaxed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Administrative Control Hub */}
                                <div className="space-y-3 pb-4">
                                    <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Administrative Settings</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                                        <div>
                                            <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2.5">Account Status</span>
                                            <div className="space-y-2">
                                                {['active', 'deactivated', 'blocked'].map((statusOption) => (
                                                    <label key={statusOption} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer capitalize">
                                                        <input
                                                            type="radio"
                                                            name="account_status"
                                                            value={statusOption}
                                                            // checked={formData.account_status === statusOption}
                                                            // onChange={(e) => setFormData({ ...formData, account_status: e.target.value })}
                                                            className="w-3.5 h-3.5 accent-teal-600 cursor-pointer"
                                                        />
                                                        {statusOption === 'deactivated' ? 'Suspended' : statusOption}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2.5">Verification Registry</span>
                                            <div className="space-y-2">
                                                {['verified', 'pending', 'expired', 'rejected'].map((verifyOption) => (
                                                    <label key={verifyOption} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer capitalize">
                                                        <input
                                                            type="radio"
                                                            name="verification_status"
                                                            value={verifyOption}
                                                            // checked={formData.verification_status === verifyOption}
                                                            // onChange={(e) => setFormData({ ...formData, verification_status: e.target.value })}
                                                            className="w-3.5 h-3.5 accent-teal-600 cursor-pointer"
                                                        />
                                                        {verifyOption}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DRAWER FOOTER (FIXED ACTIONS TRAY) */}
                            <div className="border-t border-slate-100 pt-4 mt-2 grid grid-cols-2 gap-3 bg-white shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setActiveEditProvider(null)}
                                    className="w-full py-2.5 sm:py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full py-2.5 sm:py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs cursor-pointer text-center"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }
        </div >
    );
};

export default Caregivers;