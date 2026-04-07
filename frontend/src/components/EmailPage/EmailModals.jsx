import React, { useState } from "react";

function BaseModal({ open, title, subtitle, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <h2 className="font-bold text-lg mb-1">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
                {!subtitle && <div className="mb-4" />} 
                
                {children}
            </div>
        </div>
    );
}

function ModalInput({ value, onChange, placeholder, type = "text" }) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
}


export function EmailCreateModal({ open, onClose, onCreate }) {
    const [domain, setDomain] = useState("");

    function handleCreate() {
        if (!domain) return;

        if (!domain.includes(".") || domain.includes(" ")) {
            alert("Enter a valid domain, e.g. example.com");
            return;
        }

        onCreate({ domain });
        setDomain("");
        onClose();
    }

    return (
        <BaseModal open={open} onClose={onClose} title="Create Email Server">
            <div className="flex flex-col gap-3 mb-4">
                <ModalInput 
                    value={domain} 
                    onChange={(e) => setDomain(e.target.value)} 
                    placeholder="example.com (Domain)" 
                />
            </div>
            
            <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">Create</button>
            </div>
        </BaseModal>
    );
}

export function EmailMailboxModal({ server, open, onClose, onAdd }) {
    const [mailboxName, setMailboxName] = useState("");
    const [password, setPassword] = useState("");

    function handleAdd() {
        if (!mailboxName || !password || !server?.domain) return;

        onAdd({
            address: `${mailboxName}@${server.domain}`,
            password,
        });
        setMailboxName("");
        setPassword("");
        onClose();
    }


    const title = server ? `Add mailbox to ${server.domain}` : "Add mailbox";

    return (
        <BaseModal open={open} onClose={onClose} title={title}>
            <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center">
                    <input
                        value={mailboxName}
                        onChange={(e) => setMailboxName(e.target.value)}
                        placeholder="user"
                        className="flex-1 border border-r-0 rounded-l-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 z-10"
                    />
                    <span className="bg-gray-100 border border-l-0 rounded-r-lg px-3 py-2 text-gray-500">
                        @{server?.domain}
                    </span>
                </div>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">Add</button>
            </div>
        </BaseModal>
    );
}

export function EmailChangePasswordModal({ mailbox, open, onClose, onChange }) {
    const [newPassword, setNewPassword] = useState("");

    function handleChange() {
        if (!newPassword) return;
        onChange(newPassword);
        setNewPassword("");
        onClose();
    }

    return (
        <BaseModal 
            open={open} 
            onClose={onClose} 
            title="Change password" 
            subtitle={`For: ${mailbox?.address}`}
        >
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full border rounded-lg px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleChange} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">Change</button>
            </div>
        </BaseModal>
    );
}
