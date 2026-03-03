import React, { useState } from "react";
import BaseModal from "../UI/BaseModal";
import ModalInput from "../UI/ModalInput";

export default function CreateProjectModal({ open, onClose, onCreate }) {
    const [tab, setTab] = useState("git");
    const [deploying, setDeploying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [name, setName] = useState("");
    const [gitUrl, setGitUrl] = useState("");
    const [ftpDomain, setFtpDomain] = useState("");

    async function handleDeploy() {
        if (tab === "git" && (!name || !gitUrl)) return;
        if (tab === "ftp" && (!name || !ftpDomain)) return;

        setDeploying(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((p) => (p >= 100 ? 100 : p + 10));
        }, 200);

        await new Promise((r) => setTimeout(r, 2000));
        clearInterval(interval);

        const newProject = {
            id: Date.now(),
            name,
            type: tab,
            status: "Running",
            url: tab === "git" 
                ? `https://${name.toLowerCase().replace(/\s+/g, "-")}.hostpanel.dev` 
                : `https://${ftpDomain}`,
            gitUrl: tab === "git" ? gitUrl : null,
            logs: ["Build started...", "Installing dependencies...", "Deploy successful"],
        };

        onCreate(newProject);
        setDeploying(false);
        setName(""); setGitUrl(""); setFtpDomain("");
        onClose();
    }

    return (
        <BaseModal open={open} onClose={onClose} title="Create New Project">
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
                <button
                    onClick={() => setTab("git")}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${tab === "git" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
                >
                    Git Deploy
                </button>
                <button
                    onClick={() => setTab("ftp")}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${tab === "ftp" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
                >
                    FTP Upload
                </button>
            </div>

            {deploying ? (
                <div className="py-8">
                    <p className="text-center text-sm font-medium text-gray-600 mb-4">Deploying your project...</p>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    <ModalInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Project Name (e.g. My Portfolio)" />
                    {tab === "git" ? (
                        <ModalInput value={gitUrl} onChange={(e) => setGitUrl(e.target.value)} placeholder="Git Repository URL" />
                    ) : (
                        <ModalInput value={ftpDomain} onChange={(e) => setFtpDomain(e.target.value)} placeholder="Target Domain" />
                    )}
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                        <button onClick={handleDeploy} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">Deploy</button>
                    </div>
                </div>
            )}
        </BaseModal>
    );
}