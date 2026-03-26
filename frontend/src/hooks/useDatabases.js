import { useCallback, useEffect, useState } from 'react';
import { databaseApi } from '../api/generatedClient';

export default function useDatabases() {
  const [databases, setDatabases] = useState([]);

  const reload = useCallback(async () => {
    const list = await databaseApi.getMine();
    return (list || []).map((db) => ({
      id: db.id,
      name: db.dbName,
      type: 'MySQL',
      username: db.dbUser,
      size: 'Plan-limited',
      host: 'localhost',
      port: '3306',
    }));
  }, []);

  useEffect(() => {
    let mounted = true;
    reload().then((next) => mounted && setDatabases(next)).catch(() => mounted && setDatabases([]));
    return () => { mounted = false; };
  }, [reload]);

  const addDatabase = async (db) => {
    await databaseApi.create({ dbName: db.name, username: db.username, password: db.password });
    const next = await reload();
    setDatabases(next);
  };

  const deleteDatabase = async (id) => {
    await databaseApi.remove(id);
    const next = await reload();
    setDatabases(next);
  };

  return { databases, addDatabase, deleteDatabase, reload: async () => setDatabases(await reload()) };
}
