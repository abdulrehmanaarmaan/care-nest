import React from 'react';

const CaregiverBanner = ({ message, buttonText, onClick }) => {
    return (
        <div className="mb-6 bg-white border border-amber-100 rounded-3xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="font-black text-slate-800">
                        Profile Action Required
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {message}
                    </p>
                </div>
                <button
                    onClick={onClick}
                    className=" bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-2xl font-bold transition-all cursor-pointer w-full md:w-auto"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default CaregiverBanner;