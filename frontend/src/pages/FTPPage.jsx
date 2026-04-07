import React, { useState } from "react";
import useFTPServers from "../hooks/useFTPServers";
import FTPServerCard from "../components/FTPPage/FTPServerCard";
import { FTPCreateModal, FTPAccountModal, FTPChangePasswordModal } from "../components/FTPPage/FTPModals";
import PageHeader from "../components/UI/PageHeader";
import EmptyState from "../components/UI/EmptyState";

export default function FTPPage() {
    const { ftpServers, createServer, deleteServer, addAccount, deleteAccount, changePassword } = useFTPServers();

    const [showCreate, setShowCreate] = useState(false);
    const [selectedServer, setSelectedServer] = useState(null);
    const [passwordTarget, setPasswordTarget] = useState(null);

    return (
        <div className="max-w-6xl mx-auto p-8">
            <PageHeader 
                title="FTP servery" 
                description="Správa přístupových údajů pro FTP" 
                buttonText="Nový FTP server" 
                onAction={() => setShowCreate(true)} 
            />

            {ftpServers.length === 0 ? (
                <EmptyState 
                    title="Zatím nemáte žádný FTP server" 
                    buttonText="Vytvořit FTP server" 
                    onAction={() => setShowCreate(true)} 
                />
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {ftpServers.map(server => (
                        <FTPServerCard
                            key={server.id}
                            server={server}
                            onDeleteServer={deleteServer}
                            onAddAccount={setSelectedServer}
                            onDeleteAccount={deleteAccount}
                            onChangePassword={(acc, sid) => setPasswordTarget({ acc, sid })}
                        />
                    ))}
                </div>
            )}

            <FTPCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={createServer} />

            <FTPAccountModal
                open={!!selectedServer}
                server={selectedServer}
                onClose={() => setSelectedServer(null)}
                onAdd={(acc) => { addAccount(selectedServer, acc); setSelectedServer(null); }}
            />

            <FTPChangePasswordModal
                open={!!passwordTarget}
                account={passwordTarget?.acc}
                onClose={() => setPasswordTarget(null)}
                onChange={(newPass) => { changePassword(passwordTarget.acc, passwordTarget.sid, newPass); setPasswordTarget(null); }}
            />
        </div>
    );
}
