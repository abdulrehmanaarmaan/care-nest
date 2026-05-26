'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { FaCalendarCheck, FaHeart, FaSlidersH, FaStar, FaTrashAlt, FaUserShield } from 'react-icons/fa';

// Mock schema representation matching Care Nest 2026 database profiles
interface FavoriteProvider {
    _id: string;
    name: string;
    role_title: string;
    avatar_url: string;
    category: 'Infant Care' | 'Elderly Assistance' | 'Medical Companion';
    rating: number;
    total_reviews: number;
    hourly_rate: number;
    availability_status: 'active_now' | 'allocated' | 'offline';
    next_available_slot: string;
    years_experience: number;
}

const Favorites = () => {

    const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

    // Realized state arrays modeling live 2026 application contexts
    const [favorites, setFavorites] = useState<FavoriteProvider[]>([
        {
            _id: 'p-701',
            name: 'Sarah Jenkins, RN',
            role_title: 'Certified Pediatric Specialist',
            avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
            category: 'Infant Care',
            rating: 4.95,
            total_reviews: 142,
            hourly_rate: 35,
            availability_status: 'active_now',
            next_available_slot: 'Immediate Allocation',
            years_experience: 6
        },
        {
            _id: 'p-702',
            name: 'David Vance',
            role_title: 'Advanced Mobility & Elder Assistant',
            avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
            category: 'Elderly Assistance',
            rating: 4.88,
            total_reviews: 96,
            hourly_rate: 28,
            availability_status: 'allocated',
            next_available_slot: 'Monday, 09:00 AM',
            years_experience: 8
        },
        {
            _id: 'p-703',
            name: 'Amelia Roy, Cle',
            role_title: 'Postnatal Care & Lactation Companion',
            avatar_url: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300',
            category: 'Infant Care',
            rating: 5.0,
            total_reviews: 64,
            hourly_rate: 42,
            availability_status: 'active_now',
            next_available_slot: 'Immediate Allocation',
            years_experience: 4
        }
    ]);

    const handleRemoveFavorite = (id: string) => {
        // UI state mutation handler
        setFavorites(favorites.filter(item => item._id !== id));
    };

    const filteredFavorites = activeCategoryFilter === 'All'
        ? favorites
        : favorites.filter(item => item.category === activeCategoryFilter);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* ==========================================
  1. DASHBOARD SUB-ROUTE HEADER
 ========================================== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase">
                        <span>Control Panel</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>Shortlists</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Verified Favorites
                    </h1>
                    <p className="text-slate-400 text-xs font-medium">
                        Monitor real-time allocation availability updates for your shortlisted care specialists.
                    </p>
                </div>
                {/* Dynamic Context Counter Badge */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl px-4 py-2.5 flex items-center gap-3 self-start sm:self-center">
                    <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                        <FaHeart size={12} className="animate-pulse" />
                    </div>
                    <div>
                        <span className="block text-sm font-black text-slate-900 leading-none">{favorites.length} Saved</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Asset Monitors</span>
                    </div>
                </div>
            </div>
            {/* ==========================================
  2. INTERACTIVE SEGMENTED FILTER BAR
 ========================================== */}
            <div className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-100 p-2 rounded-2xl overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-1.5 min-w-max">
                    {['All', 'Infant Care', 'Elderly Assistance', 'Medical Companion'].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveCategoryFilter(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer ${activeCategoryFilter
                                === tab
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="text-slate-400 p-2 hidden sm:block">
                    <FaSlidersH size={12} />
                </div>
            </div>
            {/* ==========================================
  3. SHORTLISTED CARD FLOW ARCHITECTURE
 ========================================== */}
            {filteredFavorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFavorites.map((provider) => (
                        <article
                            key={provider._id}
                            className="bg-white border border-slate-200 rounded-[2rem] shadow-[0_12px_30px_rgba(15,23,42,0.01)] hover:shadow-[0_20px_40px_rgba(13,148,136,0.04)] hover:border-teal-100/80 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
                        >
                            {/* Top Meta Interaction Bar overlay */}
                            <div className="absolute top-4 right-4 z-20">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFavorite(provider._id)}
                                    title="Remove from Shortlist"
                                    className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm cursor-pointer"
                                >
                                    <FaTrashAlt size={10} />
                                </button>
                            </div>
                            {/* Main Content Body */}
                            <div className="p-6 space-y-4">
                                {/* Provider Identity Row */}
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 relative">
                                        <img
                                            src={provider.avatar_url}
                                            alt={provider.name}
                                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                                        />
                                        {/* Live Telemetry Status Ring Overlay */}
                                        <span
                                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${provider.
                                                availability_status === 'active_now' ? 'bg-emerald-500' :
                                                provider.availability_status === 'allocated' ? 'bg-amber-500' : 'bg-slate-300'
                                                }`}
                                            title={`Status: ${provider.availability_status}`}
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">
                                            {provider.category}
                                        </span>
                                        <h3 className="font-black text-slate-900 tracking-tight text-sm sm:text-base line-clamp-1 group-hover:text-teal-600 transition-colors">
                                            {provider.name}
                                        </h3>
                                        <p className="text-slate-500 text-xs font-semibold line-clamp-1">
                                            {provider.role_title}
                                        </p>
                                    </div>
                                </div>
                                {/* Rating Metrics & Credential Bar */}
                                <div className="flex items-center justify-between bg-slate-50 border border-slate-100/60 rounded-xl px-3 py-2 text-xs">
                                    <div className="flex items-center gap-1">
                                        <FaStar className="text-amber-500 fill-amber-500" size={10} />
                                        <span className="font-black text-slate-800">{provider.rating.toFixed(2)}</span>
                                        <span className="text-slate-400 font-medium">({provider.total_reviews})</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-500 font-bold">
                                        <FaUserShield size={11} className="text-teal-500" />
                                        <span>{provider.years_experience} Yrs Exp</span>
                                    </div>
                                </div>
                                {/* Telemetry Operational Schedule Block */}
                                <div className="space-y-1 bg-teal-50/20 border border-teal-50 rounded-xl p-3">
                                    <span className="text-[9px] uppercase font-black tracking-wider text-teal-800 block">
                                        Telemetry Schedule Tracking
                                    </span>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mt-0.5">
                                        <FaCalendarCheck size={11} className="text-teal-600 flex-shrink-0" />
                                        <span className="line-clamp-1">{provider.next_available_slot}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Action Footer Module */}
                            <div className="px-6 pb-6 pt-2 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between gap-4">
                                <div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Price Index</span>
                                    <div className="flex items-baseline">
                                        <span className="text-lg font-black text-slate-900">${provider.hourly_rate}</span>
                                        <span className="text-[10px] text-slate-400 font-extrabold ml-0.5">/hr</span>
                                    </div>
                                </div>
                                <Link
                                    href={`/services/${provider._id}`}
                                    className="bg-slate-900 text-white hover:bg-teal-600 px-4 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider active:scale-[0.98] transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm shadow-slate-900/5"
                                >
                                    <span>Deploy</span>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                /* ==========================================
                    4. ZERO STATE EMPTY BALANCER
                   ========================================== */
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 sm:p-20 text-center shadow-[0_15px_40px_rgba(15,23,42,0.01)] max-w-xl mx-auto">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                        <FaHeart size={18} />
                    </div>
                    <h2 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">No Tracked Specialists Saved</h2>
                    <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto mt-1.5 leading-relaxed">
                        Shortlist provider matrices while exploring the platform services network to monitor availability metrics here directly.
                    </p>
                    <div className="pt-5">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 bg-teal-600 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-teal-700 transition-all shadow-md shadow-teal-600/10 cursor-pointer"
                        >
                            Explore Public Services
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorites;