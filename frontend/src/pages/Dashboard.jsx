import { useState } from 'react';
import PageHeader from '../components/UI/PageHeader';
import StatsGrid from '../components/Dashboard/StatsGrid';
import QuickActionsPanel from '../components/Dashboard/QuickActionPanel';
import RecentProjectsPanel from '../components/Dashboard/RecentProjectPanel';
import CreateProjectModal from '../components/Dashboard/CreateProjectModal';
import useProjects from '../hooks/useProjects';
import useEmailServers from '../hooks/useEmailServers';
import useFTPServers from '../hooks/useFTPServers';
import useDatabases from '../hooks/useDatabases';

export default function DashboardPage() {
  const { projects, addProject } = useProjects();
  const { emailServers } = useEmailServers();
  const { ftpServers } = useFTPServers();
  const { databases } = useDatabases();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader title="Welcome back!" description="Here's an overview of your hosting resources." />
      <StatsGrid
        projectsCount={projects.length}
        dbCount={databases.length}
        ftpCount={ftpServers.length}
        emailCount={emailServers.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentProjectsPanel projects={projects} />
        </div>
        <div>
          <QuickActionsPanel onOpenCreateModal={() => setShowCreateModal(true)} />
        </div>
      </div>

      <CreateProjectModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onCreate={addProject} />
    </div>
  );
}
