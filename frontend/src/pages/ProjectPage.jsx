import React from "react";
import { useNavigate } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import ProjectCard from "../components/ProjectsPage/ProjectCard";
import PageHeader from "../components/UI/PageHeader";
import EmptyState from "../components/UI/EmptyState";

export default function ProjectsPage() {
    const navigate = useNavigate();
    const { projects, deleteProject, redeployProject } = useProjects();

    return (
        <div className="max-w-7xl mx-auto p-6">
            <PageHeader 
                title="Projekty" 
                description="Spravujte a nasazujte své webové aplikace" 
                buttonText="Nový projekt" 
                onAction={() => navigate('/projects/new')} 
            />

            {projects.length === 0 ? (
                <EmptyState 
                    title="Nebyly nalezeny žádné projekty" 
                    buttonText="Vytvořit první projekt" 
                    onAction={() => navigate('/projects/new')} 
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
        </div>
    );
}
