import React, { useState } from "react"

function FTPCreateModal({ open, onClose, onCreate }) {
    const [domain, setDomain] = useState("")
    const [rootDir, setRootDir] = useState("/var/www/")

    if (!open) return null

    function handleCreate() {
        if (!domain) return
        onCreate({ id: Date.now().toString(), domain, rootDir, accounts: [] })
        setDomain("")
        setRootDir("/var/www/")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="font-bold text-lg mb-4">Create FTP Server</h2>

                <input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    className="w-full border rounded-lg px-3 py-2 mb-3"
                />
                <input
                    value={rootDir}
                    onChange={(e) => setRootDir(e.target.value)}
                    placeholder="/var/www/"
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-xl">
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

function FTPAccountModal({ server, open, onClose, onAdd }) {
    const [username, setUsername] = useState("")

    if (!open) return null

    function handleAdd() {
        if (!username) return
        onAdd({ id: Date.now().toString(), username, password: "123456" })
        setUsername("")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="font-bold mb-4">Add account to {server.domain}</h2>

                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ftpuser"
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-xl">
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}

function FTPChangePasswordModal({ account, serverId, open, onClose, onChange }) {
    const [newPassword, setNewPassword] = useState("")

    if (!open) return null

    function handleChange() {
        if (!newPassword) return
        onChange(newPassword)
        setNewPassword("")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="font-bold mb-4">Change password for {account.username}</h2>

                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-xl">
                        Cancel
                    </button>
                    <button
                        onClick={handleChange}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                    >
                        Change
                    </button>
                </div>
            </div>
        </div>
    )
}

function FTPServerCard({ server, onDeleteServer, onAddAccount, onDeleteAccount, onChangePassword }) {
    const [confirmDelete, setConfirmDelete] = useState(false)

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between mb-4">
                <div>
                    <h3 className="font-bold text-lg">{server.domain}</h3>
                    <p className="text-sm text-gray-500">{server.accounts.length} accounts</p>
                    <p className="text-sm text-gray-400">Root: {server.rootDir}</p>
                </div>
                <div>
                    {!confirmDelete ? (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="text-red-500 text-sm"
                        >
                            Delete
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => onDeleteServer(server.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="px-3 py-1 bg-gray-200 rounded-lg text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <div className="flex justify-between mb-2">
                    <span className="font-medium">FTP Accounts</span>
                    <button onClick={() => onAddAccount(server)} className="text-blue-600 text-sm">
                        + Add
                    </button>
                </div>

                {server.accounts.map(acc => (
                    <div key={acc.id} className="flex justify-between bg-gray-100 rounded-lg px-3 py-2 mb-2">
                        <span className="text-sm">{acc.username}</span>
                        <div className="flex gap-2">
                            <button onClick={() => onChangePassword(acc, server.id)} className="text-xs text-gray-600">
                                Password
                            </button>
                            <button onClick={() => onDeleteAccount(server.id, acc.id)} className="text-xs text-red-500">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function FTPPage() {
    const [ftpServers, setFtpServers] = useState([
        {
            id: "1",
            domain: "example.com",
            rootDir: "/var/www/example",
            accounts: [
                { id: "a1", username: "ftpuser", password: "123456" },
                { id: "a2", username: "backup", password: "123456" }
            ]
        }
    ])

    const [showCreate, setShowCreate] = useState(false)
    const [selectedServer, setSelectedServer] = useState(null)
    const [passwordTarget, setPasswordTarget] = useState(null)

    function createServer(newServer) {
        setFtpServers(prev => [...prev, newServer])
    }

    function deleteServer(id) {
        setFtpServers(prev => prev.filter(s => s.id !== id))
    }

    function addAccount(server, account) {
        setFtpServers(prev =>
            prev.map(s =>
                s.id === server.id ? { ...s, accounts: [...s.accounts, account] } : s
            )
        )
    }

    function deleteAccount(serverId, accountId) {
        setFtpServers(prev =>
            prev.map(s =>
                s.id === serverId
                    ? { ...s, accounts: s.accounts.filter(a => a.id !== accountId) }
                    : s
            )
        )
    }

    function changePassword(account, serverId, newPassword) {
        setFtpServers(prev =>
            prev.map(s =>
                s.id === serverId
                    ? {
                        ...s,
                        accounts: s.accounts.map(a =>
                            a.id === account.id ? { ...a, password: newPassword } : a
                        )
                    }
                    : s
            )
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">FTP Servers</h1>
                    <p className="text-gray-500">Manage your FTP access credentials</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl">
                    New FTP Server
                </button>
            </div>

            {ftpServers.length === 0 && (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <h3 className="text-lg font-semibold">No FTP servers yet</h3>
                    <button onClick={() => setShowCreate(true)} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl">
                        Create FTP Server
                    </button>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {ftpServers.map(server => (
                    <FTPServerCard
                        key={server.id}
                        server={server}
                        onDeleteServer={deleteServer}
                        onAddAccount={(s) => setSelectedServer(s)}
                        onDeleteAccount={deleteAccount}
                        onChangePassword={(acc, sid) => setPasswordTarget({ acc, sid })}
                    />
                ))}
            </div>

            <FTPCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={createServer} />

            {selectedServer && (
                <FTPAccountModal
                    open={!!selectedServer}
                    server={selectedServer}
                    onClose={() => setSelectedServer(null)}
                    onAdd={(acc) => {
                        addAccount(selectedServer, acc)
                        setSelectedServer(null)
                    }}
                />
            )}

            {passwordTarget && (
                <FTPChangePasswordModal
                    open={!!passwordTarget}
                    account={passwordTarget.acc}
                    serverId={passwordTarget.sid}
                    onClose={() => setPasswordTarget(null)}
                    onChange={(newPass) => {
                        changePassword(passwordTarget.acc, passwordTarget.sid, newPass)
                        setPasswordTarget(null)
                    }}
                />
            )}
        </div>
    )
}