import { useState } from "react";

export default function useProjects() {
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
    ]);

    const addProject = (project) => setProjects((prev) => [...prev, project]);

    const deleteProject = (id) => setProjects((prev) => prev.filter((p) => p.id !== id));

    const redeployProject = (id) => {
        setProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: "Deploying" } : p))
        );

        setTimeout(() => {
            setProjects((prev) =>
                prev.map((p) => (p.id === id ? { ...p, status: "Running" } : p))
            );
        }, 2000);
    };

    return { projects, addProject, deleteProject, redeployProject };
}