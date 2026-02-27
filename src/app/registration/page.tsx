import React from 'react';

const Registration = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="bg-white shadow-2xl shadow-teal-900/5 rounded-3xl p-8 md:p-12 w-full max-w-xl border border-gray-100">
                {/* Header Section */} <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-teal-600 tracking-tight"> Join Care Nest </h2>
                    <p className="text-gray-500 mt-2 text-sm"> Fill in your details to create a secure account and start your journey. </p>
                </div>
                <form className="space-y-5"> {/* 2-Column Grid for larger screens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                            <input type="text" name="name" placeholder="John Doe" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all duration-200" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">NID Number</label>
                            <input type="text" name="nid" placeholder="1234567890" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all duration-200" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
                            <input type="email" name="email" placeholder="name@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all duration-200" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Contact Number</label>
                            <input type="text" name="contact" placeholder="+880 1XXX-XXXXXX" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all duration-200" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Create Password</label>
                        <input type="password" name="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all duration-200" required />
                    </div> {/* Action Button */}
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 active:transform active:scale-[0.98] transition-all duration-200 shadow-lg shadow-teal-600/20 cursor-pointer" > Create Account</button>
                    </div>
                </form> {/* Footer Section */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600"> Already have an account?{' '}
                        <a href="/login" className="font-bold text-teal-600 hover:text-teal-700 underline-offset-4 hover:underline transition"> Sign In </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;