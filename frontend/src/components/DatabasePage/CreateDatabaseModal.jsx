import { useState } from "react";

function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    return Array.from({ length: 12 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join("");
}

export default function CreateDatabaseModal({ open, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("PostgreSQL");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(generatePassword());
    const [size, setSize] = useState("1 GB");

    if (!open) return null;

    function handleCreate() {
        if (!name || !username) return;

        const newDb = {
            id: Date.now(),
            name,
            type,
            username,
            password,
            size,
            host: "localhost",
            port: type === "PostgreSQL" ? "5432" : "3306",
        };

        onCreate(newDb);

        setName("");
        setUsername("");
        setPassword(generatePassword());
        onClose();
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
                        <option value="PostgreSQL">PostgreSQL</option>
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
                            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl text-xs hover:bg-blue-200"
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
                        className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}