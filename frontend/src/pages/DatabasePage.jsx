import { useState } from 'react';
import DatabaseCard from '../components/DatabasePage/DatabaseCard';
import CreateDatabaseModal from '../components/DatabasePage/CreateDatabaseModal';
import PageHeader from '../components/UI/PageHeader';
import EmptyState from '../components/UI/EmptyState';
import useDatabases from '../hooks/useDatabases';

export default function DatabasesPage() {
  const {
    databases,
    loading,
    error,
    addDatabase,
    deleteDatabase,
    updatePassword,
  } = useDatabases();
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function handleCreate(db) {
    setSubmitError('');
    setCreating(true);

    try {
      await addDatabase(db);
    } catch (err) {
      setSubmitError(err.message || 'Databázi se nepodařilo vytvořit.');
      throw err;
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title="Databáze"
        description="Správa hostovaných MariaDB databází přes připravené API"
        buttonText="Nová databáze"
        onAction={() => setShowCreate(true)}
      />

      <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
        Pro tuto verzi aplikace je podporována pouze <strong>MariaDB 11</strong>. Uživatel si může vytvořit vlastní databázi
        hostovanou na naší infrastruktuře a spravovat její přístupové údaje.
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {submitError && <p className="text-sm text-red-600 mb-4">{submitError}</p>}

      {loading ? (
        <div className="text-sm text-gray-500">Načítám databáze…</div>
      ) : databases.length === 0 ? (
        <EmptyState title="Zatím nemáte žádnou databázi" buttonText="Vytvořit databázi" onAction={() => setShowCreate(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {databases.map((db) => (
            <DatabaseCard key={db.id} db={db} onDelete={deleteDatabase} onChangePassword={updatePassword} />
          ))}
        </div>
      )}

      <CreateDatabaseModal
        open={showCreate}
        onClose={() => !creating && setShowCreate(false)}
        onCreate={handleCreate}
        busy={creating}
      />
    </div>
  );
}
