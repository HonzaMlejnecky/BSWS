import React, { useState } from "react";
import { Link } from "react-router-dom";
import useWebmail from "../hooks/useWebmail";
import { WebmailSidebar, EmailDetail } from "../components/Webmail/WebmailComponents";
import ComposeModal from "../components/Webmail/ComposeModal";

export default function WebmailPage() {
    const { folder, selectedEmail, filteredEmails, sendEmail, selectEmail, changeFolder } = useWebmail();
    const [showCompose, setShowCompose] = useState(false);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link title="Back" to="/dashboard/emails" className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">←</Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Webmail</h1>
                        <p className="text-sm text-gray-500 font-medium">admin@hostpanel.dev</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowCompose(true)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-all"
                >
                    + Compose
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row overflow-hidden" style={{ minHeight: "600px" }}>
                
                <WebmailSidebar activeFolder={folder} onFolderChange={changeFolder} />

                <div className="flex-1 flex flex-col min-w-0">
                    {selectedEmail ? (
                        <EmailDetail email={selectedEmail} onBack={() => selectEmail(null)} />
                    ) : (
                        <div className="flex-1 overflow-auto">
                            {filteredEmails.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-40">
                                    <span className="text-4xl mb-2">☁️</span>
                                    <p className="text-sm font-medium">This folder is empty</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {filteredEmails.map((email) => (
                                        <button
                                            key={email.id}
                                            onClick={() => selectEmail(email)}
                                            className="w-full text-left px-6 py-4 hover:bg-blue-50/30 transition-colors flex items-center justify-between group"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {!email.read && folder === 'inbox' && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                                                    <span className={`text-sm truncate ${!email.read ? "font-bold text-gray-900" : "text-gray-600"}`}>
                                                        {folder === "inbox" ? email.from : email.to}
                                                    </span>
                                                </div>
                                                <p className={`text-sm truncate ${!email.read ? "font-semibold text-gray-800" : "text-gray-500"}`}>
                                                    {email.subject}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium ml-4">{email.date}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ComposeModal open={showCompose} onClose={() => setShowCompose(false)} onSend={sendEmail} />
        </div>
    );
}