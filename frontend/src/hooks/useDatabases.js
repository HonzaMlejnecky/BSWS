import { useCallback, useEffect, useState } from 'react';
import { databaseApi } from '../api/generatedClient';

const MANAGED_DATABASE = {
  type: 'MariaDB 11',
  host: 'localhost',
  port: '3307',
  size: 'Dle limitu tarifu',
};

function normalizeDb(db) {
  return {
    id: db.id,
    name: db.dbName,
    username: db.dbUser,
    ...MANAGED_DATABASE,
  };
}

export default function useDatabases() {
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    const list = await databaseApi.getMine();
    return (list || []).map(normalizeDb);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const next = await reload();
      setDatabases(next);
    } catch (err) {
      setError(err.message || 'Nepodařilo se načíst databáze.');
      setDatabases([]);
    } finally {
      setLoading(false);
    }
  }, [reload]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addDatabase = async (db) => {
    setError('');
    await databaseApi.create({ dbName: db.name, username: db.username, password: db.password });
    await refresh();
  };

  const deleteDatabase = async (id) => {
    setError('');
    await databaseApi.remove(id);
    await refresh();
  };

  const updatePassword = async (databaseId, newPassword) => {
    setError('');
    await databaseApi.updatePassword(databaseId, newPassword);
  };

  return {
    databases,
    loading,
    error,
    addDatabase,
    deleteDatabase,
    updatePassword,
    reload: refresh,
  };
}
