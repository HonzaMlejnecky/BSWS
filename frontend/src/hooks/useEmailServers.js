import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "http://api.local/api/v1/email";

export default function useEmailServers(userId) {
    const [emailServers, setEmailServers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchServers = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/domain/user/${userId}`);
            if (!response.ok) throw new Error("Chyba při načítání emailových serverů");

            const data = await response.json();

            const formattedData = data.map(domain => ({
                id: domain.id,
                domain: domain.domainName,
                isActive: domain.isActive,
                mailboxes: (domain.accounts || []).map(acc => ({
                    id: acc.id,
                    address: acc.emailAddress,
                    isActive: acc.isActive
                }))
            }));

            setEmailServers(formattedData);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);


    useEffect(() => {
        fetchServers();
    }, [fetchServers]);


    const createServer = async (domainName) => {
        try {
            const response = await fetch(`${API_BASE_URL}/domain/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    domainName: domainName,
                    userId: userId,
                    isActive: true
                })
            });
            if (response.ok) fetchServers();
        } catch (err) {
            console.error("Chyba při vytváření domény:", err);
        }
    };

    const deleteServer = async (domainId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/domain/${domainId}`, {
                method: "DELETE"
            });
            if (response.ok) fetchServers();
        } catch (err) {
            console.error("Chyba při mazání domény:", err);
        }
    };

    const addMailbox = async (domainId, emailAddress, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/account/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    domainId: domainId,
                    emailAddress: emailAddress,
                    password: password,
                    isActive: true
                })
            });
            if (response.ok) fetchServers();
        } catch (err) {
            console.error("Chyba při vytváření schránky:", err);
        }
    };

    const deleteMailbox = async (mailboxId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/account/${mailboxId}`, {
                method: "DELETE"
            });
            if (response.ok) fetchServers();
        } catch (err) {
            console.error("Chyba při mazání schránky:", err);
        }
    };

    const changePassword = async (accountId, newPassword) => {
        try {
            const response = await fetch(`${API_BASE_URL}/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accountId: accountId,
                    newPassword: newPassword
                })
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg);
            }
        } catch (err) {
            console.error("Chyba při změně hesla:", err);
        }
    };

    return {
        emailServers,
        isLoading,
        error,
        createServer,
        deleteServer,
        addMailbox,
        deleteMailbox,
        changePassword,
        refresh: fetchServers
    };
}