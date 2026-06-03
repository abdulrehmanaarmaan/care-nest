'use client'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FaCheckCircle, FaClock, FaCreditCard, FaEye, FaEyeSlash, FaIdCard, FaShieldAlt, FaUniversity, FaUserCheck } from 'react-icons/fa';
import useBankAccount from '../../../../hooks/useBankAccount';
import Swal from 'sweetalert2';

const BankAccount = () => {

    const { data, status } = useSession()
    const { id, name } = data?.user || {}

    const { bankAccount, isLoading, refetch } = useBankAccount(id)

    const { handleSubmit, register, reset, control, formState: { isSubmitting, isDirty } } = useForm()

    const [isHydrated, setIsHydrated] = useState(false)

    const [showAccountNumber, setShowAccountNumber] = useState(false);

    const accountDetails = useWatch({ control })

    const storageKey = `bank-account-${id}`

    useEffect(() => {
        if (status !== 'authenticated' && !isHydrated) return
        const timeout = setTimeout(() => {
            localStorage.setItem(
                storageKey,
                JSON.stringify(accountDetails)
            )
        }, 500)
        return () => clearTimeout(timeout)
    }, [status, id, storageKey, accountDetails, isHydrated])

    useEffect(() => {
        if (status !== 'authenticated' && isHydrated) return

        const savedDraft = localStorage.getItem(storageKey)

        const parsedDraft = JSON.parse(savedDraft)
        if (savedDraft) {
            reset(parsedDraft)
            setTimeout(() => {
                setIsHydrated(true)
            }, 300)
        }

        else if (bankAccount && Object.keys(bankAccount).length > 0) {
            reset({
                account_holder_name: bankAccount?.account_holder_name,
                bank_name: bankAccount?.bank_name,
                account_number: bankAccount?.account_number,
                routing_number: bankAccount?.routing_number
            })
        }

        else if (name) {
            reset({ account_holder_name: name })
        }
        setTimeout(() => {
            setIsHydrated(true)
        }, 300)
    }, [status, id, storageKey, reset, bankAccount, isHydrated, name])

    if (isLoading) {
        return <>Loading...</>
    }

    // const { _id, account_number_last4, updated_at, bank_name, is_verified } = bankAccount

    const saveBankAccount = async data => {

        const { account_holder_name, bank_name, account_number, routing_number } = data

        const account = { account_holder_name, bank_name, account_number, routing_number }

        if (bankAccount && Object.keys(bankAccount).length > 0) {

            const res = await fetch(`/api/caregiver-bank-accounts?caregiver_id=${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(account)
            })
            const result = await res.json()
            if (result?.success) {
                refetch()

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Bank account updated',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true
                })
            }
        }

        else if (isDirty) {

            const res = await fetch('/api/caregiver-bank-accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(account)
            })
            const result = await res.json()
            if (result?.success) {
                refetch()

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Bank account saved',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true
                })
            }
        }
    }

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto px-1 sm:px-2">

            {/* HEADER */}
            <div className="border-b border-slate-100/80 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-teal-600">
                        <span>Financial Settings</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>Payout Destination</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Bank Account
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                        Manage the bank account used for caregiver withdrawals and payout settlements.
                    </p>
                </div>
            </div>

            {/* TWO-COLUMN GRID TO DE-CLUTTER VERTICAL HEAVINESS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* LEFT/MAIN CONTAINER: BANK SETTING INTERFACE CARD */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                                Bank Information
                            </h3>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">
                                Update where your platform earnings should be transferred securely.
                            </p>
                        </div>

                        {/* HOOKED INTO YOUR REACT HOOK FORM MIDDLEWARE */}
                        <form onSubmit={handleSubmit(saveBankAccount)} className="space-y-5">

                            {/* ACCOUNT HOLDER */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                                    Account Holder Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <FaUserCheck className="text-sm" />
                                    </div>
                                    <input
                                        type="text"
                                        {...register('account_holder_name')}
                                        className="w-full border border-slate-200 bg-slate-50/30 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all placeholder:text-slate-400"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            {/* BANK NAME */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                                    Bank Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <FaUniversity className="text-sm" />
                                    </div>
                                    <input
                                        type="text"
                                        {...register('bank_name')}
                                        className="w-full border border-slate-200 bg-slate-50/30 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all placeholder:text-slate-400"
                                        placeholder="e.g., Brac Bank"
                                        required
                                    />
                                </div>
                            </div>

                            {/* FLEX FIELDS MATRIX FOR BALANCED HORIZONTAL GRID */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* ACCOUNT NUMBER */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                                        Account Number / IBAN
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <FaCreditCard className="text-sm" />
                                        </div>
                                        <input
                                            type={showAccountNumber ? 'text' : 'password'}
                                            {...register('account_number')}
                                            minLength={6}
                                            maxLength={30}
                                            className="w-full border border-slate-200 bg-slate-50/30 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all placeholder:text-slate-400 tracking-wide"
                                            placeholder="Full Account Number"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowAccountNumber(prev => !prev)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                                        >
                                            {showAccountNumber ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* ROUTING NUMBER */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                                        Routing Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <FaIdCard className="text-sm" />
                                        </div>
                                        <input
                                            type="text"
                                            {...register('routing_number')}
                                            minLength={3}
                                            maxLength={20}
                                            className="w-full border border-slate-200 bg-slate-50/30 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all placeholder:text-slate-400"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SAVE BUTTON */}
                            <button
                                type="submit"
                                disabled={!isDirty || isSubmitting}
                                className="w-full bg-slate-900 text-white hover:bg-teal-600 disabled:bg-slate-700 px-5 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm transition-all duration-300 active:scale-[0.99] cursor-pointer mt-2"
                            >
                                {isSubmitting ? 'Processing Audit Securely...' : 'Save Bank Account'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT SIDEBAR PANEL: METRICS & SECURITY INSIGHT DETAILS */}
                <div className="space-y-6">

                    {/* ACCOUNT STATUS CARD */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm group hover:border-teal-100 transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    Active Payout Account
                                </p>
                                <h2 className="text-base font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
                                    {bankAccount?._id ? `${bankAccount?.bank_name} (•••• ${bankAccount?.account_number_last4})` : 'No Saved Account'}
                                </h2>
                                <p className="text-[10px] text-slate-400 font-semibold">
                                    Last synchronized: {bankAccount?.updated_at ? new Date(bankAccount?.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                                </p>
                            </div>

                            {bankAccount?.is_verified ? (
                                <div className="px-2.5 py-1 rounded-md bg-teal-50 border border-teal-100 text-teal-700 flex items-center gap-1 shrink-0">
                                    <FaCheckCircle className="text-[9px]" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Verified</span>
                                </div>
                            ) : (
                                <div className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-100 text-amber-700 flex items-center gap-1 shrink-0">
                                    <FaClock className="text-[9px]" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Unverified</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* VERIFICATION STATUS INSIGHT BLOCK */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                                    Verification Status
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1">
                                    Withdrawals can only be processed securely to matching verified bank credentials.
                                </p>
                            </div>
                        </div>

                        {/* Status timeline tracker mockup */}
                        <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-400">Current Status:</span>
                            <span className={`px-2 py-0.5 rounded uppercase tracking-wider text-[10px] ${bankAccount?.is_verified ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
                                {bankAccount?.is_verified ? 'Active Settlement Live' : 'Pending Verification'}
                            </span>
                        </div>
                    </div>

                    {/* SECURITY NOTICE METRIC BOX */}
                    <div className="bg-gradient-to-br from-teal-50/50 to-teal-50/20 border border-teal-100/50 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center gap-2 text-teal-900">
                            <FaShieldAlt className="text-xs shrink-0" />
                            <h4 className="text-xs font-black uppercase tracking-wider">
                                Security Notice
                            </h4>
                        </div>
                        <p className="text-[11px] text-teal-800/90 font-medium leading-relaxed">
                            For your account protection, altering active settlement route parameters may temporarily delay live payout verification protocols until compliance checks conclude.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default BankAccount;