import { useState } from "react";

function TabSelector({ tab, setTab }) {
    return (
        <div className="flex gap-4 mb-4">
            <button
                onClick={() => setTab("git")}
                className={`px-4 py-2 rounded-xl ${tab === "git" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
                Git Deploy
            </button>
            <button
                onClick={() => setTab("ftp")}
                className={`px-4 py-2 rounded-xl ${tab === "ftp" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
                FTP Upload
            </button>
        </div>
    );
}

function ProgressBar({ progress }) {
    return (
        <div>
            <p className="mb-2 text-sm">Deploying...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}


export default function CreateProjectModal({ open, onClose, onCreate }) {
    const [tab, setTab] = useState("git");
    const [deploying, setDeploying] = useState(false);
    const [progress, setProgress] = useState(0);

    const [name, setName] = useState("");
    const [gitUrl, setGitUrl] = useState("");
    const [ftpDomain, setFtpDomain] = useState("");

    if (!open) return null;

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

        onCreate({
            id: Date.now(),
            name,
            type: tab,
            status: "Running",
            url: tab === "git" ? `https://${name.toLowerCase().replace(/\s+/g, "-")}.hostpanel.dev` : `https://${ftpDomain}`,
            gitUrl: tab === "git" ? gitUrl : null,
            logs: ["Build started...", "Installing dependencies...", "Deploy successful"],
        });

        setDeploying(false);
        setProgress(0);
        setName("");
        setGitUrl("");
        setFtpDomain("");
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
                <h2 className="text-xl font-bold mb-4">Create Project</h2>

                <TabSelector tab={tab} setTab={setTab} />

                {deploying ? (
                    <ProgressBar progress={progress} />
                ) : (
                    <>
                        <input
                            className="w-full mb-3 px-4 py-2 border rounded-xl"
                            placeholder="Project name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        {tab === "git" ? (
                            <input
                                className="w-full mb-3 px-4 py-2 border rounded-xl"
                                placeholder="Git URL"
                                value={gitUrl}
                                onChange={(e) => setGitUrl(e.target.value)}
                            />
                        ) : (
                            <input
                                className="w-full mb-3 px-4 py-2 border rounded-xl"
                                placeholder="Domain"
                                value={ftpDomain}
                                onChange={(e) => setFtpDomain(e.target.value)}
                            />
                        )}

                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-xl">
                                Cancel
                            </button>
                            <button
                                onClick={handleDeploy}
                                className="px-6 py-2 bg-blue-600 text-white rounded-xl"
                            >
                                Deploy
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}