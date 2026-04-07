import React, { useState } from "react";

function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-600">{label}</span>
            <span className="font-mono text-xs">{value}</span>
        </div>
    );
}

function InlineConfirmAction({ onConfirm, onCancel }) {
    return (
        <div className="flex gap-2">
            <button onClick={onConfirm} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition-colors">
                Confirm
            </button>
            <button onClick={onCancel} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300 transition-colors">
                Cancel
            </button>
        </div>
    );
}

function MailboxRow({ mailbox, onChangePassword, onDelete }) {
    return (
        <div className="flex justify-between items-center bg-white border border-gray-100 shadow-sm rounded-lg px-4 py-3">
            <span className="text-sm font-medium">{mailbox.address}</span>
            <div className="flex gap-3">
                <button onClick={onChangePassword} className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors">
                    Password
                </button>
                <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
                    Delete
                </button>
            </div>
        </div>
    );
}


export default function EmailServerCard({ server, onDeleteServer, onAddMailbox, onDeleteMailbox, onChangePassword }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const smtpHost = server.smtpHost || `mail.${server.domain}`;
    const imapHost = server.imapHost || `mail.${server.domain}`;

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-xl">{server.domain}</h3>
                    <p className="text-sm text-gray-500 mt-1">{server.mailboxes.length} mailboxes active</p>
                </div>
                <div>
                    {!confirmDelete ? (
                        <button onClick={() => setConfirmDelete(true)} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                            Delete Server
                        </button>
                    ) : (
                        <InlineConfirmAction 
                            onConfirm={() => onDeleteServer(server.id)} 
                            onCancel={() => setConfirmDelete(false)} 
                        />
                    )}
                </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5 text-sm flex flex-col gap-2">
                <DetailRow label="SMTP Host" value={smtpHost} />
                <DetailRow label="IMAP Host" value={imapHost} />
            </div>

            <div>
                <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">Mailboxes</span>
                    <button onClick={() => onAddMailbox(server)} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                        + Add Mailbox
                    </button>
                </div>

                {server.mailboxes.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-2 italic">No mailboxes created yet.</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {server.mailboxes.map(mb => (
                            <MailboxRow 
                                key={mb.id} 
                                mailbox={mb}
                                onChangePassword={() => onChangePassword(mb, server.id)}
                                onDelete={() => onDeleteMailbox(server.id, mb.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
