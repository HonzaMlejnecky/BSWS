import React from "react";

export default function ModalInput({ value, onChange, placeholder, type = "text" }) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-3 
                       outline-none transition-all
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 
                       placeholder:text-gray-400 text-sm"
        />
    );
}