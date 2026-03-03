export function WebmailSidebar({ activeFolder, onFolderChange }) {
    const folders = [
        { id: "inbox", label: "Inbox", icon: "📥" },
        { id: "sent", label: "Sent", icon: "📤" }
    ];

    return (
        <div className="w-full lg:w-56 border-r border-gray-100 p-3 flex lg:flex-col gap-1">
            {folders.map(f => (
                <button
                    key={f.id}
                    onClick={() => onFolderChange(f.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm text-left transition-all ${
                        activeFolder === f.id ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <span className="mr-2">{f.icon}</span> {f.label}
                </button>
            ))}
        </div>
    );
}

export function EmailDetail({ email, onBack }) {
    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">←</button>
                <h3 className="text-lg font-bold truncate">{email.subject}</h3>
            </div>
            <div className="p-8 overflow-auto">
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-50">
                    <div>
                        <p className="font-bold text-gray-900">{email.from}</p>
                        <p className="text-sm text-gray-500">To: {email.to}</p>
                    </div>
                    <span className="text-xs text-gray-400">{email.date}</span>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{email.body}</div>
            </div>
        </div>
    );
}