'use client'
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { FaArrowLeft, FaBell, FaBriefcase, FaCheckDouble, FaCircle, FaClock, FaExclamationTriangle, FaTrashAlt, FaUserCheck, FaWallet } from 'react-icons/fa';
import useMyNotifications from '../../../../hooks/useMyNotifications';

const Notifications = () => {

    const { notifications: initialNotifications } = useMyNotifications()


    const [notifications, setNotifications] = useState(initialNotifications);
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'

    // 1. Unread Counter Core Calculation
    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.is_read).length;
    }, [notifications]);

    // 2. Tab Segment Filtering Architecture
    const filteredNotifications = useMemo(() => {
        if (activeTab === 'unread') {
            return notifications.filter(n => !n.is_read);
        }
        return notifications;
    }, [notifications, activeTab]);

    // 3. Action Pipeline Operators
    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const toggleReadStatus = (id) => {
        setNotifications(prev => prev.map(n =>
            n._id === id ? { ...n, is_read: !n.is_read } : n
        ));
    };

    const handleDeleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n._id !== id));
    };

    // 4. Color Mapping Utility Matrix based on Schema `type`
    const getTypeConfigs = (type) => {
        switch (type) {
            case 'job_assigned':
                return {
                    icon: <FaBriefcase className="text-xs" />,
                    bg: 'bg-teal-50 border-teal-100/50 text-teal-700',
                    label: 'Assignment'
                };
            case 'payout_processed':
                return {
                    icon: <FaWallet className="text-xs" />,
                    bg: 'bg-emerald-50 border-emerald-100/50 text-emerald-700',
                    label: 'Financial'
                };
            case 'verification_approved':
                return {
                    icon: <FaUserCheck className="text-xs" />,
                    bg: 'bg-blue-50 border-blue-100/50 text-blue-700',
                    label: 'System Profile'
                };
            default:
                return {
                    icon: <FaExclamationTriangle className="text-xs" />,
                    bg: 'bg-slate-50 border-slate-100 text-slate-700',
                    label: 'Alert'
                };
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

            {/* SECTION COMPACT HEADER BLOCK */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-600">
                        <Link href="/dashboard/caregiver" className="hover:underline flex items-center gap-1">
                            <FaArrowLeft className="text-[10px]" /> Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-slate-400">Live Broadcast Terminal</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Action Alerts Hub
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold">
                        Real-time logging of patient assignments, routing configurations, and compliance updates.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                    >
                        <FaCheckDouble className="text-slate-400 text-xs" />
                        Clear Unread Badges
                    </button>
                )}
            </div>

            {/* TAB FILTER & SUB-CONTROLS SYSTEM */}
            <div className="flex items-center border-b border-slate-100 gap-6 text-xs">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === 'all'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                >
                    All Feeds ({notifications.length})
                </button>
                <button
                    onClick={() => setActiveTab('unread')}
                    className={`pb-3 font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'unread'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Unread Inbox
                    {unreadCount > 0 && (
                        <span className="bg-teal-500 text-white font-black rounded-full px-1.5 py-0.5 text-[9px] min-w-4 text-center">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>

            {/* CORE NOTIFICATION MATRIX CONTENT BLOCK */}
            {filteredNotifications.length === 0 ? (
                /* GLOBAL LEVEL VACANT LOG EMPTY STATE */
                <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center shadow-sm flex flex-col items-center justify-center animate-fadeIn">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-4 shadow-inner">
                        <FaBell className="text-2xl" />
                    </div>
                    <h3 className="text-base font-black text-slate-800 tracking-tight">Broadcast Inbox Clean</h3>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed font-medium">
                        There are no active {activeTab === 'unread' ? 'unread' : 'account'} log markers needing operational engagement right now.
                    </p>
                </div>
            ) : (
                <div className="space-y-3.5">
                    {filteredNotifications.map((notif) => {
                        const typeConfig = getTypeConfigs(notif.type);
                        return (
                            <div
                                key={notif._id}
                                className={`group bg-white border rounded-[2rem] p-5 sm:p-6 transition-all duration-300 flex items-start gap-4 shadow-sm relative overflow-hidden ${notif.is_read
                                    ? 'border-slate-100 opacity-80 hover:opacity-100'
                                    : 'border-slate-200/80 ring-1 ring-slate-100/50'
                                    }`}
                            >
                                {/* Left Static Visual Indicator Bar */}
                                {!notif.is_read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-teal-500 to-emerald-500" />
                                )}

                                {/* Category Custom Metric Icon Bubble */}
                                <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm ${typeConfig.bg}`}>
                                    {typeConfig.icon}
                                </div>

                                {/* Core Informational Field Block */}
                                <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <h4 className={`text-sm tracking-tight leading-none ${notif.is_read ? 'text-slate-700 font-bold' : 'text-slate-900 font-black'}`}>
                                            {notif.title}
                                        </h4>
                                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-md ${typeConfig.bg}`}>
                                            {typeConfig.label}
                                        </span>
                                    </div>

                                    <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-3xl pr-4">
                                        {notif.message}
                                    </p>

                                    {/* Associated Meta Footer Section */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 font-bold pt-1.5">
                                        <span className="flex items-center gap-1">
                                            <FaClock className="text-[9px]" />
                                            June 21, 2026
                                        </span>
                                        <span>•</span>
                                        <div>
                                            <span className="font-semibold text-slate-300 uppercase tracking-wider">Ref ID:</span>{' '}
                                            <span className="font-mono bg-slate-50 border border-slate-100 px-1 py-0.2 rounded text-slate-500 text-[9px]">
                                                {notif.reference_id}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Matrix Action Controls Trigger Blocks */}
                                <div className="flex items-center gap-1 self-center opacity-40 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggleReadStatus(notif._id)}
                                        title={notif.is_read ? "Mark as unread" : "Mark as read"}
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 ${notif.is_read
                                            ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                                            : 'text-teal-600 hover:bg-teal-50'
                                            }`}
                                    >
                                        <FaCircle className={notif.is_read ? "text-[8px]" : "text-[10px] animate-pulse"} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteNotification(notif._id)}
                                        title="Delete log permanently"
                                        className="w-8 h-8 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-all active:scale-90"
                                    >
                                        <FaTrashAlt className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Notifications;