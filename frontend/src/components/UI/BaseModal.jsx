import React from "react";

export default function BaseModal({ open, onClose, title, subtitle, children }) {

    if (!open) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()} 
            >

                <div className="mb-4">
                    <h2 className="font-bold text-xl text-gray-800">{title}</h2>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>

                <div className="mt-2">
                    {children}
                </div>
            </div>
        </div>
    );
}