'use client'

import React from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800/80 relative overflow-hidden select-none">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-12 lg:gap-0 justify-start lg:justify-between pb-16 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Core Value Proposition (4 cols on Desktop) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl">
              <div className="bg-teal-500 p-2.5 rounded-xl group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 shadow-lg shadow-teal-500/20">
                <HeartHandshake className="text-white w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Care<span className="text-teal-500">Nest</span>
              </h2>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Providing compassionate, background-verified, and professional caregiving services. 
              Delivering safety and trusted peace of mind directly to homes.
            </p>

            {/* Platform Highlights */}
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400">
                <ShieldCheck size={16} className="text-teal-400" />
                <span>100% Verified Caregivers</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400">
                <Clock size={16} className="text-teal-400" />
                <span>24/7 Dedicated Family Support</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-3 pt-2">
              <SocialIcon href="https://x.com/AbdulA48036" icon={<FaTwitter size={16} />} label="Twitter / X" />
              <SocialIcon href="https://www.linkedin.com/in/abdul-rehman-aarmaan/" icon={<FaLinkedin size={16} />} label="LinkedIn" />
            </div>
          </div>

          {/* Column 2: Quick Links - Platform (2 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-widest text-slate-200">
              Platform
            </h3>
            <ul className="space-y-3.5 text-sm font-medium">
              <li>
                <Link href="/services" className="hover:text-teal-400 transition-colors duration-200">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/caregivers" className="hover:text-teal-400 transition-colors duration-200">
                  Find Caregivers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors duration-200">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/become-a-caregiver" className="hover:text-teal-400 transition-colors duration-200">
                  Join as Caregiver
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info & Support (3 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-widest text-slate-200">
              Get in Touch
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3 text-slate-400 group">
                <MapPin size={18} className="text-teal-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>Chattogram, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone size={18} className="text-teal-500 shrink-0 group-hover:scale-110 transition-transform" />
                <a href="tel:+8801725348534" className="text-slate-400 hover:text-teal-400 transition-colors">
                  +880 1725 348534
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={18} className="text-teal-500 shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:abdulrehmanaarmaan@gmail.com" className="text-slate-400 hover:text-teal-400 transition-colors">
                  support@carenest.com
                </a>
              </li>
            </ul>

            {/* Direct Contact Page Link */}
            <div className="mt-6 pt-4 border-t border-slate-800/60">
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors group"
              >
                <span>Visit Help Center / Contact Us</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Column 4: Lightweight Newsletter Subscription (3 cols) */}
          {/* <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-widest text-slate-200">
              Stay Informed
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Subscribe to get caregiving tips and regular service updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl text-xs transition-all duration-200 active:scale-[0.98] shadow-md shadow-teal-900/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Subscribe</span>
              </button>
            </form>
          </div> */}

        </div>

        {/* Bottom Bar / Copyright & Legal */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} CareNest. All rights reserved.</p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="hover:text-teal-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-teal-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-teal-400 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Reusable Helper Component for Social Links
const SocialIcon = ({ icon, href, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    aria-label={label}
    className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700/60 text-slate-400 hover:bg-teal-600 hover:border-teal-600 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-xs"
  >
    {icon}
  </a>
);

export default Footer;