'use client'
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import useUserData from '../../../hooks/useUserData';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Image from 'next/image';
// import { TruckElectricIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
// import usePersistanceHandler from '../../../hooks/useUnsavedChangesWarning';
import useUnsavedChangesHandler from '../../../hooks/useUnsavedChangesWarning';

const Profile = () => {

    const user = useUserData()
    console.log(user)

    const { refetch, ...rest } = user || {}

    const { email, name, profile_image, address, emergency_contact } = rest


    const { postal_code, street_address, city } = address || {}
    const { full_name, phone_number } = emergency_contact || {}
    // console.log(emergency_contact_number)

    const { register, handleSubmit, reset, formState: { isDirty } } = useForm()

    const { status } = useSession()

    const [uploadedUrl, setProfileUrl] = useState(null)

    const hasHydrated = useRef(false)

    useEffect(() => {
        if (status !== 'authenticated' || hasHydrated.current) return
        // localStorage.removeItem('initialData')
        const timeout = setTimeout(() => {
            reset({ postal_code, street_address, city, full_name, phone_number, ...rest })
            hasHydrated.current = true
            // localStorage.removeItem('initialData')
        }, 300)
        return () => clearTimeout(timeout)

    }, [status, reset, postal_code, street_address, city, full_name, phone_number, rest])

    const pathname = usePathname()

    const hasUnsavedChanges = isDirty || uploadedUrl

    useUnsavedChangesHandler({ hasUnsavedChanges, pathname })

    const [fileName, setFileName] = useState("document.jpg")

    // ================================
    // 🔹 FILE UPLOAD HANDLER (IMPORTANT)
    // ================================
    const fileInputRef = useRef(null)
    const hasUploaded = useRef(false)

    useEffect(() => {

        if (status === 'unauthenticated') return;
        async function prePopulate() {
            if (!fileInputRef.current) return
            try {
                const response = await fetch(uploadedUrl)
                const blob = await response.blob()
                const file = new File([blob], fileName || "document.jpg", {
                    type: blob.type
                })
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                fileInputRef.current.files = dataTransfer.files
            } catch (err) {
                console.error("File restore failed", err)
            }
        }
        prePopulate()
    }, [uploadedUrl, status, fileName])

    const handleFileUpload = async e => {
        const file = e.target.files?.[0]
        if (!file) return
        setFileName(file.name) // ✅ store filename
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
        )
        const data = await res.json()
        if (res.ok && data.secure_url) {
            setProfileUrl(data.secure_url)
            hasUploaded.current = true
            if (status === 'unauthenticated') return;
        }
    }


    const updateProfile = async data => {
        const { name, phone, full_name, phone_number, date_of_birth, gender, postal_code, street_address, city, bio, medical_notes, is_verified } = data

        const updatedProfile = {
            name,
            profile_image: uploadedUrl || profile_image,
            phone,
            emergency_contact: { full_name, phone_number },
            date_of_birth,
            gender,
            address: { postal_code, street_address, city },
            bio,
            medical_notes,
            is_verified,
            updated_at: new Date()
        }

        const res = await fetch('/api/me', {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProfile),
            method: 'PATCH'
        })

        const result = await res.json()

        if (result?.success) {
            Swal.fire({
                title: 'Updated!',
                text: 'Your profile has been updated.',
                icon: 'success'
            })

            // if (fileInputRef.current) {
            // fileInputRef.current.value = ''
            // }

            refetch()
            setProfileUrl(null)
        }
        else {
            Swal.fire({
                title: 'No Changes Made',
                text: 'Update your profile information before saving.',
                icon: 'info'
            })
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Profile Header Card */}
                <section className="bg-white shadow-[0_20px_50px_rgba(13,148,136,0.05)] rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none" aria-hidden="true"></div>

                    {/* Profile Image & Upload Section */}
                    <section className="relative z-10 flex flex-col items-center flex-shrink-0">
                        <figure className="relative group">
                            {/* Avatar Container */}
                            <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-[5px] border-white bg-gradient-to-br from-teal-50 to-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.12)] transition-all duration-500 group-hover:scale-[1.03]">
                                {(uploadedUrl || profile_image) ? (
                                    <Image
                                        src={uploadedUrl || profile_image}
                                        alt={`${name || 'User'
                                            } 's profile picture`}
                                        fill
                                        priority
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                                        <span className="text-3xl sm:text-4xl font-black tracking-tight text-teal-600 uppercase select-none">
                                            {name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "CN"}
                                        </span>
                                    </div>
                                )}

                                {/* Glassmorphism Hover Overlay */}
                                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-[2px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    </svg>
                                    <figcaption className="text-[10px] font-black tracking-widest text-white uppercase">Change Photo</figcaption>
                                </div>
                            </div >

                            {/* Accessible File Input */}
                            < input
                                type="file"
                                ref={fileInputRef}
                                required={!uploadedUrl}
                                onChange={handleFileUpload}
                                accept="image/*"
                                aria-label="Upload Profile Picture"
                                className="absolute inset-0 z-20 cursor-pointer opacity-0" />

                            {/* Floating Interaction Badge */}
                            < div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-white border border-slate-100 shadow-xl rounded-full p-2.5 sm:p-3 transition-all duration-300 group-hover:scale-110 pointer-events-none" >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                </svg>
                            </div >
                        </figure >

                        {/* Dynamic Success Notification */}
                        {uploadedUrl && (
                            <div role="status" className="mt-6 w-full max-w-[280px] sm:max-w-sm animate-in fade-in slide-in-from-bottom duration-500">
                                <div className="flex flex-col gap-4 rounded-[2rem] border border-emerald-100 bg-emerald-50/80 p-4 shadow-sm backdrop-blur-sm">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-2xl border-2 border-white shadow-md flex-shrink-0">
                                            <Image src={uploadedUrl} alt="Preview" fill className="object-cover" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shadow-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                                <p className="text-xs font-black text-emerald-900 uppercase tracking-wide">Success</p>
                                            </div>
                                            <p className="text-[11px] sm:text-xs leading-tight text-emerald-800/80 font-semibold">
                                                Image synced with Care Nest cloud.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Professional Interactive Clear Action Element */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                            setProfileUrl(null)
                                            // Clear your uploadedUrl file state hook or react-hook-form entry here
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white border border-rose-100 hover:bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-[0.96] cursor-pointer shadow-sm hover:shadow-rose-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Remove Photo</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </section >

                    {/* Profile Identity Details */}
                    < section className="text-center md:text-left z-10 md:pt-4" >
                        <span className="inline-flex items-center px-4 py-1.5 mb-4 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase bg-teal-50 border border-teal-100/50 rounded-full">
                            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                            Care Nest Member
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2 leading-tight">
                            {name || "User Name"}
                        </h1>
                        <p className="text-slate-500 font-bold text-sm sm:text-base tracking-wide italic opacity-80">{email}</p>
                    </section >
                </section >

                {/* Main Profile Form */}
                < form className="bg-white shadow-[0_20px_50px_rgba(13,148,136,0.05)] rounded-[2.5rem] border border-slate-100 p-8 md:p-14 space-y-10" onSubmit={handleSubmit(updateProfile)} >

                    {/* SECTION: BASIC INFO */}
                    < div className="space-y-6" >
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Basic Information</h2>
                            <div className="h-px bg-slate-100 flex-grow"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 ml-1">Full Name <span className="text-teal-600">*</span></label>
                                <input
                                    {...register('name', { required: true })}
                                    // defaultValue={name}
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 ml-1">Email Address (Primary)</label>
                                <input
                                    {...register('email', { required: true })}
                                    // defaultValue={email}
                                    type="email"
                                    readOnly
                                    className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-400 font-medium outline-none cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 ml-1">Contact Number</label>
                                <input
                                    {...register('phone_number', { required: true })}
                                    type="tel"
                                    inputMode="tel"
                                    pattern="[0-9+ ]*"
                                    // defaultValue={contact}
                                    placeholder="+880 1XXX-XXXXXX"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 ml-1">Date of Birth</label>
                                <input
                                    {...register('date_of_birth')}
                                    type="date"
                                    // defaultValue={date_of_birth}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-700 ml-1">Gender Identification</label>
                                <select {...register('gender')} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium appearance-none">
                                    <option value="">Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Non-binary</option>
                                    <option>Prefer not to say</option>
                                </select>
                            </div>
                        </div>
                    </div >

                    {/* SECTION: ADDRESS */}
                    < div className="space-y-6" >
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Residency Details</h2>
                            <div className="h-px bg-slate-100 flex-grow"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input {...register('street_address', { required: true })} type="text" placeholder="Street Address" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium md:col-span-2" />
                            <input {...register('city', { required: true })} type="text" placeholder="City" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium" />
                            <input {...register('postal_code', { required: true })} type="text" placeholder="Postal Code" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium" />
                        </div>
                    </div >

                    {/* SECTION: BIO */}
                    < div className="space-y-2" >
                        <label className="text-xs font-bold text-slate-700 ml-1">About / Care Bio</label>
                        <textarea
                            {...register('bio')}
                            rows={4}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all duration-300 font-medium resize-none"
                            placeholder="Write a brief description of your care needs or professional experience..."
                        />
                    </div >

                    {/* SECTION: CARE INFO (Bento Style) */}
                    <div className="bg-teal-50/40 border border-teal-100/70 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] space-y-6 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(13,148,136,0.02)]">
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-teal-600/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 tracking-wider uppercase text-xs sm:text-sm">Care Preferences</h3>
                                <p className="text-[11px] font-semibold text-teal-700/70 uppercase tracking-wider mt-0.5 sm:hidden">Specialized Details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                            {/* Note: If adding 'Primary Care Needs' or 'Availability' back in the future, change grid-cols-1 to md:grid-cols-2 */}
                            <div className="space-y-2">
                                <label htmlFor="medical_notes" className="text-xs font-bold text-slate-700 ml-1 block">
                                    Medical Conditions or Specific Notes
                                </label>
                                <textarea
                                    id="medical_notes"
                                    {...register('medical_notes')}
                                    rows={3}
                                    placeholder="Please share any specific medical conditions, allergies, or personal care preferences..."
                                    className="w-full bg-white border border-teal-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-300 font-medium resize-none shadow-sm placeholder:text-slate-400 text-slate-800 text-sm sm:text-base"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION: EMERGENCY CONTACT (Visual Alert Style) */}
                    < div className="bg-rose-50/30 border border-rose-100 p-8 rounded-[2.5rem] space-y-6" >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="font-black text-slate-900 tracking-tight uppercase text-sm">Safety & Emergency Contact</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input {...register('full_name')} type="text" placeholder="Trusted Person's Name" className="w-full bg-white border border-rose-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all font-medium" />
                            <input {...register('phone_number')} type="tel" inputMode="tel" pattern="[0-9+ ]*" placeholder="Contact's Phone Number" className="w-full bg-white border border-rose-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all font-medium" />
                        </div>
                    </div >

                    {/* SECTION: NOTIFICATIONS */}
                    < div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 border border-slate-100 p-6 rounded-2xl gap-4 hover:bg-white transition-colors duration-300" >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div>
                                <span className="font-black text-slate-900 block text-sm">Instant Notifications</span>
                                <span className="text-xs text-slate-400 font-medium">Receive real-time care alerts and messages</span>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input {...register('is_verified', { required: true })} type="checkbox" className="sr-only peer" />
                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                    </div >

                    {/* ACTION: SAVE */}
                    < div className="pt-6" >
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-teal-700 active:scale-[0.99] transition-all duration-300 shadow-xl shadow-teal-600/20 flex items-center justify-center gap-3 cursor-pointer group"
                        >
                            Save Changes
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div >
                </form >
            </div >
        </div >
    );
};

export default Profile;