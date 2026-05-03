'use client'
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const ApplyCaregiver = () => {

  const { data: existingApplication = {}, refetch } = useQuery({
    queryKey: ['existingApplication'],
    queryFn: async () => {
      const res = await fetch('/api/caregivers/apply')
      return res.json()
    }
  })

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/me')
      return res.json()
    }
  })

  console.log(user)

  const { exists, application_status } = existingApplication

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    watch,
    reset
  } = useForm()

  const { status } = useSession()
  // console.log({ ...rest, status, data })

  useEffect(() => {
    if (status === 'unauthenticated') return

    reset({
      name: user?.name,
      email: user?.email,
      phone: user?.contact
    })
  }, [reset, status, user?.name, user?.email, user?.contact])

  const router = useRouter()

  // ✅ Prevent unnecessary API calls

  // ================================
  // 🔹 FORM DATA PERSISTENCE (TEXT ONLY)
  // ================================
  const applicationData = watch()
  const { name, email, phone, ...rest } = applicationData

  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated || status === 'unauthenticated') return;

    const timeout = setTimeout(() => {
      localStorage.setItem(
        'applicationData',
        JSON.stringify(rest)
      );
    }, 300)
    return () => clearTimeout(timeout)

  }, [isHydrated, status, rest])

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('applicationData')

    if (saved) {
      const parsedData = JSON.parse(saved)
      reset(parsedData)
    }

    setIsHydrated(true)
  }, [reset])

  // ================================
  // 🔹 FILE (IMAGE) STATE
  // ================================
  const [uploadedUrl, setUploadedUrl] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedUrl = localStorage.getItem("uploadedDocument")

    if (savedUrl) {
      // const parsedUrl = JSON.parse(savedUrl)
      setUploadedUrl(savedUrl)
      // reset({ documentUrl: parsedUrl })
    }
  }, [reset, status])

  useEffect(() => {
    // if (status === 'unauthenticated') return;
    // const savedUrl = localStorage.getItem("uploadedDocument")
    const savedName = localStorage.getItem("uploadedDocumentName")

    // if (savedUrl) setUploadedUrl(savedUrl)
    if (savedName) setFileName(savedName)
  }, [status])

  // ================================
  // 🔹 FILE UPLOAD HANDLER (IMPORTANT)
  // ================================

  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState("document.jpg")

  useEffect(() => {
    if (status === 'unauthenticated') return;

    async function prePopulate() {
      if (!uploadedUrl || !fileInputRef.current) return

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
  }, [uploadedUrl, fileName, status])

  const currentPath = usePathname()

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
      setUploadedUrl(data.secure_url)

      if (status === 'unauthenticated') return;

      localStorage.setItem("uploadedDocument", data.secure_url)
      localStorage.setItem("uploadedDocumentType", file.type)
      localStorage.setItem("uploadedDocumentName", file.name) // ✅ NEW
    }
  }

  // Logic for dynamic status colors
  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100'; // Pending
    }
  };

  // ================================
  // 🔹 SUBMIT HANDLER
  // ================================
  const submitApplication = async (formData) => {

    if (!uploadedUrl) {
      alert("Please upload a document")
      return
    }

    const { name, email, phone, experience, specialization, description, agreedToTerms } = formData

    const application = {
      userId: user?._id,
      name: name,
      email: email,
      phone: phone,
      experience: experience,
      specialization: specialization,
      description: description,
      documentUrl: uploadedUrl,
      documentType: localStorage.getItem("uploadedDocumentType"),
      status: "pending",
      agreedToTerms: Boolean(agreedToTerms),
      createdAt: new Date(),
    }

    console.log(application)

    const res = await fetch('/api/caregivers/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application),
    })

    const result = await res.json()

    if (result?.success) {

      Swal.fire({
        title: 'Done!',
        text: 'Your application has been sent',
        icon: 'success'
      })

      // localStorage.removeItem('applicationData')
      localStorage.removeItem('uploadedDocument')
      localStorage.removeItem('uploadedDocumentType')
      localStorage.removeItem('uploadedDocumentName')

      reset({
        name: '',
        email: '',
        phone: '',
        experience: '',
        specialization: '',
        description: '',
        agreedToTerms: false
      })

      setUploadedUrl(null)
      setFileName("")

      // 🔥 Clear file input manually (VERY IMPORTANT)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      refetch()
      // ✅ optional UX improvement
      // router.push('/dashboard/my-applications')
    }
  }

  if (exists) {
    return (
      <section className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl bg-white shadow-2xl shadow-teal-900/5 rounded-[3rem] p-10 md:p-16 border border-slate-100 text-center relative overflow-hidden transition-all duration-500">
          {/* Ambient background glows for 2026 aesthetic */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50 rounded-full -mr-24 -mt-24 blur-3xl opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-50 rounded-full -ml-16 -mb-16 blur-2xl opacity-40"></div>
          {/* Success/Status Icon with Refined Floating Animation */}
          <div className="relative mx-auto w-24 h-24 bg-teal-50 rounded-[2rem] flex items-center justify-center mb-10 transition-transform hover:scale-105 duration-300">
            <span className="text-4xl filter drop-shadow-sm">📄</span>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-50">
              <div className="w-4 h-4 bg-teal-500 rounded-full animate-pulse shadow-sm shadow-teal-500/50"></div>
            </div>
          </div>
          {/* Content Section */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4">
              Application Received
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-10 font-medium max-w-sm mx-auto">
              You have already submitted an application to join the **Care Nest** team.
              Our professionals are currently reviewing your documents.
            </p>
            {/* Dynamic Status Badge - Glassmorphism Style */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-slate-50 font-black text-[10px] uppercase tracking-[0.2em] mb-12 shadow-inner bg-slate-50/50">
              <span className="text-slate-400">Current Status</span>
              <span className={`px-4 py-1.5 rounded-xl border-2 font-black transition-all ${getStatusStyles(application_status)}`}>
                {application_status || 'In Review'}
              </span>
            </div>
            {/* Action Section */}
            <div className="space-y-6">
              <button
                onClick={() => router.push('/dashboard/my-application')}
                className="group w-full bg-teal-600 text-white font-black py-5 rounded-2xl hover:bg-teal-700 active:scale-[0.97] transition-all shadow-xl shadow-teal-600/20 flex items-center justify-center gap-3 uppercase text-xs tracking-widest cursor-pointer"
              >
                <span>View Application Profile</span>
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em]">
                  Need Priority Support?
                </p>
                <a
                  href="mailto:support@carenest.com"
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors underline underline-offset-4"
                >
                  support@carenest.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-slate-50 py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl shadow-teal-900/5 rounded-[2.5rem] p-8 md:p-14 border border-gray-100 overflow-hidden relative">
        {/* Ambient Background Glow for 2026 Aesthetics */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        {/* Header Section */}
        <div className="relative text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-[0.15em] rounded-full mb-4 border border-teal-100">
            Join Our Team
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
            Become a Caregiver
          </h1>
          <p className="text-slate-500 mt-4 text-sm md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
            Empower lives with Care Nest. Join a community of trusted, compassionate professionals.
          </p>
        </div>
        {/* Authentication Guard Notice */}
        <div className={`relative mb-10 p-6 rounded-[2rem] border-2 transition-all duration-500 transform ${status === 'authenticated'
          ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
          : 'bg-amber-50/50 border-amber-100 text-amber-900'
          }`}>
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-2xl border border-inherit">
              {status === 'authenticated' ? '✅' : '🔒'}
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-sm mb-1 uppercase tracking-wider">
                {status === 'authenticated' ? 'Verified Session' : 'Access Restricted'}
              </h4>
              <p className="text-xs md:text-sm leading-relaxed font-medium opacity-80">
                {status === 'authenticated'
                  ? "You are signed in. Your profile data has been pre-filled for a faster application."
                  : "Please secure your account before submitting professional credentials."
                }
              </p>
              {status !== 'authenticated' && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => router.push(`/login?callbackUrl=${currentPath}`)}
                    className="text-xs font-black px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 active:scale-95 cursor-pointer"
                  >
                    Sign In Now
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/registration?callbackUrl=${currentPath}`)}
                    className="text-xs font-black px-6 py-2.5 border-2 border-amber-600 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all active:scale-95 cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Application Form */}
        <form className="space-y-10 relative" onSubmit={handleSubmit(submitApplication)}>
          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@carenest.com' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+880 1XXX-XXXXXX' },
              { label: 'Years of Experience', name: 'experience', type: 'number', placeholder: 'e.g. 5' }
            ].map((field) => (
              <div key={field.name} className="space-y-2.5">
                <label className="text-xs font-black text-slate-700 ml-1 uppercase tracking-widest">
                  {field.label}
                </label>
                <input
                  {...register(field.name, { required: true })}
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={
                    field.name === 'name' ? (user?.name && Boolean(watch('name'))) :
                      field.name === 'email' ? (user?.email && Boolean(watch('email'))) :
                        field.name === 'phone' ? (user?.contact && Boolean(watch('phone'))) : false
                  }
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 focus:bg-white outline-none transition-all font-medium text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            ))}
          </div>
          {/* Specialization */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-slate-700 ml-1 uppercase tracking-widest">Specialization</label>
            <div className="relative">
              <select
                {...register('specialization', { required: true })}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer font-medium text-slate-800"
              >
                <option value="">Select your area of expertise</option>
                <option>Baby Care</option>
                <option>Senior Care</option>
                <option>Memory Care</option>
                <option>Patient Care</option>
                <option>Recovery Care</option>
                <option>Disability Care</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>
          {/* Description */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-slate-700 ml-1 uppercase tracking-widest">Professional Background</label>
            <textarea
              {...register('description', { required: true })}
              rows={5}
              placeholder="Detailed overview of your clinical or home-care experience..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 focus:bg-white outline-none transition-all resize-none font-medium text-slate-800"
            ></textarea>
          </div>
          {/* File Upload Section */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-slate-700 ml-1 uppercase tracking-widest">Verification Documents</label>
            <div className="relative group border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer">
              <input
                type="file"
                ref={fileInputRef}
                required={!uploadedUrl}
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
                  ☁️
                </div>
                <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-400">PDF, JPG or PNG (Max 5MB)</p>
              </div>
            </div>
            {/* Uploaded Feedback with Next.js Image */}
            {uploadedUrl && (
              <div className="mt-6 flex items-center gap-6 p-4 bg-emerald-50 rounded-3xl border border-emerald-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                  <Image
                    src={uploadedUrl}
                    alt="Verification Document"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-800">Document Verified</p>
                  <p className="text-xs text-emerald-600 font-medium">Successfully uploaded and ready for review.</p>
                </div>
              </div>
            )}
          </div>
          {/* Terms */}
          <label className="flex items-start gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition-colors">
            <input
              {...register('agreedToTerms', { required: true })}
              type="checkbox"
              className="w-6 h-6 accent-teal-600 rounded-lg cursor-pointer mt-0.5 border-none shadow-inner"
            />
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
              I certify that all provided documents and experience details are authentic. I agree to Care Nest&apos;s background check and
              verification protocol.
            </p>
          </label>
          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={status !== 'authenticated' || isSubmitting}
              className={`w-full text-white font-black py-5 rounded-[1.5rem] transition-all shadow-2xl flex items-center justify-center gap-3 transform active:scale-[0.98] tracking-widest uppercase text-sm
      ${status === 'authenticated'
                  ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/30 cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed shadow-none'
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reviewing...
                </span>
              ) : 'Submit Professional Application'}
            </button>
            <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
              <div className="h-[1px] w-12 bg-slate-300"></div>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">
                Care Nest Excellence 2026
              </p>
              <div className="h-[1px] w-12 bg-slate-300"></div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ApplyCaregiver;