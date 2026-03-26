import { useCallback, useEffect, useState } from 'react';
import { projectsApi } from '../api/generatedClient';
import { useAuth } from '../context/AuthContext';

function mapProject(project) {
  const status = (project.publicationStatus || '').toLowerCase();
  return {
    id: project.id,
    name: project.domain,
    type: project.runtime,
    status: status === 'published' ? 'Running' : 'Deploying',
    url: `https://${project.domain}`,
    gitUrl: project.runtime === 'static' ? 'Git/static deploy' : '',
    logs: [`Runtime: ${project.runtime}`, `Doc root: ${project.documentRoot}`, `Status: ${project.publicationStatus}`],
  };
}

export default function useProjects() {
  const { userId } = useAuth();
  const [projects, setProjects] = useState([]);

  const reload = useCallback(async () => {
    if (!userId) return [];
    const list = await projectsApi.getByUser(userId);
    return (list || []).map(mapProject);
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    reload().then((next) => mounted && setProjects(next)).catch(() => mounted && setProjects([]));
    return () => { mounted = false; };
  }, [reload]);

  const addProject = async (project) => {
    await projectsApi.create({
      userId,
      domain: `${project.name.toLowerCase().replace(/\s+/g, '-')}.local`,
      documentRoot: `/srv/customers/user_${userId}/www`,
      runtime: project.type === 'ftp' ? 'php' : 'static',
    });
    setProjects(await reload());
  };

  const deleteProject = async (id) => {
    await projectsApi.remove(id);
    setProjects(await reload());
  };

  const redeployProject = async (id) => {
    try {
      await projectsApi.redeploy(id);
    } catch {
      await projectsApi.publish(id);
    }
    setProjects(await reload());
  };

  return { projects, addProject, deleteProject, redeployProject };
}
