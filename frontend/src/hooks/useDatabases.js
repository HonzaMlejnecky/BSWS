import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "http://api.local/api/v1/database";

export default function useDatabases(userId) {
    const [databases, setDatabases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDatabases = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/user/${userId}`);
            if (!response.ok) throw new Error("Chyba při načítání databází");

            const data = await response.json();


            const formattedData = data.map(db => ({
                id: db.id,
                name: db.dbName || db.name,
                username: db.dbUsername || db.dbName || db.name,
                host: "127.0.0.1",
                port: "3307",
                type: "MariaDB"
            }));

            setDatabases(formattedData);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchDatabases();
    }, [fetchDatabases]);

    const createDatabase = async (dbName, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    dbName: dbName,
                    password: password
                })
            });
            if (response.ok) fetchDatabases();
        } catch (err) {
            console.error("Chyba při vytváření databáze:", err);
        }
    };

    const deleteDatabase = async (dbId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${dbId}`, {
                method: "DELETE"
            });
            if (response.ok) fetchDatabases();
        } catch (err) {
            console.error("Chyba při mazání databáze:", err);
        }
    };

    return {
        databases,
        isLoading,
        createDatabase,
        deleteDatabase,
        refresh: fetchDatabases
    };
}