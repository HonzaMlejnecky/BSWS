import RecentProject from "./RecentProject";

export default function RecentProjectsPanel({ projects }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Poslední projekty</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
                {projects.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-12 italic">Nemáte žádné aktivní projekty.</p>
                ) : (
                    <div className="flex flex-col">
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
    );
}
