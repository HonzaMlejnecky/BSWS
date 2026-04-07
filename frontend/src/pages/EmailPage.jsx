import { useState } from "react";
import PageHeader from "../components/UI/PageHeader";
import EmptyState from "../components/UI/EmptyState";
import EmailServerCard from "../components/EmailPage/EmailServerCard";
import { EmailCreateModal, EmailMailboxModal, EmailChangePasswordModal } from "../components/EmailPage/EmailModals";
import useEmailServers from "../hooks/useEmailServers";

export default function EmailPage() {

    const { emailServers, createServer, deleteServer, addMailbox, deleteMailbox, changePassword } = useEmailServers();

    const [showCreate, setShowCreate] = useState(false);
    const [selectedServer, setSelectedServer] = useState(null);
    const [passwordTarget, setPasswordTarget] = useState(null);

    return (
        <div className="max-w-6xl mx-auto p-8">
            
            <PageHeader 
                title="E-mailové servery" 
                description="Správa vaší e-mailové infrastruktury" 
                buttonText="Nový server" 
                onAction={() => setShowCreate(true)} 
            />

            {emailServers.length === 0 ? (
                <EmptyState 
                    title="Zatím nemáte žádný e-mailový server" 
                    buttonText="Vytvořit server" 
                    onAction={() => setShowCreate(true)} 
                />
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {emailServers.map(server => (
                        <EmailServerCard
                            key={server.id}
                            server={server}
                            onDeleteServer={deleteServer}
                            onAddMailbox={setSelectedServer}
                            onDeleteMailbox={deleteMailbox}
                            onChangePassword={(mb, sid) => setPasswordTarget({ mb, sid })}
                        />
                    ))}
                </div>
            )}
            
            <EmailCreateModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                onCreate={createServer}
            />

            <EmailMailboxModal
                open={!!selectedServer}
                server={selectedServer}
                onClose={() => setSelectedServer(null)}
                onAdd={(mb) => { addMailbox(selectedServer, mb); setSelectedServer(null); }}
            />

            <EmailChangePasswordModal
                open={!!passwordTarget}
                mailbox={passwordTarget?.mb}
                onClose={() => setPasswordTarget(null)}
                onChange={(newPass) => { changePassword(passwordTarget.mb, passwordTarget.sid, newPass); setPasswordTarget(null); }}
            />

        </div>
    );
}
