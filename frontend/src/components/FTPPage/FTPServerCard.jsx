import React, { useState } from "react";

function AccountRow({ account, onChangePassword, onDelete }) {
    return (
        <div className="flex justify-between items-center bg-white border border-gray-100 shadow-sm rounded-lg px-4 py-3">
            <span className="text-sm font-medium">{account.username}</span>
            <div className="flex gap-3">
                <button onClick={onChangePassword} className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors">Password</button>
                <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">Delete</button>
            </div>
        </div>
    );
}

export default function FTPServerCard({ server, onDeleteServer, onAddAccount, onDeleteAccount, onChangePassword }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-xl">{server.domain}</h3>
                    <p className="text-sm text-gray-500 mt-1">Root: {server.rootDir}</p>
                </div>
                {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)} className="text-red-500 text-sm font-medium hover:underline">Delete Server</button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={() => onDeleteServer(server.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs">Confirm</button>
                        <button onClick={() => setConfirmDelete(false)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs">Cancel</button>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">{server.accounts.length} FTP Accounts</span>
                    <button onClick={() => onAddAccount(server)} className="text-blue-600 text-sm font-medium hover:text-blue-800">+ Add Account</button>
                </div>

                <div className="flex flex-col gap-2">
                    {server.accounts.map(acc => (
                        <AccountRow 
                            key={acc.id} 
                            account={acc} 
                            onChangePassword={() => onChangePassword(acc, server.id)}
                            onDelete={() => onDeleteAccount(server.id, acc.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}