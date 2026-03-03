import React, { useState } from "react";
import BaseModal from "../UI/BaseModal";
import ModalInput from "../UI/ModalInput";

export function FTPCreateModal({ open, onClose, onCreate }) {
    const [domain, setDomain] = useState("");
    const [rootDir, setRootDir] = useState("/var/www/");

    function handleCreate() {
        if (!domain) return;
        onCreate({ id: Date.now().toString(), domain, rootDir, accounts: [] });
        setDomain("");
        setRootDir("/var/www/");
        onClose();
    }

    return (
        <BaseModal open={open} onClose={onClose} title="Create FTP Server">
            <div className="flex flex-col gap-3 mb-4">
                <ModalInput value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
                <ModalInput value={rootDir} onChange={(e) => setRootDir(e.target.value)} placeholder="/var/www/" />
            </div>
            <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Create</button>
            </div>
        </BaseModal>
    );
}

export function FTPAccountModal({ server, open, onClose, onAdd }) {
    const [username, setUsername] = useState("");

    function handleAdd() {
        if (!username) return;
        onAdd({ id: Date.now().toString(), username, password: "123456" });
        setUsername("");
        onClose();
    }

    return (
        <BaseModal open={open} onClose={onClose} title={`Add account to ${server?.domain}`}>
            <ModalInput value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ftpuser" />
            <div className="flex justify-end gap-3 mt-4">
                <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Add</button>
            </div>
        </BaseModal>
    );
}

export function FTPChangePasswordModal({ account, open, onClose, onChange }) {
    const [newPassword, setNewPassword] = useState("");

    function handleChange() {
        if (!newPassword) return;
        onChange(newPassword);
        setNewPassword("");
        onClose();
    }

    return (
        <BaseModal open={open} onClose={onClose} title="Change password" subtitle={`For user: ${account?.username}`}>
            <ModalInput type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
            <div className="flex justify-end gap-3 mt-4">
                <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={handleChange} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Change</button>
            </div>
        </BaseModal>
    );
}