'use client'
import React, { Key, ReactNode, useMemo, useState } from 'react';
import { FaBriefcase, FaCalendarCheck, FaCheckCircle, FaChevronRight, FaClock, FaConciergeBell, FaFileDownload, FaFilter, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaUsers, FaUserShield } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi'
import useUsersData from '../../../../hooks/useUsersData';
import useAllServices from '../../../../hooks/useAllServices';
import useAllReviews from '../../../../hooks/useAllReviews';
import useBookingsData from '../../../../hooks/useBookingsData';
import useApplicationsData from '../../../../hooks/useApplicationsData';
import useAvailabilitySchedules from '../../../../hooks/useAvailabilitySchedules';
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Link from 'next/link';
import { exportAnalyticsReport } from '../../../../lib/exportAnalyticsReport';

const Analytics = () => {

    const { users } = useUsersData()

    const activeUsers = users.filter(user => user?.account_status === 'active')

    const { bookings } = useBookingsData()

    const [range, setRange] = useState('all');

    const filteredBookings = useMemo(() => {
        const now = new Date();

        return bookings.filter((booking) => {
            const date = new Date(booking?.updated_at);

            const diffDays =
                (now.getTime() - date.getTime()) /
                (1000 * 60 * 60 * 24);

            if (range === '1d') return diffDays <= 1;
            if (range === '7d') return diffDays <= 7;
            if (range === '30d') return diffDays <= 30;
            if (range === '90d') return diffDays <= 90;
            if (range === 'all') return true;

            return true;
        });
    }, [bookings, range]);

    const revenueMap = new Map();

    const totalCaregivers = activeUsers.filter(user => user?.role === 'caregiver').length

    const { services } = useAllServices()

    const { reviews } = useAllReviews()

    const activeBookings = filteredBookings.filter(booking => booking?.status !== "Rejected" && booking?.status !== "Cancelled")

    const completedBookings = useMemo(() => {
        return filteredBookings.filter(
            booking => booking?.status === "Completed"
        );
    }, [filteredBookings]);

    completedBookings.forEach((booking) => {
        const date = new Date(booking?.updated_at)
            .toISOString()
            .split('T')[0]; // YYYY-MM-DD
        const current = revenueMap.get(date) || 0;
        revenueMap.set(
            date,
            current + (booking?.pricing?.total_amount || 0)
        );
    });

    const revenueChartData = Array.from(revenueMap, ([date, revenue]) => ({
        date,
        revenue,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const divisions = activeBookings.map(booking => booking?.location?.division)

    const uniqueDivisions = new Set(divisions)

    const { applications } = useApplicationsData('pending')

    const recentApplications = [...applications]
        .sort(
            (a, b) =>
                new Date(b?.created_at).getTime() -
                new Date(a?.created_at).getTime()
        )
        .slice(0, 10)

    const recentBookings = [...activeBookings]
        .sort(
            (a, b) =>
                new Date(b?.booked_at).getTime() -
                new Date(a?.booked_at).getTime()
        )
        .slice(0, 10)

    const { schedules } = useAvailabilitySchedules()

    const ratings = new Set(reviews.map(review => review?.rating).sort((a, b) => b - a))

    const activeSchedules = schedules.filter(schedule => schedule?.status === 'Active')

    const inactiveSchedules = schedules.filter(schedule => schedule?.status === 'Inactive')

    const totalRevenue = completedBookings.reduce(
        (sum, booking) =>
            sum + (booking?.pricing?.total_amount || 0),
        0
    )

    const averageRating = reviews.length
        ? (
            reviews.reduce(
                (sum, review) => sum + review.rating,
                0
            ) / reviews.length
        ).toFixed(1)
        : 0

    const statusStyles = {

        'Pending Payment': {
            className: 'bg-rose-50 border-rose-100 text-rose-700',
            icon: FaMoneyBillWave,
            label: 'Pending Payment'
        },

        'Pending Approval': {
            className: 'bg-amber-50 border-amber-100 text-amber-700',
            icon: FaClock,
            label: 'Pending Approval'
        },

        Approved: {
            className: 'bg-sky-50 border-sky-100 text-sky-700',
            icon: FaCheckCircle,
            label: 'Approved'
        },

        Confirmed: {
            className: 'bg-cyan-50 border-cyan-100 text-cyan-700',
            icon: FaCalendarCheck,
            label: 'Confirmed'
        },

        Assigned: {
            className: 'bg-violet-50 border-violet-100 text-violet-700',
            icon: FaUserShield,
            label: 'Assigned'
        },

        'In Progress': {
            className: 'bg-indigo-50 border-indigo-100 text-indigo-700',
            icon: FaClock,
            label: 'In Progress'
        },

        'Pending Reassignment': {
            className: 'bg-orange-50 border-orange-100 text-orange-700',
            icon: FaUserShield,
            label: 'Pending Reassignment'
        },

        Completed: {
            className: 'bg-emerald-50 border-emerald-100 text-emerald-700',
            icon: FaCheckCircle,
            label: 'Completed'
        }
    }

    const bookingStatusData = [
        {
            name: 'Pending Payment',
            value: activeBookings.filter(
                booking => booking?.status === 'Pending Payment'
            ).length,
            color: '#f43f5e'
        },

        {
            name: 'Pending Approval',
            value: activeBookings.filter(
                booking => booking?.status === 'Pending Approval'
            ).length,
            color: '#f59e0b'
        },

        {
            name: 'Approved',
            value: activeBookings.filter(
                booking => booking?.status === 'Approved'
            ).length,
            color: '#0ea5e9'
        },

        {
            name: 'Confirmed',
            value: activeBookings.filter(
                booking => booking?.status === 'Confirmed'
            ).length,
            color: '#06b6d4'
        },

        {
            name: 'Assigned',
            value: activeBookings.filter(
                booking => booking?.status === 'Assigned'
            ).length,
            color: '#8b5cf6'
        },

        {
            name: 'In Progress',
            value: activeBookings.filter(
                booking => booking?.status === 'In Progress'
            ).length,
            color: '#6366f1'
        },

        {
            name: 'Pending Reassignment',
            value: activeBookings.filter(
                booking => booking?.status === 'Pending Reassignment'
            ).length,
            color: '#f97316'
        },

        {
            name: 'Completed',
            value: completedBookings.length,
            color: '#10b981'
        }
    ]

    const totalOperationalBookings =
        bookingStatusData.reduce(
            (sum, item) => sum + item.value,
            0
        )

    const [isExporting, setIsExporting] = useState(false)

    const handleExportReport = () => {
        setIsExporting(true)
        try {
            exportAnalyticsReport({
                range,
                totalRevenue,
                totalBookings: filteredBookings.length,
                activeUsers: activeUsers.length,
                totalCaregivers,
                applicationsCount: applications.length,
                servicesCount: services.length,
                reviewsCount: reviews.length,
                averageRating,
                bookingStatusData,
                activeSchedules,
                inactiveSchedules,
                completedBookings,
                services
            });
            setIsExporting(false)
        }
        catch (error) {
            console.error('EXPORT ERROR:', error);
            setIsExporting(false)
        }
    };

    const bookingsByService = useMemo(() => {
        return completedBookings.reduce((acc, booking) => {
            const serviceName =
                booking?.service_name;
            if (!serviceName) return acc;
            if (!acc[serviceName]) {
                acc[serviceName] = [];
            }
            acc[serviceName].push(booking);
            return acc;
        }, {} as Record<string, typeof completedBookings>);
    }, [completedBookings]);

    return (
        <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8 space-y-8">

            {/* HEADER & FILTER MATRIX */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black tracking-widest text-teal-600 uppercase">Live Administrative Control</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        CareNest <span className="text-teal-600">Analytics</span>
                    </h1>
                    <p className="text-slate-400 text-xs font-semibold mt-0.5">
                        Real-time overview of platform scaling dynamics, care distribution metrics, and ecosystem revenue.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <select
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            className="appearance-none px-4 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all cursor-pointer">
                            <option value='all'>All Time</option>
                            <option value='1d'>Today</option>
                            <option value='7d'>Last 7 Days</option>
                            <option value='30d'>Last 30 Days</option>
                            <option value='90d'>Last 90 Days</option>
                        </select>
                        <FaFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
                    </div>

                    <button disabled={isExporting} onClick={handleExportReport} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer group">
                        <FaFileDownload className="group-hover:translate-y-[0.5px] transition-transform" />
                        <span>{isExporting ? 'Generating...' : 'Export Excel'}</span>
                    </button>
                </div>
            </div>

            {/* BENTO-STYLE CORE KPI CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* Total Gross Revenue */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-teal-100 transition-colors duration-300">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">৳{totalRevenue.toLocaleString()}</h2>
                        <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5 mt-1">
                            <FiTrendingUp className="text-[9px]" /> Live Growth
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                        <FaMoneyBillWave className="text-lg" />
                    </div>
                </div>

                {/* Total System Bookings */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-teal-100 transition-colors duration-300">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{filteredBookings?.length}</h2>
                        <span className="text-[10px] text-slate-400 font-medium block mt-1">Bookings in selected period</span>
                    </div>
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                        <FaCalendarCheck className="text-lg" />
                    </div>
                </div>

                {/* Total Platform Users */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-teal-100 transition-colors duration-300">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Users</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{activeUsers.length}</h2>
                        <span className="text-[10px] text-slate-400 font-medium block mt-1">Customers & Profiles</span>
                    </div>
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                        <FaUsers className="text-lg" />
                    </div>
                </div>

                {/* Active Caregivers */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-teal-100 transition-colors duration-300">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Verified Caregivers</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{totalCaregivers}</h2>
                        <span className="text-[10px] text-teal-600 font-bold block mt-1">Verified providers</span>
                    </div>
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                        <FaUserShield className="text-lg" />
                    </div>
                </div>

                {/* Pending Applications */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-teal-100 transition-colors duration-300">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Applications</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{applications.length}</h2>
                        <span className="text-[10px] text-amber-600 font-semibold block mt-1">Pending Applications (All Time)</span>
                    </div>
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                        <FaBriefcase className="text-lg" />
                    </div>
                </div>

                {/* Configured Services */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-teal-100 transition-colors duration-300">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Services</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{services.length}</h2>
                        <span className="text-[10px] text-slate-400 font-medium block mt-1">Active service catalogs</span>
                    </div>
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                        <FaConciergeBell className="text-lg" />
                    </div>
                </div>

                {/* Review Count */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-teal-100 transition-colors duration-300">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Reviews</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{reviews.length}</h2>
                        <span className="text-[10px] text-slate-400 font-medium block mt-1">User submitted feedback</span>
                    </div>
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                        <FaStar className="text-lg" />
                    </div>
                </div>

                {/* Average Satisfaction Rating */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-teal-100 transition-colors duration-300">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Avg Rating</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
                            {averageRating} <span className="text-xs font-bold text-slate-400">/ 5.0</span>
                        </h2>
                        <div className="flex items-center gap-0.5 mt-1 text-amber-500 text-[10px]">
                            Based on {reviews.length} reviews
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                        <FaStar className="text-lg" />
                    </div>
                </div>

            </div>

            {/* CHARTS CONTAINER SHELLS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Revenue Trend Matrix */}
                <div className="xl:col-span-2 bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h3 className="font-black text-lg text-slate-900 tracking-tight">Revenue Generation Trend</h3>
                            <p className="text-slate-400 text-xs font-semibold">Comparative timeline charting across parameters.</p>
                        </div>
                    </div>

                    {/* CHART HOOK: Drop your Recharts or Chart.js component canvas right inside here */}
                    {
                        revenueChartData.length ? (
                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >
                                <LineChart data={revenueChartData}>
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10 }}
                                        minTickGap={25}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(value) => {
                                            if (value >= 1000) return `৳${(value / 1000).toFixed(1).toLocaleString()}k`;
                                            return `৳${value.toLocaleString()}`;
                                        }} />
                                    <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#14b8a6"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-75 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6 py-20">
                                <FaMoneyBillWave className="text-slate-300 text-2xl mb-3" />

                                <h4 className="text-sm font-bold text-slate-700">
                                    No Revenue Data Available
                                </h4>

                                <p className="text-xs text-slate-400 max-w-xs mt-1">
                                    No completed bookings were found for the selected time period.
                                </p>
                            </div>
                        )
                    }
                </div>

                {/* Booking Status Distribution Breakdown */}
                <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                    <div>
                        <h3 className="font-black text-lg text-slate-900 tracking-tight">Booking Allocations</h3>
                        <p className="text-slate-400 text-xs font-semibold">Platform distribution & fulfillment efficiency.</p>
                    </div>

                    {/* RADIAL CHART HOOK */}
                    {
                        totalOperationalBookings ? (
                            <>
                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={bookingStatusData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={55}
                                                outerRadius={85}
                                                paddingAngle={3}
                                                strokeWidth={0}
                                            >
                                                {
                                                    bookingStatusData.map(item => (
                                                        <Cell
                                                            key={item.name}
                                                            fill={item.color}
                                                        />
                                                    ))
                                                }
                                            </Pie>

                                            <Tooltip
                                                formatter={(value) => [
                                                    value,
                                                    'Bookings'
                                                ]}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Detailed Data Legend Rows */}
                                <div className="grid grid-cols-1 gap-2">
                                    {bookingStatusData.length &&
                                        (bookingStatusData
                                            .filter(item => item.value > 0)
                                            .map(item => (
                                                <div
                                                    key={item.name}
                                                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="w-2 h-2 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    item.color
                                                            }}
                                                        />
                                                        <span className="text-[11px] font-bold text-slate-600">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] text-slate-400">
                                                            {(
                                                                item.value /
                                                                totalOperationalBookings *
                                                                100
                                                            ).toFixed(1)}%
                                                        </span>
                                                        <span className="text-[11px] font-black text-slate-900">
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                </div>
                            </>
                        ) : (
                            <div className="h-64 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
                                <FaCalendarCheck className="text-slate-300 text-3xl mb-3" />

                                <h4 className="text-sm font-bold text-slate-700">
                                    No Booking Data Available
                                </h4>

                                <p className="text-xs text-slate-400 max-w-xs mt-1">
                                    Booking allocation statistics will appear here once bookings are created.
                                </p>
                            </div>
                        )
                    }
                </div>

            </div>

            {/* POPULAR SERVICES + CAREGIVER AVAILABILITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Popular Services Section (Progress Bars Matrix) */}
                <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div>
                        <h3 className="font-black text-lg text-slate-900 tracking-tight">Popular Services</h3>
                        <p className="text-slate-400 text-xs font-semibold">Comparing service booking frequencies to total generation metrics.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Elderly Care */}
                        {services.map(service => {
                            const bookingsPerService = bookingsByService[service?.service_name] || [];
                            return (
                                < div key={service?._id} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                        <span>{service?.service_name}<span className="text-[10px] text-slate-400 font-medium">({bookingsPerService.length} {bookingsPerService.length === 1 ? 'booking' : 'bookings'})</span></span>
                                        <span className="text-teal-600 font-black">৳ {bookingsPerService.map(booking => booking?.pricing?.total_amount).reduce((a, b) => (a + b), 0) || 0}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-full rounded-full" style={{ width: `${(bookingsPerService.length / completedBookings.length) * 100 || 0}%` }}></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Caregiver Deployment Vectors Block */}
                <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div>
                        <h3 className="font-black text-lg text-slate-900 tracking-tight">Caregiver Availability</h3>
                        <p className="text-slate-400 text-xs font-semibold">Real-time status metrics of on-call providers.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-5 text-center space-y-1 group hover:bg-emerald-50 transition-colors">
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block mb-1 shadow-sm shadow-emerald-500/30"></span>
                            <span className="text-slate-400 font-bold text-[11px] block uppercase tracking-wider">Active Availability</span>
                            <span className="text-3xl font-black text-emerald-700 tracking-tight block">{activeSchedules.length}</span>
                            <span className="text-[10px] text-emerald-600 font-medium block">Ready for deployment</span>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center space-y-1 group hover:bg-slate-100/70 transition-colors">
                            <span className="w-2.5 h-2.5 bg-slate-400 rounded-full inline-block mb-1"></span>
                            <span className="text-slate-400 font-bold text-[11px] block uppercase tracking-wider">Offline / Inactive</span>
                            <span className="text-3xl font-black text-slate-700 tracking-tight block">{inactiveSchedules.length}</span>
                            <span className="text-[10px] text-slate-500 font-medium block">Resting / Suspended</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* GEOGRAPHY + REVIEWS DETAILED METRICS METRIC SPECTRUMS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Geographic Allocation Grid */}
                <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
                    <div>
                        <h3 className="font-black text-lg text-slate-900 tracking-tight">Demand by Division</h3>
                        <p className="text-slate-400 text-xs font-semibold">Operational volume segmented across local divisions.</p>
                    </div>

                    <div className="space-y-3">
                        {
                            uniqueDivisions.size ? ([...uniqueDivisions].map((division: ReactNode) => {
                                const bookingsPerDivision = filteredBookings.filter(booking => booking?.location?.division === division)
                                return (
                                    <div key={division as Key} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-teal-50/20 hover:border-teal-100/40 transition-all duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors">
                                                <FaMapMarkerAlt className="text-xs" />
                                            </div>
                                            <span className="font-bold text-slate-800 text-sm">{division}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-950 bg-white px-2.5 py-1 rounded-lg border border-slate-100">{bookingsPerDivision.length} {bookingsPerDivision.length === 1 ? 'Booking' : 'Bookings'}</span>
                                    </div>
                                )
                            })) : (
                                <div className="py-16 flex flex-col items-center justify-center text-center">
                                    <FaMapMarkerAlt className="text-4xl text-slate-300 mb-4" />

                                    <h4 className="font-bold text-slate-700">
                                        No Geographic Data
                                    </h4>

                                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                        Demand locations will appear here once bookings are created.
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* Star-by-Star Review Volume Breakdown */}
                <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
                    <div>
                        <h3 className="font-black text-lg text-slate-900 tracking-tight">Rating Distribution</h3>
                        <p className="text-slate-400 text-xs font-semibold">Distribution mapping score across user submittals.</p>
                    </div>

                    <div className="space-y-3.5">
                        {
                            [...ratings].map((rating: ReactNode) => {
                                const percentagePerRating = (reviews.filter(review => review?.rating === rating).length / reviews.length) * 100
                                return (
                                    <div key={rating as Key} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                        <span className="w-12 flex items-center gap-1">{rating}<FaStar className="text-amber-500 text-[10px] mb-0.5" /></span>
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${percentagePerRating}%` }}></div>
                                        </div>
                                        <span className="w-8 text-right font-black text-slate-900">{percentagePerRating.toFixed(1)}%</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            {/* RECENT PROVIDER APPLICATIONS TABLE */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h3 className="font-black text-lg text-slate-900 tracking-tight">Recent Onboarding Applications</h3>
                        <p className="text-slate-400 text-xs font-semibold">Incoming caregiver verification queues.</p>
                    </div>
                    <Link href={'/dashboard/admin/caregiver-applications'} className="text-xs font-black text-teal-600 hover:text-teal-700 uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"><span>All Profile Applications</span> <FaChevronRight className="text-[9px]" /></Link>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    {recentApplications.length ? (<table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                <th className="py-4 px-5">Applicant Details</th>
                                <th className="py-4 px-5">Target Service Vector</th>
                                <th className="py-4 px-5">Audit Status</th>
                                <th className="py-4 px-5 text-right">Log Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">

                            {recentApplications.map(application => (
                                <tr key={application?._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-5 font-bold text-slate-900">{application?.name}</td>
                                    <td className="py-4 px-5 text-slate-500 font-semibold">{application?.specialization}</td>
                                    <td className="py-4 px-5">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-md uppercase">
                                            <FaClock className="text-[8px]" /> Under Review
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 text-right text-slate-400 font-semibold">{new Date(application?.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>) : (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <FaBriefcase className="text-4xl text-slate-300 mb-4" />
                            <h4 className="font-bold text-slate-700">
                                No Applications Found
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                No caregiver applications have been submitted yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* RECENT OPERATIONAL BOOKINGS DATA TABLE */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h3 className="font-black text-lg text-slate-900 tracking-tight">Recent Dispatch Bookings</h3>
                        <p className="text-slate-400 text-xs font-semibold">Most recent booking activity</p>
                    </div>
                    <Link href={'/dashboard/admin/bookings'} className="text-xs font-black text-teal-600 hover:text-teal-700 uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"><span>View All Bookings </span> <FaChevronRight className="text-[9px]" /></Link>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    {recentBookings.length ? (<table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                <th className="py-4 px-5">Booking Transaction ID</th>
                                <th className="py-4 px-5">Customer Profile</th>
                                <th className="py-4 px-5">Assigned Care Vector</th>
                                <th className="py-4 px-5">Fulfillment Status</th>
                                <th className="py-4 px-5 text-right">Escrow Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                            {recentBookings.map(booking => {
                                const status =
                                    statusStyles[booking?.status] ||
                                    {
                                        className: 'bg-slate-50 border-slate-100 text-slate-700',
                                        icon: FaClock,
                                        label: booking?.status
                                    }

                                const StatusIcon = status.icon
                                return (
                                    <tr key={booking?._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-5 font-bold text-teal-600">#{booking?._id.slice(-6).toUpperCase()}</td>
                                        <td className="py-4 px-5 font-bold text-slate-900">{booking?.customer?.name}</td>
                                        <td className="py-4 px-5 text-slate-500 font-semibold">{booking?.service_name}</td>
                                        <td className="py-4 px-5">
                                            <span
                                                className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md uppercase border ${status?.className}`}
                                            >
                                                <StatusIcon className="text-[8px]" />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-right font-black text-slate-900">৳{booking?.pricing?.total_amount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>) : (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <FaCalendarCheck className="text-4xl text-slate-300 mb-4" />
                            <h4 className="font-bold text-slate-700">
                                No Bookings Available
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                No bookings were found for the selected period.
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div >
    );
};

export default Analytics;