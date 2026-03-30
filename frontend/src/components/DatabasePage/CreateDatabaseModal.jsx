import { useState } from 'react';

function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  return Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function CreateDatabaseModal({ open, onClose, onCreate, busy }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(generatePassword());

  if (!open) return null;

  async function handleCreate() {
    if (!name || !username || !password || busy) return;

    await onCreate({ name, username, password });

    setName('');
    setUsername('');
    setPassword(generatePassword());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-2">Vytvořit databázi</h3>
        <p className="text-sm text-gray-600 mb-4">
          Aktuálně podporujeme pouze <strong>MariaDB 11</strong> přes připravené API. Databáze bude hostovaná u nás.
        </p>

        <div className="flex flex-col gap-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Název databáze" className="w-full px-4 py-3 border rounded-xl" />

          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Uživatel databáze" className="w-full px-4 py-3 border rounded-xl" />

          <div className="flex gap-2">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-xl font-mono text-sm"
              placeholder="Heslo"
            />
            <button
              type="button"
              onClick={() => setPassword(generatePassword())}
              className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl text-xs hover:bg-blue-200"
            >
              Generovat
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300" disabled={busy}>Zrušit</button>
          <button onClick={handleCreate} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700" disabled={busy}>
            {busy ? 'Vytvářím…' : 'Vytvořit'}
          </button>
        </div>
      </div>
    </div>
  );
}
