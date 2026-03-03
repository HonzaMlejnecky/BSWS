import React, { useState } from "react";

export default function useEmailServers() {
    const [emailServers, setEmailServers] = useState([
        {
            id: "1",
            domain: "example.com",
            smtpHost: "smtp.example.com",
            imapHost: "imap.example.com",
            mailboxes: [
                { id: "m1", address: "admin@example.com", password: "123456" },
                { id: "m2", address: "info@example.com", password: "123456" }
            ]
        }
    ]);

    const createServer = (newServer) => setEmailServers(prev => [...prev, newServer]);
    const deleteServer = (id) => setEmailServers(prev => prev.filter(s => s.id !== id));
    
    const addMailbox = (server, mailbox) => {
        setEmailServers(prev => prev.map(s => s.id === server.id ? { ...s, mailboxes: [...s.mailboxes, mailbox] } : s));
    };
    
    const deleteMailbox = (serverId, mailboxId) => {
        setEmailServers(prev => prev.map(s => s.id === serverId ? { ...s, mailboxes: s.mailboxes.filter(m => m.id !== mailboxId) } : s));
    };

    const changePassword = (mailbox, serverId, newPassword) => {
        setEmailServers(prev => prev.map(s => s.id === serverId ? { ...s, mailboxes: s.mailboxes.map(m => m.id === mailbox.id ? { ...m, password: newPassword } : m) } : s));
    };

    return { emailServers, createServer, deleteServer, addMailbox, deleteMailbox, changePassword };
}