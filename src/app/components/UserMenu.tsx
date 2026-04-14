'use client'
import { useSession } from 'next-auth/react';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const UserMenu = () => {

    const { data } = useSession()

    return (
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none mb-1">
                    {data?.user?.name || 'Care Nest User'}
                </p>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Premium Member</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-teal-50 border-2 border-teal-100 flex items-center justify-center text-teal-600 font-black shadow-sm">
                {data?.user?.name ? data.user.name[0].toUpperCase() : <FaUserCircle size={24} />}
            </div>
        </div>
    );
};

export default UserMenu;