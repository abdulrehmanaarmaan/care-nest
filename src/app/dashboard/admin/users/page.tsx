'use client'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { FaCheckCircle, FaSearch, FaShieldAlt, FaTimesCircle, FaTrash, FaUser, FaUserShield } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useUsersData from '../../../../hooks/useUsersData';

const Users = () => {

    const { users, refetch } = useUsersData()

    const { data } = useSession()

    const { id: myId } = data?.user || {}

    const grantAdminRole = async (id: string) => {

        if (id == myId) {
            return Swal.fire({
                icon: "error",
                title: "Action blocked",
                text: "You cannot change your own role."
            })
        }

        const user = users.find(user => user?._id === id)

        if (user.role === 'admin') {
            return Swal.fire({
                icon: "info",
                title: "Action blocked",
                text: "User is already an admin."
            })
        }

        await Swal.fire({
            title: 'Grant Administrator Access?',
            text: 'This user will gain administrative permissions.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Grant Access'
        })
            .then(async res => {
                if (res.isConfirmed) {

                    const payload = { role: "admin", promoted_at: new Date(), promoted_by: myId }

                    const res = await fetch(`/api/users/${id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    })

                    const result = await res.json()

                    if (result?.success) {
                        refetch().then(() => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Access Updated',
                                text: 'Administrator privileges granted'
                            })
                        })
                    }
                }
            })
    }

    const terminateUserAccount = async (id: string) => {

        if (id == myId) {
            return Swal.fire({
                icon: "error",
                title: "Action blocked",
                text: "You cannot deactivate your own account."
            })
        }

        const user = users.find(user => user?._id === id)

        if (user.role === 'admin') {
            return Swal.fire({
                icon: "error",
                title: "Action blocked",
                text: "Administrator accounts cannot be deactivated."
            })
        }

        if (user.account_status === "deactivated") {
            return Swal.fire({
                icon: "info",
                title: "Action blocked",
                text: "User's account is already deactivated."
            })
        }

        const bookingRes = await fetch(`/api/bookings?customer_id=${id}&status=Active`);

        const bookings = await bookingRes.json();

        if (bookings.length > 0) {
            return Swal.fire({
                icon: "warning",
                title: "Cannot deactivate",
                text: "This user has active bookings that must be completed or cancelled first."
            })
        }

        await Swal.fire({
            title: 'Deactivate account?',
            text: 'User access will be removed.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Deactivate'
        })
            .then(async res => {
                if (res.isConfirmed) {

                    const payload = { account_status: "deactivated", deactivated_at: new Date(), deactivated_by: myId }

                    const res = await fetch(`/api/users/${id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    })
                    const result = await res.json()
                    if (result?.success) {
                        refetch().then(() => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Account Disabled',
                                text: 'User can no longer sign in'
                            })
                        })
                    }
                }
            })
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Directory</h1>
                    <p className="text-slate-500 text-sm font-medium">Monitor ecosystem accounts, update access layers, and manage
                        permissions</p>
                </div>
                {/* Dynamic Context Stats Module */}
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2 rounded-xl text-xs font-bold text-slate-500">
                    <span className="px-3 py-1.5 bg-white shadow-sm border border-slate-200/50 rounded-lg">
                        Total Users: <span className="text-slate-900 font-black">{users?.length || 0}</span>
                    </span>
                </div>
            </div>
            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Identity Details</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Contact / Line</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Security /
                                    Verification</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">System Role</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400">Registration Date</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.1em] font-black text-slate-400 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users && users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user?._id} className="hover:bg-slate-50/30 transition-colors group">
                                        {/* Profile Card Core Layout */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 flex-shrink-0 relative">
                                                    {user?.profile_image ? (
                                                        <img
                                                            src={user?.profile_image}
                                                            alt={user?.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-700 font-black text-sm uppercase">
                                                            {user?.name?.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 leading-tight group-hover:text-teal-600 transition-colors">{user?.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Communications Node */}
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-slate-700 font-bold">{user?.contact || 'No Contact Set'}</p>
                                            <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5 uppercase">ID: {user?.
                                                _id?.slice(-8)}</p>
                                        </td>
                                        {/* Account Authenticity Validation Badge */}
                                        <td className="px-6 py-5">
                                            {user?.is_verified ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-100">
                                                    <FaCheckCircle size={10} /> Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100">
                                                    <FaTimesCircle size={10} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        {/* Authority Level Assignment Selector */}
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${user?.role === 'admin'
                                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                : 'bg-slate-50 text-slate-700 border-slate-200'
                                                }`}>
                                                {user?.role === 'admin' ? <FaUserShield size={10} /> : <FaUser size={10} />}
                                                {user?.role}
                                            </span>
                                        </td>
                                        {/* Platform Lifespan Registration */}
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-semibold text-slate-600">
                                                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric', year: 'numeric'
                                                }) : 'N/A'}
                                            </p>
                                        </td>
                                        {/* Administrative Actions Layer */}
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1">
                                                {user?._id == myId ? (
                                                    <span
                                                        className=" inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-200 whitespace-nowrap"
                                                    >
                                                        You
                                                    </span>
                                                ) : user?.account_status === "deactivated" ? (

                                                    /* Deactivated Account */
                                                    <span
                                                        className=" inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100 whitespace-nowrap"
                                                    >
                                                        Deactivated
                                                    </span>

                                                ) : (

                                                    <>
                                                        {/* Grant Admin */}
                                                        {user?.role !== "admin" && (
                                                            <button
                                                                onClick={() => grantAdminRole(user?._id)}
                                                                className=" p-2.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                                                title="Grant Admin Role"
                                                            >
                                                                <FaShieldAlt size={16} />
                                                            </button>
                                                        )}

                                                        {/* Deactivate */}
                                                        {user?.role !== "admin" && (
                                                            <button
                                                                onClick={() => terminateUserAccount(user?._id)}
                                                                className=" p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                                                title="Deactivate User Account"
                                                            >
                                                                <FaTrash size={15} />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <FaSearch size={44} className="mb-4 opacity-20" />
                                            <p className="font-bold text-slate-500">No managed users discovered</p>
                                            <p className="text-xs mt-1">There are currently no standard accounts logged within Care Nest.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default Users;