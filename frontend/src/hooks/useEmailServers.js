import { useEffect, useState } from 'react';
import { emailApi } from '../api/generatedClient';

export default function useEmailServers() {
  const [emailServers, setEmailServers] = useState([]);

  const reload = () => emailApi.getDomainsByUser()
    .then((domains) => {
      setEmailServers((domains || []).map((domain) => ({
        id: String(domain.id),
        domain: domain.domainName,
        smtpHost: `smtp.${domain.domainName}`,
        imapHost: `imap.${domain.domainName}`,
        mailboxes: (domain.accounts || []).map((mb) => ({ id: String(mb.id), address: mb.emailAddress, password: '' })),
      })));
    })
    .catch(() => setEmailServers([]));

  useEffect(() => { reload(); }, []);

  const createServer = async (newServer) => {
    await emailApi.createDomain({ domainName: newServer.domain });
    await reload();
  };

  const deleteServer = async (id) => {
    await emailApi.removeDomain(id);
    await reload();
  };

  const addMailbox = async (server, mailbox) => {
    await emailApi.createAccount({ domainId: Number(server.id), emailAddress: mailbox.address, password: mailbox.password });
    await reload();
  };

  const deleteMailbox = async (_serverId, mailboxId) => {
    await emailApi.removeAccount(mailboxId);
    await reload();
  };

  const changePassword = async (mailbox, _serverId, newPassword) => {
    await emailApi.changePassword({ accountId: Number(mailbox.id), newPassword });
  };

  return { emailServers, createServer, deleteServer, addMailbox, deleteMailbox, changePassword };
}
