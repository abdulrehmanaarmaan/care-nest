'use client'
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaStar } from 'react-icons/fa';
import useUsersData from '../../hooks/useUsersData';
import useUserData from '../../hooks/useUserData';
import Swal from 'sweetalert2';

const Review = ({ status, id, caregiver_id }) => {

    const { data: savedReview, refetch, isLoading } = useQuery({
        queryKey: ['saved_review', id],
        queryFn: async () => {
            const res = await fetch(`/api/caregiver-reviews?booking_id=${id}`)
            return res.json()
        }
    })

    const { users } = useUsersData()

    const { user } = useUserData()

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

    const [rating, setRating] = useState(0)

    const { handleSubmit, register } = useForm()

    if (isLoading) {
        return <>Loading...</>
    }

    const caregiver_name = users.find(user => user?._id === caregiver_id)?.name

    const { _id, name } = user || {}

    const { _id: reviewId, rating: savedRating } = savedReview || {}

    const handleReviewSubmit = async data => {
        const { review_text } = data

        const caregiverReview = {
            booking_id: id,
            caregiver_id,
            caregiver_name,
            customer_id: _id,
            customer_name: name,
            rating,
            review_text
        }

        const res = await fetch('/api/caregiver-reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caregiverReview)
        })

        const result = await res.json()

        if (result?.success) {
            setIsReviewModalOpen(false)
            refetch()
            Swal.fire({
                title: 'Thank You!',
                text: 'Your feedback has been recorded successfully.',
                icon: 'success',
                confirmButtonColor: '#0d9488',
            })

            const notification = {
                recipient_id: caregiver_id,
                recipient_role: 'caregiver',
                type: 'review_received',
                title: "New Review Received",
                message: `A client has submitted a new review for your service.`,
                reference_type: "review",
                reference_id: result?.success,
                is_read: false,
            }
            await fetch('/api/caregiver-notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notification)
            })
        }
    }

    return (
        <div>
            {status === 'Completed' && (
                <div className="pt-8 mt-8 border-t border-slate-100">
                    <h3 className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-wider text-sm mb-4">
                        <span className="w-2 h-2 rounded-full bg-teal-500" /> Feedback & Valuation
                    </h3>

                    {!reviewId ? (
                        /* STATE A: Show Interactive Prompt to Open Form */
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-black text-slate-800">Rate Your Service Experience</h4>
                                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                                    Help our platform retain quality benchmarks by scoring your recent care provider engagement parameters.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsReviewModalOpen(true)}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                            >
                                <span className="text-amber-400">★★★★★</span> Leave Review
                            </button>
                        </div>
                    ) : (
                        /* STATE B: Pro 2026 Read-Only Success Card (Hides Form Completely) */
                        <div className="p-6 bg-emerald-50/40 border border-emerald-100/60 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-emerald-800">
                                    <span className="text-xs font-black bg-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wide">✓ Review Logged</span>
                                    <h4 className="text-sm font-black">Thank You for Your Feedback!</h4>
                                </div>
                                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                    Your performance submission has been locked into this caregiver's routing record.
                                </p>
                            </div>

                            {/* Optional: Render their actual submitted rating if available in bookingData */}
                            {savedRating && (
                                <div className="flex text-amber-500 text-sm tracking-tight sm:self-center self-start bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm gap-0.5">
                                    {Array.from({ length: savedRating }, (_, i) => (
                                        <span key={i}>
                                            <FaStar />
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            {/* INSERT PORTAL OVERLAY MODAL BEYOND THE CENTRAL CARD ELEMENT (Right before structural page exit layout parameters) */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-md border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_30px_70px_rgba(15,23,42,0.15)] space-y-6 transform transition-all animate-scaleUp">
                        {/* Modal Branding Header */}
                        <div className="space-y-1">
                            <div className="text-[9px] font-black tracking-[0.2em] uppercase text-teal-600">Performance Log</div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Rate Caregiver</h3>
                            <p className="text-xs text-slate-400 font-medium">Your score directly impacts the care provider's platform routing visibility.</p>
                        </div>
                        {/* Form State Component */}
                        <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-5">
                            {/* Micro Star Iteration Array */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Performance Valuation</label>
                                <div className="flex gap-2 text-2xl text-amber-400">
                                    {/* Static presentation matching data object defaults. Swap for interactive array mapped index modifiers if using active hover rating hooks */}
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        // Check if this specific star index is less than or equal to the currently selected active rating state
                                        const isActive = star <= rating;

                                        return (
                                            <button
                                                onClick={() => setRating(star)}
                                                type="button"
                                                key={star}
                                                className="hover:scale-125 transition-transform duration-150 active:scale-95 cursor-pointer p-1"
                                            >
                                                <FaStar
                                                    className={`text-2xl transition-colors duration-150 ${isActive
                                                        ? 'text-amber-500 drop-shadow-[0_2px_4px_rgba(245,158,11,0.2)]'
                                                        : 'text-slate-200'
                                                        }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Text Block Field */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Review Commentary</label>
                                <textarea
                                    {...register('review_text')}
                                    required
                                    rows={4}
                                    placeholder="Provide details about your experience. E.g., Very professional caregiver..."
                                    className="w-full p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500/50 focus:bg-white transition-all resize-none"
                                />
                            </div>
                            {/* Command Action Interfaces */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-wider transition cursor-pointer text-center border border-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black uppercase tracking-wider transition shadow-sm shadow-teal-600/10 active:scale-95 cursor-pointer text-center"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Review;