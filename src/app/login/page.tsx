import Link from 'next/link';
import React from 'react';

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="bg-white shadow-2xl shadow-teal-900/5 rounded-3xl p-8 md:p-12 w-full max-w-md border border-gray-100"> {/* Header Section */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-teal-600 tracking-tight"> Welcome Back </h2>
                    <p className="text-gray-500 mt-2 text-sm"> Please enter your details to access your Care Nest account </p>
                </div>
                <form className="space-y-5"> {/* Email Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1"> Email Address </label>
                        <input type="email" name="email" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all duration-200 placeholder:text-gray-400" placeholder="name@example.com" required />
                    </div> {/* Password Input */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5 ml-1">
                            <label className="block text-sm font-semibold text-gray-700"> Password </label> <Link href="#" className="text-xs font-medium text-teal-600 hover:text-teal-700 transition"> Forgot password? </Link>
                        </div>
                        <input type="password" name="password" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all duration-200 placeholder:text-gray-400" placeholder="••••••••" required />
                    </div> {/* Submit Button */}
                    <button type="submit" className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 active:transform active:scale-[0.98] transition-all duration-200 shadow-lg shadow-teal-600/20 mt-2 cursor-pointer" > Sign In </button>
                </form> {/* Footer Section */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600"> Don't have an account?{' '}<Link href="/registration" className="font-bold text-teal-600 hover:text-teal-700 underline-offset-4 hover:underline transition"> Join the Nest </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;