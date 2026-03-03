import { useState } from "react";

export default function useFTPServers() {
    const [ftpServers, setFtpServers] = useState([
        {
            id: "1",
            domain: "example.com",
            rootDir: "/var/www/example",
            accounts: [
                { id: "a1", username: "ftpuser", password: "123456" },
                { id: "a2", username: "backup", password: "123456" }
            ]
        }
    ]);

    const createServer = (newServer) => setFtpServers(prev => [...prev, newServer]);
    const deleteServer = (id) => setFtpServers(prev => prev.filter(s => s.id !== id));
    
    const addAccount = (server, account) => {
        setFtpServers(prev => prev.map(s => s.id === server.id ? { ...s, accounts: [...s.accounts, account] } : s));
    };
    
    const deleteAccount = (serverId, accountId) => {
        setFtpServers(prev => prev.map(s => s.id === serverId ? { ...s, accounts: s.accounts.filter(a => a.id !== accountId) } : s));
    };

    const changePassword = (account, serverId, newPassword) => {
        setFtpServers(prev => prev.map(s => s.id === serverId ? { ...s, accounts: s.accounts.map(a => a.id === account.id ? { ...a, password: newPassword } : a) } : s));
    };

    return { ftpServers, createServer, deleteServer, addAccount, deleteAccount, changePassword };
}