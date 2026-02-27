'use client'
import { HeartHandshake, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import NavLink from './navbar/NavLink';


const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"> {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group transition-all"> <div className="bg-teal-50 p-1.5 rounded-lg group-hover:bg-teal-100 transition-colors"> <HeartHandshake className="text-teal-600" size={28} /> </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight"> Care<span className="text-teal-600">Nest</span>
                    </h1>
                </Link> {/* Desktop Menu */}
                <ul className="hidden lg:flex items-center gap-8">
                    {/* {navLinks.map((link) => (<li key={link.href}> <Link href={link.href} className={`${getLinkStyle(link.href)} transition-colors duration-200 text-sm`} > {link.name} </Link> */}
                    {/* </li>))} */}
                </ul> {/* Auth & CTA */} <div className="hidden md:flex items-center gap-6">
                    <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-teal-600 transition-colors" > Login </Link>
                    <Link href="/book" className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 hover:-translate-y-0.5 active:scale-95 transition-all shadow-lg shadow-teal-600/20 text-sm" > Book Care </Link>
                </div> {/* Mobile icon */}
                <div className="lg:hidden cursor-pointer text-slate-700" onClick={() => setIsOpen(!isOpen)}> {isOpen ? <X size={26} /> : <Menu size={26} />} </div>
            </div> {/* Mobile Menu */} {isOpen && (<div className="lg:hidden bg-white border-t border-slate-100 px-6 py-8 absolute w-full left-0 animate-in slide-in-from-top duration-300">
                <ul className="flex flex-col gap-6">
                    {/* {navLinks.map((link) => (<li key={link.href}> */}
                    {/* <Link href={link.href} onClick={() => setIsOpen(false)} className={`text-lg ${getLinkStyle(link.href)}`} > {link.name} </Link> </li>))} */}
                </ul>
                <div className="flex flex-col gap-4 mt-8 border-t border-slate-50 pt-8">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-3 text-slate-700 font-bold text-lg" > Login </Link>
                    <Link href="/book" onClick={() => setIsOpen(false)} className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-center shadow-xl shadow-teal-600/20" > Book Care Now </Link>
                </div>
            </div>)}
        </nav>
    );
};

export default Navbar;