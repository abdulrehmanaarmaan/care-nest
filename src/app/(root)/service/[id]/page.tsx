'use client'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    FaCheckCircle, FaStar, FaClock, FaShieldAlt,
    FaArrowRight, FaStethoscope, FaUserShield
} from 'react-icons/fa';
import useServiceInfo from '../../../../hooks/useServiceInfo';
import Loader from '../../loading';

const ServiceDetails = () => {

    const { id } = useParams()

    const { service, isLoading } = useServiceInfo(id)

    if (isLoading) {
        return <Loader></Loader>
    }

    const { category, rating, total_reviews, service_name, description, professional_status, features, price, duration } = service || {}

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* 1. Dynamic Hero Header */}
            <section className="bg-slate-900 pt-20 pb-32 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-teal-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-400 text-xs font-bold uppercase tracking-widest">
                            {category}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <FaStar /> <span className="text-white font-bold">{rating}</span>
                            <span className="text-slate-400 text-sm font-normal">({total_reviews}
                                reviews)</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
                        {service_name}
                    </h1>
                </div>
            </section>
            {/* 2. Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Details (8/12) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-900/5">
                            <div className="prose prose-slate max-w-none">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Service Overview</h2>
                                <p className="text-slate-600 text-lg leading-relaxed mb-10">
                                    {description}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="p-3 bg-white text-teal-600 rounded-xl shadow-sm">
                                        <FaUserShield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Professional Status</h4>
                                        <p className="text-slate-500 text-sm">{professional_status}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="p-3 bg-white text-teal-600 rounded-xl shadow-sm">
                                        <FaShieldAlt size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Care Guarantee</h4>
                                        <p className="text-slate-500 text-sm">Verified & Insured Personnel</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Features/Inclusions Section */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8">What this service
                                includes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                            <FaCheckCircle size={14} />
                                        </div>
                                        <span className="text-slate-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Booking Widget (4/12) */}
                    <aside className="lg:col-span-4">
                        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-teal-50 shadow-2xl shadow-teal-900/10 sticky top-8">
                            <div className="mb-8">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl font-black text-slate-900">${price}</span>
                                    <span className="text-slate-400 font-bold uppercase tracking-wider text-sm">{duration}</span>
                                </div>
                                <p className="text-slate-500 text-sm">All-inclusive care package</p>
                            </div>
                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium p-4 bg-slate-50 rounded-2xl">
                                    <FaClock className="text-teal-600" />
                                    <span>Immediate Availability</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium p-4 bg-slate-50 rounded-2xl">
                                    <FaStethoscope className="text-teal-600" />
                                    <span>Custom Care Plan Included</span>
                                </div>
                            </div>
                            <Link href={`/booking/${id}`} className="w-full bg-teal-600 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-teal-700 hover:-translate-y-1 transition-all shadow-xl shadow-teal-600/30 group">
                                Book Service Now
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <p className="mt-6 text-center text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                                Secure Checkout by Care Nest
                            </p>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default ServiceDetails;