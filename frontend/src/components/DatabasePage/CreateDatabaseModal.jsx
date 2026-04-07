import { useState } from "react";

function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    return Array.from({ length: 12 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join("");
}

export default function CreateDatabaseModal({ open, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState(generatePassword());

    if (!open) return null;

    function handleCreate() {
        if (!name || !password) return;

        // Předáváme nahoru jen název a heslo
        onCreate(name, password);

        setName("");
        setPassword(generatePassword());
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold mb-4">Create Database</h3>

                <div className="flex flex-col gap-4 mb-6">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Database name (e.g. wordpress_db)"
                        className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex gap-2">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="flex-1 px-4 py-3 border rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => setPassword(generatePassword())}
                            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl text-xs hover:bg-blue-200 transition-colors"
                        >
                            Generate
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}