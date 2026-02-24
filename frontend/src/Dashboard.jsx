import { Link } from "react-router-dom"
import {useState} from "react";


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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
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

function StatCard({ label, value, icon, href, color }) {
    return (
        <Link
            to={href}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200 group"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} transition-all duration-200 group-hover:scale-110`}>
                    {icon}
                </div>
            </div>
        </Link>
    )
}

function QuickAction({ label, href }) {
    return (
        <Link
            to={href}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
        >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                +
            </div>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    )
}

function RecentProject({ name, status, url }) {
    const statusColor =
        status === "Running"
            ? "bg-green-500"
            : status === "Deploying"
                ? "bg-yellow-500"
                : "bg-red-500"

    return (
        <div className="flex items-center gap-4 py-3">
            <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{name}</p>
                <p className="text-xs text-gray-500 truncate">{url}</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100">
                {status}
            </span>
        </div>
    )
}

export default function DashboardPage() {

    const user = { name: "John Doe" }

    const [projects, setProjects] = useState([
        { id: 1, name: "Portfolio", status: "Running", url: "https://portfolio.dev" },
        { id: 2, name: "API Server", status: "Deploying", url: "https://api.dev" },
    ])

    const [showCreateModal, setShowCreateModal] = useState(false)

    const databases = [{ id: 1 }, { id: 2 }]
    const ftpAccounts = [{ id: 1 }]
    const emailServers = [{ id: 1 }]

    function handleCreateProject(project) {
        setProjects((prev) => [...prev, project])
    }

    return (
        <div className="max-w-7xl mx-auto p-6">

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Welcome back, {user.name.split(" ")[0]}
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's an overview of your hosting resources.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Projects"
                    value={projects.length}
                    href="/projects"
                    color="bg-blue-100 text-blue-600"
                    icon="📁"
                />
                <StatCard
                    label="Databases"
                    value={databases.length}
                    href="/databases"
                    color="bg-green-100 text-green-600"
                    icon="🗄"
                />
                <StatCard
                    label="FTP Accounts"
                    value={ftpAccounts.length}
                    href="/ftp"
                    color="bg-yellow-100 text-yellow-600"
                    icon="📂"
                />
                <StatCard
                    label="Email Servers"
                    value={emailServers.length}
                    href="/dashboard/emails"
                    color="bg-red-100 text-red-600"
                    icon="📧"
                />
            </div>

            {/* Quick Actions + Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div>
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

                    <div className="flex flex-col gap-3">

                        {/* 🔥 TADY JE ZMĚNA */}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                +
                            </div>
                            <span className="text-sm font-medium">Create Project</span>
                        </button>

                        <QuickAction label="Create Database" href="#" />
                        <QuickAction label="Create FTP Account" href="#" />
                        <QuickAction label="Create Email Server" href="#" />
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        {projects.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-8">
                                No projects yet.
                            </p>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {projects.slice(0, 5).map((project) => (
                                    <RecentProject
                                        key={project.id}
                                        name={project.name}
                                        status={project.status}
                                        url={project.url}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔥 MODAL */}
            <CreateProjectModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreateProject}
            />
        </div>
    )
}