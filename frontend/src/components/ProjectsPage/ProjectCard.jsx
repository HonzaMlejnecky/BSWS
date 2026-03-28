import React, { useState } from "react";

export default function ProjectCard({ project, onDelete, onRedeploy }) {
    const [showLogs, setShowLogs] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const statusStyles = {
        Running: "bg-green-100 text-green-700",
        Deploying: "bg-yellow-100 text-yellow-700 animate-pulse",
        Error: "bg-red-100 text-red-700",
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg">{project.name}</h3>
                    <a href={project.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">{project.url}</a>
                    <p className="text-xs text-gray-500 mt-2">Cílová doména: <span className="font-mono">{project.domain}</span></p>
                    <p className="text-xs text-gray-500">Upload path: <span className="font-mono">{project.uploadPath}</span></p>
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${statusStyles[project.status]}`}>
                    {project.status}
                </span>
            </div>

            {project.gitUrl && (
                <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded-lg mb-4 truncate">
                    {project.gitUrl}
                </div>
            )}

            <div className="flex gap-2">
                <button onClick={() => onRedeploy(project.id)} className="flex-1 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors">Redeploy</button>
                <button onClick={() => setShowLogs(!showLogs)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors">Logs</button>
                {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)} className="px-3 py-2 text-red-400 hover:text-red-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                ) : (
                    <div className="flex gap-1">
                        <button onClick={() => onDelete(project.id)} className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs">Confirm</button>
                        <button onClick={() => setConfirmDelete(false)} className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg text-xs">X</button>
                    </div>
                )}
            </div>

            {showLogs && (
                <div className="mt-4 bg-gray-900 text-green-400 p-3 rounded-xl text-[10px] font-mono shadow-inner max-h-32 overflow-y-auto">
                    {project.logs.map((log, i) => (
                        <div key={i}><span className="opacity-50 mr-2">[{i}]</span>{log}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
