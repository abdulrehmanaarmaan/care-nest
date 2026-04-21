'use client'
import React, { useEffect, useState } from 'react';
import useServiceInfo from '../../../../hooks/useServiceInfo';
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import Loader from '../../loading';
import useCrudState from '../../../../hooks/useCrudState';

const Booking = () => {

    const { id } = useParams()

    const { service, isLoading: loading } = useServiceInfo(id)

    const { data: warehouses = [], isLoading } = useQuery({
        queryKey: ['warehouses'],
        queryFn: async () => {
            const result = await fetch('/api/warehouses')
            return result.json()
        }
    })

    const [region, setRegion] = useState('')

    const { register, watch, handleSubmit, setValue, reset } = useForm()

    const watchedQuantity = watch('quantity', 1)

    const { data } = useSession()

    console.log(data)

    const router = useRouter()

    const [isDisabled, disable] = useState(false)

    const { isClicked, click } = useCrudState()

    const { name, email } = data?.user || {}

    const [existingBookingId, setExistingBookingId] = useState("")

    const { data: existingBooking } = useQuery({
        queryKey: ['existingBooking', existingBookingId, email, name, id],
        queryFn: async () => {
            if (!existingBookingId || !email || !name || !service_name) return null;
            const result = await fetch(`/api/bookings/${existingBookingId}?email=${email}&name=${name}&service_id=${id}`)
            return result.json()
        },
        enabled: !!existingBookingId && !!email && !!name && !!id
    })

    console.log(existingBooking)

    useEffect(() => {
        // const urlBookingId = new URLSearchParams(window.location.search).get('bookingId');
        const savedBookingId = localStorage.getItem('pendingBookingId');

        const finalId = savedBookingId;

        if (finalId) {
            setExistingBookingId(finalId);
        }
    }, []);

    const [isHydrated, setIsHydrated] = useState(false)

    const formData = watch()

    useEffect(() => {
        if (!isHydrated) return;
        const timeout = setTimeout(() => {
            localStorage.setItem(
                'formData',
                JSON.stringify({
                    ...formData,
                    region,
                    service_id: id   // 🔥 REQUIRED
                })
            );
        }, 300)
        return () => clearTimeout(timeout)
    }, [formData, isHydrated, region, id])

    useEffect(() => {
        if (!id) return;
        if (existingBooking) {
            // ✅ Load from database (highest priority)
            reset({
                quantity: existingBooking?.pricing?.quantity,
                district: existingBooking?.location?.district,
                detailed_address: existingBooking?.location?.detailed_address
            });
            setRegion(existingBooking?.location?.division);
        } else {
            // ✅ Load from localStorage ONLY if same service
            const saved = localStorage.getItem('formData');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed?.service_id === id) {
                    reset(parsed);
                    setRegion(parsed?.region);
                } else {
                    localStorage.removeItem('formData'); // clean old service data
                }
            }
        }
        setIsHydrated(true);

    }, [existingBooking, reset, id])

    if (loading || isLoading) {
        return <Loader></Loader>
    }

    const { service_name, price, unit, duration_label } = service || {}

    const totalCost = price * watchedQuantity

    const regions = new Set(warehouses.map(warehouse => warehouse?.region))
    const uniqueRegions: any = [...regions]

    const selectedWarehouses = warehouses.filter(warehouse => warehouse?.region === region)

    const selectedDistricts = selectedWarehouses.map(warehouse => warehouse?.district)

    const bookService = async data => {
        click(true)
        try {
            const { district, detailed_address } = data

            const booking = {
                service_id: id,
                service_name,
                customer: {
                    name,
                    email
                },
                pricing: {
                    base_price: price,
                    quantity: Number(watchedQuantity),
                    unit: unit,
                    total_amount: totalCost,
                },
                location: {
                    division: region,
                    district: district,
                    detailed_address: detailed_address
                },
                status: 'Pending',
                payment_status: 'Unpaid',
                booked_at: new Date()
            }

            if (!region || !selectedDistricts.includes(district)) {
                Swal.fire({
                    title: 'Warning!',
                    text: 'Select your division and district',
                    icon: "info"
                })
                    .then(() => {
                        click(false)
                    })
            }

            else {
                let result;

                if (existingBookingId) {

                    const response = await fetch(`/api/bookings/${existingBookingId}`, {
                        headers: { 'Content-Type': 'application/json' },
                        method: 'PATCH',
                        body: JSON.stringify(booking)
                    })

                    result = await response.json()
                }

                else {
                    const response = await fetch('/api/bookings', {
                        headers: { 'Content-Type': 'application/json' },
                        method: 'POST',
                        body: JSON.stringify(booking)
                    })

                    result = await response.json()

                    if (result?.success) {
                        localStorage.setItem('pendingBookingId', result?.bookingId)
                    }
                }

                const res = await fetch("/api/create-checkout-session", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        serviceName: service_name,
                        amount: totalCost,
                        bookingId: existingBookingId || result?.bookingId,
                        serviceId: id
                    }),
                });
                const paymentResponse = await res.json();
                window.location.href = paymentResponse.url;
                click(false)
            }
        }
        catch {
            Swal.fire({
                title: 'Failed!',
                text: 'Failed to book',
                icon: "error"
            })
                .then(() => {
                    click(false)
                })
        }
    }

    return (
        <form onSubmit={handleSubmit(bookService)} className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Navigation & Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold text-sm mb-4 transition-colors cursor-pointer group">
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Details
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Complete Your <span className="text-teal-600">Booking</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            Service: <span className="text-slate-900 font-bold">{service_name}</span>
                        </p>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm hidden md:block">
                        <span className="text-xs text-slate-400 block uppercase tracking-[0.2em] font-bold mb-1">Estimated Total</span>
                        <span className="text-3xl font-black text-teal-600">${totalCost}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Step 1: Duration Logic */}
                        <section className="bg-white shadow-sm border border-slate-200 rounded-[2rem] p-8 hover:border-teal-100 transition-colors">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-10 h-10 bg-teal-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-teal-600/20">1</span>
                                <h3 className="text-xl font-bold text-slate-800">Booking Duration</h3>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-700 ml-1">
                                    How many <span className="text-teal-600">{unit}</span> do you need?
                                </label>
                                <div className="relative">
                                    <input
                                        value={watchedQuantity}
                                        {...register('quantity', { required: true })}
                                        type="number"
                                        min="1"
                                        className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-lg font-bold text-slate-800"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm uppercase tracking-wider">
                                        {watchedQuantity > 1 ? unit : unit.replace(/s$/, '')}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-4 bg-teal-50/50 rounded-xl border border-teal-100/50">
                                    <FaCalendarAlt className="text-teal-600" />
                                    <p className="text-xs text-teal-800 font-semibold italic">
                                        Standard Rate: ${price} per {duration_label}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Step 2: Location */}
                        <section className="bg-white shadow-sm border border-slate-200 rounded-[2rem] p-8 hover:border-teal-100 transition-colors">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-10 h-10 bg-teal-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-teal-600/20">2</span>
                                <h3 className="text-xl font-bold text-slate-800">Service Location</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 ml-1">Division</label>
                                    <select required value={region || 'Select Division'} onChange={(e) => {
                                        setRegion(e.target.value)
                                        setValue('district', 'Select District')
                                    }} className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none bg-white font-medium text-slate-700 appearance-none cursor-pointer">
                                        <option disabled>Select Division</option>
                                        {uniqueRegions.map((region, i) => (<option key={i}>{region}</option>))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 ml-1">District</label>
                                    <select onClick={() => disable(true)}
                                        {...register('district', { required: true })} value={watch('district') || ''} className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none bg-white font-medium text-slate-700 appearance-none cursor-pointer">
                                        <option disabled={Boolean(isDisabled)}>{region ? 'Select District' : 'Select Division First'}</option>
                                        {selectedDistricts.map((district, i) => (<option key={i}>{district}</option>))}
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 ml-1">Detailed Address / Area</label>
                                    <textarea
                                        {...register('detailed_address', { required: true })}
                                        rows={3}
                                        placeholder="House no, Street name, Landmark..."
                                        className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium text-slate-700 resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sticky Summary Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white shadow-2xl shadow-slate-900/10 border border-slate-100 rounded-[2.5rem] p-8 sticky top-8">
                            <h3 className="text-2xl font-black text-slate-900 mb-6">Order Summary</h3>
                            <div className="space-y-4 pb-8 border-b border-slate-100">
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Base Rate</span>
                                    <span className="text-slate-900 font-bold">${price}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Selected {unit}</span>
                                    <span className="text-slate-900 font-bold">x {watchedQuantity}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-medium pt-2">
                                    <span>Service Fee</span>
                                    <span className="text-teal-600 font-bold tracking-tight">INCLUDED</span>
                                </div>
                            </div>

                            <div className="py-6">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-black text-slate-900 text-lg uppercase tracking-tight">Total Amount</span>
                                    <span className="text-3xl font-black text-teal-600">${totalCost}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                    Price for {watchedQuantity} {watchedQuantity > 1 ? unit : unit.replace(/s$/, '')} of {service_name}
                                </p>
                            </div>

                            <button
                                disabled={isClicked}
                                type='submit'
                                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${isClicked
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98] shadow-xl shadow-teal-600/20 cursor-pointer group'}`}
                            >
                                {isClicked ? (
                                    <>
                                        <span className="w-5 h-5 border-3 border-slate-300 border-t-slate-500 rounded-full animate-spin"></span>
                                        <span>Securing your spot...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{existingBooking ? 'Pay Now' : 'Confirm Booking'}</span>
                                        <FaArrowRight className="group-hover:translate-x-1.5 transition-transform duration-300" />
                                    </>
                                )}
                            </button>

                            <div className="mt-8 flex items-start gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <FaShieldAlt className="text-teal-600 mt-1 flex-shrink-0" />
                                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                                    CARE NEST PROTECTION: Your payment is held in escrow until you confirm the service was completed satisfactorily.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div >
        </form >
    );
};

export default Booking;