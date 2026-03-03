import React, { useState } from "react";
import useProjects from "../hooks/useProjects";
import ProjectCard from "../components/ProjectsPage/ProjectCard";
import CreateProjectModal from "../components/ProjectsPage/CreateProjectModal";
import PageHeader from "../components/UI/PageHeader";
import EmptyState from "../components/UI/EmptyState";

export default function ProjectsPage() {
    const { projects, addProject, deleteProject, redeployProject } = useProjects();
    const [showCreate, setShowCreate] = useState(false);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <PageHeader 
                title="Projects" 
                description="Manage and deploy your web applications" 
                buttonText="New Project" 
                onAction={() => setShowCreate(true)} 
            />

            {projects.length === 0 ? (
                <EmptyState 
                    title="No projects found" 
                    buttonText="Create your first project" 
                    onAction={() => setShowCreate(true)} 
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onDelete={deleteProject}
                            onRedeploy={redeployProject}
                        />
                    ))}
                </div>
            )}

            <CreateProjectModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                onCreate={addProject}
            />
        </div>
    );
}