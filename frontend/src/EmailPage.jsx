import React, { useState } from "react"

function EmailCreateModal({ open, onClose, onCreate }) {
    const [domain, setDomain] = useState("")
    const [smtpHost, setSmtpHost] = useState("")
    const [imapHost, setImapHost] = useState("")

    if (!open) return null

    function handleCreate() {
        if (!domain) return
        onCreate({
            id: Date.now().toString(),
            domain,
            smtpHost: smtpHost || `smtp.${domain}`,
            imapHost: imapHost || `imap.${domain}`,
            mailboxes: [],
        })
        setDomain("")
        setSmtpHost("")
        setImapHost("")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="font-bold text-lg mb-4">Create Email Server</h2>

                <input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    className="w-full border rounded-lg px-3 py-2 mb-3"
                />
                <input
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.example.com"
                    className="w-full border rounded-lg px-3 py-2 mb-3"
                />
                <input
                    value={imapHost}
                    onChange={(e) => setImapHost(e.target.value)}
                    placeholder="imap.example.com"
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-xl">Cancel</button>
                    <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Create</button>
                </div>
            </div>
        </div>
    )
}

function EmailMailboxModal({ server, open, onClose, onAdd }) {
    const [mailboxName, setMailboxName] = useState("")

    if (!open) return null

    function handleAdd() {
        if (!mailboxName) return
        onAdd({
            id: Date.now().toString(),
            address: `${mailboxName}@${server.domain}`,
            password: "123456"
        })
        setMailboxName("")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="font-bold mb-4">Add mailbox to {server.domain}</h2>

                <input
                    value={mailboxName}
                    onChange={(e) => setMailboxName(e.target.value)}
                    placeholder="user"
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-xl">Cancel</button>
                    <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Add</button>
                </div>
            </div>
        </div>
    )
}

function EmailChangePasswordModal({ mailbox, serverId, open, onClose, onChange }) {
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
                <h2 className="font-bold mb-4">Change password for {mailbox.address}</h2>

                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-xl">Cancel</button>
                    <button onClick={handleChange} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Change</button>
                </div>
            </div>
        </div>
    )
}

function EmailServerCard({ server, onDeleteServer, onAddMailbox, onDeleteMailbox, onChangePassword }) {
    const [confirmDelete, setConfirmDelete] = useState(false)

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between mb-4">
                <div>
                    <h3 className="font-bold text-lg">{server.domain}</h3>
                    <p className="text-sm text-gray-500">{server.mailboxes.length} mailboxes</p>
                </div>
                <div>
                    {!confirmDelete ? (
                        <button onClick={() => setConfirmDelete(true)} className="text-red-500 text-sm">Delete</button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => onDeleteServer(server.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs">Confirm</button>
                            <button onClick={() => setConfirmDelete(false)} className="px-3 py-1 bg-gray-200 rounded-lg text-xs">Cancel</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-4 mb-4 text-sm">
                <div>SMTP: {server.smtpHost}</div>
                <div>IMAP: {server.imapHost}</div>
            </div>

            <div>
                <div className="flex justify-between mb-2">
                    <span className="font-medium">Mailboxes</span>
                    <button onClick={() => onAddMailbox(server)} className="text-blue-600 text-sm">+ Add</button>
                </div>

                {server.mailboxes.map(mb => (
                    <div key={mb.id} className="flex justify-between bg-gray-100 rounded-lg px-3 py-2 mb-2">
                        <span className="text-sm">{mb.address}</span>
                        <div className="flex gap-2">
                            <button onClick={() => onChangePassword(mb, server.id)} className="text-xs text-gray-600">Password</button>
                            <button onClick={() => onDeleteMailbox(server.id, mb.id)} className="text-xs text-red-500">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function EmailPage() {
    const [emailServers, setEmailServers] = useState([
        {
            id: "1",
            domain: "example.com",
            smtpHost: "smtp.example.com",
            imapHost: "imap.example.com",
            mailboxes: [
                { id: "m1", address: "admin@example.com", password: "123456" },
                { id: "m2", address: "info@example.com", password: "123456" }
            ]
        }
    ])

    const [showCreate, setShowCreate] = useState(false)
    const [selectedServer, setSelectedServer] = useState(null)
    const [passwordTarget, setPasswordTarget] = useState(null)

    function createServer(newServer) {
        setEmailServers(prev => [...prev, newServer])
    }

    function deleteServer(id) {
        setEmailServers(prev => prev.filter(s => s.id !== id))
    }

    function addMailbox(server, mailbox) {
        setEmailServers(prev =>
            prev.map(s =>
                s.id === server.id ? { ...s, mailboxes: [...s.mailboxes, mailbox] } : s
            )
        )
    }

    function deleteMailbox(serverId, mailboxId) {
        setEmailServers(prev =>
            prev.map(s =>
                s.id === serverId ? { ...s, mailboxes: s.mailboxes.filter(m => m.id !== mailboxId) } : s
            )
        )
    }

    function changePassword(mailbox, serverId, newPassword) {
        setEmailServers(prev =>
            prev.map(s =>
                s.id === serverId
                    ? { ...s, mailboxes: s.mailboxes.map(m => m.id === mailbox.id ? { ...m, password: newPassword } : m) }
                    : s
            )
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-8">

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Email Servers</h1>
                    <p className="text-gray-500">Manage your email infrastructure</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl">
                    New Server
                </button>
            </div>

            {emailServers.length === 0 && (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <h3 className="text-lg font-semibold">No email servers yet</h3>
                    <button onClick={() => setShowCreate(true)} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl">
                        Create Server
                    </button>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {emailServers.map(server => (
                    <EmailServerCard
                        key={server.id}
                        server={server}
                        onDeleteServer={deleteServer}
                        onAddMailbox={setSelectedServer}
                        onDeleteMailbox={deleteMailbox}
                        onChangePassword={(mb, sid) => setPasswordTarget({ mb, sid })}
                    />
                ))}
            </div>

            <EmailCreateModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                onCreate={createServer}
            />

            {selectedServer && (
                <EmailMailboxModal
                    open={!!selectedServer}
                    server={selectedServer}
                    onClose={() => setSelectedServer(null)}
                    onAdd={(mb) => {
                        addMailbox(selectedServer, mb)
                        setSelectedServer(null)
                    }}
                />
            )}

            {passwordTarget && (
                <EmailChangePasswordModal
                    open={!!passwordTarget}
                    mailbox={passwordTarget.mb}
                    serverId={passwordTarget.sid}
                    onClose={() => setPasswordTarget(null)}
                    onChange={(newPass) => {
                        changePassword(passwordTarget.mb, passwordTarget.sid, newPass)
                        setPasswordTarget(null)
                    }}
                />
            )}

        </div>
    )
}