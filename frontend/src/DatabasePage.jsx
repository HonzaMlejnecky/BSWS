import { useState } from "react"

function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"
    return Array.from({ length: 12 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join("")
}

function CreateDatabaseModal({ open, onClose, onCreate }) {
    const [name, setName] = useState("")
    const [type, setType] = useState("PostgreSQL")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState(generatePassword())
    const [size, setSize] = useState("1 GB")

    if (!open) return null

    function handleCreate() {
        if (!name || !username) return

        const newDb = {
            id: Date.now(),
            name,
            type,
            username,
            password,
            size,
            host: "localhost",
            port: type === "PostgreSQL" ? "5432" : "3306",
        }

        onCreate(newDb)

        setName("")
        setUsername("")
        setPassword(generatePassword())
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold mb-4">Create Database</h3>

                <div className="flex flex-col gap-4">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Database name"
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl"
                    >
                        <option value="MySQL">MySQL</option>
                    </select>

                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                    <div className="flex gap-2">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex-1 px-4 py-3 border rounded-xl font-mono text-sm"
                        />
                        <button
                            onClick={() => setPassword(generatePassword())}
                            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl text-xs"
                        >
                            Generate
                        </button>
                    </div>

                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl"
                    >
                        <option>256 MB</option>
                        <option>512 MB</option>
                        <option>1 GB</option>
                        <option>2 GB</option>
                        <option>5 GB</option>
                        <option>10 GB</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-xl"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

function CopyButton({ value }) {
    function copy() {
        navigator.clipboard.writeText(value)
    }

    return (
        <button
            onClick={copy}
            className="text-xs px-2 py-1 bg-gray-100 rounded-lg"
        >
            Copy
        </button>
    )
}

function DatabaseCard({ db, onDelete }) {
    const [confirm, setConfirm] = useState(false)

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-semibold">{db.name}</h3>
                    <span className="text-xs text-gray-500">
            {db.type} · {db.size}
          </span>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm flex flex-col gap-2">
                <div className="flex justify-between">
                    <span>Host</span>
                    <div className="flex gap-2 items-center">
                        <span className="font-mono text-xs">{db.host}</span>
                        <CopyButton value={db.host} />
                    </div>
                </div>

                <div className="flex justify-between">
                    <span>Port</span>
                    <div className="flex gap-2 items-center">
                        <span className="font-mono text-xs">{db.port}</span>
                        <CopyButton value={db.port} />
                    </div>
                </div>

                <div className="flex justify-between">
                    <span>Username</span>
                    <div className="flex gap-2 items-center">
                        <span className="font-mono text-xs">{db.username}</span>
                        <CopyButton value={db.username} />
                    </div>
                </div>
            </div>

            <button
                onClick={() => setConfirm(true)}
                className="mt-4 text-red-600 text-xs"
            >
                Delete Database
            </button>

            {confirm && (
                <div className="mt-3">
                    <p className="text-xs mb-2">
                        Are you sure? This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                onDelete(db.id)
                                setConfirm(false)
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => setConfirm(false)}
                            className="px-3 py-1 bg-gray-200 rounded-lg text-xs"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function DatabasesPage() {
    const [databases, setDatabases] = useState([])
    const [showCreate, setShowCreate] = useState(false)

    function addDatabase(db) {
        setDatabases((prev) => [...prev, db])
    }

    function deleteDatabase(id) {
        setDatabases((prev) => prev.filter((d) => d.id !== id))
    }

    return (
        <div className="max-w-7xl mx-auto p-6">

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Databases</h1>
                    <p className="text-gray-500 mt-1">
                        Manage your database instances
                    </p>
                </div>

                <button
                    onClick={() => setShowCreate(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                >
                    New Database
                </button>
            </div>

            {databases.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <h3 className="text-lg font-semibold">
                        No databases yet
                    </h3>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl"
                    >
                        Create Database
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {databases.map((db) => (
                        <DatabaseCard
                            key={db.id}
                            db={db}
                            onDelete={deleteDatabase}
                        />
                    ))}
                </div>
            )}

            <CreateDatabaseModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                onCreate={addDatabase}
            />
        </div>
    )
}