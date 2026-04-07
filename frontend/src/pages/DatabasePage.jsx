import { useState } from "react";
import DatabaseCard from "../components/DatabasePage/DatabaseCard";
import CreateDatabaseModal from "../components/DatabasePage/CreateDatabaseModal";
import PageHeader from "../components/UI/PageHeader";
import EmptyState from "../components/UI/EmptyState";
import useDatabases from "../hooks/useDatabases";

export default function DatabasesPage() {
    const currentUserId = 1;
    const { databases, createDatabase, deleteDatabase } = useDatabases(currentUserId);

    const [showCreate, setShowCreate] = useState(false);

    return (
        <div className="max-w-7xl mx-auto p-6">

            <PageHeader
                title="Databases"
                description="Manage your database instances"
                buttonText="New Database"
                onAction={() => setShowCreate(true)}
            />

            {databases.length === 0 ? (
                <EmptyState
                    title="No databases yet"
                    buttonText="Create Database"
                    onAction={() => setShowCreate(true)}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {databases.map((db) => (
                        <DatabaseCard
                            key={db.id}
                            db={db}
                            onDelete={deleteDatabase}
                        />
                    ))}
                </div>
            )}

            <CreateDatabaseModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                onCreate={(name, password) => {
                    createDatabase(name, password);
                    setShowCreate(false);
                }}
            />

        </div>
    );
}