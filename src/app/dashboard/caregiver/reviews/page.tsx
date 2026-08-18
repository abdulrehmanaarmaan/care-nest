'use client'
import React, { useMemo } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaFilter, FaQuoteLeft, FaRegCommentDots, FaRegStar, FaSearch, FaStar, FaUser } from 'react-icons/fa';
import useMyReviews from '../../../../hooks/useMyReviews';
import Link from 'next/link';
import { format } from 'date-fns';

const Reviews = () => {

    const { searchTerm, setSearchTerm, selectedRating, setSelectedRating, reviews, isLoading } = useMyReviews()

    // 1. Core Analytics Calculations
    const stats = useMemo(() => {
        const total = reviews.length;
        if (total === 0) return { average: 0, total: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

        const sum = reviews.reduce((acc, curr) => acc + curr?.rating, 0);
        const average = Number((sum / total).toFixed(2));

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(rev => {
            if (breakdown[rev?.rating] !== undefined) breakdown[rev?.rating]++;
        });

        return { average, total, breakdown };
    }, [reviews]);

    // Helper to render responsive crisp stars
    const renderStars = rating => {
        return Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? "text-amber-400" : "text-slate-200"}>
                {i < rating ? <FaStar /> : <FaRegStar />}
            </span>
        ));
    };

    if (isLoading && searchTerm && selectedRating) {
        return <>Loading...</>
    }

    return (
        <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

            {/* 1. ROUTE ENTRY HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-600">
                        <Link href="/dashboard/caregiver" className="hover:underline flex items-center gap-1">
                            <FaArrowLeft className="text-[10px]" /> Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-slate-400">Reviews</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Client Evaluative Feedback
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold">
                        Review, track, and analyze medical care service insights left by patient families.
                    </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-100/70 text-teal-700 text-[10px] font-black uppercase tracking-wider self-start sm:self-center shadow-sm">
                    <FaRegCommentDots className="text-xs" />
                    {stats?.total} {stats?.total > 1 ? 'Total Ratings' : 'Total Rating'}
                </div>
            </div>

            {!reviews.length && !searchTerm && !selectedRating ? (
                /* SECTION BASE ZERO STATE VIEW */
                < div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center shadow-sm flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-4 shadow-inner">
                        <FaRegCommentDots className="text-2xl" />
                    </div>
                    <h3 className="text-base font-black text-slate-800 tracking-tight">No Reviews Logged Yet</h3>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed font-medium">
                        Patient reports and direct feedback ratings appear here automatically upon concluding assignment verification timelines.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT COLUMN: RATING INDEX & CONTROL PLATFORMS */}
                    <div className="space-y-6">
                        {/* RATINGS AGGREGATE SUMMARY */}
                        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-3">
                                Rating Aggregate Index
                            </h3>

                            {/* Large Score Metric display */}
                            <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <div className="text-center">
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{stats?.average}</h2>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Out of 5.0</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex text-xs gap-0.5">
                                        {renderStars(Math.round(stats?.average))}
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold">Overall Platform Standing</p>
                                </div>
                            </div>

                            {/* Progression Bar Metrics Breakdown */}
                            <div className="space-y-2.5">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = stats?.breakdown[star];
                                    const percentage = stats?.total > 0 ? (count / stats?.total) * 100 : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                                            <span className="w-3 text-right font-black">{star}</span>
                                            <span className="text-amber-400 text-[10px]"><FaStar /></span>
                                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-linear-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="w-6 text-right text-slate-400 font-medium">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* FILTER OPERATOR CONTROLS CARD */}
                        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                                Segment Filters
                            </h3>
                            <div className="space-y-3">
                                {/* Search Inputs */}
                                <div className="relative">
                                    <FaSearch className="absolute right-4 mt-3 text-xs text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search text or client name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-500/30 focus:bg-white transition-all"
                                    />
                                </div>
                                {/* Filter Dropdown options selectors */}
                                <div className="relative">
                                    <FaFilter className="absolute right-4 mt-3 text-xs text-slate-400" />
                                    <select
                                        value={selectedRating}
                                        onChange={(e) => setSelectedRating(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 font-black tracking-tight appearance-none focus:outline-none focus:border-teal-500/30 focus:bg-white transition-all"
                                    >
                                        <option value="all">All Star Gradations</option>
                                        <option value="5">5 Stars Only</option>
                                        <option value="4">4 Stars Only</option>
                                        <option value="3">3 Stars Only</option>
                                        <option value="2">2 Stars Only</option>
                                        <option value="1">1 Star Only</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMNS: DYNAMIC EVALUATION REVIEWS TIMELINE FEED */}
                    <div className="lg:col-span-2 space-y-4">
                        {reviews.length === 0 ? (
                            /* FILTERED MATRIX EMPTY STATE MATCH VUE */
                            <div className="bg-white border border-slate-100 rounded-[2rem] p-10 text-center shadow-sm">
                                <p className="text-xs font-bold text-slate-400">No logs match your tracing search parameters.</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div
                                    key={review?._id}
                                    className="bg-white border border-slate-100 rounded-[2rem] p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden group hover:border-slate-200 transition-all duration-300 animate-fadeIn"
                                >
                                    {/* Evaluation Card Top Level Identification Area */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 text-xs shrink-0 shadow-sm">
                                                <FaUser />
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none">
                                                    {review?.customer_name}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                    <FaCalendarAlt className="text-[9px]" />
                                                    {format(new Date(review?.created_at), 'PPP')}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Score Block Badge Elements Layout */}
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-100 text-xs self-start sm:self-center">
                                            <div className="flex gap-0.5 text-[10px]">
                                                {renderStars(review?.rating)}
                                            </div>
                                            <span className="font-black text-slate-700 text-[10px]">{review?.rating}.0</span>
                                        </div>
                                    </div>

                                    {/* Direct Review Context Core Content Block */}
                                    <div className="flex gap-4 pl-6 pr-2">
                                        <FaQuoteLeft className="text-slate-400 text-sm pointer-events-none group-hover:text-teal-500/10 transition-colors" />
                                        <p className="text-xs font-medium text-slate-700 italic leading-relaxed whitespace-pre-line">
                                            {`"${review?.review_text}"`}
                                        </p>
                                    </div>

                                    {/* Operational Log Index Tracking Tags Footer */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 border-t border-slate-50 text-[10px] font-bold text-slate-400">
                                        <div>
                                            <span className="font-semibold text-slate-300 uppercase tracking-wider">Booking Lock:</span>{' '}
                                            <span className="font-mono bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-slate-500 select-all">{review?.booking_id}</span>
                                        </div>
                                        <div className="hidden sm:block text-slate-200">|</div>
                                        <div>
                                            <span className="font-semibold text-slate-300 uppercase tracking-wider">Client Ref:</span>{' '}
                                            <span className="font-mono bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-slate-500 select-all">{review?.customer_id}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default Reviews;