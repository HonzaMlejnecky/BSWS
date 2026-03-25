import { useEffect, useState } from 'react';
import { sftpApi } from '../api/generatedClient';
import { useAuth } from '../context/AuthContext';

export default function useFTPServers() {
  const { userId } = useAuth();
  const [ftpServers, setFtpServers] = useState([]);

  const reload = () => sftpApi.getByUser(userId).then((accounts) => {
    setFtpServers((accounts || []).map((a) => ({
      id: String(a.id),
      domain: a.homeDirectory,
      rootDir: a.homeDirectory,
      accounts: [{ id: String(a.id), username: a.username, password: '' }],
    })));
  }).catch(() => setFtpServers([]));

  useEffect(() => { reload(); }, [userId]);

  const createServer = async (newServer) => {
    await sftpApi.create({ userId, username: newServer.domain, homeDirectory: newServer.rootDir, password: newServer.password || 'ChangeMe123!' });
    await reload();
  };

  const deleteServer = async (id) => {
    await sftpApi.remove(id);
    await reload();
  };

  const addAccount = async (server, account) => {
    await sftpApi.create({ userId, username: account.username, homeDirectory: server.rootDir, password: account.password });
    await reload();
  };

  const deleteAccount = async (_serverId, accountId) => {
    await sftpApi.remove(accountId);
    await reload();
  };

  const changePassword = async (account, _serverId, newPassword) => {
    await sftpApi.changePassword({ accountId: Number(account.id), newPassword });
  };

  return { ftpServers, createServer, deleteServer, addAccount, deleteAccount, changePassword };
}
