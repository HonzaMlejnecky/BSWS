import { useState } from "react";

export default function useWebmail() {
    const [emails, setEmails] = useState([
        { id: 1, from: "support@hostpanel.dev", to: "admin@hostpanel.dev", subject: "Welcome to HostPanel", body: "Your mail server has been successfully created.", date: "2025-01-10", folder: "inbox", read: false },
        { id: 2, from: "admin@hostpanel.dev", to: "client@example.com", subject: "Invoice January", body: "Please find attached invoice.", date: "2025-01-08", folder: "sent", read: true },
    ]);

    const [folder, setFolder] = useState("inbox");
    const [selectedEmail, setSelectedEmail] = useState(null);

    const filteredEmails = emails.filter((e) => e.folder === folder);

    const sendEmail = (email) => {
        setEmails((prev) => [...prev, email]);
    };

    const selectEmail = (email) => setSelectedEmail(email);
    const changeFolder = (f) => {
        setFolder(f);
        setSelectedEmail(null);
    };

    return { emails, folder, selectedEmail, filteredEmails, sendEmail, selectEmail, changeFolder };
}