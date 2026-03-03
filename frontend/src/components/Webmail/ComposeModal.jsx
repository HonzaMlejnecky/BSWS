import React, { useState } from "react";
import BaseModal from "../UI/BaseModal";
import ModalInput from "../UI/ModalInput";

export default function ComposeModal({ open, onClose, onSend }) {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    function handleSend() {
        if (!to || !subject) return;
        onSend({
            id: Date.now(),
            from: "admin@hostpanel.dev",
            to, subject, body,
            date: new Date().toISOString().split('T')[0],
            folder: "sent",
            read: true,
        });
        setTo(""); setSubject(""); setBody("");
        onClose();
    }

    return (
        <BaseModal open={open} onClose={onClose} title="New Message">
            <div className="flex flex-col gap-1">
                <ModalInput value={to} onChange={(e) => setTo(e.target.value)} placeholder="Recipient (e.g. hello@world.com)" />
                <ModalInput value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your message here..."
                    rows={8}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm resize-none"
                />
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-gray-500 font-medium">Cancel</button>
                    <button onClick={handleSend} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        Send Message
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}