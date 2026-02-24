import { useState, useEffect } from "react"

function CreateProjectModal({ open, onClose, onCreate }) {
    const [tab, setTab] = useState("git")
    const [deploying, setDeploying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [name, setName] = useState("")
    const [gitUrl, setGitUrl] = useState("")
    const [ftpDomain, setFtpDomain] = useState("")

    if (!open) return null

    async function handleDeploy() {
        if (tab === "git" && (!name || !gitUrl)) return
        if (tab === "ftp" && (!name || !ftpDomain)) return

        setDeploying(true)
        setProgress(0)

        const interval = setInterval(() => {
            setProgress((p) => (p >= 100 ? 100 : p + 10))
        }, 200)

        await new Promise((r) => setTimeout(r, 2000))
        clearInterval(interval)

        const newProject = {
            id: Date.now(),
            name,
            type: tab,
            status: "Running",
            url:
                tab === "git"
                    ? `https://${name.toLowerCase().replace(/\s+/g, "-")}.hostpanel.dev`
                    : `https://${ftpDomain}`,
            gitUrl: tab === "git" ? gitUrl : null,
            logs: ["Build started...", "Installing dependencies...", "Deploy successful"],
        }

        onCreate(newProject)
        setDeploying(false)
        setProgress(0)
        setName("")
        setGitUrl("")
        setFtpDomain("")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Create Project</h2>

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

                {deploying ? (
                    <div>
                        <p className="mb-2 text-sm">Deploying...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
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
    )
}

function ProjectCard({ project, onDelete, onRedeploy }) {
    const [showLogs, setShowLogs] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const statusColor =
        project.status === "Running"
            ? "bg-green-500"
            : project.status === "Deploying"
                ? "bg-yellow-500"
                : "bg-red-500"

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{project.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-lg text-white ${statusColor}`}>
          {project.status}
        </span>
            </div>

            <p className="text-sm text-gray-500 mb-2">{project.url}</p>
            {project.gitUrl && <p className="text-xs text-gray-400 mb-2">{project.gitUrl}</p>}

            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => onRedeploy(project.id)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs"
                >
                    Redeploy
                </button>
                <button
                    onClick={() => setShowLogs(!showLogs)}
                    className="flex-1 py-2 bg-gray-200 rounded-xl text-xs"
                >
                    Logs
                </button>
                {!confirmDelete ? (
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-xl text-xs"
                    >
                        Delete
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onDelete(project.id)}
                            className="px-3 py-2 bg-red-600 text-white rounded-xl text-xs"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="px-3 py-2 bg-gray-200 rounded-xl text-xs"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {showLogs && (
                <div className="mt-4 bg-black text-white p-3 rounded-xl text-xs font-mono">
                    {project.logs.map((log, i) => (
                        <div key={i}>{log}</div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: "Portfolio",
            type: "git",
            status: "Running",
            url: "https://portfolio.hostpanel.dev",
            gitUrl: "https://github.com/user/portfolio",
            logs: ["Build started...", "Deploy complete"],
        },
    ])

    const [showCreate, setShowCreate] = useState(false)

    function addProject(project) {
        setProjects((prev) => [...prev, project])
    }

    function deleteProject(id) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
    }

    function redeployProject(id) {
        setProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: "Deploying" } : p))
        )

        setTimeout(() => {
            setProjects((prev) =>
                prev.map((p) => (p.id === id ? { ...p, status: "Running" } : p))
            )
        }, 2000)
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Projects</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                >
                    New Project
                </button>
            </div>

            {projects.length === 0 && (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <h3 className="text-lg font-semibold">No projects yet</h3>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl"
                    >
                        Create Project
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onDelete={deleteProject}
                        onRedeploy={redeployProject}
                    />
                ))}
            </div>

            <CreateProjectModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                onCreate={addProject}
            />
        </div>
    )
}