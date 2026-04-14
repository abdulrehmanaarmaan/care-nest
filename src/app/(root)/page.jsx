'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FaQuoteLeft, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function Home() {

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const result = await fetch('/api/services')
      return result.json()
    }
  })

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const result = await fetch('/api/reviews')
      return result.json()
    }
  })

  console.log(services)
  // if (reviewsLoading || servicesLoading) {
  // return <Loader />
  // }

  return (
    <div className="w-full font-sans antialiased text-slate-900 bg-white">
      {/* ================= HERO SECTION ================= */}
      <header className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-12 lg:gap-16">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-bold mb-8 shadow-sm">
              <FaCheckCircle className="text-teal-500" />
              <span>Verified Professionals Only</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] text-slate-900 mb-6 tracking-tight">
              Compassionate Care <br />
              <span className="text-teal-600">For Your Loved Ones</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Care Nest connects families with trusted caregivers for babies, seniors, and recovery — ensuring safety and peace of mind.
            </p>
            <div className="flex flex-wrap gap-5">
              <button className="bg-teal-600 text-white font-bold px-10 py-4 rounded-2xl shadow-lg shadow-teal-600/30 hover:bg-teal-700 hover:-translate-y-1 transition-all duration-300">
                Explore Services
              </button>
              <button className="bg-white text-slate-700 border border-slate-200 font-bold px-10 py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
                Meet Caregivers
              </button>
            </div>
          </div>
          <div className="relative">
            {/* Decorative Blobs */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse delay-700"></div>
            <div className="relative rounded-[3rem] p-4 bg-white shadow-2xl border border-slate-100 transform hover:rotate-1 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80"
                alt="Caregiving"
                className="rounded-[2.5rem] object-cover aspect-4/3 w-full"
              />
            </div>
          </div>
        </div>
      </header>
      <main>
        {/* ================= ABOUT SECTION ================= */}
        <section className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h4 className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-4">Our Mission</h4>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-8">Building a Trusted Care Ecosystem</h2>
            <p className="text-slate-600 text-lg lg:text-xl leading-relaxed mb-10">
              At Care Nest, we believe caregiving is more than a service—it’s a commitment. We verify every professional so you can focus on
              emotional support.
            </p>
            <div className="h-1.5 w-24 bg-teal-600 mx-auto rounded-full"></div>
          </div>
        </section>
        {/* ================= SERVICES SECTION ================= */}
        <section className="py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900">Comprehensive Services</h2>
              <p className="text-slate-500 mt-4 text-lg">Professional support for every stage of life</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {servicesLoading ? (
                <>
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                </>
              ) : (
                services.map(service => (
                  <div key={service?._id} className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-teal-100 hover:-translate-y-2 transition-all duration-500">
                    <img
                      src={service?.image_url}
                      className="w-20 h-20 bg-teal-50 rounded-2xl p-4 mb-8 group-hover:bg-teal-600 group-hover:invert transition-all"
                      alt={service?.service_name}
                    />
                    <h3 className="text-2xl font-bold mb-4 text-slate-900">{service?.service_name}</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3">{service?.description}</p>
                    <Link href={`/service/${service?._id}`} className="text-teal-600 font-bold inline-flex items-center gap-2">
                      Learn More <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
        {/* ================= TESTIMONIALS ================= */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto bg-slate-900 text-white rounded-[3.5rem] px-8 lg:px-16 py-20 shadow-2xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Trusted by Thousands</h2>
              <p className="text-slate-400">Join the growing Care Nest family today.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 mb-24">
              {reviewsLoading ? (
                <>
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                </>)
                : (
                  reviews.map(review => (
                    <div key={review?._id} className="bg-slate-800/30 p-10 rounded-[2.5rem] border border-slate-700/50 flex flex-col justify-between">
                      <div>
                        <FaQuoteLeft className="text-teal-500 text-2xl mb-6 opacity-40" />
                        <p className="text-slate-200 italic mb-8 leading-relaxed">"{review?.review_text}"</p>
                      </div>
                      <div className="flex items-center gap-4 pt-6 border-t border-slate-700/50">
                        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center font-bold text-white shadow-inner">
                          {review?.name?.[0] || 'U'}
                        </div>
                        <div>
                          <h4 className="font-bold text-white leading-none mb-1">{review?.name || "Client Review"}</h4>
                          <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">
                            {review?.verified ? '✓ Verified User' : review?.designation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-t border-slate-800">
              <StatItem num="500+" label="Families Served" />
              <StatItem num="300+" label="Caregivers" />
              <StatItem num="98%" label="Satisfaction" />
              <StatItem num="24/7" label="Support" />
            </div>
          </div>
        </section>
      </main>
    </div >
  )
}

const StatItem = ({ num, label }) => (
  <div className="text-center group">
    <h3 className="text-3xl lg:text-4xl font-black text-teal-500 mb-2 transition-transform group-hover:scale-110">{num}</h3>
    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{label}</p>
  </div>
);