'use client'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheck, FaEnvelope, FaPaperPlane, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

interface ContactFormData {
    name: string;
    email: string;
    topic: string;
    booking_id?: string;
    message: string;
}

const Contact = () => {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedInfo, setSubmittedInfo] = useState({
        name: "",
        topic: "",
    });

    const { data: session, status } = useSession();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        defaultValues: {
            name: "",
            email: "",
            topic: "General Inquiry",
            booking_id: "",
            message: "",
        },
    });

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            reset({
                name: session.user.name ?? "",
                email: session.user.email ?? "",
                topic: "General Inquiry",
                booking_id: "",
                message: "",
            });
        }
    }, [status, session, reset]);

    const topic = watch("topic");

    const showBookingIdField =
        topic === "Booking Inquiry" ||
        topic === "Billing & Payments";

    const onSubmit = async (data: ContactFormData) => {
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to send your message."
                );
            }

            setSubmittedInfo({
                name: data?.name,
                topic: data?.topic
            })

            setIsSubmitted(true)

            reset();

        } catch (error) {
            console.error("Contact form submission failed:", error);

            // Show a toast/error message here.
        }
    };

    return (
        <div className="w-full font-sans antialiased text-slate-900 bg-white min-h-screen py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-6 space-y-16">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <span className="inline-flex items-center px-4 py-1.5 text-xs font-bold tracking-widest text-teal-700 bg-teal-50 border border-teal-100 rounded-full uppercase shadow-xs">
                        Contact CareNest Support
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                        How Can We Help?
                    </h1>
                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                        Have questions about finding a caregiver, managing a booking, or service details? Our team is here to support you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Help Channels Column (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Email Support Card */}
                        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-teal-100 transition-all duration-300 relative overflow-hidden flex gap-5 items-start group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-50/40 rounded-bl-full pointer-events-none" />
                            <div className="p-4 bg-teal-50 rounded-2xl text-teal-600 border border-teal-100 shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                                <FaEnvelope size={20} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Email Support</h3>
                                <a href="mailto:abdulrehmanaarmaan@gmail.com" className="text-teal-600 font-bold text-base block hover:underline">
                                    support@carenest.com
                                </a>
                                <p className="text-slate-500 text-xs font-medium pt-1">
                                    We usually respond within 12 hours.
                                </p>
                            </div>
                        </div>

                        {/* Phone Support Card */}
                        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-teal-100 transition-all duration-300 relative overflow-hidden flex gap-5 items-start group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-50/40 rounded-bl-full pointer-events-none" />
                            <div className="p-4 bg-teal-50 rounded-2xl text-teal-600 border border-teal-100 shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                                <FaPhoneAlt size={18} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Phone Support</h3>
                                <a href="tel:+8801725348534" className="text-slate-900 font-extrabold text-base block hover:text-teal-600 transition-colors">
                                    +880 1725 348534
                                </a>
                                <p className="text-slate-500 text-xs font-medium pt-1">
                                    Sunday - Thursday, 9:00 AM to 6:00 PM (GMT+6)
                                </p>
                            </div>
                        </div>

                        {/* WhatsApp Support Callout Card */}
                        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden space-y-4">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full pointer-events-none" />
                            <div className="flex items-center gap-2.5 text-teal-400 text-xs font-bold uppercase tracking-widest">
                                <FaWhatsapp size={18} />
                                <span>WhatsApp Support</span>
                            </div>
                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                Need immediate help with an active care booking? Connect directly with our team on WhatsApp for quick assistance.
                            </p>
                            <a
                                href="https://wa.me/8801725348534"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-teal-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-600/30 transition-all duration-300 cursor-pointer"
                            >
                                <span>Chat on WhatsApp</span>
                            </a>
                        </div>

                    </div>

                    {/* Contact Form Panel (7 cols) */}
                    <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm relative">
                        {isSubmitted ? (
                            <div className="py-20 text-center space-y-4 animate-fadeIn">
                                <div className="w-16 h-16 bg-teal-50 border border-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <FaCheck size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                        Message Sent Successfully
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                                        Thank you, <span className="text-slate-900 font-bold">{submittedInfo?.name}</span>. We’ve received your message regarding <span className="text-slate-900 font-bold">{submittedInfo?.topic}</span> and will get back to you shortly.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="mt-6 inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-700 underline cursor-pointer"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                {/* Full Name & Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold tracking-wider text-slate-500 block">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            {...register("name", {
                                                required: "Full name is required",
                                                minLength: {
                                                    value: 2,
                                                    message: "Name must be at least 2 characters",
                                                }
                                            })}
                                            placeholder="e.g. Abdul Rehman"
                                            className={`w-full px-5 py-3.5 border rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none bg-slate-50/50 transition-all ${errors.name
                                                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"}`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold tracking-wider text-slate-500 block">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            {...register("email", {
                                                required: "Email address is required",
                                            })}

                                            placeholder="e.g. abdul@gmail.com"
                                            className={`w-full px-5 py-3.5 border rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none bg-slate-50/50 transition-all ${errors.email
                                                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"}`}
                                        />

                                        {status === "authenticated" && (
                                            <p className="mt-1 text-[11px] font-medium text-teal-600">
                                                Pre-filled from your account
                                            </p>
                                        )}

                                        {errors.email && (
                                            <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p>
                                        )}

                                    </div>
                                </div>

                                {/* Inquiry Topic */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold tracking-wider text-slate-500 block">
                                        Inquiry Topic
                                    </label>
                                    <select
                                        {...register("topic", {
                                            required: "Please select an inquiry topic",
                                        })}
                                        className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 bg-slate-50/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Booking Inquiry">Booking Inquiry</option>
                                        <option value="Caregiver Application">Caregiver Application</option>
                                        <option value="Billing & Payments">Billing & Payments</option>
                                    </select>
                                    {errors.topic && (
                                        <p className='text-rose-600'>{errors.topic.message}</p>
                                    )}
                                </div>

                                {/* Conditional Booking ID Field */}
                                {showBookingIdField && (
                                    <div className="space-y-2 animate-fadeIn">
                                        <label className="text-xs uppercase font-bold tracking-wider text-slate-500 block flex justify-between">
                                            <span>Booking ID</span>
                                            <span className="text-slate-400 font-normal lowercase">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register("booking_id")}
                                            placeholder="e.g. BK-94021"
                                            className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 bg-slate-50/50 transition-all"
                                        />
                                    </div>
                                )}

                                {/* Message */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold tracking-wider text-slate-500 block">
                                        Message
                                    </label>
                                    <textarea
                                        rows={4}
                                        {...register("message", {
                                            required: "Please enter your message",
                                            minLength: {
                                                value: 10,
                                                message: "Message must be at least 10 characters",
                                            },
                                            maxLength: {
                                                value: 2000,
                                                message: "Message cannot exceed 2000 characters",
                                            },
                                        })}
                                        placeholder="How can we help you today?"
                                        className={`w-full px-5 py-3.5 border rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none bg-slate-50/50 transition-all resize-none ${errors.name
                                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"}`}
                                    />
                                    {errors.message && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">{errors.message.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-teal-600 text-white font-extrabold text-sm uppercase tracking-wider py-4 rounded-2xl hover:bg-teal-700 shadow-lg shadow-teal-600/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                                >
                                    <FaPaperPlane size={14} />
                                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;