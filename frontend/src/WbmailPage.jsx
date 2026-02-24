import { useState } from "react"
import { Link } from "react-router-dom"

function ComposeModal({ open, onClose, onSend }) {
    const [to, setTo] = useState("")
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")

    if (!open) return null

    function handleSend() {
        if (!to || !subject) return

        const newEmail = {
            id: Date.now(),
            from: "admin@hostpanel.dev",
            to,
            subject,
            body,
            date: new Date().toLocaleDateString(),
            folder: "sent",
            read: true,
        }

        onSend(newEmail)

        setTo("")
        setSubject("")
        setBody("")
        onClose()
    }

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold mb-4">New Message</h3>

                <div className="flex flex-col gap-4">
                    <input
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="recipient@example.com"
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                    <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Write your message..."
                        rows={6}
                        className="w-full px-4 py-3 border rounded-xl resize-none"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-xl"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

function EmailDetail({ email, onBack }) {
    return (
        <div className="flex-1 flex flex-col">
            <div className="p-4 border-b flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="text-sm text-blue-600"
                >
                    ← Back
                </button>
                <h3 className="text-lg font-semibold truncate">
                    {email.subject}
                </h3>
            </div>

            <div className="p-6 flex-1 overflow-auto">
                <div className="mb-4">
                    <p className="text-sm font-medium">{email.from}</p>
                    <p className="text-xs text-gray-500">
                        To: {email.to} · {email.date}
                    </p>
                </div>

                <div className="text-sm whitespace-pre-wrap">
                    {email.body}
                </div>
            </div>
        </div>
    )
}

export default function WebmailPage() {

    // 🔥 DEFAULT MOCK EMAILS
    const [emails, setEmails] = useState([
        {
            id: 1,
            from: "support@hostpanel.dev",
            to: "admin@hostpanel.dev",
            subject: "Welcome to HostPanel",
            body: "Your mail server has been successfully created.",
            date: "2025-01-10",
            folder: "inbox",
            read: false,
        },
        {
            id: 2,
            from: "admin@hostpanel.dev",
            to: "client@example.com",
            subject: "Invoice January",
            body: "Please find attached invoice.",
            date: "2025-01-08",
            folder: "sent",
            read: true,
        },
    ])

    const [folder, setFolder] = useState("inbox")
    const [selectedEmail, setSelectedEmail] = useState(null)
    const [showCompose, setShowCompose] = useState(false)

    const filteredEmails = emails.filter((e) => e.folder === folder)

    function handleSendEmail(email) {
        setEmails((prev) => [...prev, email])
    }

    return (
        <div className="max-w-7xl mx-auto p-6">

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        to="/dashboard/email"
                        className="text-blue-600 text-sm"
                    >
                        ← Back
                    </Link>

                    <div>
                        <h1 className="text-2xl font-bold">Webmail</h1>
                        <p className="text-sm text-gray-500">
                            admin@hostpanel.dev
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowCompose(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                >
                    Compose
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md flex flex-col lg:flex-row" style={{ minHeight: "500px" }}>

                {/* Sidebar */}
                <div className="w-full lg:w-56 border-b lg:border-b-0 lg:border-r">
                    <div className="p-3 flex lg:flex-col gap-1">

                        <button
                            onClick={() => { setFolder("inbox"); setSelectedEmail(null) }}
                            className={`px-3 py-2 rounded-xl text-sm text-left ${
                                folder === "inbox" ? "bg-blue-100 text-blue-600" : ""
                            }`}
                        >
                            Inbox
                        </button>

                        <button
                            onClick={() => { setFolder("sent"); setSelectedEmail(null) }}
                            className={`px-3 py-2 rounded-xl text-sm text-left ${
                                folder === "sent" ? "bg-blue-100 text-blue-600" : ""
                            }`}
                        >
                            Sent
                        </button>

                    </div>
                </div>

                {/* Content */}
                {selectedEmail ? (
                    <EmailDetail
                        email={selectedEmail}
                        onBack={() => setSelectedEmail(null)}
                    />
                ) : (
                    <div className="flex-1">

                        {filteredEmails.length === 0 ? (
                            <div className="flex items-center justify-center h-full py-16">
                                <p className="text-sm text-gray-500">
                                    No emails in this folder
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {filteredEmails.map((email) => (
                                    <button
                                        key={email.id}
                                        onClick={() => setSelectedEmail(email)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {folder === "inbox" ? email.from : email.to}
                      </span>
                                            <span className="text-xs text-gray-500">
                        {email.date}
                      </span>
                                        </div>
                                        <p className="text-sm truncate">
                                            {email.subject}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>
                )}
            </div>

            <ComposeModal
                open={showCompose}
                onClose={() => setShowCompose(false)}
                onSend={handleSendEmail}
            />
        </div>
    )
}