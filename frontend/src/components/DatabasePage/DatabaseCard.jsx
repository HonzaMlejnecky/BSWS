import { useState } from 'react';

function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  return Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function CopyButton({ value }) {
  function copy() {
    navigator.clipboard.writeText(value);
  }

  return (
    <button onClick={copy} className="text-xs px-2 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
      Copy
    </button>
  );
}

function Badge({ children }) {
  return <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">{children}</span>;
}

function DatabaseField({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <div className="flex gap-2 items-center">
        <span className="font-mono text-xs">{value}</span>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

function DeleteConfirmation({ onConfirm, onCancel, busy }) {
  return (
    <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
      <p className="text-xs mb-3 text-red-800 font-medium">Opravdu smazat databázi? Tuto akci nejde vrátit zpět.</p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
          disabled={busy}
        >
          Potvrdit smazání
        </button>
        <button onClick={onCancel} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors" disabled={busy}>
          Zrušit
        </button>
      </div>
    </div>
  );
}

export default function DatabaseCard({ db, onDelete, onChangePassword }) {
  const [confirm, setConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  async function handleRotatePassword() {
    const nextPassword = generatePassword();
    setChangingPassword(true);
    setError('');
    setInfo('');

    try {
      await onChangePassword(db.id, nextPassword);
      setInfo(`Nové heslo: ${nextPassword}`);
    } catch (err) {
      setError(err.message || 'Nepodařilo se změnit heslo databáze.');
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError('');
    setInfo('');

    try {
      await onDelete(db.id);
      setConfirm(false);
    } catch (err) {
      setError(err.message || 'Nepodařilo se smazat databázi.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-lg">{db.name}</h3>
          <Badge>{db.type} · {db.size}</Badge>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm flex flex-col gap-3">
        <DatabaseField label="Host" value={db.host} />
        <DatabaseField label="Port" value={db.port} />
        <DatabaseField label="Username" value={db.username} />
      </div>

      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={handleRotatePassword}
          className="text-xs font-semibold text-blue-700 hover:text-blue-900"
          disabled={changingPassword || deleting}
        >
          {changingPassword ? 'Měním heslo…' : 'Vygenerovat nové heslo'}
        </button>

        {!confirm ? (
          <button
            onClick={() => setConfirm(true)}
            className="text-red-600 hover:text-red-800 text-xs font-semibold transition-colors"
            disabled={changingPassword || deleting}
          >
            Smazat databázi
          </button>
        ) : (
          <DeleteConfirmation onConfirm={handleDelete} onCancel={() => setConfirm(false)} busy={deleting} />
        )}
      </div>

      {info && <p className="mt-3 text-xs text-green-700 break-all">{info}</p>}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </div>
  );
}
